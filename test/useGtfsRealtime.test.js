import { renderHook } from '@testing-library/react'
import GtfsRealtimeBindings from 'gtfs-realtime-bindings'
import fs from 'fs'
import { describe, expect, it, vi } from 'vitest'
import useGtfsRealtime from '../lib/useGtfsRealtime.js'

import realtime1JSON from '../test/fixtures/realtime1-parsed.json'
import realtime2JSON from '../test/fixtures/realtime2-parsed.json'
const realtime1Buffer = fs.readFileSync('test/fixtures/realtime1-raw.proto')
const realtime2Buffer = fs.readFileSync('test/fixtures/realtime2-raw.proto')
const feedMessage = GtfsRealtimeBindings.transit_realtime.FeedMessage

describe('useGtfsRealtime', () => {
  it('returns undefined when unresolved', () => {
    const resolve = async () => realtime1Buffer
    const { result } = renderHook(() => useGtfsRealtime(resolve, 1000))
    expect(result.current).toBeUndefined()
  })

  it('returns the parsed object representation of the realtime data when resolved', async () => {
    const resolve = async () => realtime1Buffer
    const { result } = renderHook(() => useGtfsRealtime(resolve, 1000))
    await vi.waitFor(() => expect(result.current).toBeInstanceOf(feedMessage))
    expect(result.current.toJSON()).toEqual(realtime1JSON)
  })

  it('re-resolves according to the given timeout', async () => {
    const resolve = vi.fn()

    resolve.mockImplementationOnce(async () => realtime1Buffer)
    const { result } = renderHook(() => useGtfsRealtime(resolve, 1000))
    await vi.waitFor(() => expect(result.current.toJSON()).toEqual(realtime1JSON))
    expect(result.current).toBeInstanceOf(feedMessage)
    expect(resolve).toHaveBeenCalledTimes(1)

    resolve.mockImplementationOnce(async () => realtime2Buffer)
    vi.advanceTimersByTime(1000)
    await vi.waitFor(() => expect(result.current.toJSON()).toEqual(realtime2JSON))
    expect(result.current).toBeInstanceOf(feedMessage)
    expect(resolve).toHaveBeenCalledTimes(2)
  })

  it('returns null when an error occurs', async () => {
    const resolve = async () => { throw Error() }
    const { result } = renderHook(() => useGtfsRealtime(resolve, 1000))
    await vi.waitFor(() => expect(result.current).toBeNull())
  })
})
