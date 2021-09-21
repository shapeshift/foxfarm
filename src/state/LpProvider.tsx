import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { bn, toBaseUnit } from 'utils/math'
import { getBufferedGas, toHexString } from 'utils/helpers'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import erc20Abi from 'abis/erc20Abi.json'
import { BigNumber } from 'ethers'
import { useContract } from 'hooks/useContract'
import { useWallet } from './WalletProvider'
import {
  FOX_TOKEN_CONTRACT_ADDRESS,
  UNISWAP_V2_ROUTER,
  WETH_TOKEN_CONTRACT_ADDRESS
} from 'lib/constants'
import { useRouteMatch } from 'react-router'

export class LpError extends Error {
  code?: number
  constructor(code: number, message: string) {
    super(message)
    this.name = 'LpError'
    this.code = code
  }
}

export enum TokenField {
  A = 'A',
  B = 'B'
}

export enum LpActions {
  SET_TOKEN_BALANCE = 'SET_TOKEN_BALANCE',
  SET_TOKEN_AMOUNT = 'SET_TOKEN_AMOUNT',
  SET_RATES = 'SET_RATES',
  SET_LP_DATA = 'SET_LP_DATA',
  SET_TX_DATA = 'SET_TX_DATA',
  SET_LP_BURN_AMOUNT = 'SET_LP_BURN_AMOUNT',
  SET_TX_FEE = 'SET_TX_FEE',
  SET_CONFIRMIMG = 'SET_CONFIRMIMG',
  SET_LOADING = 'SET_LOADING',
  SET_TX_HASH = 'SET_TX_HASH',
  SET_ERROR = 'SET_ERROR',
  RESET_STATE = 'RESET_STATE'
}

export interface ITokenField {
  balance: string | BigNumber | null
  amount: string | null
  symbol: string
}

export type State = {
  [TokenField.A]: ITokenField
  [TokenField.B]: ITokenField
  independentField: TokenField | string
  amountTokenDesired: string | null
  amountTokenMin: string | null
  amountETHMin: string | null
  deadline: string | null
  slippagePercentage: number
  foxPerEth: string | null
  ethPerFox: string | null
  poolShare: string | null
  estimatedLpTokens: string
  lpBurnAmount: string | null
  totalSupply: string | null
  foxPoolBalance: string | null
  estimatedFee: string | null
  confirming: boolean
  loading: boolean
  lpTxHash: string | null
  error: LpError | null
}

type Action =
  | {
      type: LpActions.SET_TOKEN_BALANCE
      payload: { field: TokenField; balance: string }
    }
  | {
      type: LpActions.SET_TOKEN_AMOUNT
      payload: { field: TokenField; amount: string; independentField?: TokenField }
    }
  | {
      type: LpActions.SET_RATES
      payload: {
        foxPerEth: string
        ethPerFox: string
        estimatedLpTokens: string
        poolShare: string | null
        totalSupply: string
        foxPoolBalance: string
      }
    }
  | { type: LpActions.SET_LP_DATA; payload: Partial<State> }
  | { type: LpActions.SET_TX_DATA; payload: TransactionRequest }
  | { type: LpActions.SET_LP_BURN_AMOUNT; payload: string }
  | { type: LpActions.SET_TX_FEE; payload: string }
  | { type: LpActions.SET_CONFIRMIMG; payload: boolean }
  | { type: LpActions.SET_LOADING; payload: boolean }
  | { type: LpActions.SET_TX_HASH; payload: string | null }
  | { type: LpActions.SET_ERROR; payload: LpError | null }
  | { type: LpActions.RESET_STATE }

