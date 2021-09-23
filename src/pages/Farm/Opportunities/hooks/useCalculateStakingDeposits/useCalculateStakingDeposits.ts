import { useWallet } from 'state/WalletProvider'
import farmAbi from 'abis/farmingAbi.json'
import { useCallback, useEffect, useState } from 'react'
import { bnOrZero } from 'utils/math'
import { useCalculateLPDeposits } from '../useCalculateLPDeposits/useCalculateLPDeposits'
import { useContract } from 'hooks/useContract'
import { useActiveProvider } from 'hooks/useActiveProvider'

export const useCalculateStakingDeposits = (
  stakingContractAddress: string,
  lpContractAddress: string
) => {
  const [amount, setFarmingData] = useState({ totalDeposited: '0' })
  const { state } = useWallet()
  const provider = useActiveProvider()

  const stakingContract = useContract(provider, state.account, stakingContractAddress, farmAbi)

  const { lpTokenPrice } = useCalculateLPDeposits(lpContractAddress)

  const calculateAmount = useCallback(async () => {
    if (stakingContract) {
      const totalSupplyStaking = await stakingContract?.totalSupply()
      const totalDeposited = bnOrZero(totalSupplyStaking.toString())
        .times(lpTokenPrice.toString())
        .toString()

      setFarmingData({ totalDeposited })
    }
  }, [stakingContract, lpTokenPrice])

  useEffect(() => {
    if (stakingContract) {
      calculateAmount()
    }
  }, [calculateAmount, stakingContract])

  return amount
}
