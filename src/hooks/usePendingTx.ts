import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'state/WalletProvider'

export enum TxStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  ERROR = 'ERROR',
  UNKNOWN = 'UNKNOWN'
}

export function usePendingTx(txId: string | null): TxStatus {
  const [pendingTxState, setPendingTxState] = useState<TxStatus>(TxStatus.UNKNOWN)
  const {
    state: { provider, blockNumber }
  } = useWallet()

  const checkPendingTx = useCallback(async () => {
    try {
      if (blockNumber && txId && provider) {
        const receipt = await provider?.getTransactionReceipt(txId)
        if (receipt && receipt.status === 1) {
          setPendingTxState(TxStatus.SUCCESS)
        } else if (receipt && receipt.status === 0) {
          setPendingTxState(TxStatus.FAILED)
        }
      }
    } catch (error) {
      setPendingTxState(TxStatus.ERROR)
      console.error(error)
    }
  }, [blockNumber, provider, txId])

  useEffect(() => {
    if (provider && txId && blockNumber) {
      checkPendingTx()
    }
  }, [provider, txId, blockNumber, checkPendingTx])

  return pendingTxState
}