const initialState: State = {
  [TokenField.A]: {
    balance: null,
    amount: '',
    symbol: 'FOX'
  },
  [TokenField.B]: {
    balance: null,
    amount: '',
    symbol: 'ETH'
  },
  independentField: '',
  amountTokenDesired: null,
  amountTokenMin: null,
  amountETHMin: null,
  deadline: null,
  slippagePercentage: 3,
  foxPerEth: null,
  ethPerFox: null,
  poolShare: null,
  estimatedLpTokens: '',
  lpBurnAmount: null,
  totalSupply: null,
  foxPoolBalance: null,
  estimatedFee: null,
  confirming: false,
  loading: false,
  lpTxHash: null,
  error: null
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case LpActions.SET_LP_DATA:
      return { ...state, ...action.payload }
    case LpActions.SET_TOKEN_BALANCE:
      return {
        ...state,
        [action.payload.field]: {
          ...state[action.payload.field],
          balance: action.payload.balance
        }
      }
    case LpActions.SET_TOKEN_AMOUNT:
      return {
        ...state,
        [action.payload.field]: {
          ...state[action.payload.field],
          amount: action.payload.amount
        },
        independentField: action.payload.independentField ?? state.independentField
      }
    case LpActions.SET_RATES:
      return {
        ...state,
        foxPerEth: action.payload.foxPerEth,
        ethPerFox: action.payload.ethPerFox,
        poolShare: action.payload.poolShare,
        estimatedLpTokens: action.payload.estimatedLpTokens,
        totalSupply: action.payload.totalSupply,
        foxPoolBalance: action.payload.foxPoolBalance
      }
    case LpActions.SET_TX_DATA:
      return { ...state, transaction: action.payload }
    case LpActions.SET_LP_BURN_AMOUNT:
      return { ...state, lpBurnAmount: action.payload }
    case LpActions.SET_TX_FEE:
      return { ...state, estimatedFee: action.payload }
    case LpActions.SET_CONFIRMIMG:
      return { ...state, confirming: action.payload }
    case LpActions.SET_LOADING:
      return { ...state, loading: action.payload }
    case LpActions.SET_ERROR:
      return { ...state, error: action.payload }
    case LpActions.SET_TX_HASH:
      return { ...state, lpTxHash: action.payload }
    case LpActions.RESET_STATE:
      return initialState
    default:
      return state
  }
}

interface ILpContext {
  state: State
  dispatch: React.Dispatch<Action>
  addLiquidity: () => Promise<void>
  removeLiquidity: () => Promise<void>
  onUserInput: (field: TokenField, amount: any) => void
}

export type LiquidityParams = { liquidityContractAddress: string }

const LpContext = createContext<ILpContext | null>(null)

function calculateSlippageMargin(percentage: number, amount: string | null) {
  if (!amount) throw new LpError(6007, 'Amount not given for slippage')
  const remainingPercentage = (100 - percentage) / 100
  return bn(toBaseUnit(amount, 18)).times(bn(remainingPercentage)).decimalPlaces(0).toFixed()
}

