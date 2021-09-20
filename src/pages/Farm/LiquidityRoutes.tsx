import { Route, Switch } from 'react-router'
import { Manage } from './Manage/Manage'
import { StakingRoutes } from './StakingRoutes'

export const LiquidityRoutes = (props: any) => {
  console.info(props, 'Liquidity Proutes')
  return (
    <Switch>
      <Route exact path='/fox-farming/liquidity/:liquidityContractAddress' component={Manage} />
      <Route
        path='/fox-farming/liquidity/:liquidityContractAddress/staking/:stakingContractAddress'
        component={StakingRoutes}
      />
    </Switch>
  )
}
