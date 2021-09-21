import { useState, useEffect, useCallback } from 'react'
import { useWallet } from 'state/WalletProvider'
import { useContract } from 'hooks/useContract'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { BN, bn, fromBaseUnit } from 'utils/math'
import { UNISWAP_V2_USDC_ETH_POOL_ADDRESS } from 'lib/constants'

type UserHoldings = {
  ethPriceUsdc?: string
  userEthHoldings?: string
  userFoxHoldings?: string
  userLpBalance?: BN
  totalSupply?: string
  reserves?: BN[]
}

type useCalculateHoldingsType = {
  lpAddress: string
  usdcEthAddress?: string
}

export const useCalculateLPHoldings = ({
  lpAddress,
  usdcEthAddress = UNISWAP_V2_USDC_ETH_POOL_ADDRESS
}: useCalculateHoldingsType) => {
  const [userHoldings, setUserHoldings] = useState<UserHoldings>({
    ethPriceUsdc: '0',
    userEthHoldings: '0',
    userFoxHoldings: '0',
    userLpBalance: bn('0'),
    totalSupply: '0'
  })

  const { state } = useWallet()

  const uniswapLPContract = useContract(state.provider, state.account, lpAddress, IUniswapV2PairABI)

  const usdcEthContract = useContract(
    state.provider,
    state.account,
    usdcEthAddress,
    IUniswapV2PairABI
  )

  const calculateHoldings = useCallback(async () => {
    if (uniswapLPContract && usdcEthContract && state.isConnected) {
      const totalSupply = await uniswapLPContract?.totalSupply()
      const balance = await uniswapLPContract?.balanceOf(state?.account)
      const reserves = await uniswapLPContract?.getReserves()

      const userOwnershipOfPool = bn(balance.toString()).div(bn(totalSupply.toString()))
      const userEthHoldings = userOwnershipOfPool.times(bn(reserves[0].toString())).decimalPlaces(0)
      const userFoxHoldings = userOwnershipOfPool.times(bn(reserves[1].toString())).decimalPlaces(0)

      const ethUsdcReserves = await usdcEthContract?.getReserves()
      const ethPriceUsdc = bn(fromBaseUnit(ethUsdcReserves[0].toString(), 6)).div(
        bn(fromBaseUnit(ethUsdcReserves[1].toString(), 18))
      )

      setUserHoldings({
        ethPriceUsdc: ethPriceUsdc.toString(),
        userEthHoldings: userEthHoldings.toFixed(),
        userFoxHoldings: userFoxHoldings.toFixed(),
        userLpBalance: balance,
        totalSupply: totalSupply.toString(),
        reserves
      })
    }
  }, [uniswapLPContract, usdcEthContract, state?.account, state.isConnected])

  useEffect(() => {
    if (
      uniswapLPContract &&
      usdcEthContract &&
      state.blockNumber &&
      state.isConnected &&
      state.account
    ) {
      calculateHoldings()
    }
  }, [
    calculateHoldings,
    state.account,
    state.isConnected,
    state.blockNumber,
    uniswapLPContract,
    usdcEthContract
  ])

  return { ...userHoldings, calculateHoldings, uniswapLPContract }
}
