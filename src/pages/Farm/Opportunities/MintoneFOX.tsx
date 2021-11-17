import {
  Text,
  Tr,
  Td,
  Tag,
  Image,
  Button,
  Flex,
  Box,
  useColorModeValue,
  Link,
  Skeleton
} from '@chakra-ui/react'
import { AprLabel } from './AprLabel'
import { numberFormatter } from 'utils/helpers'
import { bnOrZero } from 'utils/math'

type MintOneProps = {
  tvl?: string
}

export const MintoneFOX = ({ tvl }: MintOneProps) => {
  const bg = useColorModeValue('gray.100', 'gray.750')

  return (
    <Tr _hover={{ bg }}>
      <Td>
        <Flex minWidth={{ base: '100px', lg: '250px' }} alignItems='center' flexWrap='nowrap'>
          <Flex mr={2}>
            <Image
              src='https://assets.coincap.io/assets/icons/256/usdc.png'
              boxSize={{ base: '30px', lg: '40px' }}
              boxShadow='right'
              zIndex={2}
              mr={-3}
              borderRadius='full'
            />
            <Image
              src='https://assets.coincap.io/assets/icons/256/eth.png'
              boxSize={{ base: '30px', lg: '40px' }}
            />
          </Flex>
          <Box>
            <Text fontWeight='bold'>oneFOX</Text>
            <Text color='gray.500' fontSize='sm' display={{ base: 'none', lg: 'table-cell' }}>
              ICHI
            </Text>
            <AprLabel apr='5' size='sm' display={{ base: 'inline-flex', lg: 'none' }} />
          </Box>
        </Flex>
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
      <Td display={{ base: 'block', md: 'table-cell' }} textAlign='right'>
        <Button
          isFullWidth
          colorScheme='green'
          maxWidth='120px'
          as={Link}
          href='https://app.ichi.org/mint?name=onefox&collateral=USDC'
          isExternal
        >
          Get Started
        </Button>
      </Td>
    </Tr>
  )
}
