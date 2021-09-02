import { Button, ButtonProps, Flex } from '@chakra-ui/react'
import { RouteChildrenProps } from 'react-router-dom'

const TabButton = ({ ...props }: ButtonProps) => {
  return (
    <Button
      mr='0'
      w='full'
      borderRadius='30'
      px='6'
      color='gray.500'
      _active={{ bg: 'primary', color: 'white' }}
      {...props}
    />
  )
}

type TabProps = Partial<RouteChildrenProps> & { back: boolean }

export const AddRemoveTabs = ({ match, history, back }: TabProps) => {
  return (
    <Flex mx='auto' maxW='400px' borderRadius='30' bg='gray.100' mb='6'>
      <TabButton
        onClick={() =>
          history?.replace('/fox-farming/liquidity/add', {
            back
          })
        }
        isActive={match?.path === '/fox-farming/liquidity/add'}
      >
        Add Liquidity
      </TabButton>
      <TabButton
        onClick={() =>
          history?.replace('/fox-farming/liquidity/remove', {
            back
          })
        }
        isActive={match?.path === '/fox-farming/liquidity/remove'}
      >
        Remove Liquidity
      </TabButton>
    </Flex>
  )
}
