import { useHistory } from 'react-router'
import { Button, Text } from '@chakra-ui/react'
import { ContractParams, useStaking } from 'state/StakingProvider'
import { bnOrZero, formatBaseAmount } from 'utils/math'
import { useMemo } from 'react'
import { useApprove } from 'hooks/useApprove'
import { MAX_ALLOWANCE } from 'lib/constants'
import { useHasContractExpired } from 'hooks/useHasContractExpired'
import { useRouteMatch } from 'react-router-dom'

export const StakingHeaderBtns = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { push } = useHistory()
  const { params } = useRouteMatch<ContractParams>()
  const { userLpBalance, uniswapLPContract, stake } = useStaking()
  const expired = useHasContractExpired()

  const unstakedLpBalance = useMemo(() => {
    return formatBaseAmount(userLpBalance ? userLpBalance.toString() : '0', 18)
  }, [userLpBalance])

  const { approved } = useApprove(uniswapLPContract, params.stakingContractAddress, MAX_ALLOWANCE)

  const handleStakeClick = () => {
    if (!approved)
      return push(
        `/fox-farming/liquidity/${params.liquidityContractAddress}/staking/${params.stakingContractAddress}/approve`
      )
    if (bnOrZero(unstakedLpBalance).gt(0) && approved) return stake()
    push(`/fox-farming/liquidity/${params.liquidityContractAddress}/add`)
  }

  return (
    <>
      <Button
        w='full'
        onClick={handleStakeClick}
        mt={6}
        mb={2}
        _hover={{ bg: 'blue.800' }}
        _disabled={{
          bg: 'blue.500',
          opacity: 0.5,
          _hover: { bg: 'blue.500', cursor: 'not-allowed' }
        }}
        isDisabled={!bnOrZero(unstakedLpBalance).gt(0) || expired}
      >
        Stake
      </Button>

      <Button
        w='full'
        variant='solid'
        onClick={() =>
          push(
            `/fox-farming/liquidity/${params.liquidityContractAddress}/staking/${params.stakingContractAddress}/unstake`
          )
        }
        isDisabled={isDisabled}
      >
        Unstake
      </Button>
      <Text color='gray.500' fontSize='xs' textAlign='center' mt={2}>
        Note: When you unstake, your bonus rewards will be deposited into your connected wallet.
      </Text>
    </>
  )
}
