import BigNumber from 'bignumber.js'

export type BN = BigNumber
export const bn = (n: BigNumber.Value, base = 10): BN => new BigNumber(n, base)
export const bnOrZero = (n: BN | null | undefined | string): BN => {
  const value = bn(n || 0)
  return value.isNaN() ? bn(0) : value
}

export function toBaseUnit(amount: string | BN, decimals: number): string {
  return bn(amount)
    .multipliedBy(bn(10).pow(bn(decimals)))
    .decimalPlaces(0)
    .toFixed()
}

export function fromBaseUnit(amount: string | BN | number, decimals: number): string {
  if (!bn(amount).isZero() && !bn(amount).isNaN()) {
    return bn(amount)
      .dividedBy(bn(10).pow(bn(decimals)))
      .toFixed()
  }
  return bn(0).toString()
}

export function formatBaseAmount(amount: string | BN, decimals: number): string | null {
  if (bn(amount).isNaN() || bn(amount).isZero()) return '0'
  try {
    const inputAmount: string = fromBaseUnit(amount, decimals)
    const zeroCount: number = -Math.floor(Math.log10(Number(inputAmount)))
    const decimalDisplay: number = zeroCount + 5 >= decimals ? decimals : zeroCount + 5
    const formattedAmount =
      zeroCount < 1 ? bn(inputAmount).toFixed(2, 1) : bn(inputAmount).toFixed(decimalDisplay, 1)
    return formattedAmount
  } catch (e) {
    console.warn(e)
    return null
  }
}

export function toDisplayAmount(amount: string | number, decimals: number): string {
  if (bn(amount).isNaN() || bn(amount).isZero()) return ''
  try {
    const zeroCount: number = -Math.floor(Math.log10(Number(amount)))
    const decimalDisplay: number = zeroCount + 5 >= decimals ? decimals : zeroCount + 5
    const formattedAmount =
      zeroCount < 1 ? bn(amount).toFixed(3, 1) : bn(amount).toFixed(decimalDisplay, 1)
    return formattedAmount
  } catch (e) {
    console.error(e)
    return ''
  }
}

export function bufferGas(limitOrPrice: string) {
  return bn(limitOrPrice).times(1.2).decimalPlaces(0).toFixed()
}
