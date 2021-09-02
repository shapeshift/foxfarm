import { StakingRewardsCountDown } from './CountDown'
import { useStaking } from 'state/StakingProvider'
import { bnOrZero, bn, toDisplayAmount } from 'utils/math'
import { useState } from 'react'
import { useCoinCapPrice } from 'hooks/useCoinCapPrice'
import { useInterval } from 'hooks/useInterval'
import { useWallet } from 'state/WalletProvider'
import { useEffect } from 'react'
import { rewardRatePerAddress } from 'utils/rates'

type TRewardAmounts = { foxAmount: string | null }

const REWARD_INTERVAL = 1000

export const RewardAmounts = ({ foxAmount }: TRewardAmounts) => {
  const {
    state: { account, isConnected }
  } = useWallet()
  const { farmingRewardsContract } = useStaking()
  const price = useCoinCapPrice('fox-token')
  const [displayFarmRewardsValue, setDisplayFarmRewardsValue] = useState<string | undefined>()
  const [rewardRate, setRewardRate] = useState('0')

  const { start, intervalId } = useInterval({
    callback: () => {
      const rate = bnOrZero(rewardRate).div('1e+18')
      let value = bnOrZero(displayFarmRewardsValue).gt(0)
        ? bnOrZero(displayFarmRewardsValue)
        : bnOrZero(foxAmount)
      const rewardVal = value.plus(bnOrZero(rate).times(REWARD_INTERVAL).div(1000)).toFixed(3)
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
  }, [foxAmount, start, isConnected, intervalId])

  return (
    <StakingRewardsCountDown
      fiatAmount={
        price && displayFarmRewardsValue
          ? toDisplayAmount(bn(price).times(displayFarmRewardsValue).toFixed(), 18)
          : null
      }
      foxAmount={displayFarmRewardsValue}
    />
  )
}
