import { Heading, Text } from '@chakra-ui/layout'
import { Card } from 'components/Card/Card'

export const NotFound = () => {
  return (
    <Card
      minHeight='250px'
      alignItems='center'
      justifyContent='center'
      maxWidth='350px'
      textAlign='center'
      display='flex'
    >
      <Card.Body>
        <Heading as='h1'>404</Heading>
        <Text>The page you're looking for cannot be found</Text>
      </Card.Body>
    </Card>
  )
}
