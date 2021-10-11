import { useCallback, useEffect } from 'react'
import { useState } from 'react'
import { bn } from 'utils/math'
import { Contract } from '@ethersproject/contracts'
import { getBufferedGas, toHexString } from 'utils/helpers'
import { useWallet } from 'state/WalletProvider'

export interface Approval {
  approve: () => Promise<void>
  approved: boolean
  txHash: string | null
  error: Error | null
  confirming: boolean
}

export const useApprove = (
  contract: Contract | null,
  spender: string,
  amount: string,
  amountToApprove?: string | null
): Approval => {
  const { state: wallet } = useWallet()
  const [approved, setApproved] = useState<boolean>(false)
  const [confirming, setConfirming] = useState<boolean>(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const callAllowance = useCallback(async () => {
    if (amount && contract && wallet.account && spender) {
      try {
        const allowance = await contract.allowance(wallet.account, spender)
        if (bn(allowance.toString()).gte(bn(amount)) && bn(amount).gt(0)) {
          setApproved(true)
        } else {
          setApproved(false)
        }
      } catch (error) {
        console.warn(error)
      }
    }
  }, [amount, contract, wallet.account, spender])

  const approve = useCallback(async () => {
    setConfirming(true)
    try {
      if (!wallet.provider || !wallet.account) {
        throw Error('Missing wallet address or provider')
      }
      const data = contract?.interface.encodeFunctionData('approve', [
        spender,
        amountToApprove ? amountToApprove : amount
      ])
      if (!contract?.address) {
        throw Error('Missing contract address')
      }
      const tx = {
        to: contract?.address,
        data,
        value: toHexString('0')
      }
      if (tx) {
        const { gasLimit, gasPrice } = await getBufferedGas(wallet.provider, tx)
        if (gasLimit && gasPrice) {
          const ethBalance = await wallet.provider?.getBalance(wallet.account)
          if (bn(ethBalance.toString()).lt(bn(gasLimit).times(gasPrice).toFixed())) {
            throw Error('Not enough ETH for gas')
          }
          const nonce = await wallet.provider?.getSigner().getTransactionCount()
          const approveTx = await wallet.provider?.getSigner().sendTransaction({
            to: contract?.address,
            data: data,
            value: tx.value,
            gasLimit: toHexString(gasLimit),
            gasPrice: toHexString(gasPrice),
            nonce: nonce
          })

          if (approveTx) {
            setConfirming(false)
            setTxHash(approveTx.hash)
          }
        }
      }
    } catch (error) {
      setError(error)
      setConfirming(false)
    }
  }, [
    wallet.provider,
    wallet.account,
    contract?.interface,
    contract?.address,
    spender,
    amountToApprove,
    amount
  ])

  useEffect(() => {
    if (amount && contract && wallet.account && spender && wallet.blockNumber) {
      callAllowance()
    }
  }, [amount, callAllowance, contract, wallet.account, spender, wallet.blockNumber])

  useEffect(() => {
    if (approved && txHash) {
      setTxHash(null)
    }
  }, [approved, txHash])

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      if (error) {
        setError(null)
      }
    }, 8000)
    return () => {
      clearTimeout(errorTimeout)
    }
  }, [error])

  return { approve, approved, txHash, error, confirming }
}
