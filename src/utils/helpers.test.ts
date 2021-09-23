import { lpUrlFormatter, numberFormatter } from './helpers'

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

    it('renders with no staking route if there is not a staking address passed in', () => {
      expect(lpUrlFormatter('', 'lpAddress')).toBe('/fox-farming/liquidity/lpAddress')
    })

    it('renders with staking address in url when stakingAddress is passed in', () => {
      expect(lpUrlFormatter(undefined, 'lpAddress', 'stakingAddress')).toBe(
        '/fox-farming/liquidity/lpAddress/staking/stakingAddress'
      )
    })

    it('renders with no staking route if there is not a staking address passed in', () => {
      expect(lpUrlFormatter(undefined, 'lpAddress')).toBe('/fox-farming/liquidity/lpAddress')
    })
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
