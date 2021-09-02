import { Box, BoxProps } from '@chakra-ui/react'
import { FC } from 'react'

export const CardContainer: FC<BoxProps> = ({ children, ...rest }) => (
  <Box
    flexDir={{ base: 'column-reverse', md: 'row' }}
    display='flex'
    width='100vw'
    maxWidth='900px'
    {...rest}
  >
    {children}
  </Box>
)
