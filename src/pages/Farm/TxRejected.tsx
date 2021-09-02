import { Text } from '@chakra-ui/react'

export const TxRejected = ({ rejected }: { rejected: Error | null }) => {
  return (
    <>
      {rejected && (
        <Text p={2} color='red.400'>
          {rejected?.message
            ? rejected.message
            : typeof rejected === 'string'
            ? rejected
            : 'Transaction rejected on wallet. Try again.'}
        </Text>
      )}
    </>
  )
}
