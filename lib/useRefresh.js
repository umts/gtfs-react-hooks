import { useCallback, useEffect, useState } from 'react'

export default function useRefresh (resolve, timeout) {
  const [data, setData] = useState()
  const refresh = useCallback(async () => { setData(await resolve()) }, [resolve])

  // resolve immediately on render
  useEffect(() => {
    refresh()
  }, [refresh])

  // resolve periodically
  useEffect(() => {
    const interval = setInterval(refresh, timeout)
    return () => clearInterval(interval)
  }, [refresh, timeout])

  return data
}
