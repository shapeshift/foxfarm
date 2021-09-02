import { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { Web3Provider, JsonRpcSigner, InfuraProvider } from '@ethersproject/providers'
import { AddressZero } from '@ethersproject/constants'
import { isAddress } from 'utils/helpers'

export function getSigner(library: Web3Provider | InfuraProvider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

export function getProviderOrSigner(
  library: Web3Provider | InfuraProvider,
  account?: string
): Web3Provider | JsonRpcSigner | InfuraProvider {
  return account ? getSigner(library, account) : library
}

export function getContract(
  address: string,
  ABI: any,
  library: Web3Provider | InfuraProvider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any)
}

export function useContract(
  provider: Web3Provider | InfuraProvider | null,
  account: string | null,
  contractAddress: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  return useMemo(() => {
    if (!contractAddress || !ABI || !provider) return null
    try {
      return getContract(
        contractAddress,
        ABI,
        provider,
        withSignerIfPossible && account ? account : undefined
      )
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [contractAddress, ABI, provider, withSignerIfPossible, account])
}
