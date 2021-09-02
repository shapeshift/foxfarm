import { FC } from 'react'
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Flex, Text, Image, HStack, FlexProps } from '@chakra-ui/react'
import { useWallet } from 'state/WalletProvider'
import { shortenAddress } from 'utils/helpers'

export const WalletButton: FC<FlexProps> = props => {
  const { state, connect } = useWallet()
  const { isConnected, wallet, account } = state

  return (
    <Flex
      borderRadius='full'
      bg='whiteAlpha.400'
      justifyContent='space-between'
      p={1}
      color='white'
      alignItems='center'
      onClick={connect}
      _hover={{ cursor: 'pointer', bg: 'whiteAlpha.500' }}
      {...props}
    >
      {isConnected ? (
        <HStack>
          <Image
            maxW='28px'
            maxH='28px'
            ml={2}
            src={
              wallet?.icons?.svg
                ? `data:image/svg+xml;base64,${btoa(wallet.icons.svg)}`
                : wallet?.icons?.iconSrc
            }
          />
          <Text fontSize='sm'>{account && shortenAddress(account, 4)}</Text>
          <ChevronDownIcon h={8} w={8} />
        </HStack>
      ) : (
        <>
          <Text fontSize='sm' ml={2}>
            Connect Wallet
          </Text>
          <ChevronRightIcon h={8} w={8} />
        </>
      )}
    </Flex>
  )
}
