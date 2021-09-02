import { Route, Switch } from 'react-router'
import { AirDrop } from 'pages/Airdrop/Airdrop'
import { Farm } from 'pages/Farm/Farm'
import { WalletProvider } from 'state/WalletProvider'
import { NotFound } from 'pages/NotFound/NotFound'

export default function App() {
  return (
    <WalletProvider>
      <Switch>
        <Route path='/airdrop' component={AirDrop} />
        <Route path='/fox-farming' component={Farm} />
        <Route component={NotFound} />
      </Switch>
    </WalletProvider>
  )
}
