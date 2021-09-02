import { useCallback, useEffect, useState } from 'react'
import { InfuraProvider, Web3Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { Interface } from '@ethersproject/abi'
import { useActiveProvider } from 'hooks/useActiveProvider'
import AirDropABI from 'abis/airdropAbi.json'
import axios from 'axios'
import { ClaimError } from 'state/ClaimProvider'

const CLAIM_API = process.env.REACT_APP_CLAIM_API

const AirDropInterface = new Interface(AirDropABI)

export async function checkIsClaimed(
  provider: Web3Provider | InfuraProvider,
  contractAddress: string,
  index: number
) {
  const claimContract = new Contract(contractAddress, AirDropInterface, provider)
  return claimContract?.isClaimed(index)
}

export interface IClaim {
  index?: number
  amount?: string
  proof?: string[]
  contractAddress?: string
  claimantAddress?: string
  notFound?: true
  claimed?: true
}

export enum CheckType {
  WALLET,
  INPUT
}

export const ERROR_MESSAGES = {
  NOT_ELIGIBLE: 'Address not eligible for airdrop',
  ALREADY_CLAIMED: 'Airdrop already claimed for address'
}

export const useCheckEligible = () => {
  const [claimResponse, setClaimResponse] = useState<IClaim | null>(null)
  const [loading, setLoading] = useState<{ loading: boolean; type: CheckType | null }>({
    loading: false,
    type: null
  })
  const [error, setError] = useState<ClaimError | null>(null)
  const provider = useActiveProvider()

  const checkEligible = useCallback(
    async (addressToCheck: string, type: CheckType) => {
      setLoading({ loading: true, type })
      setClaimResponse(null)
      setError(null)
      try {
        // real deal hank hill
        const { data, status } = await axios.get<IClaim>(`${CLAIM_API}/${addressToCheck}`, {
          timeout: 10000
        })

        if (status === 204) {
          setLoading({ loading: false, type })
          throw new ClaimError(100, ERROR_MESSAGES.NOT_ELIGIBLE)
        }

        if (data?.contractAddress && data?.index != null) {
          const claimed = await checkIsClaimed(provider, data.contractAddress, data.index as number)
          if (claimed) {
            setLoading({ loading: false, type })
            throw new ClaimError(101, ERROR_MESSAGES.ALREADY_CLAIMED)
          }
        }

        setClaimResponse({ ...data, claimantAddress: addressToCheck })
        setLoading({ loading: false, type })
      } catch (error) {
        console.warn('Eligibility check error: ', error)
        setLoading({ loading: false, type })
        setError(error)
      }
    },
    [provider]
  )

  useEffect(() => {
    const errorTimeout = setTimeout(() => {
      if (error) {
        setError(null)
        setClaimResponse(null)
      }
    }, 10000)
    return () => {
      clearTimeout(errorTimeout)
    }
  }, [error])

  return {
    checkEligible,
    data: claimResponse,
    loading,
    error
  }
}
