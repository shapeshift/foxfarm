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
  useColorModeValue
} from '@chakra-ui/react'
import { AprLabel } from './AprLabel'
import { useHasContractExpired } from 'hooks/useHasContractExpired'
import { bnOrZero } from 'utils/math'
import { useCalculateHoldings } from 'hooks/useCalculateHoldings/useCalculateHoldings'
import { useHistory } from 'react-router'
import { useWallet } from 'state/WalletProvider'
import { useUserFriendlyAmount } from 'hooks/useUserFriendlyAmount'
import { BalancePopOver } from './BalancePopOver'
import { useFarming } from 'hooks/useFarming'
import { useCalculateStakingDeposits } from './hooks/useCalculateStakingDeposits/useCalculateStakingDeposits'
import { numberFormatter } from 'utils/helpers'

type StakingRowProps = {
  contract: StakingContractProps
}

export const ContractStakingRow = ({ contract }: StakingRowProps) => {
  const { push } = useHistory()
  const { state, connect } = useWallet()
  const { totalApr } = useFarming({
    lpContract: contract.pool.contractAddress,
    stakingContract: contract.contractAddress
  })
  const { totalDeposited } = useCalculateStakingDeposits(
    contract.contractAddress,
    contract.pool.contractAddress
  )

  const bg = useColorModeValue('gray.100', 'gray.750')
  const isEnded = useHasContractExpired(contract.contractAddress)
  const { userHoldings } = useCalculateHoldings({
    lpAddress: contract.pool.contractAddress,
    rewardsAddress: contract.contractAddress
  })

  const userHoldingsValue = useUserFriendlyAmount(userHoldings?.totalUsdcValueStakedAndLp)
  const userStakedBalance = useUserFriendlyAmount(userHoldings?.userStakedBalance?.toString())
  const userLpBalance = useUserFriendlyAmount(userHoldings?.userLpBalance?.toString())
  const foxAmount = useUserFriendlyAmount(userHoldings?.userUnclaimedRewards?.toString())
  const totalStakedInContract = useUserFriendlyAmount(totalDeposited)

  const handleGetStarted = () => {
    const stakedBalance = bnOrZero(userStakedBalance).toNumber()
    const lpBalance = bnOrZero(userLpBalance).toNumber()
    // dont have wallet connected
    if (!state.isConnected) return connect()
    // contract has expired but you have a staked balance
    if (isEnded && stakedBalance > 0) {
      return push(
        `/fox-farming/liquidity/${contract.pool.contractAddress}/staking/${contract.contractAddress}/rewards`
      )
    }
    // contract is active but you dont have any lp
    if (!isEnded && lpBalance <= 0) {
      return push(
        `/fox-farming/liquidity/${contract.pool.contractAddress}/staking/${contract.contractAddress}/get-started`
      )
    }
    // contract has expired you have lp tokens but have not staked
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

  if (isEnded && bnOrZero(userStakedBalance).lte(0)) return null

  return (
    <Tr _hover={{ bg }}>
      <Td>
        <Flex minWidth={{ base: '100px', lg: '250px' }} alignItems='center' flexWrap='nowrap'>
          <Flex mr={2}>
            <Image
              src={contract.pool.token0.icon}
              boxSize={{ base: '30px', lg: '40px' }}
              boxShadow='right'
              zIndex={0}
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
              apr={totalApr}
              isEnded={isEnded}
              periodFinish={contract.periodFinish}
              size='sm'
              display={{ base: 'inline-flex', lg: 'none' }}
            />
          </Box>
        </Flex>
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <AprLabel apr={totalApr} isEnded={isEnded} periodFinish={contract.periodFinish} />
      </Td>
      <Td display={{ base: 'none', lg: 'table-cell' }}>
        <Text>${numberFormatter(bnOrZero(totalStakedInContract).toNumber(), 2)}</Text>
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
        {Number(userHoldingsValue) > 0 ? (
          <BalancePopOver
            foxAmount={foxAmount}
            userHoldingsValue={userHoldingsValue}
            contractAddress={contract.contractAddress}
          />
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
