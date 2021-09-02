import { Route, Switch, MemoryRouter, RouterProps } from 'react-router'
import { Box } from '@chakra-ui/react'
import { StepProgress } from '../BenefitsOverview/Progress'
import { Step1 } from '../BenefitsOverview/Step1'
import { Step2 } from '../BenefitsOverview/Step2'
import { Step3 } from '../BenefitsOverview/Step3'
import { Step4 } from '../BenefitsOverview/Step4'
import { Step5 } from '../BenefitsOverview/Step5'
import { DrawerSteps } from '../ClaimDrawer'

export const Steps = ['/step/1', '/step/2', '/step/3', '/step/4', '/step/5']

export const BenefitsOverview = ({
  history,
  setStep
}: RouterProps & { setStep: React.Dispatch<React.SetStateAction<DrawerSteps>> }) => {
  return (
    <Box height='100vh' display='flex' flexDir='column' width='full'>
      <Box
        display='flex'
        flexDir='column'
        flex={1}
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        bg='bg.normal'
        mx={-6}
        height='100%'
        mt={-12}
      >
        <MemoryRouter initialEntries={Steps} initialIndex={0}>
          <StepProgress />
          <Switch>
            <Route path='/step/1' component={Step1} />
            <Route path='/step/2' component={Step2} />
            <Route path='/step/3' component={Step3} />
            <Route path='/step/4' component={Step4} />
            <Route path='/step/5' render={props => <Step5 setStep={setStep} {...props} />} />
          </Switch>
        </MemoryRouter>
      </Box>
    </Box>
  )
}
