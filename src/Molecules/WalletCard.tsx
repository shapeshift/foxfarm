import { CloseButton, Flex, Image, Box, Text, FlexProps, Button } from '@chakra-ui/react'
import { useWallet } from 'state/WalletProvider'
import { shortenAddress } from 'utils/helpers'

export const WalletCard = ({
  addressLength = 6,
  allowChange = false,
  ...rest
}: { addressLength?: number; allowChange?: boolean } & FlexProps) => {
  const { state, disconnect, connect } = useWallet()
  const { wallet, account } = state
  return (
    <Flex flexBasis='58%' alignItems='center' my='3' flex={1} width='100%' {...rest}>
      {!allowChange && (
        <CloseButton
          onClick={e => {
            e.stopPropagation()
            disconnect()
          }}
        />
      )}
      <Image
        maxW='28px'
        maxH='28px'
        src={
          wallet?.icons?.svg
            ? `data:image/svg+xml;base64,${btoa(wallet.icons.svg)}`
            : wallet?.icons?.iconSrc
        }
      />
      <Box ml='3'>
        <Text fontWeight='bold'>{wallet?.name}</Text>
        <Text>{account && shortenAddress(account, addressLength)}</Text>
      </Box>
      {allowChange && (
        <Button size='sm' variant='solid' ml='auto' bg='transparent' onClick={() => connect()}>
          Change
        </Button>
      )}
    </Flex>
  )
}
