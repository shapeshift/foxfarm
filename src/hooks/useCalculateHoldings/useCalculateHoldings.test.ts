import { act, renderHook } from '@testing-library/react-hooks'
import { useWallet } from 'state/WalletProvider'
import { useContract } from 'hooks/useContract'

import { useCalculateHoldings } from './useCalculateHoldings'
import { useCalculateLPHoldings } from '../useCalculateLPHoldings/useCalculateLPHoldings'
import { bn } from 'utils/math'

jest.mock('state/WalletProvider')
jest.mock('hooks/useContract')
jest.mock('../useCalculateLPHoldings/useCalculateLPHoldings')

const reserves = [bn('2816488923381816911251'), bn('24232560691150293271370038'), bn('1632165953')]

const setup = ({
  lpAddress = 'lpAddress',
  rewardsAddress = 'rewardsAddress',
  isConnected = false
}) => {
  ;(useWallet as jest.Mock<unknown>).mockImplementation(() => ({
    state: { provider: {}, account: 'account', isConnected, blockNumber: 100 }
  }))

  return renderHook(() => useCalculateHoldings({ lpAddress, rewardsAddress }))
}

describe('useCalculateHoldings', () => {
  it('returns a users calculated lp balances when wallet isConnected', async () => {
    await act(async () => {
      ;(useContract as jest.Mock<unknown>).mockImplementationOnce(() => ({
        balanceOf: jest.fn().mockResolvedValue('3846733958239020657'),
        earned: jest.fn().mockResolvedValue('46733958239020657')
      }))
      ;(useCalculateLPHoldings as jest.Mock<unknown>).mockImplementation(() => ({
        ethPriceUsdc: '3028.58577941402245763707',
        userEthHoldings: '45558255891442583',
        userFoxHoldings: '391974984068728436394',
        userLpBalance: bn('3846733958239020657'),
        totalSupply: '3846733958239020657',
        reserves,
        uniswapLPContract: {}
      }))
      const { result, waitForValueToChange } = setup({ isConnected: true })

      await waitForValueToChange(() => result.current.userHoldings.totalUsdcValue)

      expect(result.current.userHoldings.ethPriceUsdc).toBe('3028.58577941402245763707')
      expect(result.current.userHoldings.totalUsdcValue).toBe('275.95417185545623147732')
      expect(result.current.userHoldings.userEthHoldings).toBe('45558255891442583')
      expect(result.current.userHoldings.userFoxHoldings).toBe('391974984068728436394')
      expect(result.current.userHoldings.userStakedBalance).toBe('3846733958239020657')
      expect(result.current.userHoldings.userLpBalance?.toString()).toBe('3846733958239020657')
      expect(result.current.userHoldings.userEthHoldingsStakedAndLp).toBe(
        '5.632977846763633822502e+21'
      )
      expect(result.current.userHoldings.userFoxHoldingsStakedAndLp).toBe(
        '4.8465121382300586542740076e+25'
      )
      expect(result.current.userHoldings.totalUsdcValueStakedAndLp).toBe(
        '3.411991320492512380225043553867257625343069828e+25'
      )
    })
  })

  it('returns a default values when wallet is not Connected', async () => {
    await act(async () => {
      ;(useContract as jest.Mock<unknown>).mockImplementationOnce(() => ({}))
      ;(useCalculateLPHoldings as jest.Mock<unknown>).mockImplementation(() => ({
        ethPriceUsdc: '0',
        userEthHoldings: '0',
        userFoxHoldings: '0',
        userLpBalance: bn('0'),
        totalSupply: '0'
      }))
      const { result } = setup({ isConnected: false })

      expect(result.current.userHoldings.ethPriceUsdc).toBe('0')
      expect(result.current.userHoldings.totalUsdcValue).toBe('0')
      expect(result.current.userHoldings.userEthHoldings).toBe('0')
      expect(result.current.userHoldings.userFoxHoldings).toBe('0')
      expect(result.current.userHoldings.userStakedBalance).toBe('0')
      expect(result.current.userHoldings.userLpBalance?.toString()).toBe('0')
      expect(result.current.userHoldings.userEthHoldingsStakedAndLp).toBe('0')
      expect(result.current.userHoldings.userFoxHoldingsStakedAndLp).toBe('0')
      expect(result.current.userHoldings.totalUsdcValueStakedAndLp).toBe('0')
    })
  })
})
