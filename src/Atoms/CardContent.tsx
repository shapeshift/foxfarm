import { Center, CenterProps } from '@chakra-ui/react'

export const CardContent: React.FC<CenterProps> = ({ children, ...rest }) => (
  <Center px={{ base: 4, md: 14 }} py={8} flexDir='column' w='100%' flex={1} {...rest}>
    {children}
  </Center>
)
