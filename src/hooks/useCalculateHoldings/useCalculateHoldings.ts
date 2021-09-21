import { useState, useEffect, useCallback } from 'react'
import { useWallet } from 'state/WalletProvider'
import { useContract } from 'hooks/useContract'
import { BN, bn, bnOrZero, fromBaseUnit } from 'utils/math'
import farmAbi from 'abis/farmingAbi.json'
import { useCalculateLPHoldings } from '../useCalculateLPHoldings/useCalculateLPHoldings'

type UserHoldings = {
  ethPriceUsdc?: string
  totalUsdcValue?: string
  userEthHoldings?: string
  userFoxHoldings?: string
  userStakedBalance?: string
  userLpBalance?: BN
  userUnclaimedRewards?: string
  userEthHoldingsStakedAndLp?: string
  userFoxHoldingsStakedAndLp?: string
  totalUsdcValueStakedAndLp?: string
}

type useCalculateHoldingsType = {
  lpAddress: string
  rewardsAddress: string
  usdcEthAddress?: string
}

export const useCalculateHoldings = ({ lpAddress, rewardsAddress }: useCalculateHoldingsType) => {
  const [userHoldings, setUserHoldings] = useState<UserHoldings>({
    ethPriceUsdc: '0',
    totalUsdcValue: '0',
    userEthHoldings: '0',
    userFoxHoldings: '0',
    userStakedBalance: '0',
    userLpBalance: bn('0'),
    userEthHoldingsStakedAndLp: '0',
    userFoxHoldingsStakedAndLp: '0',
    totalUsdcValueStakedAndLp: '0'
  })

  const { state } = useWallet()

  const {
    userEthHoldings,
    userFoxHoldings,
    userLpBalance,
    uniswapLPContract,
    totalSupply,
    reserves,
    ethPriceUsdc
  } = useCalculateLPHoldings({ lpAddress: lpAddress })

  const farmingRewardsContract = useContract(state.provider, state.account, rewardsAddress, farmAbi)

  const calculateHoldings = useCallback(async () => {
    if (uniswapLPContract && farmingRewardsContract && state.isConnected) {
      const stakedBalance = await farmingRewardsContract.balanceOf(state?.account)
      const userUnclaimedRewards = await farmingRewardsContract.earned(state?.account)

      const totalUsdcValue = bnOrZero(userEthHoldings).times(2).times(bnOrZero(ethPriceUsdc))

      const totalBalanceOwned = bnOrZero(userLpBalance).plus(bnOrZero(stakedBalance?.toString()))
      const userEthHoldingsStakedAndLp = totalBalanceOwned
        .div(bnOrZero(totalSupply))
        .times(bnOrZero(reserves?.[0]?.toString()))
        .decimalPlaces(0)
        .toString()
      const userFoxHoldingsStakedAndLp = totalBalanceOwned
        .div(bnOrZero(totalSupply))
        .times(bnOrZero(reserves?.[1]?.toString()))
        .decimalPlaces(0)
        .toString()
      const totalUsdcValueStakedAndLp = bn(userEthHoldingsStakedAndLp)
        .times(2)
        .times(bnOrZero(ethPriceUsdc))
        .toString()

      setUserHoldings({
        totalUsdcValue: fromBaseUnit(totalUsdcValue.toString(), 18),
        userStakedBalance: stakedBalance,
        userUnclaimedRewards,
        userFoxHoldingsStakedAndLp,
        userEthHoldingsStakedAndLp,
        totalUsdcValueStakedAndLp
      })
    }
  }, [
    uniswapLPContract,
    farmingRewardsContract,
    state.isConnected,
    state?.account,
    userEthHoldings,
    ethPriceUsdc,
    userLpBalance,
    totalSupply,
    reserves
  ])

  useEffect(() => {
    if (
      uniswapLPContract &&
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
    uniswapLPContract
  ])

  return {
    userHoldings: {
      ...userHoldings,
      userEthHoldings,
      userFoxHoldings,
      userLpBalance,
      ethPriceUsdc
    },
    calculateHoldings
  }
}
