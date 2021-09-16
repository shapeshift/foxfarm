import { useEffect } from 'react'
import { RouterProps } from 'react-router'
import { Text, Button } from '@chakra-ui/react'
import { NavLink } from 'Atoms/NavLink'
import { FoxEthLiquidityIconGroup } from 'Molecules/LiquidityIconGroup'
import { useStaking } from 'state/StakingProvider'
import { formatBaseAmount } from 'utils/math'
import { TxRejected } from './TxRejected'
import { ViewOnChainLink } from 'Molecules/ViewOnChainLink'
import { TxStatus, usePendingTx } from 'hooks/usePendingTx'
import { useWallet } from 'state/WalletProvider'
import { Card } from 'components/Card/Card'

export const Unstake = ({ history }: RouterProps) => {
  const {
    userStakedBalance,
    userUnclaimedRewards,
    unStake,
    confirming,
    error,
    stakeTxID,
    setStakeTxID
  } = useStaking()
  const pendingTx = usePendingTx(stakeTxID)
  const {
    state: { wallet }
  } = useWallet()

  useEffect(() => {
    let ignore = false
    if (!ignore) {
      if (pendingTx === TxStatus.SUCCESS) {
        setStakeTxID(null)
        history.push('/fox-farming')
      }
    }
    return () => {
      ignore = true
    }
  }, [history, pendingTx, setStakeTxID])

  return (
    <Card>
      <Card.Body
        maxWidth='500px'
        display='flex'
        flexDir='column'
        justifyContent='center'
        alignItems='center'
        pb={6}
      >
        <FoxEthLiquidityIconGroup w='170px' mb={10} mt={8} />
        <Text mb={8} fontSize='2xl' textAlign='center'>
          Unstake {formatBaseAmount(userStakedBalance ? userStakedBalance.toString() : '0', 18)} LP
          Tokens
        </Text>

        <Text color='gray.500' mb={8} textAlign='center'>
          Since you're unstaking your LP tokens, your{' '}
          <Text as='span' color='green.500' fontWeight='bold'>
            reward balance of{' '}
            {formatBaseAmount(userUnclaimedRewards ? userUnclaimedRewards.toString() : '0', 18)} FOX
            Tokens
          </Text>{' '}
          will be deposited into your connected wallet.
        </Text>
        {stakeTxID && <ViewOnChainLink txId={stakeTxID} />}
        <TxRejected rejected={error} />
        <Button
          w='full'
          isLoading={confirming || !!(pendingTx === TxStatus.UNKNOWN && stakeTxID)}
          loadingText={confirming ? `Confirm on ${wallet?.name}` : ''}
          isDisabled={confirming || userStakedBalance?.toString() === '0'}
          onClick={() => unStake()}
          mb={6}
          size='lg'
        >
          Confirm & Unstake
        </Button>
        <NavLink to='/fox-farming/staking/rewards' color='gray.500'>
          Cancel
        </NavLink>
      </Card.Body>
    </Card>
  )
}
