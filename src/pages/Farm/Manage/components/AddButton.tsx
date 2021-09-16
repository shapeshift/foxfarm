import { Button } from '@chakra-ui/react'
import { Approval } from 'hooks/useApprove'
import { useEffect, useState } from 'react'
import { ITokenField } from 'state/LpProvider'
import { bn, toBaseUnit } from 'utils/math'

export const AddButton = ({
  isConnected,
  connect,
  walletName,
  approval,
  sendTx,
  txConfirming,
  tokenA,
  tokenB
}: {
  isConnected: boolean
  connect: () => Promise<void>
  walletName: string
  approval: Approval
  sendTx: () => void
  txConfirming: boolean
  tokenA: ITokenField
  tokenB: ITokenField
}) => {
  const [text, setText] = useState<string>('Enter An Amount')
  const [disabled, setDisabled] = useState<boolean>(false)
  const sufficientTokenA = !!bn(tokenA.balance as string).gte(
    bn(toBaseUnit(tokenA.amount as string, 18))
  )
  const sufficientTokenB = !!bn(tokenB.balance as string).gte(
    bn(toBaseUnit(tokenB.amount as string, 18))
  )

  useEffect(() => {
    if (!approval.approved && isConnected) {
      setText('Approve')
      setDisabled(false)
    }
    if (approval.approved && isConnected && sufficientTokenA && sufficientTokenB) {
      setText('Supply')
      setDisabled(false)
    }
    if (!sufficientTokenA || !sufficientTokenB) {
      setText(`Insufficient ${!sufficientTokenA ? tokenA.symbol : tokenB.symbol} Balance`)
      setDisabled(true)
    }
    if (!bn(tokenA.amount as string).gt(0) || !bn(tokenB.amount as string).gt(0)) {
      setText('Enter An Amount')
      setDisabled(true)
    }
    if (!approval.approved && approval.txHash) {
      setText('Awaiting Approval Transaction')
      setDisabled(true)
    }
    if (!isConnected) {
      setText('Connect Wallet')
      setDisabled(false)
    }
  }, [
    approval,
    connect,
    isConnected,
    sufficientTokenA,
    sufficientTokenB,
    tokenA.amount,
    tokenA.symbol,
    tokenB.amount,
    tokenB.symbol,
    walletName
  ])

  return (
    <Button
      onClick={!isConnected ? connect : !approval.approved ? () => approval.approve() : sendTx}
      isLoading={approval.confirming || txConfirming || !!(!approval.approved && approval.txHash)}
      loadingText={
        !approval.approved && approval.txHash
          ? 'Awaiting Approval Transaction'
          : approval.confirming
          ? `Awaiting approval on ${walletName}`
          : `Confirm TX on ${walletName}`
      }
      isDisabled={disabled}
      mt={6}
      size='lg'
      w='full'
    >
      {text}
    </Button>
  )
}
