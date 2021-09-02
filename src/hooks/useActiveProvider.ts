import { useWallet } from 'state/WalletProvider'
import { InfuraProvider } from '@ethersproject/providers'

const NETWORK_KEY = process.env.REACT_APP_INFURA_ID

const networkProvider = new InfuraProvider('homestead', NETWORK_KEY)

/**
 * @description Special use-case provider for when network is always required regardless of wallet connection
 * @info example: when we need to check contract.isClaimed even without wallet connected
 */
export const useActiveProvider = () => {
  const {
    state: { provider, active }
  } = useWallet()

  return provider && active ? provider : networkProvider
}
