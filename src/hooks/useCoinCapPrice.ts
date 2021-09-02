import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'

export const useCoinCapPrice = (assetId: string) => {
  const [price, setPrice] = useState<string | null>(null)

  const getPrice = useCallback(async () => {
    try {
      const { data } = await axios.post(
        'https://graphql.coincap.io',
        {
          query: `query asset($id: ID!) {
            asset(id: $id){
            priceUsd
          }
        }`,
          variables: {
            id: assetId
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      setPrice(data.data.asset.priceUsd)
    } catch (error) {
      setPrice(null)
      console.log(`Error getting price for ${assetId}`, error)
    }
  }, [assetId])

  useEffect(() => {
    let ignore = false
    if (assetId && !ignore) {
      getPrice()
    }
    return () => {
      ignore = true
    }
  }, [assetId, getPrice])

  return price
}