export const LpProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { state: wallet } = useWallet()
  const { params } = useRouteMatch<LiquidityParams>()

  const uniswapRouter = useContract(
    wallet.provider,
    wallet.account,
    UNISWAP_V2_ROUTER,
    IUniswapV2Router02ABI
  )
  const lpContract = useContract(
    wallet.provider,
    wallet.account,
    params.liquidityContractAddress,
    IUniswapV2PairABI
  )
  const foxContract = useContract(
    wallet.provider,
    wallet.account,
    FOX_TOKEN_CONTRACT_ADDRESS,
    erc20Abi
  )
  const wethContract = useContract(
    wallet.provider,
    wallet.account,
    WETH_TOKEN_CONTRACT_ADDRESS,
    erc20Abi
  )

  const setBalances = useCallback(async () => {
    if (wallet.account) {
      try {
        const foxBalance = await foxContract?.balanceOf(wallet.account)
        dispatch({
          type: LpActions.SET_TOKEN_BALANCE,
          payload: { field: TokenField.A, balance: foxBalance.toString() }
        })
        const ethBalance = await wallet.provider?.getBalance(wallet.account)
        dispatch({
          type: LpActions.SET_TOKEN_BALANCE,
          payload: { field: TokenField.B, balance: ethBalance?.toString() as string }
        })
      } catch (error) {
        console.warn('Balance Error: ', error)
      }
    }
  }, [foxContract, wallet.account, wallet.provider])

  const setRates = useCallback(async () => {
    try {
      const balanceWethPool: BigNumber = await wethContract?.balanceOf(
        params.liquidityContractAddress
      )
      const balanceFoxPool: BigNumber = await foxContract?.balanceOf(
        params.liquidityContractAddress
      )
      const totalLpSupply: BigNumber = await lpContract?.totalSupply()
      const tokensMinted = bn(toBaseUnit(state.A.amount as string, 18))
        .times(bn(totalLpSupply.toString()))
        .dividedBy(bn(balanceFoxPool.toString()))
        .decimalPlaces(0)
        .toString()

      const supplyWithMinted = bn(tokensMinted).plus(bn(totalLpSupply.toString()))
      const poolShare = bn(tokensMinted).div(supplyWithMinted).times(bn('100')).toFixed()
      const foxPerEth = bn(balanceFoxPool.toString()).div(bn(balanceWethPool.toString())).toFixed()
      const ethPerFox = bn(balanceWethPool.toString()).div(bn(balanceFoxPool.toString())).toFixed()
      dispatch({
        type: LpActions.SET_RATES,
        payload: {
          foxPerEth,
          ethPerFox,
          estimatedLpTokens: tokensMinted,
          poolShare: !bn(poolShare).isNaN() ? poolShare : null,
          totalSupply: totalLpSupply.toString(),
          foxPoolBalance: balanceFoxPool.toString()
        }
      })
    } catch (error) {
      console.error('Error fetching rates: ', error)
    }
  }, [foxContract, lpContract, params.liquidityContractAddress, state.A.amount, wethContract])

  const onUserInput = useCallback(
    (field: TokenField, amount: string) => {
      if (state.ethPerFox && state.foxPerEth) {
        const otherField = field === TokenField.B ? TokenField.A : TokenField.B
        const otherAmount =
          otherField === TokenField.B
            ? bn(amount).times(bn(state?.ethPerFox)).toFixed()
            : bn(amount).times(bn(state?.foxPerEth)).toFixed()
        dispatch({
          type: LpActions.SET_TOKEN_AMOUNT,
          payload: { field, amount, independentField: field }
        })
        dispatch({
          type: LpActions.SET_TOKEN_AMOUNT,
          payload: {
            field: otherField,
            amount: amount === '' ? '' : otherAmount
          }
        })
      }
    },
    [state.ethPerFox, state.foxPerEth]
  )

  const addLiquidity = useCallback(async () => {
    try {
      if (!wallet.provider || !wallet.account) {
        throw new LpError(6003, 'Missing wallet address or provider')
      }
      dispatch({ type: LpActions.SET_CONFIRMIMG, payload: true })
      const data = uniswapRouter?.interface.encodeFunctionData('addLiquidityETH', [
        FOX_TOKEN_CONTRACT_ADDRESS,
        toBaseUnit(state.A.amount as string, 18),
        calculateSlippageMargin(state.slippagePercentage, state.A.amount),
        calculateSlippageMargin(state.slippagePercentage, state.B.amount),
        wallet.account,
        Date.now() + 1200000
      ])

      const tx = {
        from: wallet.account,
        to: UNISWAP_V2_ROUTER,
        data,
        value: toHexString(toBaseUnit(state.B.amount as string, 18))
      }

      const { gasLimit, gasPrice } = await getBufferedGas(wallet.provider, tx)
      if (gasLimit && gasPrice) {
        dispatch({
          type: LpActions.SET_TX_FEE,
          payload: bn(gasLimit).times(gasPrice).toFixed()
        })
        const ethBalance = await wallet.provider?.getBalance(wallet.account)
        if (
          bn(ethBalance.toString())
            .minus(bn(toBaseUnit(state.B.amount as string, 18)))
            .lt(bn(gasLimit).times(gasPrice).toFixed())
        ) {
          throw new LpError(6004, 'Not enough ETH for gas')
        }

        const nonce = await wallet.provider?.getSigner().getTransactionCount()
        const lpTx = await wallet.provider?.getSigner().sendTransaction({
          from: wallet.account,
          to: tx.to,
          data: tx.data,
          value: tx.value,
          gasLimit: toHexString(gasLimit),
          gasPrice: toHexString(gasPrice),
          nonce: nonce,
          chainId: 1
        })
        if (lpTx) {
          dispatch({ type: LpActions.SET_TX_HASH, payload: lpTx.hash })
          dispatch({ type: LpActions.SET_CONFIRMIMG, payload: false })
        }
      }
    } catch (error) {
      dispatch({ type: LpActions.SET_CONFIRMIMG, payload: false })
      dispatch({
        type: LpActions.SET_ERROR,
        payload: error
      })
      console.warn(error)
    }
  }, [
    wallet.provider,
    wallet.account,
    uniswapRouter?.interface,
    state.A.amount,
    state.slippagePercentage,
    state.B.amount
  ])

  const removeLiquidity = useCallback(async () => {
    try {
      if (!wallet.provider || !wallet.account) {
        throw new LpError(6003, 'Missing wallet address or provider')
      }
      dispatch({ type: LpActions.SET_CONFIRMIMG, payload: true })
      const data = uniswapRouter?.interface.encodeFunctionData('removeLiquidityETH', [
        FOX_TOKEN_CONTRACT_ADDRESS,
        state.lpBurnAmount,
        calculateSlippageMargin(state.slippagePercentage, state.A.amount),
        calculateSlippageMargin(state.slippagePercentage, state.B.amount),
        wallet.account,
        Date.now() + 1200000
      ])

      const tx = {
        from: wallet.account,
        to: UNISWAP_V2_ROUTER,
        data,
        value: toHexString('0')
      }

      const { gasLimit, gasPrice } = await getBufferedGas(wallet.provider, tx)
      if (gasLimit && gasPrice) {
        dispatch({
          type: LpActions.SET_TX_FEE,
          payload: bn(gasLimit).times(gasPrice).toFixed()
        })
        const ethBalance = await wallet.provider?.getBalance(wallet.account)
        if (bn(ethBalance.toString()).lt(bn(gasLimit).times(gasPrice).toFixed())) {
          throw new LpError(6004, 'Not enough ETH for gas')
        }

        const nonce = await wallet.provider?.getSigner().getTransactionCount()
        const lpTx = await wallet.provider?.getSigner().sendTransaction({
          from: wallet.account,
          to: tx.to,
          data: tx.data,
          value: tx.value,
          gasLimit: toHexString(gasLimit),
          gasPrice: toHexString(gasPrice),
          nonce: nonce,
          chainId: 1
        })
        if (lpTx) {
          dispatch({ type: LpActions.SET_TX_HASH, payload: lpTx.hash })
          dispatch({ type: LpActions.SET_CONFIRMIMG, payload: false })
        }
      }
    } catch (error) {
      dispatch({ type: LpActions.SET_CONFIRMIMG, payload: false })
      dispatch({
        type: LpActions.SET_ERROR,
        payload: error
      })
      console.warn(error)
    }
  }, [
    wallet.provider,
    wallet.account,
    uniswapRouter?.interface,
    state.lpBurnAmount,
    state.slippagePercentage,
    state.A.amount,
    state.B.amount
  ])

  useEffect(() => {
    let ignore = false
    if (!ignore) {
      if (wallet?.blockNumber && wallet.account) {
        setBalances()
        setRates()
      }
    }
    return () => {
      ignore = true
    }
  }, [setBalances, setRates, wallet.account, wallet?.blockNumber])

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      if (state.error && state?.error?.code !== 6000) {
        dispatch({ type: LpActions.SET_ERROR, payload: null })
      }
    }, 8000)
    return () => {
      clearTimeout(errorTimeout)
    }
  }, [state.error])

  const store: ILpContext = useMemo(
    () => ({ state, dispatch, addLiquidity, removeLiquidity, onUserInput }),
    [state, dispatch, addLiquidity, removeLiquidity, onUserInput]
  )

  return <LpContext.Provider value={store}>{children}</LpContext.Provider>
}

export const useLp = (): ILpContext => useContext(LpContext as React.Context<ILpContext>)
