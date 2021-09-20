import {
  Heading,
  Text,
  AlertDescription,
  Box,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  AlertIcon,
  Alert,
  AlertTitle,
  Link,
  Button
} from '@chakra-ui/react'
import { Card } from 'components/Card/Card'
import { useCallback, useEffect } from 'react'
import { AssetRow } from './components/AssetRow'
import { useWallet } from 'state/WalletProvider'
import { bn, formatBaseAmount, fromBaseUnit, toBaseUnit, toDisplayAmount } from 'utils/math'
import erc20Abi from 'abis/erc20Abi.json'
import { TokenField, useLp } from 'state/LpProvider'
import { useApprove } from 'hooks/useApprove'
import { useContract } from 'hooks/useContract'
import { FOX_TOKEN_CONTRACT_ADDRESS, MAX_ALLOWANCE, UNISWAP_V2_ROUTER } from 'lib/constants'
import { AddButton } from './components/AddButton'
import { RouteComponentProps } from 'react-router-dom'
import { ViewOnChainLink } from 'Molecules/ViewOnChainLink'
import { AddRemoveTabs } from './components/AddRemoveTabs'
import { ArrowBackIcon } from '@chakra-ui/icons'

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)

type AddProps = RouteComponentProps & { location?: { state?: { back?: boolean } } }

