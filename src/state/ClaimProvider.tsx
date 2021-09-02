import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from 'react'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Web3Provider, InfuraProvider } from '@ethersproject/providers'
import { bn } from 'utils/math'
import { getBufferedGas, toHexString } from 'utils/helpers'
import AirDropABI from 'abis/airdropAbi.json'
import { Interface } from '@ethersproject/abi'

export class ClaimError extends Error {
  code?: number
  constructor(code: number, message: string) {
    super(message)
    this.name = 'ClaimError'
    this.code = code
  }
}

const AirDropInterface = new Interface(AirDropABI)

export enum ClaimActions {
  SET_CLAIM_DATA = 'SET_CLAIM_DATA',
  SET_TX_DATA = 'SET_TX_DATA',
  SET_TX_FEE = 'SET_TX_FEE',
  SET_CONFIRMIMG = 'SET_CONFIRMIMG',
  SET_LOADING = 'SET_LOADING',
  SET_TX_HASH = 'SET_TX_HASH',
  SET_ERROR = 'SET_ERROR',
  RESET_STATE = 'RESET_STATE'
}

export type State = {
  contractAddress: string | null
  claimantAddress: string | null
  amount: string | null
  index: number | null
  proof: string[] | null
  transaction: TransactionRequest | null
  estimatedFee: string | null
  confirming: boolean
  loading: boolean
  claimTxHash: string | null
  error: ClaimError | null
}

type Action =
  | { type: ClaimActions.SET_CLAIM_DATA; payload: Partial<State> }
  | { type: ClaimActions.SET_TX_DATA; payload: TransactionRequest }
  | { type: ClaimActions.SET_TX_FEE; payload: string }
  | { type: ClaimActions.SET_CONFIRMIMG; payload: boolean }
  | { type: ClaimActions.SET_LOADING; payload: boolean }
  | { type: ClaimActions.SET_TX_HASH; payload: string }
  | { type: ClaimActions.SET_ERROR; payload: ClaimError | null }
  | { type: ClaimActions.RESET_STATE }

const initialState: State = {
  contractAddress: null,
  claimantAddress: null,
  amount: null,
  index: null,
  proof: null,
  transaction: null,
  estimatedFee: null,
  confirming: false,
  loading: false,
  claimTxHash: null,
  error: null
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ClaimActions.SET_CLAIM_DATA:
      return { ...state, ...action.payload }
    case ClaimActions.SET_TX_DATA:
      return { ...state, transaction: action.payload }
    case ClaimActions.SET_TX_FEE:
      return { ...state, estimatedFee: action.payload }
    case ClaimActions.SET_CONFIRMIMG:
      return { ...state, confirming: action.payload }
    case ClaimActions.SET_LOADING:
      return { ...state, loading: action.payload }
    case ClaimActions.SET_ERROR:
      return { ...state, error: action.payload }
    case ClaimActions.SET_TX_HASH:
      return { ...state, claimTxHash: action.payload }
    case ClaimActions.RESET_STATE:
      return initialState
    default:
      return state
  }
}

interface IClaimContext {
  state: State
  dispatch: React.Dispatch<Action>
  claim: (provider: Web3Provider | null, walletAddress: string | null) => Promise<void>
  buildTx: (activeProvider: Web3Provider | InfuraProvider) => Promise<void>
}

const ClaimContext = createContext<IClaimContext | null>(null)

export const ClaimProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const claim = useCallback(
    async (provider: Web3Provider | null, walletAddress: string | null) => {
      try {
        if (!provider || !walletAddress) {
          throw new ClaimError(6003, 'Missing wallet address or provider')
        }
        dispatch({ type: ClaimActions.SET_CONFIRMIMG, payload: true })
        const ethBalance = await provider?.getBalance(walletAddress)
        if (bn(ethBalance.toString()).lt(bn(state.estimatedFee as string))) {
          throw new ClaimError(6004, 'Not enough ETH for gas')
        }
        const nonce = await provider?.getSigner().getTransactionCount()
        const claimTx = await provider?.getSigner().sendTransaction({
          from: walletAddress,
          to: state.transaction?.to,
          data: state.transaction?.data,
          value: state.transaction?.value,
          gasLimit: state.transaction?.gasLimit,
          gasPrice: state.transaction?.gasPrice,
          nonce: nonce,
          chainId: state.transaction?.chainId
        })
        if (claimTx) {
          dispatch({ type: ClaimActions.SET_TX_HASH, payload: claimTx.hash })
        }
      } catch (error) {
        dispatch({ type: ClaimActions.SET_CONFIRMIMG, payload: false })
        dispatch({
          type: ClaimActions.SET_ERROR,
          payload: error
        })
        console.warn(error)
      }
    },
    [state.estimatedFee, state.transaction]
  )

  // estimate gas and build tx data
  const buildTx = useCallback(
    async (activeProvider: Web3Provider | InfuraProvider) => {
      if (activeProvider && state.contractAddress) {
        try {
          dispatch({ type: ClaimActions.SET_LOADING, payload: true })
          const data = AirDropInterface.encodeFunctionData('claim', [
            state.index,
            state.claimantAddress,
            state.amount,
            state.proof
          ])

          const tx = {
            to: state.contractAddress,
            data,
            value: toHexString('0')
          }

          if (tx) {
            const { gasLimit, gasPrice } = await getBufferedGas(activeProvider, tx)
            if (gasLimit && gasPrice) {
              // buffer gas from node slightly
              dispatch({
                type: ClaimActions.SET_TX_FEE,
                payload: bn(gasLimit).times(gasPrice).toFixed()
              })
              dispatch({
                type: ClaimActions.SET_TX_DATA,
                payload: {
                  to: tx.to,
                  data: tx.data,
                  gasPrice: toHexString(gasPrice),
                  gasLimit: toHexString(gasLimit),
                  chainId: 1,
                  value: toHexString('0')
                }
              })
            }
          }
          dispatch({ type: ClaimActions.SET_LOADING, payload: false })
        } catch (error) {
          dispatch({ type: ClaimActions.SET_LOADING, payload: false })
          dispatch({
            type: ClaimActions.SET_ERROR,
            payload: new ClaimError(6000, 'Error building transaction')
          })
          console.warn(error)
        }
      }
    },
    [state.amount, state.claimantAddress, state.contractAddress, state.index, state.proof]
  )

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      if (state.error && state?.error?.code !== 6000) {
        dispatch({ type: ClaimActions.SET_ERROR, payload: null })
      }
    }, 5000)
    return () => {
      clearTimeout(errorTimeout)
    }
  }, [state.error])

  const store: IClaimContext = useMemo(
    () => ({ state, dispatch, claim, buildTx }),
    [state, dispatch, claim, buildTx]
  )

  return <ClaimContext.Provider value={store}>{children}</ClaimContext.Provider>
}

export const useClaim = (): IClaimContext =>
  useContext(ClaimContext as React.Context<IClaimContext>)
