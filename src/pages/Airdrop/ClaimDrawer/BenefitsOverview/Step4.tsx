import { Heading, Text, Button, Box, Image, Link } from '@chakra-ui/react'
import Src from 'assets/img/gas.png'
import { RouterProps } from 'react-router'
export const Step4 = ({ history }: RouterProps) => {
  return (
    <Box pb={8} width='100%' display='flex' flexDir='column' height='100%'>
      <Image src={Src} width='100%' />
      <Box mt={16} mb='auto' px={8}>
        <Heading fontWeight='300' mb={6}>
          Cover Gas Fees on Trades
        </Heading>
        <Text color='gray.500' fontSize='lg' mb={4}>
          FOX Fuel reimburses your gas costs on trades!
        </Text>
        <Link
          color={'primary'}
          href={
            'https://shapeshift.zendesk.com/hc/en-us/articles/360061145791-FOX-Fuel-How-it-Works'
          }
          isExternal={true}
        >
          Learn More
        </Link>
      </Box>
      <Button onClick={() => history.push('/step/5')} py={4} mx={8} mb={8}>
        Next
      </Button>
    </Box>
  )
}
