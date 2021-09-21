import { lpUrlFormatter } from './helpers'

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
