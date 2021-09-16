import { FC } from 'react'
import { Button } from '@chakra-ui/button'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { useWallet } from 'state/WalletProvider'

import { WalletCard } from 'Molecules/WalletCard'
import { CheckType } from 'hooks/useCheckEligible'

interface WalletBtnProps {
  checkEligible: () => void
  loading: { loading: boolean; type: CheckType | null }
}

export const WalletButton: FC<WalletBtnProps> = ({ checkEligible, loading }) => {
  const { state, connect } = useWallet()
  const { isConnected } = state

  return (
    <>
      <Flex
        borderRadius='10px'
        bg='gray.100'
        flex={1}
        width='100%'
        justifyContent='space-between'
        flexWrap='wrap'
        alignItems='center'
        onClick={connect}
        _hover={{ cursor: 'pointer', bg: 'gray.200' }}
      >
        {isConnected ? (
          <Flex
            alignItems='center'
            justifyContent='space-between'
            width='100%'
            flexDir={{ base: 'column', sm: 'row' }}
          >
            <WalletCard />
            <Box my='3' flex={1} textAlign='center' width='100%' px={{ base: 4, md: 0 }}>
              <Button
                width={{ base: '100%', md: 'auto' }}
                size='sm'
                paddingLeft={3}
                paddingRight={3}
                isLoading={loading.loading && loading.type === CheckType.WALLET}
                isDisabled={loading.loading && loading.type !== CheckType.WALLET}
                loadingText='Checking'
                onClick={e => {
                  e.stopPropagation()
                  checkEligible()
                }}
                _loading={{ _disabled: { bg: 'blue.500' } }}
                rightIcon={<ChevronRightIcon color='white' h={6} w={6} />}
              >
                Check Eligibility
              </Button>
            </Box>
          </Flex>
        ) : (
          <>
            <Text ml='6' mr='auto' my='5'>
              Connect Wallet
            </Text>
            <ChevronRightIcon mr='6' color='primary' h={4} w={4} />
          </>
        )}
      </Flex>
    </>
  )
}
