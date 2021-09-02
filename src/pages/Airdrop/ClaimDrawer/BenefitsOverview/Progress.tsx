import { Progress } from '@chakra-ui/react'
import { useLocation } from 'react-router'
import { Steps } from '../BenefitsOverview/BenefitsOverview'
export const StepProgress = () => {
  const location = useLocation()
  const active = location.pathname
  const index = Steps.indexOf(active) + 1
  const progress = (index / Steps.length) * 100
  return (
    <Progress
      value={progress}
      height='5px'
      width='100%'
      isAnimated
      position='absolute'
      bg='whiteAlpha.100'
      top={0}
    />
  )
}
