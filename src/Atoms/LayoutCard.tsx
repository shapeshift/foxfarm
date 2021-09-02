import { Center } from '@chakra-ui/react'
import { FC } from 'react'

export const LayoutCard: FC = ({ children }) => (
  <Center
    borderRadius='2xl'
    bgColor='white'
    boxShadow={{ base: '', md: '0px 0px 22px 4px rgba(0,0,0,0.10)' }}
    flexDir='column'
    overflow='hidden'
    m={8}
  >
    {children}
  </Center>
)
