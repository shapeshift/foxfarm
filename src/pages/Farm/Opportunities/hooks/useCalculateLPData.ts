import { useWallet } from 'state/WalletProvider'
import { useContract } from 'hooks/useContract'
import { useActiveProvider } from 'hooks/useActiveProvider'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { UNISWAP_V2_USDC_ETH_POOL_ADDRESS } from 'lib/constants'
import { useCallback, useEffect, useState } from 'react'
import { bn, bnOrZero, fromBaseUnit } from 'utils/math'

export const useCalculateLPData = (lpContractAddress: string) => {
  const [lpData, setLPData] = useState({
    totalLiquidity: '0',
    lpTokenPrice: '0'
  })
  const { state } = useWallet()
  const provider = useActiveProvider()

  const lpContract = useContract(provider, state.account, lpContractAddress, IUniswapV2PairABI)

  const usdcEthContract = useContract(
    provider,
    state.account,
    UNISWAP_V2_USDC_ETH_POOL_ADDRESS,
    IUniswapV2PairABI
  )

  const calculateLPData = useCallback(async () => {
    if (lpContract && usdcEthContract) {
      const totalSupplyLiquidity = await lpContract?.totalSupply()
      const reserves = await lpContract?.getReserves()
      // Amount of Eth in liquidity pool
      const ethInReserve = bnOrZero(reserves?.[0]?.toString()).toString()

      // Calculate price of eth based on eth/usdc pool
      const ethUsdcReserves = await usdcEthContract?.getReserves()
      const ethPriceUsdc = bn(fromBaseUnit(ethUsdcReserves[0].toString(), 6)).div(
        bn(fromBaseUnit(ethUsdcReserves[1].toString(), 18))
      )

      // Total market cap of liquidity pool in usdc.
      // Multiplied by 2 to show equal amount of eth and fox.
      const totalLiquidity = bnOrZero(ethInReserve).times(ethPriceUsdc.toString()).times(2)

      const lpTokenPrice = totalLiquidity.div(totalSupplyLiquidity.toString())

      setLPData({
        totalLiquidity: totalLiquidity.toString(),
        lpTokenPrice: lpTokenPrice.toString()
      })
    }
  }, [lpContract, usdcEthContract])

  useEffect(() => {
    if (lpContract && usdcEthContract) {
      calculateLPData()
    }
  }, [calculateLPData, usdcEthContract, lpContract])

  return lpData
}
