import { ExternalLinkIcon } from '@chakra-ui/icons'
import { Button, ButtonProps } from '@chakra-ui/react'

type ViewOnChainLinkProps = { txId: string } & ButtonProps

export const ViewOnChainLink = ({ txId, ...rest }: ViewOnChainLinkProps) => (
  <Button
    variant='link'
    color='primary'
    rightIcon={<ExternalLinkIcon />}
    onClick={() => {
      window.open(`https://etherscan.io/tx/${txId}`)
    }}
    mb={12}
    {...rest}
  >
    VIEW ON CHAIN
  </Button>
)
