import { bnOrZero, formatBaseAmount } from 'utils/math'
import { useMemo } from 'react'

export const useUserFriendlyAmount = (balance?: string) => {
  const memoedBalance = useMemo(() => {
    return formatBaseAmount(bnOrZero(balance), 18)
  }, [balance])

  return memoedBalance
}
