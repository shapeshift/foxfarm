import { useCallback, useEffect, useState } from 'react'
import { Box, Text } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/button'
import FoxImage from 'assets/img/floating-fox.png'
import { Input } from '@chakra-ui/input'
import { Image } from '@chakra-ui/image'
import { ClaimDrawer } from './ClaimDrawer/ClaimDrawer'
import { Hero } from 'Molecules/Hero'
import { WalletButton } from './WalletButton'
import { Layout } from 'Molecules/Layout/Layout'
import { isAddress } from 'utils/helpers'
import { Alert, AlertIcon, AlertTitle } from '@chakra-ui/alert'
import { useWallet } from 'state/WalletProvider'
import { CheckType, ERROR_MESSAGES, useCheckEligible } from 'hooks/useCheckEligible'
import { useDisclosure } from '@chakra-ui/hooks'
import { ClaimProvider, useClaim, ClaimActions } from 'state/ClaimProvider'
import { LayoutContent } from 'Atoms/LayoutContent'
import { LayoutCard } from 'Atoms/LayoutCard'
import { CardContent } from 'Atoms/CardContent'
import { Link } from '@chakra-ui/react'
import { NavLink } from 'Atoms/NavLink'
import { useEnsAddress } from 'hooks/useEnsAddress'
import { FEATURE_FLAGS } from 'lib/constants'
import { AirDropEnded } from './AirdropEnded'

const AirDropContent = () => {
  const [addressInput, setAddressInput] = useState<string>('')
  const [addressToCheck, setAddressToCheck] = useState<string | null>(null)
  const [validAddress, setValidAddress] = useState<boolean>(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { checkEligible, data, loading, error } = useCheckEligible()
  const { state } = useWallet()
  const { dispatch } = useClaim()
  const ensAddress = useEnsAddress(addressInput ?? null)

  const onAddressInput = useCallback(
    (value: string) => {
      const trimmedValue = value.trim()
      const isValid = isAddress(trimmedValue)

      if (!isValid && !ensAddress && trimmedValue !== '') {
        setAddressToCheck(null)
        setValidAddress(false)
      } else if (isValid) {
        setAddressToCheck(isValid)
        setValidAddress(true)
      } else {
        setAddressToCheck(null)
        setValidAddress(true)
      }
    },
    [ensAddress]
  )

  const errorMessage = useCallback(() => {
    if (!validAddress && !error) {
      return 'Not a valid ETH address'
    } else if (error?.message === ERROR_MESSAGES.ALREADY_CLAIMED) {
      return (
        <>
          {ERROR_MESSAGES.ALREADY_CLAIMED}. Learn how to earn{' '}
          <NavLink to='/fox-farming' color='primary'>
            FOX token rewards
          </NavLink>
        </>
      )
    } else if (error?.message) {
      return error.message
    } else {
      return 'Something went wrong. Please try again'
    }
  }, [error, validAddress])

  useEffect(() => {
    onAddressInput(addressInput)
  }, [addressInput, onAddressInput])

  useEffect(() => {
    if (ensAddress) {
      onAddressInput(ensAddress)
    }
  }, [ensAddress, onAddressInput])

  useEffect(() => {
    if (
      !data?.claimed &&
      !data?.notFound &&
      data?.amount &&
      data?.contractAddress &&
      data?.index !== null &&
      data?.claimantAddress
    ) {
      dispatch({ type: ClaimActions.SET_CLAIM_DATA, payload: data })
    }
  }, [data, dispatch])

  useEffect(() => {
    if (data && !loading.loading && !error) {
      onOpen()
    }
  }, [data, loading, error, onOpen])

  return (
    <Layout>
      <Hero>
        <Text
          color='white'
          mb='2'
          textAlign='center'
          fontWeight='heading'
          fontSize={{ base: '4xl', md: '5xl' }}
          as='h1'
        >
          FOX Airdrop
        </Text>
        <Text color='gray.400' textAlign='center' fontWeight='heading' as='p'>
          We are rewarding users with a FOX Token airdrop! If you've traded ETH/ERC-20 tokens or
          have a qualifying wallet balance, you may have FOX Tokens waiting for you. Check your ETH
          addresses to see if they're eligible.
        </Text>
      </Hero>
      <LayoutContent>
        <LayoutCard>
          <CardContent bgColor='gray.100'>
            <Image w='100%' maxWidth='150px' mb='2' mx='auto' src={FoxImage} />
            <Text mb='2' fontWeight='bold' fontSize='2xl'>
              Claim your FOX
            </Text>
            <Text textAlign='center' color='gray.500' fontWeight='heading' as='p'>
              Check your ETH addresses to see if they're eligible
            </Text>
            <Link
              href='http://shapeshift.com/shapeshift-decentralize-airdrop'
              isExternal
              textTransform='capitalize'
              w='full'
              size='md'
              v='outline'
              mb={3}
              textAlign='center'
              color='primary'
            >
              Learn More
            </Link>
          </CardContent>
          <CardContent px={6}>
            <WalletButton
              loading={loading}
              checkEligible={() => checkEligible(state.account as string, CheckType.WALLET)}
            />
            <Box
              color='gray.300'
              width='100%'
              display='flex'
              alignItems='center'
              textAlign='center'
              padding='3'
              _before={{
                content: `''`,
                flex: 1,
                borderBottom: '2px',
                margin: '7px'
              }}
              _after={{
                content: `''`,
                flex: 1,
                borderBottom: '2px',
                margin: '7px'
              }}
            >
              OR
            </Box>
            <Input
              value={addressInput}
              onChange={e => setAddressInput(e.target.value)}
              size='lg'
              type='text'
              autoCorrect='off'
              spellCheck='false'
              placeholder='Paste an ETH address or ENS name'
              isInvalid={!validAddress}
              focusBorderColor={!validAddress ? 'red.500' : 'blue.500'}
            />
            {(!validAddress || error) && (
              <Alert status={error?.code === 100 ? 'warning' : 'error'} borderRadius='6' mt='4'>
                <AlertIcon />
                <AlertTitle mr={2} maxWidth='sm'>
                  {errorMessage()}
                </AlertTitle>
              </Alert>
            )}
            {validAddress && addressToCheck && (
              <Button
                onClick={() => checkEligible(addressToCheck, CheckType.INPUT)}
                width='full'
                mt='6'
                size='lg'
                loadingText='Checking'
                isLoading={loading.loading && loading.type === CheckType.INPUT}
                isDisabled={loading.loading && loading.type !== CheckType.INPUT}
                _loading={{ _disabled: { bg: 'blue.500' } }}
              >
                Check Eligibility
              </Button>
            )}
          </CardContent>
        </LayoutCard>
      </LayoutContent>
      <ClaimDrawer isOpen={isOpen} onClose={onClose} />
    </Layout>
  )
}

export const AirDrop = () => (
  <ClaimProvider>{FEATURE_FLAGS.airdrop ? <AirDropContent /> : <AirDropEnded />}</ClaimProvider>
)
