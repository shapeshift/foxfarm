import { LinkIcon } from '@chakra-ui/icons'
import { Box, Flex, Link, Text } from '@chakra-ui/react'
import { shortenAddress } from 'utils/helpers'
import { ClaimPanel } from './ClaimRow'

type ClaimInfoProps = {
  address: string | null
  foxPrice: string | null
  usdValue: string | null
  foxAmount?: string | null
  txHash?: string | null
}

export const ClaimInfo = ({ address, foxPrice, usdValue, foxAmount, txHash }: ClaimInfoProps) => {
  return (
    <ClaimPanel mb={6}>
      <ClaimPanel.Row borderTopWidth={0}>
        <ClaimPanel.Label pr={1}>FOX will be sent to</ClaimPanel.Label>
        <Text>{address && shortenAddress(address, 8)}</Text>
      </ClaimPanel.Row>
      {txHash && (
        <ClaimPanel.Row>
          <ClaimPanel.Label>Transaction</ClaimPanel.Label>
          <Link isExternal href={`https://etherscan.io/tx/${txHash}`}>
            <Flex alignItems='center' color='primary' fontWeight='semibold'>
              <Text fontSize='md' mr={2}>
                View on chain
              </Text>
              <LinkIcon />
            </Flex>
          </Link>
        </ClaimPanel.Row>
      )}
      <ClaimPanel.Row>
        <Box>
          <ClaimPanel.Label>Airdrop Value</ClaimPanel.Label>
          {foxPrice && (
            <Text color='whiteAlpha.600' fontSize='xs'>
              1 FOX = ${foxPrice}
            </Text>
          )}
        </Box>
        <Box textAlign='right'>
          <Text>{foxAmount} FOX</Text>
          {foxPrice && <ClaimPanel.Label>${usdValue}</ClaimPanel.Label>}
        </Box>
      </ClaimPanel.Row>
    </ClaimPanel>
  )
}
