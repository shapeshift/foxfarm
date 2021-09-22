import { useWallet } from 'state/WalletProvider'
import farmAbi from 'abis/farmingAbi.json'
import { useCallback, useEffect, useState } from 'react'
import { bnOrZero } from 'utils/math'
import { useCalculateLPData } from './useCalculateLPData'
import { useContract } from 'hooks/useContract'

export const useCalculateFarmingDeposits = (
  stakingContractAddress: string,
  lpContractAddress: string
) => {
  const [amount, setFarmingData] = useState({ totalDeposited: '0' })
  const { state } = useWallet()

  const stakingContract = useContract(
    state.provider,
    state.account,
    stakingContractAddress,
    farmAbi
  )

  const { lpTokenPrice } = useCalculateLPData(lpContractAddress)

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
    if (stakingContract && state.blockNumber && state.account) {
      calculateAmount()
    }
  }, [calculateAmount, state.account, state.blockNumber, stakingContract])

  return amount
}
