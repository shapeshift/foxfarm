import { Pending } from 'pages/Airdrop/ClaimDrawer/components/Pending'
import { Route, Switch } from 'react-router'
import { StakingProvider } from 'state/StakingProvider'
import { Approve } from './Approve'
import { Rewards } from './Rewards'
import { Staking } from './Staking'
import { Unstake } from './Unstake'

export const StakingRoutes = (props: any) => {
  console.info(props, 'STAKING ROUTES')
  return (
    <StakingProvider>
      <Switch>
        <Route
          exact
          path='/fox-farming/liquidity/:liquidityContractAddress/staking/:stakingContractAddress'
          component={Staking}
        />
        <Route
          exact
          path='/fox-farming/liquidity/:liquidityContractAddress/staking/:stakingContractAddress/approve'
          component={Approve}
        />
        <Route
          exact
          path='/fox-farming/liquidity/:liquidityContractAddress/staking/:stakingContractAddress/pending'
          component={Pending}
        />
        <Route
          exact
          path='/fox-farming/liquidity/:liquidityContractAddress/staking/:stakingContractAddress/rewards'
          component={Rewards}
        />
        <Route
          exact
          path='/fox-farming/liquidity/:liquidityContractAddress/staking/:stakingContractAddress/unstake'
          component={Unstake}
        />
      </Switch>
    </StakingProvider>
  )
}
