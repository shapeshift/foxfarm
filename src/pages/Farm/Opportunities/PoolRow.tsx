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
import { AprLabel } from './AprLabel'
import { bnOrZero } from 'utils/math'
import { numberFormatter } from 'utils/helpers'
import { useHistory } from 'react-router'
import { useCalculateLPDeposits } from './hooks/useCalculateLPDeposits/useCalculateLPDeposits'
import { useUserFriendlyAmount } from 'hooks/useUserFriendlyAmount'
import { useFarming } from 'hooks/useFarming'
import { useCalculateLPHoldings } from 'hooks/useCalculateLPHoldings/useCalculateLPHoldings'

type PoolRowProps = {
  contract: PoolProps
}

export const PoolRow = ({ contract }: PoolRowProps) => {
  const { push } = useHistory()
  const { lpApr } = useFarming({
    lpContract: contract.contractAddress
  })
  const { userLpBalance } = useCalculateLPHoldings({
    lpAddress: contract.contractAddress
  })
  const { totalLiquidity, lpTokenPrice } = useCalculateLPDeposits(contract.contractAddress)
  const totalInLiquidity = useUserFriendlyAmount(totalLiquidity)
  const totalUserBalance = bnOrZero(useUserFriendlyAmount(userLpBalance?.toString()))
    .times(bnOrZero(lpTokenPrice))
    .toNumber()
  const handleView = () => {
    push(`/fox-farming/liquidity/${contract.contractAddress}/lp-add`)
  }
  return (
    <Tr _hover={{ bg: useColorModeValue('gray.100', 'gray.750') }}>
      <Td>
        <Flex minWidth={{ base: '100px', lg: '250px' }} alignItems='center' flexWrap='nowrap'>
          <Flex mr={2}>
            <Image
              src={contract.token0.icon}
              boxSize={{ base: '30px', lg: '40px' }}
              boxShadow='right'
              zIndex={2}
              mr={-3}
              borderRadius='full'
            />
            <Image src={contract.token1.icon} boxSize={{ base: '30px', lg: '40px' }} />
          </Flex>
          <Box>
            <Text fontWeight='bold'>{contract.name}</Text>
            <Text color='gray.500' fontSize='sm' display={{ base: 'none', lg: 'table-cell' }}>
              {contract.owner}
            </Text>
            <AprLabel apr={'1.235'} size='sm' display={{ base: 'inline-flex', lg: 'none' }} />
          </Box>
        </Flex>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <AprLabel colorScheme='green' apr={lpApr} />
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <Text>${numberFormatter(bnOrZero(totalInLiquidity).toNumber(), 2)}</Text>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <Tag colorScheme='purple' textTransform='capitalize'>
          {contract.network}
        </Tag>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <HStack>
          {contract.rewards?.map(reward => (
            <Image key={reward.symbol} boxSize='24px' src={reward.icon} />
          ))}
        </HStack>
      </Td>
      <Td display={{ base: 'none', md: 'table-cell' }}>
        {totalUserBalance > 0 ? <Text>${totalUserBalance}</Text> : '-'}
      </Td>
      <Td>
        <Button isFullWidth onClick={handleView}>
          Manage
        </Button>
      </Td>
    </Tr>
  )
}
