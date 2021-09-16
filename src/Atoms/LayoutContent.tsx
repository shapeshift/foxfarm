import { Center, useColorModeValue } from '@chakra-ui/react'
import { FC } from 'react'

export const LayoutContent: FC = ({ children }) => (
  <Center
    px={{ base: 0, md: 8 }}
    py={8}
    bgGradient={`linear(to bottom, ${useColorModeValue(
      'gray.200',
      'gray.900'
    )} 40%, ${useColorModeValue('white', 'gray.800')} 40%)`}
    flexDir='column'
    minHeight='50vh'
  >
    {children}
  </Center>
)
