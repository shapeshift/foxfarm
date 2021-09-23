import { Route, Switch } from 'react-router'
import { LpProvider } from 'state/LpProvider'
import { Add } from './Add'
import { AddingLiquidity } from './AddingLiquidity'
import { Remove } from './Remove'
import { StakingRoutes } from '../StakingRoutes'
import { stakingContracts } from 'lib/constants'
import { useMemo } from 'react'
import { NotFound } from 'pages/NotFound/NotFound'
import { supportedContractsPath } from 'utils/helpers'

export const LiquidityRoutes = () => {
  const supportedContracts = useMemo(() => {
    return supportedContractsPath(stakingContracts)
  }, [])

  return (
    <LpProvider>
      <Switch>
        <Route path='/fox-farming/liquidity/:liquidityContractAddress/lp-add' component={Add} />
        <Route
          path='/fox-farming/liquidity/:liquidityContractAddress/lp-remove'
          component={Remove}
        />
        <Route
          path='/fox-farming/liquidity/:liquidityContractAddress/lp-pending'
          component={AddingLiquidity}
        />
        <Route
          path={`/fox-farming/liquidity/:liquidityContractAddress/staking/:stakingContractAddress${supportedContracts}`}
          component={StakingRoutes}
        />
        <Route component={NotFound} />
      </Switch>
    </LpProvider>
  )
}
