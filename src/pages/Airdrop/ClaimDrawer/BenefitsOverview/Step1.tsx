import { Heading, Text, Button, Box, Image } from '@chakra-ui/react'
import Src from 'assets/img/step1.png'
import { RouterProps } from 'react-router'
export const Step1 = ({ history }: RouterProps) => {
  return (
    <Box p={8} display='flex' flexDir='column' height='100%'>
      <Box mt='auto' mb='auto'>
        <Image src={Src} ml='auto' mr='auto' mb={16} maxWidth='300px' />
        <Heading fontWeight='300' mb={6}>
          HODL Your FOX Tokens for Tons of Benefits
        </Heading>
        <Text color='gray.500' fontSize='lg'>
          Your FOX Tokens have superpowers!
        </Text>
      </Box>
      <Button onClick={() => history.push('/step/2')} width='full' mb={8} py={4}>
        Next
      </Button>
    </Box>
  )
}
