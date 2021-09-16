import { Button, HStack, StackProps } from '@chakra-ui/react'

export const HeaderCtas = (props: StackProps) => (
  <HStack spacing={6} {...props}>
    <Button
      onClick={() => {
        window.open('https://beta.shapeshift.com')
      }}
      textTransform='uppercase'
      fontSize='sm'
      pl={6}
      pr={6}
    >
      Try ShapeShift
    </Button>
    <Button
      onClick={() => {
        window.open(
          'https://auth.shapeshift.com/oauth/authorize?response_type=code&client_id=5a6dd0ac-0039-4561-95c4-87e0a2b35390&state=&redirect_uri=https%3A%2F%2Fbeta.shapeshift.com%2Fredirect&scope=users%3Aread',
          '_blank'
        )
      }}
      variant='outline'
      textTransform='uppercase'
      fontSize='sm'
    >
      Log In
    </Button>
  </HStack>
)
