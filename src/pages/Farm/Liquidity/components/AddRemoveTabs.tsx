import { Button, ButtonProps, Flex } from '@chakra-ui/react'
import { RouteChildrenProps } from 'react-router-dom'
import { lpUrlFormatter } from 'utils/helpers'
import { LiquidityRouteProps } from '../Remove'

const TabButton = ({ ...props }: ButtonProps) => {
  return (
    <Button
      mr='0'
      w='full'
      borderRadius='30'
      px='6'
      color='gray.500'
      colorScheme='gray'
      _active={{ bg: 'blue.500', color: 'white' }}
      {...props}
    />
  )
}

type TabProps = Partial<RouteChildrenProps> & { back: boolean } & Pick<LiquidityRouteProps, 'match'>

export const AddRemoveTabs = ({ match, history, back }: TabProps) => {
  return (
    <Flex mx='auto' maxW='400px' borderRadius='30' bg='gray.100' mb='6'>
      <TabButton
        onClick={() =>
          history?.replace(
            lpUrlFormatter(
              'lp-add',
              match.params.liquidityContractAddress,
              match.params.stakingContractAddress
            ),
            {
              back
            }
          )
        }
        isActive={
          match?.path === `/fox-farming/liquidity/${match.params.liquidityContractAddress}/lp-add`
        }
      >
        Add Liquidity
      </TabButton>
      <TabButton
        onClick={() =>
          history?.replace(
            lpUrlFormatter(
              'lp-remove',
              match.params.liquidityContractAddress,
              match.params.stakingContractAddress
            ),
            {
              back
            }
          )
        }
        isActive={
          match?.path ===
            `/fox-farming/liquidity/${match.params.liquidityContractAddress}/lp-remove` ||
          match?.path ===
            `/fox-farming/liquidity/${match.params.liquidityContractAddress}/staking/${match.params.stakingContractAddress}/lp-remove`
        }
      >
        Remove Liquidity
      </TabButton>
    </Flex>
  )
}