export const Add = ({ history, match, location }: AddProps) => {
  const { state: wallet, connect } = useWallet()
  const { state: lpState, onUserInput, addLiquidity } = useLp()
  const foxContract = useContract(
    wallet.provider,
    wallet.account,
    FOX_TOKEN_CONTRACT_ADDRESS,
    erc20Abi
  )
  const approval = useApprove(
    foxContract,
    UNISWAP_V2_ROUTER,
    toBaseUnit(lpState.A.amount as string, 18),
    MAX_ALLOWANCE
  )

  const formatter = useCallback(
    (field: TokenField, nextUserInput: string) => {
      if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        onUserInput(field, nextUserInput)
      }
    },
    [onUserInput]
  )

  const handleMax = useCallback(
    (field: TokenField) => {
      if (field === TokenField.B) {
        onUserInput(
          field,
          bn(fromBaseUnit(lpState.B.balance as string, 18)).gt(bn(0.01))
            ? bn(fromBaseUnit(lpState.B.balance as string, 18))
                .minus(bn(0.01))
                .toFixed()
            : bn(fromBaseUnit(lpState.B.balance as string, 18)).toFixed()
        )
      } else {
        onUserInput(field, fromBaseUnit(lpState.A.balance as string, 18))
      }
    },
    [lpState.A.balance, lpState.B.balance, onUserInput]
  )

  useEffect(() => {
    if (!lpState.confirming && lpState.lpTxHash) history.push('/fox-farming/liquidity/pending')
  }, [history, lpState.confirming, lpState.lpTxHash])

  useEffect(() => {
    onUserInput(TokenField.A, '')
    // this only once to remove any residual state from provider
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card flexDir='column' maxW='500px' position='relative'>
      <Card.Body>
        <AddRemoveTabs match={match} history={history} back={location?.state?.back ?? false} />
        <Alert
          variant='left-accent'
          borderRadius='lg'
          colorScheme='blue'
          flexDirection='column'
          alignItems='flex-start'
        >
          <AlertDescription fontSize='sm'>
            <strong>Tip:</strong> When you add liquidity, you will receive pool tokens representing
            your position. These tokens automatically earn fees proportional to your share of the
            pool, and can be redeemed at any time.
          </AlertDescription>
          <Link
            href='https://shapeshift.zendesk.com/hc/en-us/articles/4404019905677'
            mt={2}
            isExternal
            fontSize='sm'
            color='primary'
          >
            Learn More
          </Link>
        </Alert>
        <Box width='full' mt={6}>
          <AssetRow
            src='https://static.coincap.io/assets/icons/256/fox.png'
            symbol={lpState.A.symbol}
            balance={formatBaseAmount(lpState.A.balance as string, 18)}
            inputProps={{
              value:
                lpState.independentField === TokenField.A
                  ? (lpState.A.amount as string)
                  : toDisplayAmount(lpState.A.amount as string, 18),
              onChange: e => formatter(TokenField.A, e.target.value.replace(/,/g, '.'))
            }}
            buttonProps={{
              onClick: () => handleMax(TokenField.A)
            }}
          />
          <Box display='flex' alignItems='center' my={2}>
            <Box flex={1} bg='blackAlpha.50' height='1px' />
            <Text fontWeight='bold' color='blackAlpha.300' mx={4}>
              +
            </Text>
            <Box flex={1} bg='blackAlpha.50' height='1px' />
          </Box>
          <AssetRow
            src='https://static.coincap.io/assets/icons/256/eth.png'
            symbol={lpState.B.symbol}
            balance={formatBaseAmount(lpState.B.balance as string, 18)}
            inputProps={{
              value:
                lpState.independentField === TokenField.B
                  ? (lpState.B.amount as string)
                  : toDisplayAmount(lpState.B.amount as string, 18),
              onChange: e => formatter(TokenField.B, e.target.value.replace(/,/g, '.'))
            }}
            buttonProps={{
              onClick: () => handleMax(TokenField.B)
            }}
          />
        </Box>
        <Box
          bg='gray.50'
          borderRadius='lg'
          mt={6}
          width='full'
          borderWidth={1}
          borderColor='gray.200'
        >
          <Heading
            as='h5'
            fontSize='sm'
            fontWeight='bold'
            textAlign='center'
            borderBottom='1px'
            borderColor='gray.100'
            py={2}
            mb={2}
          >
            Prices and Pool Share
          </Heading>
          <StatGroup
            w='full'
            display='flex'
            alignItems='space-between'
            flexDirection={{ base: 'column', md: 'row' }}
            py={2}
          >
            <Stat textAlign='center' mb='3'>
              <StatNumber fontSize='lg'>
                {lpState?.ethPerFox ? toDisplayAmount(lpState.ethPerFox, 18) : '-'}
              </StatNumber>
              <StatLabel color='gray.500'>ETH per FOX</StatLabel>
            </Stat>
            <Stat textAlign='center' mb='3'>
              <StatNumber fontSize='lg'>
                {lpState?.foxPerEth ? toDisplayAmount(lpState.foxPerEth, 18) : '-'}
              </StatNumber>
              <StatLabel color='gray.500'>FOX per ETH</StatLabel>
            </Stat>
            <Stat textAlign='center'>
              <StatNumber fontSize='lg'>
                {bn(lpState?.poolShare as string).lt(0.01) &&
                bn(lpState?.poolShare as string).gt(bn(0))
                  ? '< 0.01%'
                  : bn(lpState?.poolShare as string).gt(0)
                  ? `${toDisplayAmount(lpState.poolShare as string, 18)}%`
                  : '-'}
              </StatNumber>
              <StatLabel color='gray.500'>Share of Pool</StatLabel>
            </Stat>
          </StatGroup>
        </Box>
        {(lpState.error || approval.error) && (
          <Alert
            status={lpState?.error?.code === 100 ? 'warning' : 'error'}
            borderRadius='6'
            mt='4'
          >
            <AlertIcon />
            <AlertTitle mr={2}>
              {approval?.error?.message
                ? approval.error.message
                : typeof approval.error === 'string'
                ? approval.error
                : lpState?.error?.message
                ? lpState.error.message
                : 'Something went wrong. Please try again'}
            </AlertTitle>
          </Alert>
        )}
        <AddButton
          isConnected={wallet.isConnected}
          connect={connect}
          walletName={wallet.wallet?.name as string}
          approval={approval}
          sendTx={addLiquidity}
          txConfirming={lpState.confirming}
          tokenA={lpState[TokenField.A]}
          tokenB={lpState[TokenField.B]}
        />
        {!approval.approved && approval?.txHash && (
          <ViewOnChainLink txId={approval?.txHash} mt={4} mb={0} />
        )}
        {location?.state?.back && (
          <Button
            w='full'
            variant='ghost'
            leftIcon={<ArrowBackIcon />}
            onClick={() => history?.push('/fox-farming')}
            mt={4}
          >
            Back
          </Button>
        )}
      </Card.Body>
    </Card>
  )
}
