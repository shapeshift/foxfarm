import { PoolProps } from 'lib/constants'
import {
  Text,
  Tr,
  Td,
  Tag,
  Image,
  HStack,
  Button,
  Flex,
  Box,
  useColorModeValue
} from '@chakra-ui/react'

type PoolRowProps = {
  pool: PoolProps
}

export const PoolRow = ({ pool }: PoolRowProps) => {
  return (
    <Tr _hover={{ bg: useColorModeValue('gray.100', 'gray.750') }}>
      <Td>
        <Flex minWidth={{ base: '100px', lg: '250px' }} alignItems='center' flexWrap='nowrap'>
          <Flex mr={2}>
            <Image
              src={pool.token0.icon}
              boxSize={{ base: '30px', lg: '40px' }}
              boxShadow='right'
              zIndex={2}
              mr={-3}
              borderRadius='full'
            />
            <Image src={pool.token1.icon} boxSize={{ base: '30px', lg: '40px' }} />
          </Flex>
          <Box>
            <Text fontWeight='bold'>{pool.name}</Text>
            <Text color='gray.500' fontSize='sm' display={{ base: 'none', lg: 'table-cell' }}>
              {pool.owner}
            </Text>
            <Tag colorScheme='green' size='sm' display={{ base: 'inline-flex', lg: 'none' }}>
              1.00%
            </Tag>
          </Box>
        </Flex>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <Tag colorScheme='green'>1.00%</Tag>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <Text>$21.85m</Text>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <Tag colorScheme='purple'>Ethereum</Tag>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <HStack>
          {pool.rewards?.map(reward => (
            <Image boxSize='24px' src={reward.icon} />
          ))}
        </HStack>
      </Td>
      <Td>-</Td>
      <Td>
        <Button isFullWidth>View</Button>
      </Td>
    </Tr>
  )
}
