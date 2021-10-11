import { ContractParams } from 'state/StakingProvider'
import { bn } from 'utils/math'
import { useMemo } from 'react'
import { RewardsBtns } from './RewardsBtns'
import { Text, Button } from '@chakra-ui/react'
import { useHasContractExpired } from 'hooks/useHasContractExpired'
import { useHistory } from 'react-router'
import { useRouteMatch } from 'react-router-dom'
import { useRealTimeRewardAmounts } from './hooks/useRealTimeRewardAmount'

type TRewardAmounts = { foxAmount: string | null }

export const RewardAmounts = ({ foxAmount }: TRewardAmounts) => {
  const expired = useHasContractExpired()
  const { push } = useHistory()
  const { params } = useRouteMatch<ContractParams>()

  const { fiatAmount, displayFarmRewardsValue } = useRealTimeRewardAmounts({
    foxAmount,
    stakingContractAddress: params.stakingContractAddress
  })

  const isDisabled = useMemo(
    () => !bn(displayFarmRewardsValue ?? 0).gt(0),
    [displayFarmRewardsValue]
  )

  return (
    <>
      {fiatAmount && (
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
