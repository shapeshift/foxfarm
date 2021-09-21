import { act, renderHook } from '@testing-library/react-hooks'
import { useWallet } from 'state/WalletProvider'
import { useContract } from 'hooks/useContract'

import { useCalculateLPHoldings } from './useCalculateLPHoldings'
import { bn } from 'utils/math'

jest.mock('state/WalletProvider')
jest.mock('hooks/useContract')

const setup = ({ lpAddress = 'lpAddress', isConnected = false }) => {
  ;(useWallet as jest.Mock<unknown>).mockImplementation(() => ({
    state: { provider: {}, account: 'account', isConnected, blockNumber: 100 }
  }))

  return renderHook(() => useCalculateLPHoldings({ lpAddress }))
}

describe('useCalculateLPHoldings', () => {
  it('returns a users calculated lp balances when wallet isConnected', async () => {
    const reserves = [
      bn('2816488923381816911251'),
      bn('24232560691150293271370038'),
      bn('1632165953')
    ]
    await act(async () => {
      ;(useContract as jest.Mock<unknown>)
        .mockImplementationOnce(() => ({
          totalSupply: jest.fn().mockResolvedValue('237811640779074357101305'),
          balanceOf: jest.fn().mockResolvedValue(bn('3846733958239020657')),
          getReserves: jest.fn().mockResolvedValue(reserves)
        }))
        .mockImplementationOnce(() => ({
          getReserves: jest
            .fn()
            .mockResolvedValue([
              bn('98932053380470'),
              bn('32666089252922396901380'),
              bn('1632166562')
            ])
        }))
      const { result, waitForValueToChange } = setup({ isConnected: true })

      await waitForValueToChange(() => result.current.userLpBalance)

      expect(result.current.ethPriceUsdc).toBe('3028.58577941402245763707')
      expect(result.current.userEthHoldings).toBe('45558255891442583')
      expect(result.current.userFoxHoldings).toBe('391974984068728436394')
      expect(result.current.userLpBalance?.toString()).toBe('3846733958239020657')
      expect(result.current.totalSupply).toBe('237811640779074357101305')
      expect(result.current.reserves).toEqual(reserves)
    })
  })

  it('returns a default values when wallet is not Connected', async () => {
    await act(async () => {
      ;(useContract as jest.Mock<unknown>)
        .mockImplementationOnce(() => ({}))
        .mockImplementationOnce(() => ({}))
      const { result } = setup({ isConnected: false })

      expect(result.current.ethPriceUsdc).toBe('0')
      expect(result.current.userEthHoldings).toBe('0')
      expect(result.current.userFoxHoldings).toBe('0')
      expect(result.current.userLpBalance?.toString()).toBe('0')
      expect(result.current.totalSupply).toBe('0')
      expect(result.current.reserves).toBeUndefined()
    })
  })
})
