import { LayoutContent } from 'Atoms/LayoutContent'
import { LayoutCard } from 'Atoms/LayoutCard'
import { CardContent } from 'Atoms/CardContent'
import { Layout } from 'Molecules/Layout/Layout'
import { Hero } from 'Molecules/Hero'
import { Text, Image, Link, Button, Tag } from '@chakra-ui/react'

import FoxImage from 'assets/img/floating-fox.png'
import { DiscordIcon } from 'Atoms/Icons/DiscordIcon'
import { useHistory } from 'react-router'

export const AirDropEnded = () => {
  const history = useHistory()
  return (
    <Layout>
      <Hero>
        <Text
          color='white'
          mb='2'
          textAlign='center'
          fontWeight='heading'
          fontSize={{ base: '4xl', md: '5xl' }}
          as='h1'
        >
          FOX Airdrop
        </Text>
        <Text color='gray.400' textAlign='center' fontWeight='heading' as='p'>
          We are rewarding users with a FOX Token airdrop! If you've traded ETH/ERC-20 tokens or
          have a qualifying wallet balance, you may have FOX Tokens waiting for you. Check your ETH
          addresses to see if they're eligible.
        </Text>
      </Hero>
      <LayoutContent>
        <LayoutCard maxW='450px'>
          <CardContent bgColor='gray.100'>
            <Image w='100%' maxWidth='150px' mb='2' mx='auto' src={FoxImage} />
            <Text mb='2' fontWeight='bold' fontSize='2xl'>
              The Airdrop has ended
            </Text>
            <Text textAlign='center' color='gray.500' fontWeight='heading' as='p'>
              You can still earn up to <Tag colorScheme='green'>200% APR</Tag> on FOX Tokens with
              our farming rewards!
            </Text>
          </CardContent>
          <CardContent px={6} pb={4}>
            <Button onClick={() => history.push('/fox-farming')} width='full' size='lg'>
              Start Earning
            </Button>
          </CardContent>
          <CardContent pt={0} px={6}>
            <Text color='gray.500' mb={4}>
              Interested in contributing?
            </Text>
            <Button
              size='lg'
              isFullWidth
              variant='solid'
              colorScheme='gray'
              as={Link}
              isExternal
              href='https://discord.gg/shapeshift'
              leftIcon={<DiscordIcon />}
            >
              Join our Discord Server
            </Button>
          </CardContent>
        </LayoutCard>
      </LayoutContent>
    </Layout>
  )
}
