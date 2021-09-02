import React, { useCallback, useEffect } from 'react'
import {
  Heading,
  Text,
  Box,
  Button,
  Image,
  ButtonGroup,
  Stack,
  AvatarGroup,
  Avatar,
  AvatarBadge,
  Alert,
  AlertIcon,
  AlertTitle
} from '@chakra-ui/react'
import { CardContainer } from 'Atoms/CardContainer'
import { CardContent } from 'Atoms/CardContent'
import { useState } from 'react'
import { Slider } from './components/Slider'
import { RemoveRow } from './components/RemoveRow'
import { useStaking } from 'state/StakingProvider'
import { bn, formatBaseAmount, fromBaseUnit, toBaseUnit, toDisplayAmount } from 'utils/math'
import { LpActions, TokenField, useLp } from 'state/LpProvider'
import { useApprove } from 'hooks/useApprove'
import { MAX_ALLOWANCE, UNISWAP_V2_ROUTER } from 'lib/constants'
import { RemoveButton } from './components/RemoveButton'
import { useWallet } from 'state/WalletProvider'
import { useCoinCapPrice } from 'hooks/useCoinCapPrice'
import { AddRemoveTabs } from './components/AddRemoveTabs'
import { RouteComponentProps } from 'react-router-dom'
import { ViewOnChainLink } from 'Molecules/ViewOnChainLink'
import { TxStatus, usePendingTx } from 'hooks/usePendingTx'
import { ArrowBackIcon } from '@chakra-ui/icons'

type RemoveProps = RouteComponentProps & { location?: { state?: { back?: boolean } } }

