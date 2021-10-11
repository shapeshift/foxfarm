import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useContractMethods } from './useContractMethods'

export const useHasContractExpired = (contractAddress?: string) => {
  const [expired, setExpired] = useState(false)
  const contract = useContractMethods(contractAddress)

  useEffect(() => {
    ;(async () => {
      const timeStamp = await contract?.periodFinish()
      if (timeStamp.toNumber() === 0) {
        return setExpired(false)
      }
      const isExpired = dayjs().isAfter(dayjs.unix(timeStamp.toNumber()))
      setExpired(isExpired)
    })()
  }, [contract])

  return expired
}
