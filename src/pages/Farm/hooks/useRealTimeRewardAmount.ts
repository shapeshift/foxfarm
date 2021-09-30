import { bnOrZero, bn, toDisplayAmount } from 'utils/math'
import { useMemo, useState } from 'react'
import { useCoinCapPrice } from 'hooks/useCoinCapPrice'
import { useInterval } from 'hooks/useInterval'
import { useWallet } from 'state/WalletProvider'
import { useEffect } from 'react'
import { rewardRatePerAddress } from 'utils/rates'
import { useContract } from 'hooks/useContract'
import farmAbi from 'abis/farmingAbi.json'
import { useActiveProvider } from 'hooks/useActiveProvider'

type TUseRealTimeRewardAmounts = { foxAmount: string | null; stakingContractAddress: string }

const REWARD_INTERVAL = 1000

export const useRealTimeRewardAmounts = ({
  foxAmount,
  stakingContractAddress
}: TUseRealTimeRewardAmounts) => {
  const {
    state: { account, isConnected }
  } = useWallet()

  const provider = useActiveProvider()
  const farmingRewardsContract = useContract(provider, account, stakingContractAddress, farmAbi)
  const price = useCoinCapPrice('fox-token')
  const [displayFarmRewardsValue, setDisplayFarmRewardsValue] = useState<string | undefined>()
  const [rewardRate, setRewardRate] = useState('0')

  const { start, intervalId } = useInterval({
    callback: () => {
      const rate = bnOrZero(rewardRate).div('1e+18')
      const value = bnOrZero(foxAmount)
      const rewardVal = value.plus(bnOrZero(rate).times(REWARD_INTERVAL).div(1000)).toFixed(6)
      setDisplayFarmRewardsValue(rewardVal)
    },
    delay: REWARD_INTERVAL,
    autoStart: false
  })

  useEffect(() => {
    const getRewardRate = async () => {
      const rate = await rewardRatePerAddress({
        address: account ?? '',
        stakingContract: farmingRewardsContract
      })
      setRewardRate(rate)
    }
    if (account && isConnected) getRewardRate()
  }, [account, farmingRewardsContract, isConnected])

  useEffect(() => {
    if (isConnected && bnOrZero(foxAmount).gt(0) && !intervalId) start()
  }, [foxAmount, start, isConnected, intervalId, account])

  const fiatAmount = useMemo(
    () =>
      price && displayFarmRewardsValue
        ? toDisplayAmount(bn(price).times(displayFarmRewardsValue).toFixed(), 18)
        : null,
    [displayFarmRewardsValue, price]
  )

  return { displayFarmRewardsValue, fiatAmount }
}