export const Remove = ({ match, history, location }: RemoveProps) => {
  const [percentage, setPercentage] = useState(25)
  const { userEthHoldings, userFoxHoldings, userLpBalance, uniswapLPContract } = useStaking()
  const { state: lpState, dispatch, removeLiquidity } = useLp()
  const { state: wallet, connect } = useWallet()
  const pendingTx = usePendingTx(lpState.lpTxHash)
  const ethPrice = useCoinCapPrice('ethereum')
  const foxPrice = useCoinCapPrice('fox-token')
  const approval = useApprove(
    uniswapLPContract,
    UNISWAP_V2_ROUTER,
    userLpBalance?.toString() as string,
    MAX_ALLOWANCE
  )

  const setAmounts = useCallback(() => {
    const foxAmount = bn(percentage)
      .dividedBy(bn(100))
      .times(bn(userFoxHoldings as string))
      .toFixed()
    dispatch({
      type: LpActions.SET_TOKEN_AMOUNT,
      payload: { field: TokenField.A, amount: fromBaseUnit(foxAmount, 18) }
    })
    const ethAmount = bn(percentage)
      .dividedBy(bn(100))
      .times(bn(userEthHoldings as string))
      .toFixed()
    dispatch({
      type: LpActions.SET_TOKEN_AMOUNT,
      payload: { field: TokenField.B, amount: fromBaseUnit(ethAmount, 18) }
    })
  }, [dispatch, percentage, userEthHoldings, userFoxHoldings])

  const foxUsd = toDisplayAmount(
    bn(lpState.A.amount as string)
      .times(bn(foxPrice as string))
      .toFixed(),
    18
  )

  const ethUsd = toDisplayAmount(
    bn(lpState.B.amount as string)
      .times(bn(ethPrice as string))
      .toFixed(),
    18
  )

  const remainingLpTokens = formatBaseAmount(
    bn(userLpBalance?.toString() as string)
      .minus(bn(lpState.lpBurnAmount as string))
      .toFixed(),
    18
  )

  const onValueChange = (value: number) => {
    setPercentage(Math.floor(value))
  }

  const onPressBtn = (value: number) => {
    setPercentage(value)
  }

  useEffect(() => {
    if (userFoxHoldings && userEthHoldings) {
      setAmounts()
    }
  }, [percentage, setAmounts, userEthHoldings, userFoxHoldings])

  useEffect(() => {
    const lpTokensBurned =
      percentage === 100
        ? userLpBalance?.toString()
        : bn(toBaseUnit(lpState.A.amount as string, 18))
            .times(bn(lpState.totalSupply as string))
            .dividedBy(bn(lpState.foxPoolBalance as string))
            .decimalPlaces(0)
            .toFixed()
    dispatch({ type: LpActions.SET_LP_BURN_AMOUNT, payload: lpTokensBurned as string })
  }, [
    dispatch,
    lpState.A.amount,
    lpState.foxPoolBalance,
    lpState.totalSupply,
    percentage,
    userLpBalance
  ])

  useEffect(() => {
    let ignore = false
    if (!ignore && lpState.lpTxHash && pendingTx === TxStatus.SUCCESS) {
      dispatch({ type: LpActions.SET_TX_HASH, payload: null })
      history.push('/fox-farming')
    }
    return () => {
      ignore = true
    }
  }, [dispatch, history, lpState.lpTxHash, pendingTx])

  const renderButtons = (percentage: number) => {
    // Value in percentage terms
    const data = [{ label: 25 }, { label: 50 }, { label: 75 }, { label: 100 }]

    return data.map(button => (
      <Button
        key={button.label}
        {...button}
        onClick={() => onPressBtn(button.label)}
        isActive={percentage === button.label}
      >
        {button.label}%
      </Button>
    ))
  }

  return (
    <CardContainer flexDir='column' maxW='500px' position='relative'>
      <CardContent>
        <AddRemoveTabs match={match} history={history} back={location?.state?.back ?? false} />

        <Box display='flex' color='secondary' fontSize='sm' mb={2}>
          <Text mr={1}>Available To Remove:</Text>
          <Text>
            {formatBaseAmount(userFoxHoldings as string, 18)} FOX /{' '}
            {formatBaseAmount(userEthHoldings as string, 18)} ETH
          </Text>
        </Box>
        <Text fontSize='5xl'>{percentage}%</Text>
        <Slider min={0} max={100} defaultValue={25} value={percentage} onChange={onValueChange} />
        <ButtonGroup
          spacing={6}
          mt={6}
          variant='toggle'
          justifyContent='space-between'
          width='full'
        >
          {renderButtons(percentage)}
        </ButtonGroup>
        <Box
          bg='gray.50'
          borderRadius='lg'
          mt={8}
          width='full'
          borderWidth={1}
          borderColor='gray.200'
        >
          <Heading as='h5' fontSize='sm' fontWeight='bold' textAlign='center' py={2} mb={2}>
            You Will Recieve
          </Heading>
          <Stack divider={<Box height='1px' bg='gray.300' />}>
            <RemoveRow>
              <RemoveRow.Content>
                <Image boxSize='35px' src='https://static.coincap.io/assets/icons/256/fox.png' />
                <Text color='secondary' ml={2}>
                  FOX to Remove
                </Text>
              </RemoveRow.Content>
              <RemoveRow.Content flexDir='column' alignItems='flex-end'>
                {foxPrice && foxUsd && <Text fontWeight='bold'>${foxUsd}</Text>}
                <Text color='secondary'>
                  {bn(lpState.A.amount as string).gt(0)
                    ? toDisplayAmount(lpState.A.amount as string, 18)
                    : '0'}{' '}
                  FOX
                </Text>
              </RemoveRow.Content>
            </RemoveRow>
            <RemoveRow>
              <RemoveRow.Content>
                <Image boxSize='35px' src='https://static.coincap.io/assets/icons/256/eth.png' />
                <Text color='secondary' ml={2}>
                  ETH to Remove
                </Text>
              </RemoveRow.Content>
              <RemoveRow.Content flexDir='column' alignItems='flex-end'>
                {ethPrice && ethUsd && <Text fontWeight='bold'>${ethUsd}</Text>}
                <Text color='secondary'>
                  {bn(lpState.B.amount as string).gt(0)
                    ? toDisplayAmount(lpState.B.amount as string, 18)
                    : '0'}{' '}
                  ETH
                </Text>
              </RemoveRow.Content>
            </RemoveRow>
          </Stack>
        </Box>
        <Box
          bg='gray.50'
          borderRadius='lg'
          mt={6}
          width='full'
          borderWidth={1}
          borderColor='gray.200'
        >
          <Heading as='h5' fontSize='sm' fontWeight='bold' textAlign='center' py={2} mb={2}>
            You Will Still Have
          </Heading>
          <Stack divider={<Box height='1px' bg='gray.300' />}>
            <RemoveRow>
              <RemoveRow.Content>
                <AvatarGroup size='sm'>
                  <Avatar src='https://static.coincap.io/assets/icons/256/fox.png'>
                    <AvatarBadge boxSize='1.25em'>
                      <Image src='https://static.coincap.io/assets/icons/256/uni.png' />
                    </AvatarBadge>
                  </Avatar>
                  <Avatar src='https://static.coincap.io/assets/icons/256/eth.png' />
                </AvatarGroup>
                <Text color='secondary' ml={2}>
                  FOX-ETH
                </Text>
              </RemoveRow.Content>
              <RemoveRow.Content flexDir='column' alignItems='flex-end'>
                <Text fontWeight='bold'>{remainingLpTokens ?? '0'} LP Tokens</Text>
              </RemoveRow.Content>
            </RemoveRow>
          </Stack>
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
        <RemoveButton
          isConnected={wallet.isConnected}
          connect={connect}
          walletName={wallet.wallet?.name as string}
          approval={approval}
          sendTx={removeLiquidity}
          txHash={lpState?.lpTxHash}
          txConfirming={lpState.confirming}
          tokenA={lpState[TokenField.A]}
          tokenB={lpState[TokenField.B]}
        />
        {!approval.approved && approval?.txHash && (
          <ViewOnChainLink txId={approval.txHash} mt={4} mb={0} />
        )}
        {approval.approved && lpState?.lpTxHash && (
          <ViewOnChainLink txId={lpState.lpTxHash} mt={4} mb={0} />
        )}
        {location?.state?.back && (
          <Button
            w='full'
            variant='secondary'
            leftIcon={<ArrowBackIcon />}
            onClick={() => history?.push('/fox-farming')}
            mt={4}
          >
            Back
          </Button>
        )}
      </CardContent>
    </CardContainer>
  )
}
