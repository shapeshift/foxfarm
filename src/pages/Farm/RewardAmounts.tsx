import { ContractParams, useStaking } from 'state/StakingProvider'
import { bnOrZero, bn, toDisplayAmount } from 'utils/math'
import { useMemo, useState } from 'react'
import { useCoinCapPrice } from 'hooks/useCoinCapPrice'
import { useInterval } from 'hooks/useInterval'
import { useWallet } from 'state/WalletProvider'
import { useEffect } from 'react'
import { rewardRatePerAddress } from 'utils/rates'
import { RewardsBtns } from './RewardsBtns'
import { Text, Button } from '@chakra-ui/react'
import { useHasContractExpired } from 'hooks/useHasContractExpired'
import { useHistory } from 'react-router'
import { useRouteMatch } from 'react-router-dom'

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
  const expired = useHasContractExpired()
  const { push } = useHistory()
  const { params } = useRouteMatch<ContractParams>()

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

  const fiatAmount = useMemo(
    () =>
      price && displayFarmRewardsValue
        ? toDisplayAmount(bn(price).times(displayFarmRewardsValue).toFixed(), 18)
        : null,
    [displayFarmRewardsValue, price]
  )

  const isDisabled = useMemo(
    () => !bn(displayFarmRewardsValue ?? 0).gt(0),
    [displayFarmRewardsValue]
  )

  return (
    <>
      {displayFarmRewardsValue && (
        <>
          <Text color='gray.500'>Available Rewards</Text>
          <Text fontSize='5xl' fontWeight='bold' mt='-10px' mb='-5px'>
            ${fiatAmount}
          </Text>
        </>
      )}
      {displayFarmRewardsValue && (
        <Text fontWeight='bold' mb={8} color='blue.500'>
          {displayFarmRewardsValue} FOX TOKENS
        </Text>
      )}
      {expired ? (
        <Button
          colorScheme='green'
          size='lg'
          mb={4}
          maxWidth='350px'
          width='100%'
          onClick={() =>
            push(
              `/fox-farming/liquidity/${params.liquidityContractAddress}/staking/${params.stakingContractAddress}/unstake`
            )
          }
          isDisabled={isDisabled}
        >
          Unstake & Claim Rewards
        </Button>
      ) : (
        <RewardsBtns isDisabled={isDisabled} />
      )}
    </>
  )
}
