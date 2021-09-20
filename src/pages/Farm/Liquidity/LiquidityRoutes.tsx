import { Route, Switch } from 'react-router'
import { LpProvider } from 'state/LpProvider'
import { Add } from './Add'
import { AddingLiquidity } from './AddingLiquidity'
import { Remove } from './Remove'
import { StakingRoutes } from '../StakingRoutes'

export const LiquidityRoutes = () => {
  return (
    <LpProvider>
      <Switch>
        <Route path='/fox-farming/liquidity/:liquidityContractAddress/add' component={Add} />
        <Route path='/fox-farming/liquidity/:liquidityContractAddress/remove' component={Remove} />
        <Route
          path='/fox-farming/liquidity/:liquidityContractAddress/pending'
          component={AddingLiquidity}
        />
        <Route
          path='/fox-farming/liquidity/:liquidityContractAddress/staking/:stakingContractAddress'
          component={StakingRoutes}
        />
      </Switch>
    </LpProvider>
  )
}
