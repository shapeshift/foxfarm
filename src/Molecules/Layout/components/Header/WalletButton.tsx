import { FC } from 'react'
import { ChevronRightIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Text, Image, HStack, ButtonProps, Button } from '@chakra-ui/react'
import { useWallet } from 'state/WalletProvider'
import { shortenAddress } from 'utils/helpers'

export const WalletButton: FC<ButtonProps> = props => {
  const { state, connect } = useWallet()
  const { isConnected, wallet, account } = state

  return (
    <Button colorScheme='whiteAlpha' onClick={connect} {...props}>
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
          <Text ml={2}>Connect Wallet</Text>
          <ChevronRightIcon boxSize={6} />
        </>
      )}
    </Button>
  )
}
