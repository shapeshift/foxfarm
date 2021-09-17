import { Route, Switch } from 'react-router'
import { Text, Link } from '@chakra-ui/react'
import { Hero } from 'Molecules/Hero'
import { AirdropFoxIcon } from 'Atoms/Icons/AirdropFoxIcon'
import { Layout } from 'Molecules/Layout/Layout'
import { GetStarted } from './GetStarted'
import { Staking } from './Staking'
import { Pending } from './Pending'
import { Approve } from './Approve'
import { Rewards } from './Rewards'
import { Unstake } from './Unstake'
import { StakingProvider } from 'state/StakingProvider'
import { LayoutContent } from 'Atoms/LayoutContent'
import { LayoutCard } from 'Atoms/LayoutCard'
import { Manage } from './Manage/Manage'
import { Opportunities } from './Opportunities'

const APRFluctuates = () => (
  <Text color='gray.500' fontSize='xs' maxW='460px' textAlign='center'>
    *ShapeShift is rewarding 15,768,000 FOX until October 13, 2021 to liquidity providers that stake
    their LP tokens. This is an estimated APR calculated based on the current amount of
    FOX-ETH-UNIV2 LP tokens staked in the ShapeShift rewards contract. This APR amount is subject to
    extreme volatility and this amount could drop significantly, especially in the first few weeks
    after we roll-out FOX yield farming
  </Text>
)

export const Farm = () => {
  return (
    <Layout>
      <Hero>
        <AirdropFoxIcon color='white' size='82px' mb={4} />
        <Text
          color='white'
          mb='2'
          textAlign='center'
          fontWeight='light'
          fontSize={{ base: '4xl', md: '5xl' }}
          as='h1'
        >
          FOX has <b>Super</b> Powers
        </Text>
        <Text color='gray.400' textAlign='center' fontWeight='heading' as='p'>
          HODL your FOX Tokens for amazing benefits
        </Text>
      </Hero>
      <LayoutContent>
        <LayoutCard>
          <StakingProvider>
            <Switch>
              <Route exact path='/fox-farming' component={Opportunities} />
              <Route exact path='/fox-farming/get-started' component={GetStarted} />
              <Route path='/fox-farming/liquidity' component={Manage} />
              <Route exact path='/fox-farming/staking' component={Staking} />
              <Route exact path='/fox-farming/staking/approve' component={Approve} />
              <Route exact path='/fox-farming/staking/pending' component={Pending} />
              <Route exact path='/fox-farming/staking/rewards' component={Rewards} />
              <Route exact path='/fox-farming/staking/unstake' component={Unstake} />
            </Switch>
          </StakingProvider>
        </LayoutCard>
        <Route exact path='/fox-farming'>
          <Link
            color='primary'
            mb={16}
            href='https://shapeshift.zendesk.com/hc/en-us/articles/4404019905677-Adding-FOX-to-Liquidity-Pools-to-Earn-FOX'
            target='_blank'
          >
            How does this work?
          </Link>
          <APRFluctuates />
        </Route>
        <Route path='/fox-farming/staking' component={APRFluctuates} />
      </LayoutContent>
    </Layout>
  )
}
