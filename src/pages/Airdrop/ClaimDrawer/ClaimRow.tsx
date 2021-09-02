import { Flex, FlexProps, Text, TextProps, Box, BoxProps } from '@chakra-ui/react'

type ClaimPanelComp = {
  Row: React.FC<FlexProps>
  Label: React.FC<TextProps>
}

export const ClaimPanel: React.FC<BoxProps> & ClaimPanelComp = props => (
  <Box bg='whiteAlpha.100' borderRadius='lg' {...props} width='full' />
)

const ClaimRow = ({ children, ...props }: FlexProps) => (
  <Flex
    align='center'
    justify='space-between'
    p={4}
    borderTopWidth={1}
    borderColor='whiteAlpha.100'
    style={{ backdropFilter: 'blur(15px)' }}
    w='full'
    {...props}
  >
    {children}
  </Flex>
)
const ClaimLabel: React.FC<TextProps> = props => (
  <Text color='whiteAlpha.600' fontWeight='bold' {...props} />
)

ClaimPanel.Row = ClaimRow
ClaimPanel.Label = ClaimLabel
