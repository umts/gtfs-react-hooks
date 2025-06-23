import GtfsRealtimeBindings from 'gtfs-realtime-bindings'
import { useEffect, useState } from 'react'
import useRefresh from './useRefresh.js'

export default function useGtfsRealtime (resolve, timeout) {
  const realtimeUInt8Buffer = useRefresh(resolve, timeout)
  const [data, setData] = useState(undefined)

  useEffect(() => {
    if (realtimeUInt8Buffer === null || realtimeUInt8Buffer === undefined) {
      setData(realtimeUInt8Buffer)
    } else {
      setData(GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(realtimeUInt8Buffer))
    }
  }, [realtimeUInt8Buffer])

  return data
}
