import { useState, useEffect, useCallback } from 'react'
import { useWallet } from 'state/WalletProvider'
import { useContract } from 'hooks/useContract'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { bn, bnOrZero, fromBaseUnit } from 'utils/math'
import farmAbi from 'abis/farmingAbi.json'
import { UNISWAP_V2_USDC_ETH_POOL_ADDRESS } from 'lib/constants'

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

  const uniswapLPContract = useContract(state.provider, state.account, lpAddress, IUniswapV2PairABI)

  const usdcEthContract = useContract(
    state.provider,
    state.account,
    usdcEthAddress,
    IUniswapV2PairABI
  )

  const farmingRewardsContract = useContract(state.provider, state.account, rewardsAddress, farmAbi)

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

  return { userHoldings, calculateHoldings }
}
