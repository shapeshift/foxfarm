import { getAddress } from '@ethersproject/address'
import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { Web3Provider, InfuraProvider } from '@ethersproject/providers'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { bufferGas } from './math'

// checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}

export function toHexString(value: BigNumberish) {
  return BigNumber.from(value).toHexString()
}

export function getEtherscanLink(
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block'
): string {
  const prefix = `https://etherscan.io`

  switch (type) {
    case 'transaction': {
      return `${prefix}/tx/${data}`
    }
    case 'token': {
      return `${prefix}/token/${data}`
    }
    case 'block': {
      return `${prefix}/block/${data}`
    }
    case 'address':
    default: {
      return `${prefix}/address/${data}`
    }
  }
}

export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export async function getBufferedGas(
  provider: Web3Provider | InfuraProvider | null,
  tx: TransactionRequest
) {
  let gasLimit = null
  let gasPrice = null
  try {
    if (provider && tx) {
      const gas = await provider?.estimateGas(tx)
      const price = await provider?.getGasPrice()
      if (gas && price) {
        gasLimit = bufferGas(gas?.toString())
        gasPrice = bufferGas(price?.toString())
      }
    }
    return {
      gasLimit,
      gasPrice
    }
  } catch {
    throw Error('Problem estimating gas')
  }
}
