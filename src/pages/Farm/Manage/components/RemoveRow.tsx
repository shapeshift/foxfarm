import { Box, BoxProps } from '@chakra-ui/react'

export type RemoveRowComp = {
  Content: React.FC<BoxProps>
}

export const RemoveRow: React.FC<BoxProps> & RemoveRowComp = props => {
  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      px={6}
      py={2}
      {...props}
    />
  )
}

const RowContent: React.FC<BoxProps> = props => (
  <Box display='flex' alignItems='center' {...props} />
)

RemoveRow.Content = RowContent
