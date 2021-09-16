import { Button } from '@chakra-ui/react'
import { useStaking } from 'state/StakingProvider'
import { TxRejected } from './TxRejected'
import { ViewOnChainLink } from 'Molecules/ViewOnChainLink'
import { TxStatus, usePendingTx } from 'hooks/usePendingTx'
import { useWallet } from 'state/WalletProvider'
import { useEffect } from 'react'

export const RewardsBtns = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { claimReward, confirming, error, stakeTxID, setStakeTxID } = useStaking()
  const pendingTx = usePendingTx(stakeTxID)
  const {
    state: { wallet }
  } = useWallet()

  useEffect(() => {
    if (stakeTxID && pendingTx === TxStatus.SUCCESS) {
      setStakeTxID(null)
    }
  }, [pendingTx, setStakeTxID, stakeTxID])

  return (
    <>
      {stakeTxID && <ViewOnChainLink txId={stakeTxID} />}
      <TxRejected rejected={error} />
      <Button
        colorScheme='green'
        size='lg'
        mb={4}
        maxWidth='350px'
        width='100%'
        isLoading={confirming || !!(stakeTxID && pendingTx === TxStatus.UNKNOWN)}
        loadingText={confirming ? `Confirm on ${wallet?.name}` : ''}
        onClick={() => claimReward()}
        isDisabled={isDisabled}
      >
        Claim Rewards
      </Button>
    </>
  )
}
