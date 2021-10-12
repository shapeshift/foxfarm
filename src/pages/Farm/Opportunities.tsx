import { Text, Table, Thead, Tr, Th, Tbody, Divider } from '@chakra-ui/react'
import { Card } from 'components/Card/Card'

import { poolContracts, stakingContracts } from 'lib/constants'
import { PoolRow } from './Opportunities/PoolRow'
import { StakingRow } from './Opportunities/StakingRow'

export const Opportunities = () => {
  return (
    <Card>
      <Card.Header pb={0}>
        <Card.Heading>Liquidity Pools</Card.Heading>
        <Text color='gray.500'>Add liquidity to earn fees, incentives, voting rights, etc.</Text>
      </Card.Header>
      <Card.Body px={2}>
        <Table>
          <Thead>
            <Tr>
              <Th>Liquidity Pool</Th>
              <Th display={{ base: 'none', lg: 'table-cell' }}>Fee APR</Th>
              <Th display={{ base: 'none', lg: 'table-cell' }}>Liquidity</Th>
              <Th display={{ base: 'none', lg: 'table-cell' }}>Network</Th>
              <Th display={{ base: 'none', lg: 'table-cell' }}>Rewards</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Balance</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {poolContracts.map(pool => {
              return <PoolRow key={pool.contractAddress} contract={pool} />
            })}
          </Tbody>
        </Table>
      </Card.Body>
      <Divider />
      <Card.Header pb={0}>
        <Card.Heading>Farming Opportunities</Card.Heading>
        <Text color='gray.500'>Safely lend your assets to earn passive income.</Text>
      </Card.Header>
      <Card.Body px={2}>
        <Table>
          <Thead>
            <Tr>
              <Th>Asset</Th>
              <Th display={{ base: 'none', lg: 'table-cell' }}>Current APR</Th>
              <Th display={{ base: 'none', lg: 'table-cell' }}>Deposits</Th>
              <Th display={{ base: 'none', lg: 'table-cell' }}>Network</Th>
              <Th display={{ base: 'none', lg: 'table-cell' }}>Rewards</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Balance</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {stakingContracts.map(contract => {
              return (
                contract.enabled && (
                  <StakingRow key={contract.contractAddress} contract={contract} />
                )
              )
            })}
          </Tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}
