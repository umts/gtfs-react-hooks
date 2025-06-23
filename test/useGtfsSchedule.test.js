import { renderHook } from '@testing-library/react'
import fs from 'fs'
import { describe, expect, it, vi } from 'vitest'
import useGtfsSchedule from '../lib/useGtfsSchedule.js'

const scheduleBuffer1 = fs.readFileSync('test/schedule1.zip')
const scheduleBuffer2 = fs.readFileSync('test/schedule2.zip')
const scheduleBuffer3 = fs.readFileSync('test/schedule3.zip')

describe('useGtfsSchedule', () => {
  it('returns undefined when unresolved', async () => {
    const resolve = async () => scheduleBuffer1
    const { result } = renderHook(() => useGtfsSchedule(resolve, 1000))
    expect(result.current).toBeUndefined()
  })

  it('returns a collection of parsed csv files when resolved', async () => {
    const resolve = async () => scheduleBuffer1
    const { result } = renderHook(() => useGtfsSchedule(resolve, 1000))
    await vi.waitFor(() => expect(result.current).toEqual({
      agency1: [{ agencyId: 'SATCo', agencyName: 'PVTA' }],
      routes1: [{ routeId: '1', routeShortName: '1' }, { routeId: '2', routeShortName: '2' }],
    }))
  })

  it('periodically re-resolves according to the given timeout', async () => {
    const resolve = vi.fn()
    resolve.mockImplementationOnce(async () => scheduleBuffer1)
    const { result } = renderHook(() => useGtfsSchedule(resolve, 1000))
    await vi.waitFor(() => expect(result.current).toEqual({
      agency1: [{ agencyId: 'SATCo', agencyName: 'PVTA' }],
      routes1: [{ routeId: '1', routeShortName: '1' }, { routeId: '2', routeShortName: '2' }],
    }))
    expect(resolve).toHaveBeenCalledTimes(1)

    resolve.mockImplementationOnce(async () => scheduleBuffer2)
    vi.advanceTimersByTime(1000)
    await vi.waitFor(() => expect(result.current).toEqual({
      agency2: [{ agencyId: 'VATCo', agencyName: 'PVTA' }],
      routes2: [{ routeId: '3', routeShortName: '3' }, { routeId: '4', routeShortName: '4' }],
    }))
    expect(resolve).toHaveBeenCalledTimes(2)

    resolve.mockImplementationOnce(async () => scheduleBuffer3)
    vi.advanceTimersByTime(1000)
    await vi.waitFor(() => expect(result.current).toEqual({
      agency3: [{ agencyId: 'UMTS', agencyName: 'PVTA' }],
      routes3: [{ routeId: '5', routeShortName: '5' }, { routeId: '6', routeShortName: '6' }],
    }))
    expect(resolve).toHaveBeenCalledTimes(3)
  })

  it('returns null when an error is raised', async () => {
    const resolve = async () => { throw Error() }
    const { result } = renderHook(() => useGtfsSchedule(resolve, 1000))
    await vi.waitFor(() => expect(result.current).toBeNull())
  })
})
