import { lpUrlFormatter, supportedContractsPath, numberFormatter } from './helpers'

describe('lpUrlFormatter', () => {
  it('renders with staking address in url when stakingAddress is passed in', () => {
    expect(lpUrlFormatter('pending', 'lpAddress', 'stakingAddress')).toBe(
      '/fox-farming/liquidity/lpAddress/staking/stakingAddress/pending'
    )
  })

  it('renders with no staking route if there is not a staking address passed in', () => {
    expect(lpUrlFormatter('pending', 'lpAddress')).toBe('/fox-farming/liquidity/lpAddress/pending')
  })

  describe('no added route', () => {
    it('renders with staking address in url when stakingAddress is passed in', () => {
      expect(lpUrlFormatter('', 'lpAddress', 'stakingAddress')).toBe(
        '/fox-farming/liquidity/lpAddress/staking/stakingAddress'
      )
    })

    it('redirects to fox-farming when no route and there is not a staking address passed in', () => {
      expect(lpUrlFormatter('', 'lpAddress')).toBe('/fox-farming')
    })

    it('renders with staking address in url when stakingAddress is passed in', () => {
      expect(lpUrlFormatter(undefined, 'lpAddress', 'stakingAddress')).toBe(
        '/fox-farming/liquidity/lpAddress/staking/stakingAddress'
      )
    })

    it('redirects to fox-farming when no route and there is not a staking address passed in', () => {
      expect(lpUrlFormatter(undefined, 'lpAddress')).toBe('/fox-farming')
    })
  })
})

const poolData = {
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

const stakingData = {
  name: 'ETH-FOX V1',
  owner: 'ShapeShift',
  contractAddress: '0xdd80e21669a664bce83e3ad9a0d74f8dad5d9e72',
  pool: poolData,
  periodFinish: 1631329219,
  balance: 2000,
  network: 'ethereum',
  rewards: [
    {
      symbol: 'FOX',
      icon: 'https://assets.coincap.io/assets/icons/256/fox.png'
    }
  ]
}
describe('supportedContractsPath', () => {
  it('returns empty string for empty array', () => {
    expect(supportedContractsPath([])).toBe('')
  })
  it('returns one supported pool contract', () => {
    expect(supportedContractsPath([poolData])).toBe('(0x470e8de2ebaef52014a47cb5e6af86884947f08c)')
  })
  it('returns two supported pool contracts', () => {
    expect(supportedContractsPath([poolData, poolData])).toBe(
      '(0x470e8de2ebaef52014a47cb5e6af86884947f08c|0x470e8de2ebaef52014a47cb5e6af86884947f08c)'
    )
  })
  it('returns as many supported pool contracts as needed', () => {
    expect(supportedContractsPath([poolData, poolData, poolData, poolData])).toBe(
      '(0x470e8de2ebaef52014a47cb5e6af86884947f08c|0x470e8de2ebaef52014a47cb5e6af86884947f08c|0x470e8de2ebaef52014a47cb5e6af86884947f08c|0x470e8de2ebaef52014a47cb5e6af86884947f08c)'
    )
  })
  it('returns one supported staking contract', () => {
    expect(supportedContractsPath([stakingData])).toBe(
      '(0xdd80e21669a664bce83e3ad9a0d74f8dad5d9e72)'
    )
  })
  it('returns two supported staking contracts', () => {
    expect(supportedContractsPath([stakingData, stakingData])).toBe(
      '(0xdd80e21669a664bce83e3ad9a0d74f8dad5d9e72|0xdd80e21669a664bce83e3ad9a0d74f8dad5d9e72)'
    )
  })
  it('returns as many supported staking contracts as needed', () => {
    expect(supportedContractsPath([stakingData, stakingData, stakingData, stakingData])).toBe(
      '(0xdd80e21669a664bce83e3ad9a0d74f8dad5d9e72|0xdd80e21669a664bce83e3ad9a0d74f8dad5d9e72|0xdd80e21669a664bce83e3ad9a0d74f8dad5d9e72|0xdd80e21669a664bce83e3ad9a0d74f8dad5d9e72)'
    )
  })
})

describe('numberFormatter', () => {
  test.each([
    [0, 1, '0'],
    [12, 1, '12'],
    [1234, 1, '1.2k'],
    [100000000, 1, '100m'],
    [299792458, 1, '299.8m'],
    [759878, 1, '759.9k'],
    [759878, 0, '760k'],
    [123, 1, '123'],
    [123.456, 1, '123.5'],
    [123.456, 2, '123.46'],
    [123.456, 4, '123.456']
  ])('toHexString(numberFormatter("%s", "%s")) == "%s"', (a, b, expected) => {
    expect(numberFormatter(a, b)).toEqual(expected)
  })
})
