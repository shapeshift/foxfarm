import { Text, Button, ButtonProps, Box, Heading } from '@chakra-ui/react'
import { ExternalLinkIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { CardContent } from '../../Atoms/CardContent'
import { StakingHeaderBtns } from './StakingHeaderBtns'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { formatBaseAmount } from 'utils/math'
import { bnOrZero } from 'utils/math'
import { ContractParams } from 'state/StakingProvider'

type WalletColProps = ButtonProps & {
  label: string
  text: string
}

const WalletCol = ({ label, onClick, text }: WalletColProps) => (
  <Box flexDir='row' display='flex' justifyContent='space-between' width='100%' mb={4}>
    <Text color='gray.500' fontWeight='bold' fontSize='sm'>
      {label}
    </Text>
    {onClick ? (
      <Button
        variant='link'
        color='primary'
        fontSize='sm'
        rightIcon={<ExternalLinkIcon />}
        onClick={onClick}
      >
        {text}
      </Button>
    ) : (
      <Text fontWeight='bold' fontSize='sm'>
        {text}
      </Text>
    )}
  </Box>
)

export const StakingHeader = ({
  totalUsdcValue,
  userEthHoldings,
  userFoxHoldings,
  stakedBalance,
  unstakedBalance,
  showStaking
}: {
  totalUsdcValue?: string | null
  userEthHoldings?: string | null
  userFoxHoldings?: string | null
  stakedBalance?: string | null
  unstakedBalance?: string | null
  showStaking?: boolean
}) => {
  const history = useHistory()
  const { params } = useRouteMatch<ContractParams>()
  return (
    <CardContent
      borderRightWidth={{ base: 0, md: 1 }}
      borderTopWidth={{ base: 1, md: 0 }}
      borderColor='blackAlpha.100'
      flexDir='column'
      alignItems='flex-start'
      justifyContent='flex-start'
      py={{ base: 4, md: 8 }}
      px={0}
      minWidth={{ base: '100%', md: '350px' }}
      maxWidth='350px'
      minHeight={{ base: 'auto', md: '500px' }}
    >
      <Box px={6} width='100%' mb={6}>
        <Heading as='h5' fontSize='md' mb={6}>
          Pool Details
        </Heading>
        <WalletCol
          label='Liquidity Pool'
          text='FOX-ETH'
          onClick={() =>
            window.open(
              'https://v2.info.uniswap.org/pair/0x470e8de2ebaef52014a47cb5e6af86884947f08c'
            )
          }
        />
        <WalletCol
          label='Pool Balance'
          text={`${formatBaseAmount(userEthHoldings as string, 18)} ETH / ${formatBaseAmount(
            userFoxHoldings as string,
            18
          )} FOX`}
        />
        <WalletCol label='Pool Value' text={`$${Number(totalUsdcValue).toFixed(2)}`} />
        <Button
          variant='link'
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          width='full'
          color='primary'
          fontSize='sm'
          onClick={() =>
            history.push(`/fox-farming/liquidity/${params.liquidityContractAddress}/add`, {
              back: true
            })
          }
          mt={6}
        >
          Manage Liquidity
          <ChevronRightIcon color='blue.500' boxSize={6} />
        </Button>
      </Box>
      {showStaking && (
        <Box pt={6} borderTopWidth={1} borderColor='blackAlpha.100' px={6} width='100%'>
          <Heading as='h5' fontSize='md' mb={6}>
            Staking Details
          </Heading>
          <WalletCol label='Staked Balance' text={`${Number(stakedBalance).toFixed(4)} LP`} />
          <WalletCol label='Available to Stake' text={`${Number(unstakedBalance).toFixed(4)} LP`} />
          <StakingHeaderBtns isDisabled={bnOrZero(stakedBalance).eq(0)} />
        </Box>
      )}
    </CardContent>
  )
}
