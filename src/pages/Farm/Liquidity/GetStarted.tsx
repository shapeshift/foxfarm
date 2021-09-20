import { RouterProps } from 'react-router'
import { Text, Center, Button, Box, Spinner } from '@chakra-ui/react'
import { FoxEthLiquidityIconGroup } from 'Molecules/LiquidityIconGroup'
import { useWallet } from 'state/WalletProvider'
import { GetStartedCountDown } from '../CountDown'
import { useFarming } from 'hooks/useFarming'
import { Card } from 'components/Card/Card'

const EARNING_STEPS = [
  'Deposit FOX and ETH into the FOX-ETH liquidity pool on Uniswap v2.',
  `Approve and stake your liquidity tokens to earn bonus FOX rewards.`
]

export const GetStarted = ({ history }: RouterProps) => {
  const { state, connect } = useWallet()
  const { totalApr, loading } = useFarming()

  if (loading) {
    return (
      <Card>
        <Card.Body width='500px'>
          <Center minHeight='500px'>
            <Spinner
              thickness='8px'
              speed='3s'
              emptyColor='gray.300'
              color='blue.500'
              w='4rem'
              h='4rem'
            />
          </Center>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card flexDir='column' maxW='500px' position='relative'>
      <Card.Header
        bg='gray.50'
        m={6}
        borderRadius='lg'
        width='auto'
        display='flex'
        flexDir='column'
        alignItems='center'
        justifyContent='center'
      >
        <FoxEthLiquidityIconGroup mb={2} w='175px' />
        <GetStartedCountDown
          apr={totalApr}
          headerText='Start Earning Up To'
          completedHeader='Start Earning'
          subText='Once Bonus Rewards Begin!'
          completedSubText='With Your Liquidity Tokens!'
        />
      </Card.Header>

      <Card.Body pt={0} px={12} pb={12}>
        <Center>
          <Text color='black' fontWeight='bold' mb={6}>
            How To Start Earning FOX Token Rewards
          </Text>
        </Center>
        {EARNING_STEPS.map((step, index) => (
          <Center mb={4} key={step}>
            <Box>
              <Center borderRadius='full' bg='blue.100' w='30px' h='30px' flexDir='column' mr={4}>
                <Text color='blue.500' fontSize='sm' fontWeight='700'>
                  {index + 1}
                </Text>
              </Center>
            </Box>
            <Text color='gray.500'>{step}</Text>
          </Center>
        ))}
        {state.isConnected ? (
          <Button
            w='full'
            mt={6}
            size='lg'
            onClick={() => {
              history.push('/fox-farming/liquidity/add')
            }}
          >
            Provide Liquidity
          </Button>
        ) : (
          <>
            <Text color='gray.500' fontWeight='bold' my={4}>
              Connect a wallet to get started
            </Text>
            <Button colorScheme='blue' w='full' size='lg' onClick={connect}>
              Connect Wallet
            </Button>
          </>
        )}
      </Card.Body>
    </Card>
  )
}
