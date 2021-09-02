import { Contract, ethers } from 'ethers'
import { bn, bnOrZero } from './math'

type TStackingContract = Contract | null

export const totalLpSupply = async (stakingContract: TStackingContract) => {
  try {
    const totalSupply = await stakingContract?.totalSupply()
    return totalSupply
  } catch (error) {
    throw new Error(error)
  }
}

export const rewardRatePerToken = async (stakingContract: TStackingContract) => {
  try {
    let rewardRate = await stakingContract?.rewardRate() // Rate of FOX given per second for all staked addresses
    if (rewardRate === '0') {
      const foxFunding = bn(15768000) // Fox added to the contract
      const threeMonths = bn(90).times(24).times(60).times(60)
      rewardRate = foxFunding.div(threeMonths).times('1e+18')
    }
    const totalSupply = await totalLpSupply(stakingContract)

    return bnOrZero(rewardRate?.toString())
      .div(bnOrZero(totalSupply?.toString()))
      .times('1e+18')
      .decimalPlaces(0)
      .toString()
  } catch (error) {
    throw new Error(error)
  }
}

const checkAddressValidity = (address: string) => {
  if (!ethers.utils.isAddress(address)) throw new Error('invalid-eth-address')
}

export const rewardRatePerAddress = async ({
  address,
  stakingContract
}: {
  address: string
  stakingContract: TStackingContract
}) => {
  try {
    checkAddressValidity(address)
    const addressBalance = await stakingContract?.balanceOf(address)
    const expectedRate = await rewardRatePerToken(stakingContract)
    return bnOrZero(addressBalance?.toString())
      .times(bnOrZero(expectedRate?.toString()))
      .div('1e+18') // Since rewardRatePerToken is per token, and addressBalance is baseUnitValue, need to div by wei here.
      .decimalPlaces(0)
      .toString()
  } catch (error) {
    throw new Error(error)
  }
}
