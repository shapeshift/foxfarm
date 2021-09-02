import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react'
import { useWallet } from 'state/WalletProvider'
import { useContract } from 'hooks/useContract'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { bn, bnOrZero, fromBaseUnit } from 'utils/math'
import { BigNumber, Contract } from 'ethers'
import farmAbi from 'abis/farmingAbi.json'
import {
  UNISWAP_V2_WETH_FOX_POOL_ADDRESS,
  UNISWAP_V2_USDC_ETH_POOL_ADDRESS,
  FOX_ETH_FARMING_ADDRESS
} from 'lib/constants'
import { getBufferedGas, toHexString } from 'utils/helpers'

type UserHoldings = {
  ethPriceUsdc?: string
  totalUsdcValue?: string
  userEthHoldings?: string
  userFoxHoldings?: string
  userStakedBalance?: string
  userLpBalance?: string
  userUnclaimedRewards?: string
  userEthHoldingsStakedAndLp?: string
  userFoxHoldingsStakedAndLp?: string
  totalUsdcValueStakedAndLp?: string
}

const initialContext: StakingContextInterface = {
  uniswapLPContract: null,
  usdcEthContract: null,
  farmingRewardsContract: null,
  stakeTxID: null,
  error: null,
  confirming: false,
  setStakeTxID: () => {},
  stake: () => {},
  unStake: () => {},
  claimReward: () => {},
  calculateHoldings: () => Promise.resolve()
}

interface StakingContextInterface {
  ethPriceUsdc?: string
  totalUsdcValue?: string
  userEthHoldings?: string
  userFoxHoldings?: string
  userLpBalance?: string | BigNumber
  userStakedBalance?: string | BigNumber
  userUnclaimedRewards?: string | BigNumber
  userEthHoldingsStakedAndLp?: string
  userFoxHoldingsStakedAndLp?: string
  totalUsdcValueStakedAndLp?: string
  uniswapLPContract: Contract | null
  usdcEthContract: Contract | null
  farmingRewardsContract: Contract | null
  stakeTxID: string | null
  setStakeTxID: React.Dispatch<React.SetStateAction<string | null>>
  confirming: boolean
  error: Error | null
  stake: () => void
  unStake: () => void
  claimReward: () => void
  calculateHoldings: () => Promise<void>
}

const StakingContext = createContext<StakingContextInterface>(initialContext)

