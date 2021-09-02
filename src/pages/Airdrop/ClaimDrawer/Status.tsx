import { useState, useEffect, useCallback } from 'react'
import { useFarming } from 'hooks/useFarming'
import { useClaim } from 'state/ClaimProvider'
import { useBlockListeners } from 'hooks/useBlockListeners'
import { useWallet } from 'state/WalletProvider'
import { Pending } from './components/Pending'
import { Success } from './components/Success'
import { Failed } from './components/Failed'

enum ClaimStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS'
}

export const Status = ({
  closeDrawer,
  foxPrice,
  usdValue
}: {
  closeDrawer: () => void
  foxPrice: string | null
  usdValue: string | null
}) => {
  const { totalApr } = useFarming()
  const { state } = useClaim()
  const { state: wallet } = useWallet()
  const blockNumber = useBlockListeners()
  const [status, setStatus] = useState<ClaimStatus>(ClaimStatus.PENDING)

  const fetchReceipt = useCallback(async () => {
    try {
      if (state.claimTxHash) {
        const receipt = await wallet.provider?.getTransactionReceipt(state.claimTxHash)
        if (receipt && receipt.status === 1) {
          setStatus(ClaimStatus.SUCCESS)
        }
        if (receipt && receipt.status === 0) {
          setStatus(ClaimStatus.FAILED)
        }
      }
    } catch (error) {
      console.warn(error)
    }
  }, [state.claimTxHash, wallet.provider])

  useEffect(() => {
    if (state.claimTxHash && wallet.provider && blockNumber && status !== ClaimStatus.FAILED) {
      fetchReceipt()
    }
  }, [blockNumber, fetchReceipt, state.claimTxHash, status, wallet.provider])

  switch (status) {
    case ClaimStatus.PENDING:
      return <Pending claimTxHash={state.claimTxHash} />
    case ClaimStatus.FAILED:
      return <Failed closeDrawer={closeDrawer} />
    case ClaimStatus.SUCCESS:
      return (
        <Success
          state={state}
          foxPrice={foxPrice}
          usdValue={usdValue}
          apr={totalApr}
          closeDrawer={closeDrawer}
        />
      )
  }
}
