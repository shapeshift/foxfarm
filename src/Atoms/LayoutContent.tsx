import { Center } from '@chakra-ui/react'
import { FC } from 'react'

export const LayoutContent: FC = ({ children }) => (
  <Center
    px={{ base: 0, md: 8 }}
    py={8}
    bgGradient='linear(to bottom, gray.200 40%, white 40%)'
    flexDir='column'
    minHeight='50vh'
  >
    {children}
  </Center>
)
