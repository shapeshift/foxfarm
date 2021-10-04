import {
  Text,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  PopoverArrow,
  Stack
} from '@chakra-ui/react'
import { numberFormatter } from 'utils/helpers'
import { bnOrZero } from 'utils/math'
import { useRealTimeRewardAmounts } from '../hooks/useRealTimeRewardAmount'

type TBalancePopOver = {
  foxAmount: string | null
  userHoldingsValue: string | null
  contractAddress: string
}

export const BalancePopOver = ({
  foxAmount,
  userHoldingsValue,
  contractAddress
}: TBalancePopOver) => {
  const { fiatAmount } = useRealTimeRewardAmounts({
    foxAmount,
    stakingContractAddress: contractAddress
  })

  return (
    <Popover placement='top-start' trigger='hover'>
      <PopoverTrigger>
        <Text>
          ${numberFormatter(bnOrZero(userHoldingsValue).plus(bnOrZero(fiatAmount)).toNumber(), 2)}
        </Text>
      </PopoverTrigger>
      <PopoverContent maxWidth='250px'>
        <PopoverArrow />
        <PopoverHeader fontWeight='bold'>Balance</PopoverHeader>
        <PopoverBody>
          <Stack>
            <Flex width='full' justifyContent='space-between'>
              <Text color='gray.500'>Pool Value</Text>
              <Text>${bnOrZero(userHoldingsValue).toFixed(5)}</Text>
            </Flex>
            <Flex width='full' justifyContent='space-between'>
              <Text color='gray.500'>Rewards</Text>
              <Text>${bnOrZero(fiatAmount).toFixed(5)}</Text>
            </Flex>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
