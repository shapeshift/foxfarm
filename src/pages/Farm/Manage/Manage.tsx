import { Route } from 'react-router-dom'
import { LpProvider } from 'state/LpProvider'
import { Add } from './Add'
import { AddingLiquidity } from './AddingLiquidity'
import { Remove } from './Remove'

export const Manage = () => {
  return (
    <LpProvider>
      <Route path='/fox-farming/liquidity/add' component={Add} />
      <Route path='/fox-farming/liquidity/remove' component={Remove} />
      <Route path='/fox-farming/liquidity/pending' component={AddingLiquidity} />
    </LpProvider>
  )
}
