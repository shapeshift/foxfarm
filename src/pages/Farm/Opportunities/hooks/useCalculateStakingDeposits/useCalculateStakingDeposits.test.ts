import { act, renderHook } from '@testing-library/react-hooks'
import { useWallet } from 'state/WalletProvider'
import { useContract } from 'hooks/useContract'
import { useCalculateLPDeposits } from '../useCalculateLPDeposits/useCalculateLPDeposits'
import { useCalculateStakingDeposits } from './useCalculateStakingDeposits'

jest.mock('state/WalletProvider')
jest.mock('hooks/useContract')
jest.mock('hooks/useActiveProvider')
jest.mock('../useCalculateLPDeposits/useCalculateLPDeposits')

const setup = () => {
  ;(useWallet as jest.Mock<unknown>).mockImplementation(() => ({
    state: { account: 'account' }
  }))
  ;(useCalculateLPDeposits as jest.Mock<unknown>).mockImplementation(() => ({
    lpTokenPrice: '72'
  }))

  return renderHook(() =>
    useCalculateStakingDeposits('lpContractAddress', 'stakingContractAddress')
  )
}

describe('useCalculateStakingDeposits', () => {
  it('returns the total amount staked in usd', async () => {
    await act(async () => {
      ;(useContract as jest.Mock<unknown>).mockImplementationOnce(() => ({
        totalSupply: jest.fn().mockResolvedValue('237811640779074357101305')
      }))
      const { result, waitForValueToChange } = setup()

      await waitForValueToChange(() => result.current.totalDeposited)

      expect(result.current.totalDeposited).toBe('1.712243813609335371129396e+25')
    })
  })

  it('returns 0 if there is not staking contract', async () => {
    await act(async () => {
      ;(useContract as jest.Mock<unknown>).mockImplementationOnce(() => null)
      const { result } = setup()

      expect(result.current.totalDeposited).toBe('0')
    })
  })
})
