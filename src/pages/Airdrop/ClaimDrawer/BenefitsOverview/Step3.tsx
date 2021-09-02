import { Heading, Text, Button, Box, Image } from '@chakra-ui/react'
import Src from 'assets/img/farming.png'
import { useFarming } from 'hooks/useFarming'
import { RouterProps } from 'react-router'
export const Step3 = ({ history }: RouterProps) => {
  const { totalApr } = useFarming()
  return (
    <Box pb={8} display='flex' flexDir='column' height='100%'>
      <Image src={Src} width='100%' />
      <Box mt={16} mb='auto' px={8}>
        <Heading fontWeight='300' mb={6}>
          Big Returns
        </Heading>
        <Text color='secondary' fontSize='lg'>
          Add your FOX to a liquidity pool, then stake your LP tokens on ShapeShift to{' '}
          <Text color='white' fontWeight='bold'>
            earn an APR up to {totalApr}%*
          </Text>
        </Text>
      </Box>
      <Button onClick={() => history.push('/step/4')} variant='primary' mb={8} py={4} mx={8}>
        Next
      </Button>
      <Text fontSize='sm' color='secondary' mx={8}>
        *ShapeShift is rewarding 15,768,000 FOX until October 13, 2021 to liquidity providers that
        stake their LP tokens. This is an estimated APR calculated based on the current amount of
        FOX-ETH-UNIV2 LP tokens staked in the ShapeShift rewards contract. This APR amount is
        subject to extreme volatility and this amount could drop significantly, especially in the
        first few weeks after we roll-out FOX yield farming
      </Text>
    </Box>
  )
}
