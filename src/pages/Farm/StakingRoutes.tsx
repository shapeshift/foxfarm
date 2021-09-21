import { Pending } from 'pages/Airdrop/ClaimDrawer/components/Pending'
import { Route, Switch } from 'react-router'
import { StakingProvider } from 'state/StakingProvider'
import { Approve } from './Approve'
import { Add } from './Liquidity/Add'
import { AddingLiquidity } from './Liquidity/AddingLiquidity'
import { GetStarted } from './Liquidity/GetStarted'
import { Remove } from './Liquidity/Remove'
import { Rewards } from './Rewards'
import { Staking } from './Staking'
import { Unstake } from './Unstake'

export const StakingRoutes = () => {
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
        <Route
          exact
          path='/fox-farming/liquidity/:liquidityContractAddress/staking/:stakingContractAddress/get-started'
          component={GetStarted}
        />
        <Route
          exact
          path='/fox-farming/liquidity/:liquidityContractAddress/staking/:stakingContractAddress/lp-add'
          component={Add}
        />
        <Route
          exact
          path='/fox-farming/liquidity/:liquidityContractAddress/staking/:stakingContractAddress/lp-remove'
          component={Remove}
        />
        <Route
          exact
          path='/fox-farming/liquidity/:liquidityContractAddress/staking/:stakingContractAddress/lp-pending'
          component={AddingLiquidity}
        />
      </Switch>
    </StakingProvider>
  )
}
