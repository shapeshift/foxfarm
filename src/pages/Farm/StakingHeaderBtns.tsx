import { useHistory } from 'react-router'
import { Button, Text } from '@chakra-ui/react'
import { useStaking } from 'state/StakingProvider'
import { bnOrZero, formatBaseAmount } from 'utils/math'
import { useMemo } from 'react'
import { useApprove } from 'hooks/useApprove'
import { FOX_ETH_FARMING_ADDRESS, MAX_ALLOWANCE } from 'lib/constants'

export const StakingHeaderBtns = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { push } = useHistory()
  const { userLpBalance, uniswapLPContract, stake } = useStaking()

  const unstakedLpBalance = useMemo(() => {
    return formatBaseAmount(userLpBalance ? userLpBalance.toString() : '0', 18)
  }, [userLpBalance])

  const { approved } = useApprove(uniswapLPContract, FOX_ETH_FARMING_ADDRESS, MAX_ALLOWANCE)

  const handleStakeClick = () => {
    if (!approved) return push('/fox-farming/staking/approve')
    if (bnOrZero(unstakedLpBalance).gt(0) && approved) return stake()
    push('/fox-farming/liquidity/add')
  }

  return (
    <>
      <Button
        w='full'
        variant='primary'
        onClick={handleStakeClick}
        mt={6}
        mb={2}
        _hover={{ bg: 'blue.800' }}
        _disabled={{ bg: 'blue.500', opacity: 0.5, _hover: { bg: 'blue.500' } }}
        isDisabled={!bnOrZero(unstakedLpBalance).gt(0)}
      >
        Stake
      </Button>

      <Button
        w='full'
        variant='secondary'
        onClick={() => push('/fox-farming/staking/unstake')}
        isDisabled={isDisabled}
      >
        Unstake
      </Button>
      <Text color='secondary' fontSize='xs' textAlign='center' mt={2}>
        Note: When you unstake, your bonus rewards will be deposited into your connected wallet.
      </Text>
    </>
  )
}
