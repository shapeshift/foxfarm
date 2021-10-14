import React from 'react'
import { Center, CenterProps, Spinner } from '@chakra-ui/react'
import { FoxEthLiquidityIconGroup } from 'Molecules/LiquidityIconGroup'

type PendingIconGroupProps = CenterProps & { isLoading?: boolean }

export const PendingIconGroup: React.FC<PendingIconGroupProps> = ({
  isLoading = true,
  ...rest
}) => (
  <Center {...rest} position='relative'>
    <Spinner
      thickness='10px'
      speed={isLoading ? '3s' : '0'}
      emptyColor='gray.300'
      color='blue.500'
      w='9rem'
      h='9rem'
    />
    <FoxEthLiquidityIconGroup
      position='absolute'
      top='50%'
      left='50%'
      transform='translate(-50%, -50%)'
      w='100px'
    />
  </Center>
)
