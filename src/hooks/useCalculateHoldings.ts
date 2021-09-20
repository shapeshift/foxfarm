import { useState, useEffect, useCallback } from 'react'
import { useWallet } from 'state/WalletProvider'
import { useContract } from 'hooks/useContract'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { bn, bnOrZero, fromBaseUnit } from 'utils/math'
import farmAbi from 'abis/farmingAbi.json'
import { UNISWAP_V2_USDC_ETH_POOL_ADDRESS } from 'lib/constants'
import { useCalculateLPHoldings } from './useCalculateLPHoldings'

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

type useCalculateHoldingsType = {
  lpAddress: string
  rewardsAddress: string
  usdcEthAddress?: string
}

export const useCalculateHoldings = ({
  lpAddress,
  rewardsAddress,
  usdcEthAddress = UNISWAP_V2_USDC_ETH_POOL_ADDRESS
}: useCalculateHoldingsType) => {
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

  const { state } = useWallet()

  const {
    userEthHoldings,
    userFoxHoldings,
    userLpBalance,
    uniswapLPContract,
    totalSupply,
    reserves
  } = useCalculateLPHoldings({ lpAddress: lpAddress })

  const usdcEthContract = useContract(
    state.provider,
    state.account,
    usdcEthAddress,
    IUniswapV2PairABI
  )

  const farmingRewardsContract = useContract(state.provider, state.account, rewardsAddress, farmAbi)

  const calculateHoldings = useCallback(async () => {
    if (uniswapLPContract && usdcEthContract && farmingRewardsContract && state.isConnected) {
      const stakedBalance = await farmingRewardsContract.balanceOf(state?.account)
      const userUnclaimedRewards = await farmingRewardsContract.earned(state?.account)
      const ethUsdcReserves = await usdcEthContract?.getReserves()
      const ethPriceUsdc = bn(fromBaseUnit(ethUsdcReserves[0].toString(), 6)).div(
        bn(fromBaseUnit(ethUsdcReserves[1].toString(), 18))
      )

      const totalUsdcValue = bnOrZero(userEthHoldings).times(2).times(ethPriceUsdc)

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
        .times(ethPriceUsdc)
        .toString()

      setUserHoldings({
        ethPriceUsdc: ethPriceUsdc.toString(),
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
    usdcEthContract,
    farmingRewardsContract,
    state.isConnected,
    state?.account,
    userEthHoldings,
    userLpBalance,
    totalSupply,
    reserves
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

  return {
    userHoldings: { ...userHoldings, userEthHoldings, userFoxHoldings, userLpBalance },
    calculateHoldings
  }
}
