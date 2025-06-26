import { useCallback, useEffect, useState } from 'react'

export default function useRefresh (resolve, timeout, retry) {
  const [data, setData] = useState()
  const refresh = useCallback(async () => { setData(await resolve()) }, [resolve])

  // resolve immediately on render
  useEffect(() => {
    refresh()
  }, [refresh])

  // resolve periodically according to retry if resolve failed previously
  useEffect(() => {
    if (data === undefined) {
      const interval = setInterval(refresh, retry)
      return () => clearInterval(interval)
    }
  }, [data, refresh, retry])

  // resolve periodically according to timeout
  useEffect(() => {
    const interval = setInterval(refresh, timeout)
    return () => clearInterval(interval)
  }, [refresh, timeout])

  return data
}
