import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useContractMethods } from './useContractMethods'

export const useHasContractExpired = (contractAddress?: string) => {
  const [expired, setExpired] = useState(false)
  const contract = useContractMethods(contractAddress)

  useEffect(() => {
    ;(async () => {
      const timeStamp = await contract?.periodFinish()
      const isExpired = dayjs().isAfter(dayjs.unix(timeStamp.periodFinish))
      setExpired(isExpired)
    })()
  }, [contract])

  return expired
}
