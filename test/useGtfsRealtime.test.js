import { renderHook } from '@testing-library/react'
import GtfsRealtimeBindings from 'gtfs-realtime-bindings'
import fs from 'fs'
import { describe, expect, it, vi } from 'vitest'
import useGtfsRealtime from '../lib/useGtfsRealtime.js'

import realtimeJSON from '../test/fixtures/realtime-parsed.json'
const realtimeBuffer = fs.readFileSync('test/fixtures/realtime-raw.proto')
const feedMessage = GtfsRealtimeBindings.transit_realtime.FeedMessage

describe('useGtfsRealtime', () => {
  it('returns undefined when unresolved', () => {
    const resolve = async () => realtimeBuffer
    const { result } = renderHook(() => useGtfsRealtime(resolve, 1000))
    expect(result.current).toBeUndefined()
  })

  it('returns the parsed object representation of the realtime data when resolved', async () => {
    const resolve = async () => realtimeBuffer
    const { result } = renderHook(() => useGtfsRealtime(resolve, 1000))
    await vi.waitFor(() => expect(result.current).toBeInstanceOf(feedMessage))
    expect(result.current.toJSON()).toEqual(realtimeJSON)
  })

  it('returns null when an error occurs', async () => {
    const resolve = async () => { throw Error() }
    const { result } = renderHook(() => useGtfsRealtime(resolve, 1000))
    await vi.waitFor(() => expect(result.current).toBeNull())
  })
})
