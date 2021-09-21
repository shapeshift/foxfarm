import { Contract } from '@ethersproject/contracts'
import { InfuraProvider, Web3Provider } from '@ethersproject/providers'
import { bn } from 'utils/math'
import { Token, Fetcher } from '@uniswap/sdk'
import farmAbi from 'abis/farmingAbi.json'
import { useEffect, useState } from 'react'
import {
  FOX_ETH_FARMING_ADDRESS,
  FOX_TOKEN_CONTRACT_ADDRESS,
  WETH_TOKEN_CONTRACT_ADDRESS
} from 'lib/constants'
import { useContract } from './useContract'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useActiveProvider } from './useActiveProvider'
import { useBlockListeners } from 'hooks/useBlockListeners'
import BigNumber from 'bignumber.js'
import { useRouteMatch } from 'react-router'
import { LiquidityParams } from 'state/LpProvider'

type Farming = {
  farmApr: string
  lpApr: string
  totalApr: string
}

const TRADING_FEE_RATE = 0.003

const getToken0Volume24Hr = async ({ blockNumber, uniswapLPContract }: any) => {
  const currentBlockNumber = blockNumber
  const yesterdayBlockNumber = currentBlockNumber - 6500 // ~6500 blocks per day

  let eventFilter = uniswapLPContract.filters.Swap()
  let events = await uniswapLPContract.queryFilter(
    eventFilter,
    yesterdayBlockNumber,
    currentBlockNumber
  )

  const token0SwapAmounts = events.map(
    (event: { args: { amount0In: BigNumber.Value; amount0Out: BigNumber.Value } }) =>
      Number(event.args.amount0In)
        ? new BigNumber(event.args.amount0In.toString())
        : new BigNumber(event.args.amount0Out.toString())
            .div(new BigNumber(1).minus(TRADING_FEE_RATE)) // Since these are outbound txs, this corrects the value to include trading fees taken out.
            .decimalPlaces(0)
  )

  const token0Volume24hr = token0SwapAmounts.reduce((a: BigNumber.Value, b: BigNumber.Value) =>
    new BigNumber(a).plus(b)
  )
  return token0Volume24hr.decimalPlaces(0).valueOf()
}

const calculateAPRFromToken0 = async ({
  token0Decimals,
  token0Reserves,
  blockNumber,
  uniswapLPContract
}: any) => {
  const token0Volume24Hr = await getToken0Volume24Hr({
    blockNumber,
    uniswapLPContract
  })

  const token0PoolReservesEquivalent = new BigNumber(token0Reserves.toFixed())
    .times(2) // Double to get equivalent of both sides of pool
    .times(new BigNumber(10).pow(token0Decimals))

  const estimatedAPR = new BigNumber(token0Volume24Hr) // 24hr volume in terms of token0
    .div(token0PoolReservesEquivalent) // Total value (both sides) of pool reserves in terms of token0
    .times(TRADING_FEE_RATE) // Trading fee rate of pool
    .times(365.25) // Days in a year
    .times(100) // To get a percentage instead of a decimal
    .decimalPlaces(4)
    .valueOf()
  return estimatedAPR
}

export const totalLpSupply = async (farmingRewardsContract: Contract) => {
  try {
    const totalSupply = await farmingRewardsContract.totalSupply()
    return bn(totalSupply.toString())
  } catch (error) {
    const errorMsg = 'totalLpSupply error'
    console.error(error, errorMsg)
    throw new Error(errorMsg)
  }
}

export const rewardRatePerToken = async (farmingRewardsContract: Contract) => {
  try {
    const farmingContractFundedFlag = process.env.REACT_APP_FARMING_CONTRACT_FUNDED
    let rewardRate = await farmingRewardsContract.rewardRate() // Rate of FOX given per second for all staked addresses
    if (
      (farmingContractFundedFlag && !JSON.parse(farmingContractFundedFlag)) ||
      bn(rewardRate.toString()).eq(0)
    ) {
      const foxFunding = bn(15768000) // Fox added to the contract
      const threeMonths = bn(90).times(24).times(60).times(60)
      rewardRate = foxFunding.div(threeMonths).times('1e+18')
    }
    const totalSupply = await totalLpSupply(farmingRewardsContract)
    return bn(rewardRate.toString()).div(totalSupply).times('1e+18').decimalPlaces(0).toString()
  } catch (error) {
    const errorMsg = 'rewardRatePerToken error'
    console.error(error, errorMsg)
    throw new Error(errorMsg)
  }
}

