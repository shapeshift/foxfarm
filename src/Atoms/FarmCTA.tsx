import React from 'react'
import { Flex, Box, Text, Image } from '@chakra-ui/react'
import ETHFOX from 'assets/img/overlap-eth-fox.png'

export const FarmCTA = () => {
  return (
    <Flex
      bgGradient='linear(142deg, #17398C 3%, #5737D1 100%)'
      boxShadow='lg'
      mt={6}
      w='90%'
      maxW='740px'
      textAlign={{ base: 'center', md: 'right' }}
      borderRadius={6}
      py={6}
      px={6}
      position='relative'
      overflow='hidden'
      flexWrap='wrap'
      _hover={{ cursor: 'pointer' }}
      onClick={() =>
        window.open(
          'https://snapshot.org/#/shapeshiftdao.eth/proposal/QmcNSbAHAaPXYS77vjhHR7pmP1r7uzxJ5s6gWyeJv5LkSB',
          '_blank'
        )
      }
    >
      <Image
        width={{ base: '180px', md: '370px' }}
        mx='auto'
        position={{ base: 'relative', md: 'absolute' }}
        left={{ base: 'inherit', md: '-100px' }}
        top='50%'
        transform={{ base: 'none', md: 'translateY(-48%)' }}
        src={ETHFOX}
      />

      <Box
        ml='auto'
        mr={{ base: 'auto', md: '0' }}
        mt={{ base: '-10px', md: '0' }}
        w={{ base: '100%', md: 'auto' }}
      >
        <Text fontSize='xs' color='white' fontWeight='semibold' textTransform='uppercase'>
          🎉The Community Has Spoken🎉
        </Text>
        <Text fontSize='xl' fontWeight='bold' color='white' my={1}>
          Farming Rewards Extended
        </Text>
        <Text fontSize={{ base: 'sm', md: 'xs' }} color='whiteAlpha.700'>
          New Rewards Start Oct 12 @ 9am MDT
        </Text>
      </Box>
    </Flex>
  )
}
