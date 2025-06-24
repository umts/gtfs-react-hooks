import { renderHook } from '@testing-library/react'
import fs from 'fs'
import { describe, expect, it, vi } from 'vitest'
import useGtfsSchedule from '../lib/useGtfsSchedule.js'

import parsedSchedule1 from './fixtures/schedule1-parsed.json'
import parsedSchedule2 from './fixtures/schedule2-parsed.json'
import parsedSchedule3 from './fixtures/schedule3-parsed.json'

const scheduleBuffer1 = fs.readFileSync('test/fixtures/schedule1-raw.zip')
const scheduleBuffer2 = fs.readFileSync('test/fixtures/schedule2-raw.zip')
const scheduleBuffer3 = fs.readFileSync('test/fixtures/schedule3-raw.zip')

describe('useGtfsSchedule', () => {
  it('returns undefined when unresolved', async () => {
    const resolve = async () => scheduleBuffer1
    const { result } = renderHook(() => useGtfsSchedule(resolve, 1000))
    expect(result.current).toBeUndefined()
  })

  it('returns a collection of parsed csv files when resolved', async () => {
    const resolve = async () => scheduleBuffer1
    const { result } = renderHook(() => useGtfsSchedule(resolve, 1000))
    await vi.waitFor(() => expect(result.current).toEqual(parsedSchedule1))
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
    await vi.waitFor(() => expect(result.current).toEqual(parsedSchedule2))
    expect(resolve).toHaveBeenCalledTimes(2)

    resolve.mockImplementationOnce(async () => scheduleBuffer3)
    vi.advanceTimersByTime(1000)
    await vi.waitFor(() => expect(result.current).toEqual(parsedSchedule3))
    expect(resolve).toHaveBeenCalledTimes(3)
  })

  it('returns null when an error is raised', async () => {
    const resolve = async () => { throw Error() }
    const { result } = renderHook(() => useGtfsSchedule(resolve, 1000))
    await vi.waitFor(() => expect(result.current).toBeNull())
  })
})
