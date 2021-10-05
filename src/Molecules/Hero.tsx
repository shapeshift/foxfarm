import { Flex } from '@chakra-ui/react'
import React from 'react'
import BgImage from 'assets/img/benefits-bg.jpg'
import { TabNav } from 'Organisims/TabNav'

export const Hero: React.FC<{ bgImage?: string }> = ({ children, bgImage }) => {
  return (
    <Flex
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      backgroundImage={`url(${bgImage ?? BgImage})`}
      backgroundPosition='center top'
      backgroundSize='cover'
      backgroundRepeat='no-repeat'
      minH='580px'
    >
      <Flex
        width='90%'
        maxWidth={600}
        flexGrow={1}
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        pt='85px'
      >
        {children}
      </Flex>
      <TabNav />
    </Flex>
  )
}
