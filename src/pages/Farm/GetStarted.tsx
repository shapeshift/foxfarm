import { RouterProps } from 'react-router'
import { Text, Center, Button, Box, Spinner } from '@chakra-ui/react'
import { FoxEthLiquidityIconGroup } from 'Molecules/LiquidityIconGroup'
import { useWallet } from 'state/WalletProvider'
import { GetStartedCountDown } from './CountDown'
import { CardContent } from '../../Atoms/CardContent'
import { CardContainer } from '../../Atoms/CardContainer'
import { useStaking } from 'state/StakingProvider'
import { bnOrZero } from 'utils/math'
import { Redirect } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { useFarming } from 'hooks/useFarming'

export const GetStarted = ({ history }: RouterProps) => {
  const [initialized, setInitialized] = useState(false)

  const { state, connect } = useWallet()
  const { userLpBalance, userStakedBalance, calculateHoldings } = useStaking()

  const { totalApr } = useFarming()
  const EARNING_STEPS = [
    'Deposit FOX and ETH into the FOX-ETH liquidity pool on Uniswap v2.',
    `Approve and stake your liquidity tokens to earn bonus FOX rewards.`
  ]

  const init = useCallback(async () => {
    try {
      await calculateHoldings()
      setInitialized(true)
    } catch {
      setInitialized(true)
    }
  }, [calculateHoldings])

  useEffect(() => {
    if (!initialized && state.initialized) {
      init()
    }
  }, [init, initialized, state.initialized])

  if (!state.initialized || !initialized) {
    return (
      <CardContent minHeight='500px' width='500px'>
        <Spinner
          thickness='8px'
          speed='3s'
          emptyColor='gray.300'
          color='primary'
          w='4rem'
          h='4rem'
        />
      </CardContent>
    )
  } else if (bnOrZero(userStakedBalance?.toString()).gt(0)) {
    // if a user has a staked balance send them to rewards
    return <Redirect to='/fox-farming/staking/rewards' />
  } else if (bnOrZero(userLpBalance?.toString()).gt(0)) {
    // if a user does not have staked balance but has lp tokens send them to staking
    return <Redirect to='/fox-farming/staking' />
  }

  return (
    <CardContainer flexDir='column' maxW='500px' position='relative'>
      <CardContent bg='gray.50' m={6} borderRadius='lg' width='auto'>
        <FoxEthLiquidityIconGroup mb={6} w='175px' />
        <GetStartedCountDown
          apr={totalApr}
          headerText='Start Earning Up To'
          completedHeader='Start Earning'
          subText='Once Bonus Rewards Begin!'
          completedSubText='With Your Liquidity Tokens!'
        />
      </CardContent>

      <CardContent pt={0}>
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
            <Text color='secondary'>{step}</Text>
          </Center>
        ))}
        {state.isConnected ? (
          <Button
            variant='primary'
            w='full'
            mt={6}
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
            <Button variant='primary' w='full' onClick={connect}>
              Connect Wallet
            </Button>
          </>
        )}
      </CardContent>
    </CardContainer>
  )
}
