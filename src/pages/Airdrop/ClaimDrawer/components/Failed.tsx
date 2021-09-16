import { Alert, AlertDescription, AlertTitle, AlertIcon, Button } from '@chakra-ui/react'
export const Failed = ({ closeDrawer }: { closeDrawer: () => void }) => {
  return (
    <>
      <Alert
        status='error'
        bg='red.500'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='200px'
        borderRadius='12'
      >
        <AlertIcon color='light' boxSize='40px' mr={0} />
        <AlertTitle mt={4} mb={1} fontSize='lg'>
          Transaction Failed
        </AlertTitle>
        <AlertDescription maxWidth='sm'>
          Please try submitting your transaction again.
        </AlertDescription>
        <Button
          mt={4}
          bg='whiteAlpha.300'
          _hover={{ bg: 'white', color: 'black' }}
          onClick={closeDrawer}
        >
          Try Again
        </Button>
      </Alert>
    </>
  )
}
