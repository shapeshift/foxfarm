import { StakingContractProps } from 'lib/constants'
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
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  PopoverArrow,
  Stack,
  useColorModeValue
} from '@chakra-ui/react'
import { AprLabel } from './AprLabel'
import { useHasContractExpired } from 'hooks/useHasContractExpired'

type StakingRowProps = {
  contract: StakingContractProps
}

export const StakingRow = ({ contract }: StakingRowProps) => {
  const isEnded = useHasContractExpired(contract.contractAddress)
  return (
    <Tr _hover={{ bg: useColorModeValue('gray.100', 'gray.750') }}>
      <Td>
        <Flex minWidth={{ base: '100px', lg: '250px' }} alignItems='center' flexWrap='nowrap'>
          <Flex mr={2}>
            <Image
              src={contract.pool.token0.icon}
              boxSize={{ base: '30px', lg: '40px' }}
              boxShadow='right'
              zIndex={2}
              mr={-3}
              borderRadius='full'
            />
            <Image src={contract.pool.token1.icon} boxSize={{ base: '30px', lg: '40px' }} />
          </Flex>
          <Box>
            <Text fontWeight='bold'>{contract.name}</Text>
            <Text color='gray.500' fontSize='sm' display={{ base: 'none', lg: 'table-cell' }}>
              {contract.owner}
            </Text>
            <AprLabel
              apr={1.25}
              isEnded={isEnded}
              periodFinish={contract.periodFinish}
              size='sm'
              display={{ base: 'inline-flex', lg: 'none' }}
            />
          </Box>
        </Flex>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <AprLabel apr={1.25} isEnded={isEnded} periodFinish={contract.periodFinish} />
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <Text>$21.85m</Text>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <Tag colorScheme='purple'>Ethereum</Tag>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <HStack>
          {contract.rewards?.map(reward => (
            <Image key={reward.symbol} boxSize='24px' src={reward.icon} />
          ))}
        </HStack>
      </Td>
      <Td display={{ base: 'none', md: 'table-cell' }}>
        {contract.balance > 0 ? (
          <Popover placement='top-start' trigger='hover'>
            <PopoverTrigger>
              <Text>${contract.balance}</Text>
            </PopoverTrigger>
            <PopoverContent maxWidth='250px'>
              <PopoverArrow />
              <PopoverHeader fontWeight='bold'>Balance</PopoverHeader>
              <PopoverBody>
                <Stack>
                  <Flex width='full' justifyContent='space-between'>
                    <Text color='gray.500'>Pool Value</Text>
                    <Text>$4,125.40</Text>
                  </Flex>
                  <Flex width='full' justifyContent='space-between'>
                    <Text color='gray.500'>Rewards</Text>
                    <Text>$1,000.00</Text>
                  </Flex>
                </Stack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        ) : (
          '-'
        )}
      </Td>
      <Td display={{ base: 'block', md: 'table-cell' }}>
        {contract.balance > 0 ? (
          <Button isFullWidth>View</Button>
        ) : (
          <Button isFullWidth colorScheme='green'>
            Get Started
          </Button>
        )}
      </Td>
    </Tr>
  )
}
