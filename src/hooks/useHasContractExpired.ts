import { useActiveProvider } from './useActiveProvider'
import { useContract } from './useContract'
import { FOX_ETH_FARMING_ADDRESS } from 'lib/constants'
import farmAbi from 'abis/farmingAbi.json'
import { useEffect, useState } from 'react'

export const useHasContractExpired = () => {
  const [expired, setExpired] = useState(false)
  const provider = useActiveProvider()
  const farmingRewardsContract = useContract(provider, null, FOX_ETH_FARMING_ADDRESS, farmAbi)

  useEffect(() => {
    ;(async () => {
      const timeStamp = await farmingRewardsContract?.periodFinish()
      const isExpired = new Date() > new Date(timeStamp.toNumber() * 1000)
      setExpired(isExpired)
    })()
  }, [farmingRewardsContract])

  return expired
}
