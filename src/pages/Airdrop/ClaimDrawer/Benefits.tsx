import { Route, Switch } from 'react-router'
import { DrawerSteps } from './ClaimDrawer'
import { BenefitsOverview } from './BenefitsOverview/BenefitsOverview'

export const Benefits = ({
  setStep
}: {
  setStep: React.Dispatch<React.SetStateAction<DrawerSteps>>
}) => {
  return (
    <>
      <Switch>
        <Route path='/' render={props => <BenefitsOverview setStep={setStep} {...props} />} />
      </Switch>
    </>
  )
}
