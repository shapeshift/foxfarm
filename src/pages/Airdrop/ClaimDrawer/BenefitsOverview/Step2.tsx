import { Heading, Text, Button, Box, Image } from '@chakra-ui/react'
import Src from 'assets/img/governance.png'
import { RouterProps } from 'react-router'
export const Step2 = ({ history }: RouterProps) => {
  return (
    <Box p={8} display='flex' flexDir='column' height='100%'>
      <Box mt='auto' mb='auto'>
        <Image src={Src} ml='auto' mr='auto' mb={0} maxWidth='200px' />
        <Heading fontWeight='300' mb={6}>
          FOX Governance
        </Heading>
        <Text color='gray.500' fontSize='lg'>
          Help shape the future of finance. FOX Tokens give you voting power over the ShapeShift
          DAO.
        </Text>
      </Box>
      <Button onClick={() => history.push('/step/3')} width='full' py={4} mb={8}>
        Next
      </Button>
    </Box>
  )
}
