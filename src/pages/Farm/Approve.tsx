import { RouterProps } from 'react-router'
import { Text, Button, Link } from '@chakra-ui/react'
import { CardContent } from '../../Atoms/CardContent'
import { NavLink } from 'Atoms/NavLink'
import { PendingIconGroup } from 'Organisims/PendingIconGroup'
import { useStaking } from 'state/StakingProvider'
import { useEffect } from 'react'
import { formatBaseAmount } from 'utils/math'
import { TxRejected } from './TxRejected'
import { ViewOnChainLink } from 'Molecules/ViewOnChainLink'
import { FOX_ETH_FARMING_ADDRESS, MAX_ALLOWANCE } from 'lib/constants'
import { useApprove } from 'hooks/useApprove'
import { TxStatus, usePendingTx } from 'hooks/usePendingTx'

export const Approve = ({ history }: RouterProps) => {
  const { uniswapLPContract, userLpBalance } = useStaking()
  const approval = useApprove(
    uniswapLPContract,
    FOX_ETH_FARMING_ADDRESS,
    userLpBalance?.toString() as string,
    MAX_ALLOWANCE
  )
  const pendingTx = usePendingTx(approval?.txHash)
  const isLoading = approval.confirming || !!(approval.txHash && pendingTx === TxStatus.UNKNOWN)

  useEffect(() => {
    let ignore = false
    if (!ignore) {
      if (pendingTx === TxStatus.SUCCESS) {
        history.push('/fox-farming/staking')
      }
    }
    return () => {
      ignore = true
    }
  }, [approval.confirming, approval.error, history, pendingTx])

  return (
    <CardContent maxW='500px'>
      <PendingIconGroup mb={10} mt={8} isLoading={isLoading} />
      <>
        <Text mb={4} fontSize='2xl' textAlign='center'>
          {isLoading ? 'Confirm On Wallet' : 'Approve Staking'}
        </Text>
        <Text color='gray.500' mb={4} textAlign='center'>
          Fox Staking Contract needs your permission to Stake your{' '}
          {formatBaseAmount(userLpBalance ? userLpBalance.toString() : '0', 18)} FOX-ETH LP Pool
          Tokens
        </Text>
        <Link
          href='https://shapeshift.zendesk.com/hc/en-us/articles/360018501700-Why-Do-I-Need-To-Approve-Tokens-'
          isExternal
          color='primary'
          mb={4}
        >
          Why do I need to do this?
        </Link>
        {approval.txHash && <ViewOnChainLink txId={approval.txHash} />}
        <TxRejected rejected={approval.error} />
        <Button
          w='full'
          onClick={() => approval.approve()}
          mb={4}
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          Approve
        </Button>
      </>
      <NavLink to='/fox-farming/staking' color='gray.500'>
        Cancel
      </NavLink>
    </CardContent>
  )
}
