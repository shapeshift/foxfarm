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
import { bnOrZero } from 'utils/math'
import { useCalculateHoldings } from 'hooks/useCalculateHoldings'
import { useHistory } from 'react-router'
import { useWallet } from 'state/WalletProvider'
import { useUserFriendlyAmount } from 'hooks/useUserFriendlyAmount'

type StakingRowProps = {
  contract: StakingContractProps
}

export const StakingRow = ({ contract }: StakingRowProps) => {
  const { push } = useHistory()
  const { state, connect } = useWallet()
  const bg = useColorModeValue('gray.100', 'gray.750')
  const isEnded = useHasContractExpired(contract.contractAddress)
  const { userHoldings } = useCalculateHoldings({
    lpAddress: contract.pool.contractAddress,
    rewardsAddress: contract.contractAddress
  })

  const userHoldingsValue = useUserFriendlyAmount(userHoldings?.totalUsdcValueStakedAndLp)
  const userStakedBalance = useUserFriendlyAmount(userHoldings?.userStakedBalance)
  const userLpBalance = useUserFriendlyAmount(userHoldings?.userLpBalance)

  const handleGetStarted = () => {
    const stakedBalance = bnOrZero(userStakedBalance).toNumber()
    const lpBalance = bnOrZero(userLpBalance).toNumber()
    if (!state.isConnected) return connect()
    if (isEnded && stakedBalance > 0) {
      return push(
        `/fox-farming/liquidity/${contract.pool.contractAddress}/staking/${contract.contractAddress}/rewards`
      )
    }
    if (!isEnded && lpBalance <= 0) {
      return push(`/fox-farming/liquidity/${contract.pool.contractAddress}`)
    }
    if (!isEnded && lpBalance > 0 && stakedBalance <= 0) {
      return push(
        `/fox-farming/liquidity/${contract.pool.contractAddress}/staking/${contract.contractAddress}`
      )
    }
  }

  const handleView = () => {
    push(
      `/fox-farming/liquidity/${contract.pool.contractAddress}/staking/${contract.contractAddress}/rewards`
    )
  }

  if (isEnded && bnOrZero(userStakedBalance).toNumber() <= 0) return null

  return (
    <Tr _hover={{ bg }}>
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
        {Number(userHoldingsValue) > 0 ? (
          <Popover placement='top-start' trigger='hover'>
            <PopoverTrigger>
              <Text>${userHoldingsValue}</Text>
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
        {Number(userHoldingsValue) > 0 ? (
          <Button isFullWidth onClick={handleView}>
            View
          </Button>
        ) : (
          <Button isFullWidth colorScheme='green' onClick={handleGetStarted}>
            Get Started
          </Button>
        )}
      </Td>
    </Tr>
  )
}
