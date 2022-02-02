import { Text, Table, Thead, Tr, Th, Tbody, Divider } from '@chakra-ui/react'
import axios from 'axios'
import { Card } from 'components/Card/Card'

import {
  poolContracts,
  stakingContracts,
  ICHI_ONEFOX_STAKING_API,
  ICHI_ONEFOX_VAULT_API
} from 'lib/constants'
import { useEffect, useState } from 'react'
import { GenericStakingRow } from './Opportunities/GenericStakingRow'
import { PoolRow } from './Opportunities/PoolRow'
import { ContractStakingRow } from './Opportunities/ContractStakingRow'
import oneFox from 'assets/img/oneFox.png'
import ichi from 'assets/img/ichi.svg'
import fox from '../../assets/img/fox.png'
import tokemak from '../../assets/img/tokemak.png'
import usdc from '../../assets/img/usdc.png'

type FarmOneFoxType = {
  apy?: string
  tvl?: string
  farmTvl?: string
}

type VaultOneFoxType = {
  apy?: string
  tvl?: string
}

export const Opportunities = () => {
  const [farmData, setFarmData] = useState<FarmOneFoxType>({})
  useEffect(() => {
    axios.get(ICHI_ONEFOX_STAKING_API).then(resp => {
      const data = resp.data
      setFarmData({
        apy: data.yearlyAPY.toString(),
        tvl: data.tvl,
        farmTvl: data?.farmTVL
      })
    })
  }, [])

  const [vaultData, setVaultData] = useState<VaultOneFoxType>({})
  useEffect(() => {
    axios.get(ICHI_ONEFOX_VAULT_API).then(resp => {
      const data = resp.data
      setVaultData({
        apy: data.yearlyAPY.toString(),
        tvl: data.tvl
      })
    })
  }, [])

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
              <Th display={{ base: 'none', lg: 'table-cell' }}>Current APR</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Liquidity</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Network</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Rewards</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Balance</Th>
              <Th />
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
        <Text color='gray.500'>Stake your LP tokens to earn passive income.</Text>
      </Card.Header>
      <Card.Body px={2}>
        <Table>
          <Thead>
            <Tr>
              <Th>Asset</Th>
              <Th display={{ base: 'none', lg: 'table-cell' }}>Current APR</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Deposits</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Network</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Rewards</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Balance</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            {stakingContracts.map(contract => {
              return (
                contract.enabled && (
                  <ContractStakingRow key={contract.contractAddress} contract={contract} />
                )
              )
            })}
            <GenericStakingRow
              tvl={farmData?.farmTvl}
              apy={farmData.apy}
              assetImage={oneFox}
              assetName='oneFOX'
              assetDescription='ICHI - Staking'
              network='Ethereum'
              rewardsImage={ichi}
              url='https://app.ichi.org/deposit?poolId=1015&back=deposit'
              urlLabel='Get started'
            />
            <GenericStakingRow
              tvl={vaultData?.tvl}
              apy={vaultData?.apy}
              assetImage={oneFox}
              assetName='oneFOX'
              assetDescription='ICHI - Angel Vault'
              network='Ethereum'
              rewardsImage={fox}
              url='https://app.ichi.org/vault?poolId=20003&back=vault'
              urlLabel='Get started'
            />
          </Tbody>
        </Table>
      </Card.Body>
      <Divider />
      <Card.Header pb={0}>
        <Card.Heading>Other Opportunities</Card.Heading>
        <Text color='gray.500'>Explore a variety of ways to put your FOX to work.</Text>
      </Card.Header>
      <Card.Body px={2}>
        <Table>
          <Thead>
            <Tr>
              <Th>Asset</Th>
              <Th display={{ base: 'none', lg: 'table-cell' }}>Current APR</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Deposits</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Network</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Rewards</Th>
              <Th display={{ base: 'none', md: 'table-cell' }}>Balance</Th>
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            <GenericStakingRow
              tvl={farmData?.tvl}
              apy={null}
              assetImage={usdc}
              assetImageSecondary={fox}
              assetName='oneFOX'
              assetDescription='ICHI'
              network='Ethereum'
              url='https://app.ichi.org/mint?name=onefox&collateral=USDC'
              urlLabel='Get started'
            />
            <GenericStakingRow
              tvl={null}
              apy={null}
              assetImage={fox}
              assetName='FOX'
              assetDescription='Tokemak'
              network='Ethereum'
              rewardsImage={tokemak}
              url='https://www.tokemak.xyz/'
              urlLabel='Get started'
              aprFallbackLabel='View APR'
            />
          </Tbody>
        </Table>
      </Card.Body>
    </Card>
  )
}
