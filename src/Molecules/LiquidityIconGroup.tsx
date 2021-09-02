import React from 'react'
import { Center, Box, CenterProps, Image, Text } from '@chakra-ui/react'
import { AirdropFoxIcon } from 'Atoms/Icons/AirdropFoxIcon'
import ETH from 'assets/img/eth.png'
import UNI from 'assets/img/uni.png'

type LiquidityIconGroupProps = CenterProps & {
  leftIcon: JSX.Element
  rightIcon: JSX.Element
  topRightIcon?: JSX.Element
  bottomLeftIcon?: JSX.Element
}

export const LiquidityIconGroup: React.FC<LiquidityIconGroupProps> = ({
  leftIcon,
  rightIcon,
  topRightIcon,
  bottomLeftIcon,
  ...rest
}) => (
  <Center position='relative' {...rest}>
    <Box w='50%' h='auto' position='relative' borderRadius='full' boxShadow='0 0 0 5px #fff'>
      {leftIcon}
    </Box>
    {topRightIcon && (
      <Box
        position='absolute'
        w='20%'
        h='auto'
        top='-6%'
        right='10%'
        borderRadius='full'
        boxShadow='0px 3px 3px 1px rgba(0,0,0,0.2)'
      >
        {topRightIcon}
      </Box>
    )}
    {bottomLeftIcon && (
      <Box position='absolute' w='20%' h='auto' bottom='-14%' left='8%' borderRadius='full'>
        {bottomLeftIcon}
      </Box>
    )}
    <Box w='50%' height='auto' ml='-20%'>
      {rightIcon}
    </Box>
  </Center>
)

export const FoxEthLiquidityIconGroup: React.FC<CenterProps> = props => (
  <LiquidityIconGroup
    {...props}
    leftIcon={<AirdropFoxIcon />}
    rightIcon={<Image src={ETH} />}
    topRightIcon={<Image src={UNI} />}
  />
)

export const FoxEthStakingIconGroup: React.FC<CenterProps> = props => (
  <LiquidityIconGroup
    {...props}
    leftIcon={<AirdropFoxIcon />}
    rightIcon={<Image src={ETH} />}
    bottomLeftIcon={<Text fontSize='4xl'>🚜</Text>}
  />
)