export const lpAPR = async (
  uniswapLPContract: Contract,
  provider: Web3Provider | InfuraProvider,
  blockNumber: number
) => {
  try {
    const pair = await Fetcher.fetchPairData(
      new Token(0, WETH_TOKEN_CONTRACT_ADDRESS, 18),
      new Token(0, FOX_TOKEN_CONTRACT_ADDRESS, 18),
      provider
    )

    const lpApr = await calculateAPRFromToken0({
      token0Decimals: pair.token0.decimals,
      token0Reserves: pair.reserve0,
      blockNumber,
      uniswapLPContract
    })

    return lpApr
  } catch (err) {
    const errorMsg = 'lpAPR error'
    console.error(err, errorMsg)
    throw new Error(errorMsg)
  }
}

export const farmingAPR = async (
  farmingRewardsContract: Contract,
  uniswapLPContract: Contract,
  provider: Web3Provider | InfuraProvider
) => {
  try {
    const foxRewardRatePerToken = await rewardRatePerToken(farmingRewardsContract)
    const pair = await Fetcher.fetchPairData(
      new Token(0, WETH_TOKEN_CONTRACT_ADDRESS, 18),
      new Token(0, FOX_TOKEN_CONTRACT_ADDRESS, 18),
      provider
    )
    const totalSupply = await uniswapLPContract.totalSupply()

    const token1PoolReservesEquivalent = bn(pair.reserve1.toFixed())
      .times(2) // Double to get equivalent of both sides of pool
      .times(`1e+${pair.token1.decimals}`) // convert to base unit value

    const foxEquivalentPerLPToken = token1PoolReservesEquivalent
      .div(bn(totalSupply.toString()))
      .times(`1e+${pair.token1.decimals}`) // convert to base unit value

    return bn(foxRewardRatePerToken) // Fox Rewards per second for 1 staked LP token
      .div(foxEquivalentPerLPToken) // Equivalent FOX value for 1 LP token
      .times(100) // Decimal to percentage
      .times(3600) // 3600 seconds per hour
      .times(24) // 24 hours per day
      .times(365.25) // 365.25 days per year
      .decimalPlaces(4) // Arbitrary decimal cutoff
      .toString()
  } catch (err) {
    const errorMsg = 'farmingAPR error'
    console.error(err, errorMsg)
    throw new Error(errorMsg)
  }
}

export function useFarming(): Farming {
  const [farmApr, setFarmApr] = useState('0')
  const [lpApr, setLpApr] = useState('0')
  const [totalApr, setTotalApr] = useState('0')
  const provider = useActiveProvider()
  const blockNumber = useBlockListeners()
  const { params } = useRouteMatch<LiquidityParams>()
  const uniswapLPContract = useContract(
    provider,
    null,
    params.liquidityContractAddress,
    IUniswapV2PairABI
  )

  // We dont have the fox eth farming address to help calculate farming apr at this point and time.
  const farmingRewardsContract = useContract(provider, null, FOX_ETH_FARMING_ADDRESS, farmAbi)

  useEffect(() => {
    void (async () => {
      try {
        if (!farmingRewardsContract || !uniswapLPContract || !provider || !blockNumber) {
          return null
        }
        const apr = await farmingAPR(farmingRewardsContract, uniswapLPContract, provider)
        setFarmApr(apr)
        const lpApr = await lpAPR(uniswapLPContract, provider, blockNumber)
        setLpApr(lpApr)
        setTotalApr(new BigNumber(apr).plus(lpApr).toString())
      } catch (error) {
        console.error(error)
      }
    })()
  }, [farmingRewardsContract, uniswapLPContract, provider, blockNumber])

  return {
    farmApr,
    lpApr,
    totalApr
  }
}
