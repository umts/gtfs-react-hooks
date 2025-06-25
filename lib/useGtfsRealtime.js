import GtfsRealtimeBindings from 'gtfs-realtime-bindings'
import { useMemo } from 'react'
import useRefresh from './useRefresh.js'

export default function useGtfsRealtime (resolve, timeout) {
  const realtimeUInt8Buffer = useRefresh(resolve, timeout)
  return useMemo(() => {
    if (realtimeUInt8Buffer === undefined) {
      return realtimeUInt8Buffer
    } else {
      return GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(realtimeUInt8Buffer)
    }
  }, [realtimeUInt8Buffer])
}
