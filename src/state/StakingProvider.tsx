import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react'
import { useWallet } from 'state/WalletProvider'
import { useContract } from 'hooks/useContract'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { bn } from 'utils/math'
import { BigNumber, Contract } from 'ethers'
import farmAbi from 'abis/farmingAbi.json'
import {
  UNISWAP_V2_WETH_FOX_POOL_ADDRESS,
  UNISWAP_V2_USDC_ETH_POOL_ADDRESS,
  FOX_ETH_FARMING_ADDRESS
} from 'lib/constants'
import { getBufferedGas, toHexString } from 'utils/helpers'
import { useCalculateHoldings } from 'hooks/useCalculateHoldings'
import { useRouteMatch } from 'react-router'

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

export type ContractParams = { liquidityContractAddress?: string; stakingContractAddress?: string }

const StakingContext = createContext<StakingContextInterface>(initialContext)

export const StakingProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<Error | null>(null)
  const [confirming, setConfirming] = useState<boolean>(false)
  const [stakeTxID, setStakeTxID] = useState<string | null>(null)
  const { state } = useWallet()
  const { params } = useRouteMatch<ContractParams>()

  const uniswapLPContract = useContract(
    state.provider,
    state.account,
    params.liquidityContractAddress ?? UNISWAP_V2_WETH_FOX_POOL_ADDRESS,
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
    params?.stakingContractAddress ?? FOX_ETH_FARMING_ADDRESS,
    farmAbi
  )
  const { userHoldings, calculateHoldings } = useCalculateHoldings({
    lpAddress: UNISWAP_V2_WETH_FOX_POOL_ADDRESS,
    rewardsAddress: FOX_ETH_FARMING_ADDRESS
  })

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
