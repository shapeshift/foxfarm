import { useActiveProvider } from './useActiveProvider'
import { useContract } from './useContract'
import { FOX_ETH_FARMING_ADDRESS } from 'lib/constants'
import farmAbi from 'abis/farmingAbi.json'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

export const useHasContractExpired = (contractAddress?: string) => {
  const [expired, setExpired] = useState(false)
  const provider = useActiveProvider()
  const farmingRewardsContract = useContract(
    provider,
    null,
    contractAddress ?? FOX_ETH_FARMING_ADDRESS,
    farmAbi
  )

  useEffect(() => {
    ;(async () => {
      const timeStamp = await farmingRewardsContract?.periodFinish()
      const isExpired = dayjs().isAfter(dayjs.unix(timeStamp.periodFinish))
      setExpired(isExpired)
    })()
  }, [farmingRewardsContract])

  return expired
}
