import { act, renderHook } from '@testing-library/react-hooks'
import { useWallet } from 'state/WalletProvider'
import { useContract } from 'hooks/useContract'
import { useCalculateLPDeposits } from './useCalculateLPDeposits'
import { bn } from 'utils/math'

jest.mock('state/WalletProvider')
jest.mock('hooks/useContract')
jest.mock('hooks/useActiveProvider')

const setup = () => {
  ;(useWallet as jest.Mock<unknown>).mockImplementation(() => ({
    state: { account: 'account' }
  }))

  return renderHook(() => useCalculateLPDeposits('lpContractAddress'))
}

describe('useCalculateLPDeposits', () => {
  it('returns the total amount staked in usd', async () => {
    const reserves = [
      bn('2816488923381816911251'),
      bn('24232560691150293271370038'),
      bn('1632165953')
    ]
    await act(async () => {
      ;(useContract as jest.Mock<unknown>)
        .mockImplementationOnce(() => ({
          totalSupply: jest.fn().mockResolvedValue('237811640779074357101305'),
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
      const { result, waitForValueToChange } = setup()

      await waitForValueToChange(() => result.current.totalLiquidity)

      expect(result.current.totalLiquidity).toBe(
        '1.705995660246256190112521776933628812671534914e+25'
      )
      expect(result.current.lpTokenPrice).toBe('71.73726461233730440218')
    })
  })

  it('returns 0 if there is not staking contract', async () => {
    await act(async () => {
      ;(useContract as jest.Mock<unknown>)
        .mockImplementationOnce(() => null)
        .mockImplementationOnce(() => null)
      const { result } = setup()

      expect(result.current.totalLiquidity).toBe('0')
      expect(result.current.lpTokenPrice).toBe('0')
    })
  })
})