export const StakingProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<Error | null>(null)
  const [confirming, setConfirming] = useState<boolean>(false)
  const [stakeTxID, setStakeTxID] = useState<string | null>(null)
  const { state } = useWallet()
  const [userHoldings, setUserHoldings] = useState<UserHoldings>({
    ethPriceUsdc: '0',
    totalUsdcValue: '0',
    userEthHoldings: '0',
    userFoxHoldings: '0',
    userStakedBalance: '0',
    userLpBalance: '0',
    userEthHoldingsStakedAndLp: '0',
    userFoxHoldingsStakedAndLp: '0',
    totalUsdcValueStakedAndLp: '0'
  })

  const uniswapLPContract = useContract(
    state.provider,
    state.account,
    UNISWAP_V2_WETH_FOX_POOL_ADDRESS,
    IUniswapV2PairABI
  )

  const usdcEthContract = useContract(
    state.provider,
    state.account,
    UNISWAP_V2_USDC_ETH_POOL_ADDRESS,
    IUniswapV2PairABI
  )

  const farmingRewardsContract = useContract(
    state.provider,
    state.account,
    FOX_ETH_FARMING_ADDRESS,
    farmAbi
  )

  const calculateHoldings = useCallback(async () => {
    if (uniswapLPContract && usdcEthContract && farmingRewardsContract && state.isConnected) {
      const totalSupply = await uniswapLPContract?.totalSupply()
      const balance = await uniswapLPContract?.balanceOf(state?.account)
      const reserves = await uniswapLPContract?.getReserves()
      const stakedBalance = await farmingRewardsContract.balanceOf(state?.account)
      const userUnclaimedRewards = await farmingRewardsContract.earned(state?.account)

      const userOwnershipOfPool = bn(balance.toString()).div(bn(totalSupply.toString()))
      const userEthHoldings = userOwnershipOfPool.times(bn(reserves[0].toString())).decimalPlaces(0)
      const userFoxHoldings = userOwnershipOfPool.times(bn(reserves[1].toString())).decimalPlaces(0)

      const ethUsdcReserves = await usdcEthContract?.getReserves()
      const ethPriceUsdc = bn(fromBaseUnit(ethUsdcReserves[0].toString(), 6)).div(
        bn(fromBaseUnit(ethUsdcReserves[1].toString(), 18))
      )

      const totalUsdcValue = userEthHoldings.times(2).times(ethPriceUsdc)

      const totalBalanceOwned = bnOrZero(balance?.toString()).plus(
        bnOrZero(stakedBalance?.toString())
      )
      const userEthHoldingsStakedAndLp = totalBalanceOwned
        .div(totalSupply.toString())
        .times(reserves[0].toString())
        .decimalPlaces(0)
        .toString()
      const userFoxHoldingsStakedAndLp = totalBalanceOwned
        .div(totalSupply.toString())
        .times(reserves[1].toString())
        .decimalPlaces(0)
        .toString()
      const totalUsdcValueStakedAndLp = bn(userEthHoldingsStakedAndLp)
        .times(2)
        .times(ethPriceUsdc)
        .toString()

      setUserHoldings({
        ethPriceUsdc: ethPriceUsdc.toString(),
        totalUsdcValue: fromBaseUnit(totalUsdcValue.toString(), 18),
        userEthHoldings: userEthHoldings.toFixed(),
        userFoxHoldings: userFoxHoldings.toFixed(),
        userStakedBalance: stakedBalance,
        userLpBalance: balance,
        userUnclaimedRewards,
        userFoxHoldingsStakedAndLp,
        userEthHoldingsStakedAndLp,
        totalUsdcValueStakedAndLp
      })
    }
  }, [
    uniswapLPContract,
    usdcEthContract,
    farmingRewardsContract,
    state?.account,
    state?.isConnected
  ])

  useEffect(() => {
    if (
      uniswapLPContract &&
      usdcEthContract &&
      farmingRewardsContract &&
      state.blockNumber &&
      state.isConnected &&
      state.account
    ) {
      calculateHoldings()
    }
  }, [
    calculateHoldings,
    farmingRewardsContract,
    state.account,
    state.isConnected,
    state.blockNumber,
    uniswapLPContract,
    usdcEthContract
  ])

  const stake = useCallback(async () => {
    try {
      if (!state.provider || !state.account) {
        throw Error('Missing wallet address or provider')
      }
      setConfirming(true)
      setStakeTxID(null)
      const data = farmingRewardsContract?.interface.encodeFunctionData('stake', [
        userHoldings.userLpBalance
      ])

      const tx = {
        from: state.account,
        to: farmingRewardsContract?.address,
        data,
        value: toHexString('0')
      }

      const { gasLimit, gasPrice } = await getBufferedGas(state.provider, tx)
      if (gasLimit && gasPrice) {
        const ethBalance = await state.provider?.getBalance(state.account)
        if (bn(ethBalance.toString()).lt(bn(gasLimit).times(gasPrice).toFixed())) {
          throw Error('Not enough ETH for gas')
        }

        const nonce = await state.provider?.getSigner().getTransactionCount()
        const stakeTx = await state.provider?.getSigner().sendTransaction({
          from: tx.from,
          to: tx.to,
          data: tx.data,
          value: tx.value,
          gasLimit: toHexString(gasLimit),
          gasPrice: toHexString(gasPrice),
          nonce: nonce,
          chainId: 1
        })
        if (stakeTx) {
          setConfirming(false)
          setStakeTxID(stakeTx.hash)
        }
      }
    } catch (error) {
      setConfirming(false)
      setError(error)
      console.warn(error)
    }
  }, [
    farmingRewardsContract?.address,
    farmingRewardsContract?.interface,
    state.account,
    state.provider,
    userHoldings.userLpBalance
  ])

  const unStake = useCallback(async () => {
    try {
      if (!state.provider || !state.account) {
        throw Error('Missing wallet address or provider')
      }
      setConfirming(true)
      setStakeTxID(null)
      const data = farmingRewardsContract?.interface.encodeFunctionData('exit')

      const tx = {
        from: state.account,
        to: farmingRewardsContract?.address,
        data,
        value: toHexString('0')
      }

      const { gasLimit, gasPrice } = await getBufferedGas(state.provider, tx)
      if (gasLimit && gasPrice) {
        const ethBalance = await state.provider?.getBalance(state.account)
        if (bn(ethBalance.toString()).lt(bn(gasLimit).times(gasPrice).toFixed())) {
          throw Error('Not enough ETH for gas')
        }

        const nonce = await state.provider?.getSigner().getTransactionCount()
        const unStakeTx = await state.provider?.getSigner().sendTransaction({
          from: tx.from,
          to: tx.to,
          data: tx.data,
          value: tx.value,
          gasLimit: toHexString(gasLimit),
          gasPrice: toHexString(gasPrice),
          nonce: nonce,
          chainId: 1
        })
        if (unStakeTx) {
          setConfirming(false)
          setStakeTxID(unStakeTx.hash)
        }
      }
    } catch (error) {
      setConfirming(false)
      setError(error)
      console.warn(error)
    }
  }, [
    farmingRewardsContract?.address,
    farmingRewardsContract?.interface,
    state.account,
    state.provider
  ])

  const claimReward = useCallback(async () => {
    try {
      if (!state.provider || !state.account) {
        throw Error('Missing wallet address or provider')
      }
      setConfirming(true)
      setStakeTxID(null)
      const data = farmingRewardsContract?.interface.encodeFunctionData('getReward')

      const tx = {
        from: state.account,
        to: farmingRewardsContract?.address,
        data,
        value: toHexString('0')
      }

      const { gasLimit, gasPrice } = await getBufferedGas(state.provider, tx)
      if (gasLimit && gasPrice) {
        const ethBalance = await state.provider?.getBalance(state.account)
        if (bn(ethBalance.toString()).lt(bn(gasLimit).times(gasPrice).toFixed())) {
          throw Error('Not enough ETH for gas')
        }

        const nonce = await state.provider?.getSigner().getTransactionCount()
        const rewardTx = await state.provider?.getSigner().sendTransaction({
          from: tx.from,
          to: tx.to,
          data: tx.data,
          value: tx.value,
          gasLimit: toHexString(gasLimit),
          gasPrice: toHexString(gasPrice),
          nonce: nonce,
          chainId: 1
        })
        if (rewardTx) {
          setConfirming(false)
          setStakeTxID(rewardTx.hash)
        }
      }
    } catch (error) {
      setConfirming(false)
      setError(error)
      console.warn(error)
    }
  }, [
    farmingRewardsContract?.address,
    farmingRewardsContract?.interface,
    state.account,
    state.provider
  ])

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      if (error) {
        setError(null)
      }
    }, 8000)
    return () => {
      clearTimeout(errorTimeout)
    }
  }, [error])

  const value = useMemo(
    () => ({
      ...userHoldings,
      calculateHoldings,
      uniswapLPContract,
      farmingRewardsContract,
      stakeTxID,
      setStakeTxID,
      confirming,
      error,
      stake,
      unStake,
      claimReward,
      usdcEthContract
    }),
    [
      userHoldings,
      calculateHoldings,
      uniswapLPContract,
      farmingRewardsContract,
      stakeTxID,
      setStakeTxID,
      confirming,
      error,
      stake,
      unStake,
      claimReward,
      usdcEthContract
    ]
  )

  return <StakingContext.Provider value={value}>{children}</StakingContext.Provider>
}

export const useStaking = (): StakingContextInterface =>
  useContext(StakingContext as React.Context<StakingContextInterface>)
