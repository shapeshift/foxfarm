import { Center, CenterProps } from '@chakra-ui/react'
import { FC } from 'react'

export const LayoutCard: FC<CenterProps> = ({ children, ...rest }) => (
  <Center
    borderRadius='2xl'
    boxShadow={{ base: '', md: '0px 0px 22px 4px rgba(0,0,0,0.10)' }}
    flexDir='column'
    overflow='hidden'
    m={8}
    bg='white'
    {...rest}
  >
    {children}
  </Center>
)
