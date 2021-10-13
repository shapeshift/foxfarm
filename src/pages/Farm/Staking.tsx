import { Text, Button } from '@chakra-ui/react'
import { GetStartedCountDown } from './CountDown'
import { FoxEthLiquidityIconGroup } from 'Molecules/LiquidityIconGroup'
import { StakingHeader } from './StakingHeader'
import { ContractParams, useStaking } from 'state/StakingProvider'
import { useApprove } from 'hooks/useApprove'
import { TxRejected } from './TxRejected'
import { useFarming } from 'hooks/useFarming'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { bn } from 'utils/math'
import { useWallet } from 'state/WalletProvider'
import { useEffect } from 'react'
import { Card } from 'components/Card/Card'
import { lpUrlFormatter } from 'utils/helpers'

export const Staking = () => {
  const {
    totalUsdcValue,
    userEthHoldings,
    userFoxHoldings,
    error,
    uniswapLPContract,
    userLpBalance,
    stake,
    stakeTxID,
    confirming
  } = useStaking()
  const { params } = useRouteMatch<ContractParams>()
  const { farmApr } = useFarming()
  const { push } = useHistory()
  const { approved } = useApprove(
    uniswapLPContract,
    params.stakingContractAddress,
    userLpBalance?.toString() as string
  )
  const {
    state: { wallet }
  } = useWallet()

  const onStake = () => {
    if (!approved)
      return push(
        lpUrlFormatter('approve', params.liquidityContractAddress, params.stakingContractAddress)
      )
    if (bn(userLpBalance?.toString() as string).gt(0) && approved) {
      stake()
    }
  }

  useEffect(() => {
    if (stakeTxID && !confirming) {
      push(
        lpUrlFormatter('pending', params.liquidityContractAddress, params.stakingContractAddress)
      )
    }
  }, [confirming, params.liquidityContractAddress, params.stakingContractAddress, push, stakeTxID])

  return (
    <Card display='flex' flexWrap='wrap'>
      <StakingHeader
        totalUsdcValue={totalUsdcValue}
        userEthHoldings={userEthHoldings}
        userFoxHoldings={userFoxHoldings}
      />
      <Card.Body mx='auto' order={{ base: 1, md: 2 }}>
        <FoxEthLiquidityIconGroup mx='auto' mb={6} w='175px' mt={6} />
        <GetStartedCountDown
          headerText='Stake your LP Tokens to earn up to'
          completedHeader='Stake Your LP Tokens To Earn'
          apr={farmApr}
        />
        <TxRejected rejected={error} />
        <Button
          isLoading={confirming}
          loadingText={confirming ? `Confirm on ${wallet?.name}` : ''}
          w='full'
          mb={4}
          mt={8}
          onClick={() => onStake()}
        >
          {approved ? 'Stake Now' : 'Approve'}
        </Button>
        <Text color='gray.500' fontSize='xs' textAlign='center'>
          No lockup period. Unstake whenever you want.
        </Text>
      </Card.Body>
    </Card>
  )
}
