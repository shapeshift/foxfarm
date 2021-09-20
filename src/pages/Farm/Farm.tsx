import { Route, Switch } from 'react-router'
import { Text, Link } from '@chakra-ui/react'
import { Hero } from 'Molecules/Hero'
import { AirdropFoxIcon } from 'Atoms/Icons/AirdropFoxIcon'
import { Layout } from 'Molecules/Layout/Layout'
import { GetStarted } from './GetStarted'
import { LayoutContent } from 'Atoms/LayoutContent'
import { LayoutCard } from 'Atoms/LayoutCard'
import { Opportunities } from './Opportunities'
import { LiquidityRoutes } from './Liquidity/LiquidityRoutes'
import { APRFluctuates } from './APRFluctuates'

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
          <Switch>
            <Route exact path='/fox-farming' component={Opportunities} />
            <Route exact path='/fox-farming/get-started' component={GetStarted} />
            <Route
              path='/fox-farming/liquidity/:liquidityContractAddress'
              component={LiquidityRoutes}
            />
          </Switch>
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
        <Route
          path='/fox-farming/liquidity/:liquidityContractAddress/staking/:stakingContractAddress'
          component={APRFluctuates}
        />
      </LayoutContent>
    </Layout>
  )
}
