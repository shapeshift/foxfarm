import { RouterProps } from 'react-router'
import { Text } from '@chakra-ui/react'
import { CardContent } from '../../Atoms/CardContent'
import { NavLink } from 'Atoms/NavLink'
import { PendingIconGroup } from 'Organisims/PendingIconGroup'
import { ContractParams, useStaking } from 'state/StakingProvider'
import { ViewOnChainLink } from 'Molecules/ViewOnChainLink'
import { TxStatus, usePendingTx } from 'hooks/usePendingTx'
import { useEffect } from 'react'
import { useRouteMatch } from 'react-router-dom'

export const Pending = ({ history }: RouterProps) => {
  const { stakeTxID, setStakeTxID } = useStaking()
  const pendingTx = usePendingTx(stakeTxID)
  const { params } = useRouteMatch<ContractParams>()

  useEffect(() => {
    let ignore = false
    if (!ignore) {
      if (stakeTxID && pendingTx === TxStatus.SUCCESS) {
        setStakeTxID(null)
        history.push(
          `/fox-farming/liquidity/${params.liquidityContractAddress}/staking/${params.stakingContractAddress}/rewards`,
          { staked: true }
        )
      }
    }
    return () => {
      ignore = true
    }
  }, [
    history,
    params.liquidityContractAddress,
    params.stakingContractAddress,
    pendingTx,
    setStakeTxID,
    stakeTxID
  ])

  return (
    <CardContent>
      <PendingIconGroup mb={10} mt={8} />
      <>
        <Text mb={4} fontSize='2xl' textAlign='center' w='350px'>
          Staking your LP Tokens...
        </Text>
        {stakeTxID && <ViewOnChainLink txId={stakeTxID} />}
      </>
      <NavLink
        to={`/fox-farming/liquidity/${params.liquidityContractAddress}/staking/${params.stakingContractAddress}`}
        color='gray.500'
      >
        Cancel
      </NavLink>
    </CardContent>
  )
}
