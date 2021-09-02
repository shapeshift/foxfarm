import { FoxIcon } from 'Atoms/Icons/FoxIcon'
import { LinkIcon } from '@chakra-ui/icons'
import { Spinner, Center, Box, Text, Link, Flex } from '@chakra-ui/react'
export const Pending = ({ claimTxHash }: { claimTxHash?: string | null }) => {
  return (
    <>
      <Center position='relative'>
        <Spinner
          thickness='10px'
          speed='3s'
          emptyColor='gray.300'
          color='primary'
          w='9rem'
          h='9rem'
        />
        <Box
          borderRadius='50%'
          bg='primary'
          position='absolute'
          left='50%'
          top='50%'
          transform='translate(-50%, -50%)'
          h='104px'
          w='104px'
        >
          <FoxIcon
            boxSize='56px'
            position='absolute'
            left='50%'
            top='50%'
            transform='translate(-50%, -45%)'
            color='white'
          />
        </Box>
      </Center>
      <Text fontSize='xl' fontWeight='semibold' mb={4} mt={4}>
        Claim Processing...
      </Text>
      {claimTxHash && (
        <Link isExternal href={`https://etherscan.io/tx/${claimTxHash}`} mb={16}>
          <Flex alignItems='center' color='primary' fontWeight='semibold'>
            <Text fontSize='md' mr={2}>
              View on chain
            </Text>
            <LinkIcon />
          </Flex>
        </Link>
      )}
    </>
  )
}
