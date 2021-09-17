import { useActiveProvider } from './useActiveProvider'
import { useContract } from './useContract'
import { FOX_ETH_FARMING_ADDRESS } from 'lib/constants'
import farmAbi from 'abis/farmingAbi.json'

export const useContractMethods = (contractAddress?: string) => {
  const provider = useActiveProvider()
  const contract = useContract(provider, null, contractAddress ?? FOX_ETH_FARMING_ADDRESS, farmAbi)

  return contract
}
