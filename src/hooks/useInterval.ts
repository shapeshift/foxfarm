import { useCallback, useEffect, useRef, useState } from 'react'

type TUseInterval = { callback: () => void; delay: number; autoStart: boolean }

export function useInterval({ callback, delay, autoStart = true }: TUseInterval) {
  const savedCallback = useRef(callback)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>()

  const clear = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(undefined)
    }
  }, [intervalId])

  const start = useCallback(() => {
    const id = setInterval(() => savedCallback.current(), delay)
    setIntervalId(id)
  }, [delay])

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (autoStart) start()
    return () => clear()
  }, [autoStart, clear, start])

  return { clear, start, intervalId }
}
