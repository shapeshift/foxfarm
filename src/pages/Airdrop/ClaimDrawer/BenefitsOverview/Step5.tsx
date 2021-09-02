import { Heading, Text, Button, Box, Image, Link } from '@chakra-ui/react'
import Src from 'assets/img/rainfall.png'
import { RouterProps } from 'react-router'
import { DrawerSteps } from '../ClaimDrawer'
export const Step5 = ({
  history,
  setStep
}: RouterProps & { setStep: React.Dispatch<React.SetStateAction<DrawerSteps>> }) => {
  return (
    <Box p={8} display='flex' flexDir='column' height='100%'>
      <Box mt='auto' mb='auto'>
        <Image src={Src} mx='auto' mb={8} maxWidth='300px' />
        <Heading fontWeight='300' mb={6}>
          Win Crypto!
        </Heading>
        <Text color='secondary' fontSize='lg' mb={4}>
          Whenever a user trades on ShapeShift, another FOX Token holder wins crypto.
        </Text>
        <Link
          color={'primary'}
          href={'https://shapeshift.zendesk.com/hc/en-us/articles/360016935820-Rainfall-Explained'}
          isExternal={true}
        >
          Learn More
        </Link>
      </Box>
      <Button
        onClick={() => setStep(DrawerSteps.STATUS)}
        variant='primary'
        width='full'
        py={4}
        mb={8}
      >
        Next
      </Button>
    </Box>
  )
}
