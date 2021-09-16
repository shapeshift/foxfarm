import Countdown from 'react-countdown'
import { Center, Text, Tooltip, Box } from '@chakra-ui/react'
import { InfoIcon } from '@chakra-ui/icons'
import { COUNT_DOWN_TIME } from 'lib/constants'

type RendererProps = {
  days: number
  hours: number
  minutes: number
  seconds: number
  completed: boolean
}

const numFormatter = (num: number) => {
  if (num < 10) return `0${num}`
  return num
}

const renderer = ({ days, hours, minutes, seconds, completed }: RendererProps) => {
  if (completed) {
    return null
  } else {
    return (
      <Center mt={6}>
        <Tooltip
          label='When the countdown stops, 15,768,000 FOX (~1.5% of the total FOX supply) will be rewarded to liquidity providers over the following 90 days. Future liquidity mining programs will be determined by governance'
          fontSize='md'
          p={4}
          borderRadius='md'
        >
          <InfoIcon color='primary' w='16px' h='16px' mr={2} />
        </Tooltip>
        <Text color='gray.500'>FOX Bonus Rewards start in</Text>
        <Text color='gray.500' fontWeight='bold' ml='4px'>
          {numFormatter(days)}:{numFormatter(hours)}:{numFormatter(minutes)}:{numFormatter(seconds)}
        </Text>
      </Center>
    )
  }
}

export const CountDown = () => <Countdown date={Date.now() + 50000000} renderer={renderer} />

const CountDownHeader = ({
  headerText,
  apr,
  subText
}: {
  headerText?: string
  apr?: string
  subText?: string
}) => {
  return (
    <>
      {headerText && (
        <Text fontSize='lg' textAlign='center' mt={4} color='gray.500'>
          {headerText}
        </Text>
      )}
      {apr && (
        <Text
          mb={0}
          fontSize='2xl'
          textAlign='center'
          fontWeight='bold'
          bg='blue.100'
          my={2}
          color='blue.500'
          borderRadius='lg'
          px={4}
        >
          {apr}% APR*
        </Text>
      )}
      {subText && (
        <Text mb={0} fontSize='lg' textAlign='center' color='gray.500'>
          {subText}
        </Text>
      )}
    </>
  )
}

export const GetStartedCountDown = ({
  apr,
  headerText,
  completedHeader,
  subText,
  completedSubText
}: {
  apr?: string
  headerText?: string
  completedHeader?: string
  subText?: string
  completedSubText?: string
}) => {
  const stakingRenderer = ({ days, hours, minutes, seconds, completed }: RendererProps) => {
    if (completed) {
      return <CountDownHeader headerText={completedHeader} apr={apr} subText={completedSubText} />
    } else {
      return (
        <>
          <CountDownHeader headerText={headerText} apr={apr} subText={subText} />
          <Box display='flex' alignItems='center' mt={6}>
            <Tooltip
              label='Provide FOX-ETH liquidity on Uniswap then return here to stake your LP tokens for bonus FOX rewards'
              fontSize='md'
              p={4}
              borderRadius='md'
            >
              <InfoIcon color='primary' w='16px' h='16px' mr={2} />
            </Tooltip>
            <Text color='gray.500'>FOX Bonus Rewards start in</Text>
            <Text color='gray.500' fontWeight='bold' ml='4px'>
              {numFormatter(days)}:{numFormatter(hours)}:{numFormatter(minutes)}:
              {numFormatter(seconds)}
            </Text>
          </Box>
        </>
      )
    }
  }
  return <Countdown date={COUNT_DOWN_TIME} renderer={stakingRenderer} />
}
