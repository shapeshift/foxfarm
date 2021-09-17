import { useStaking } from 'state/StakingProvider'
import { bnOrZero, formatBaseAmount } from 'utils/math'
import { useMemo } from 'react'

export const useUserFriendlyAmounts = () => {
  const { userStakedBalance, userUnclaimedRewards, totalUsdcValueStakedAndLp, userLpBalance } =
    useStaking()

  const foxAmount = useMemo(() => {
    return formatBaseAmount(bnOrZero(userUnclaimedRewards?.toString()), 18)
  }, [userUnclaimedRewards])

  const stakedLpBalance = useMemo(() => {
    return formatBaseAmount(bnOrZero(userStakedBalance?.toString()), 18)
  }, [userStakedBalance])

  const userHoldingsValue = useMemo(() => {
    return formatBaseAmount(bnOrZero(totalUsdcValueStakedAndLp), 18)
  }, [totalUsdcValueStakedAndLp])

  const unstakedLpBalance = useMemo(() => {
    return formatBaseAmount(userLpBalance ? userLpBalance.toString() : '0', 18)
  }, [userLpBalance])

  return {
    unstakedLpBalance,
    userHoldingsValue,
    stakedLpBalance,
    foxAmount
  }
}
