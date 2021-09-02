import React, { useEffect } from 'react'
import { Text, Flex, Box, Button, Tooltip, Alert, AlertIcon, AlertTitle } from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { ClaimInfo } from './ClaimInfo'
import { ClaimPanel } from './ClaimRow'
import { AirdropFoxIcon } from 'Atoms/Icons/AirdropFoxIcon'
import { DrawerSteps } from './ClaimDrawer'
import { useClaim } from 'state/ClaimProvider'
import { bn, formatBaseAmount, fromBaseUnit } from 'utils/math'
import { useWallet } from 'state/WalletProvider'
import { useCoinCapPrice } from 'hooks/useCoinCapPrice'
import { useActiveProvider } from 'hooks/useActiveProvider'
import { WalletCard } from 'Molecules/WalletCard'

interface ConfirmProps {
  setStep: React.Dispatch<React.SetStateAction<DrawerSteps>>
  closeDrawer: () => void
  foxPrice: string | null
  usdValue: string | null
}

export const Confirm = ({ setStep, closeDrawer, foxPrice, usdValue }: ConfirmProps) => {
  const { state, claim, buildTx } = useClaim()
  const provider = useActiveProvider()
  const { state: walletState, connect } = useWallet()
  const formattedClaimAmount = state.amount && fromBaseUnit(bn(state.amount), 18)
  const ethUsd = useCoinCapPrice('ethereum')
  const estimatedFeeUsd =
    state?.estimatedFee && ethUsd && (Number(state.estimatedFee) * Number(ethUsd)).toString()

  useEffect(() => {
    if (state.claimTxHash) {
      setStep(DrawerSteps.BENEFITS)
    }
  }, [setStep, state.claimTxHash])

  useEffect(() => {
    if (
      provider &&
      state?.amount &&
      state?.claimantAddress &&
      state?.index !== null &&
      state?.proof &&
      state?.contractAddress
    ) {
      buildTx(provider)
    }
  }, [
    buildTx,
    provider,
    state?.amount,
    state?.claimantAddress,
    state?.contractAddress,
    state?.index,
    state?.proof
  ])

  return (
    <>
      <AirdropFoxIcon size='82px' mb={8} />
      <Text fontSize='lg' fontWeight='semibold' textTransform='uppercase'>
        You are eligible for
      </Text>
      <Text fontSize='4xl' mb={12}>
        {`${formattedClaimAmount} FOX Tokens`}
      </Text>
      <ClaimInfo
        address={state.claimantAddress}
        foxPrice={foxPrice}
        usdValue={usdValue}
        foxAmount={formattedClaimAmount}
      />
      <ClaimPanel>
        <ClaimPanel.Row align='flex-start' borderTopWidth={0}>
          <Flex align='center' color='secondary'>
            <ClaimPanel.Label>GAS Fee</ClaimPanel.Label>
            &nbsp;
            <Tooltip
              label={
                'Your FOX tokens are free. However, an Ethereum (ETH) gas fee will be paid to the miners who compute this transaction. This is required for all transactions on the Ethereum network.'
              }
            >
              <InfoOutlineIcon cursor='pointer' display='block' />
            </Tooltip>
          </Flex>
          <Box textAlign='right'>
            <Text>{formatBaseAmount(state.estimatedFee as string, 18)} ETH</Text>
            {estimatedFeeUsd && (
              <ClaimPanel.Label>${formatBaseAmount(estimatedFeeUsd, 18)}</ClaimPanel.Label>
            )}
          </Box>
        </ClaimPanel.Row>
        {walletState.account && walletState.account !== state.claimantAddress && (
          <ClaimPanel.Row borderBottomWidth={0} flexDir='column' alignItems='flex-start'>
            <ClaimPanel.Label>Pay for Gas With</ClaimPanel.Label>
            <WalletCard allowChange />
          </ClaimPanel.Row>
        )}
      </ClaimPanel>
      {state?.error && (
        <Alert status='error' borderRadius='6' p={{ base: '6', md: '4' }} mt='5' bg='red.500'>
          <AlertIcon color='light' />
          <AlertTitle mr={2}>
            {!state?.error?.message ? 'Transaction not submitted' : state.error.message}
          </AlertTitle>
        </Alert>
      )}
      <Box mt={16} width='full'>
        {walletState.provider && walletState.account ? (
          <Button
            mb={2}
            onClick={() => claim(walletState?.provider, walletState.account)}
            variant='primary'
            w='full'
            loadingText={state.confirming ? `Confirming on ${walletState.wallet?.name}` : ''}
            isLoading={state.loading || state.confirming}
            isDisabled={state?.error?.code === 6000}
          >
            Claim your FOX
          </Button>
        ) : (
          <Button
            mb={2}
            onClick={() => {
              connect()
            }}
            variant='primary'
            w='full'
            isLoading={state.loading}
          >
            Connect a wallet
          </Button>
        )}
        <Button mb={2} onClick={closeDrawer} variant='ghost' w='full'>
          Cancel
        </Button>
      </Box>
    </>
  )
}
