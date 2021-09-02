import { useCallback, useEffect, useState } from 'react'
import { useActiveProvider } from './useActiveProvider'
import useDebounce from './useDebounce'

const ENS_REGEX = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/

export const useEnsAddress = (name: string | null): string | null => {
  const provider = useActiveProvider()
  const [address, setAddress] = useState<string | null>(null)
  const debouncedName = useDebounce(name, 200)

  const lookupEns = useCallback(async () => {
    const match = debouncedName?.match(ENS_REGEX)
    if (!match || !debouncedName) return setAddress(null)
    try {
      const resolvedName = await provider.resolveName(debouncedName)
      setAddress(resolvedName)
    } catch (error) {
      console.log(error)
    }
  }, [debouncedName, provider])

  useEffect(() => {
    let ignore = false
    if (!ignore && debouncedName) {
      lookupEns()
    } else {
      setAddress(null)
    }
    return () => {
      ignore = true
    }
  }, [lookupEns, debouncedName])

  return address
}
