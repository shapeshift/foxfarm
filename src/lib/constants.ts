import { values } from 'lodash'

export const UNISWAP_V2_WETH_FOX_POOL_ADDRESS = '0x470e8de2ebaef52014a47cb5e6af86884947f08c'
export const UNISWAP_V2_USDC_ETH_POOL_ADDRESS = '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc'
export const UNISWAP_V2_ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
export const FOX_TOKEN_CONTRACT_ADDRESS = '0xc770EEfAd204B5180dF6a14Ee197D99d808ee52d'
export const WETH_TOKEN_CONTRACT_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

export const FOX_ETH_TEST_FARMING_ADDRESS = '0x1F2BBC14BCEc7f06b996B6Ee920AB5cA5A56b77F'
export const FOX_ETH_FARMING_ADDRESS = '0xDd80E21669A664Bce83E3AD9a0d74f8Dad5D9E72'
export const ETH_BASE = 0o67405553164731000000
export const MAX_ALLOWANCE = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'

export const COUNT_DOWN_TIME = 1626447600 * 1000 // July 16 2021 9am MST

export const ICHI_ONEFOX_STAKING_API = 'https://api.ichi.org/v1/farms/1015'
export const ICHI_ONEFOX_VAULT_API = 'https://api.ichi.org/v1/farms/20003'

export const FEATURE_FLAGS = {
  airdrop: false,
  ethFoxStakingV1: true,
  ethFoxStakingV2: true,
  // this must be set to true for testing
  ethFoxStakingV3: false
}

type TokenProps = {
  symbol: string
  icon: string
}

export type PoolProps = {
  name: string
  owner: string
  network: string
  token0: TokenProps
  token1: TokenProps
  contractAddress: string
  balance: number
  rewards?: TokenProps[]
}

const poolsContractData = {
  '0x470e8de2ebaef52014a47cb5e6af86884947f08c': {
    name: 'ETH-FOX',
    owner: 'UNI-V2',
    network: 'ethereum',
    balance: 10,
    token0: {
      symbol: 'ETH',
      icon: 'https://assets.coincap.io/assets/icons/256/eth.png'
    },
    token1: {
      symbol: 'FOX',
      icon: 'https://assets.coincap.io/assets/icons/256/fox.png'
    },
    contractAddress: '0x470e8de2ebaef52014a47cb5e6af86884947f08c',
    rewards: [
      {
        symbol: 'ETH',
        icon: 'https://assets.coincap.io/assets/icons/256/eth.png'
      },
      {
        symbol: 'FOX',
        icon: 'https://assets.coincap.io/assets/icons/256/fox.png'
      }
    ]
  }
}

export const poolContracts = values(poolsContractData) as unknown as PoolProps[]

export type StakingContractProps = {
  name: string
  owner: string
  contractAddress: string
  pool: PoolProps
  network: string
  periodFinish: number
  balance: number
  rewards: TokenProps[]
  enabled?: boolean
}

export const stakingContracts = [
  {
    name: 'ETH-FOX V1',
    owner: 'ShapeShift',
    contractAddress: '0xdd80e21669a664bce83e3ad9a0d74f8dad5d9e72',
    pool: poolsContractData['0x470e8de2ebaef52014a47cb5e6af86884947f08c'],
    periodFinish: 1634223324,
    balance: 2000,
    network: 'ethereum',
    rewards: [
      {
        symbol: 'FOX',
        icon: 'https://assets.coincap.io/assets/icons/256/fox.png'
      }
    ],
    enabled: FEATURE_FLAGS.ethFoxStakingV1
  },
  {
    name: 'ETH-FOX V2',
    owner: 'ShapeShift',
    contractAddress: '0xc54B9F82C1c54E9D4d274d633c7523f2299c42A0',
    // test contract
    // contractAddress: '0x6327fa640ecf1ab1967eb12c7b3494fc269a20b9',
    // expired contract
    // contractAddress: '0x7479831e095481cE46d378Ec6C5291e59BF25A76',
    pool: poolsContractData['0x470e8de2ebaef52014a47cb5e6af86884947f08c'],
    periodFinish: 1645714373,
    network: 'ethereum',
    balance: 0,
    rewards: [
      {
        symbol: 'FOX',
        icon: 'https://assets.coincap.io/assets/icons/256/fox.png'
      }
    ],
    enabled: FEATURE_FLAGS.ethFoxStakingV2
  },
  {
    name: 'ETH-FOX V3',
    owner: 'ShapeShift',
    contractAddress: '0xc54B9F82C1c54E9D4d274d633c7523f2299c42A0',
    // test contract
    // contractAddress: '0x6327fa640ecf1ab1967eb12c7b3494fc269a20b9',
    // expired contract
    // contractAddress: '0x7479831e095481cE46d378Ec6C5291e59BF25A76',
    pool: poolsContractData['0x470e8de2ebaef52014a47cb5e6af86884947f08c'],
    periodFinish: 1645714373,
    network: 'ethereum',
    balance: 0,
    rewards: [
      {
        symbol: 'FOX',
        icon: 'https://assets.coincap.io/assets/icons/256/fox.png'
      }
    ],
    enabled: FEATURE_FLAGS.ethFoxStakingV3
  }
] as StakingContractProps[]
