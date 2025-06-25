import { useEffect, useState } from 'react'

export default function useRefresh (resolve, timeout) {
  const [data, setData] = useState()
  useEffect(() => {
    async function refresh () {
      setData(await resolve())
    }
    refresh()
    const interval = setInterval(refresh, timeout)
    return () => clearInterval(interval)
  }, [resolve, timeout])
  return data
}
