import { useEffect, useState, useCallback } from 'react'
import { useActiveProvider } from './useActiveProvider'

export const useBlockListeners = () => {
  const [block, setBlock] = useState<number | null>(null)
  const provider = useActiveProvider()
  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setBlock(blockNumber)
    },
    [setBlock]
  )

  // attach/detach listeners
  useEffect(() => {
    if (!provider) return

    setBlock(null)

    provider
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch(error => console.error(`Failed to get block number for chainId:`, error))

    provider.on('block', blockNumberCallback)
    return () => {
      provider.off('block', blockNumberCallback)
    }
  }, [blockNumberCallback, provider])

  return block
}
