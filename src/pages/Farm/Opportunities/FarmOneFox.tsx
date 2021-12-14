import { Flex, Box, HStack, Link } from '@chakra-ui/layout'
import { Button, useColorModeValue, Image, Text, Skeleton } from '@chakra-ui/react'
import { Tr, Td } from '@chakra-ui/table'
import { Tag } from '@chakra-ui/tag'
import { numberFormatter } from 'utils/helpers'
import { bnOrZero } from 'utils/math'
import { AprLabel } from './AprLabel'
import oneFOX from 'assets/img/oneFOX.png'
import Ichi from 'assets/img/ichi.svg'

type FarmOneFoxProps = {
  apy?: string
  tvl?: string
}

export const FarmOneFox = ({ apy, tvl }: FarmOneFoxProps) => {
  const bg = useColorModeValue('gray.100', 'gray.750')
  return (
    <Tr _hover={{ bg }}>
      <Td>
        <Flex minWidth={{ base: '100px', lg: '250px' }} alignItems='center' flexWrap='nowrap'>
          <Flex mr={2}>
            <Image
              src={oneFOX}
              boxSize={{ base: '30px', lg: '40px' }}
              boxShadow='right'
              zIndex={0}
              borderRadius='full'
            />
          </Flex>
          <Box>
            <Text fontWeight='bold'>oneFOX</Text>
            <Text color='gray.500' fontSize='sm' display={{ base: 'none', lg: 'table-cell' }}>
              ICHI
            </Text>
            <AprLabel apr={'2'} size='sm' display={{ base: 'inline-flex', lg: 'none' }} />
          </Box>
        </Flex>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <Skeleton isLoaded={apy ? true : false}>
          <AprLabel apr={apy ?? ''} />
        </Skeleton>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <Skeleton isLoaded={tvl ? true : false}>
          <Text>${numberFormatter(bnOrZero(tvl ?? null).toNumber(), 2)}</Text>
        </Skeleton>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <Tag colorScheme='purple' textTransform='capitalize'>
          Ethereum
        </Tag>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <HStack>
          <Image src={Ichi} boxSize='24px' />
        </HStack>
      </Td>
      <Td display={{ base: 'none', md: 'table-cell' }}>-</Td>
      <Td display={{ base: 'block', md: 'table-cell' }}>
        <Button
          isFullWidth
          colorScheme='green'
          as={Link}
          href='https://app.ichi.org/deposit?poolId=1015&back=deposit'
          isExternal
        >
          Get Started
        </Button>
      </Td>
    </Tr>
  )
}
