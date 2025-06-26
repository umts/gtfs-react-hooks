import { renderHook } from '@testing-library/react'
import fs from 'fs'
import { describe, expect, it, vi } from 'vitest'
import useGtfsSchedule from '../lib/useGtfsSchedule.js'

import parsedSchedule from './fixtures/schedule.json'
const rawSchedule = fs.readFileSync('test/fixtures/schedule.zip')

describe('useGtfsSchedule', () => {
  it('returns undefined when unresolved', async () => {
    const resolve = async () => rawSchedule
    const { result } = renderHook(() => useGtfsSchedule(resolve, 1000))

    expect(result.current).toBeUndefined()
  })

  it('returns undefined when resolved to undefined', async () => {
    const resolve = vi.fn()
    resolve.mockImplementationOnce(async () => rawSchedule)
    const { result } = renderHook(() => useGtfsSchedule(resolve, 1000))
    await vi.waitFor(() => expect(result.current).toEqual(parsedSchedule))

    resolve.mockImplementationOnce(async () => undefined)
    vi.advanceTimersByTime(1000)

    await vi.waitFor(() => expect(result.current).toBeUndefined())
  })

  it('returns parsed schedule data when resolved to a Uint8Array', async () => {
    const resolve = async () => rawSchedule
    const { result } = renderHook(() => useGtfsSchedule(resolve, 1000))

    await vi.waitFor(() => expect(result.current).toEqual(parsedSchedule))
  })

  it('periodically re-resolves according to the given timeout and retry values', async () => {
    const resolve = vi.fn()
    resolve.mockImplementationOnce(async () => rawSchedule)
    const { result } = renderHook(() => useGtfsSchedule(resolve, 5000, 1000))

    await vi.waitFor(() => expect(result.current).toEqual(parsedSchedule))
    expect(resolve).toHaveBeenCalledTimes(1)

    // create a problem and wait for the next regular refresh
    resolve.mockImplementationOnce(async () => undefined)
    vi.advanceTimersByTime(5000)

    await vi.waitFor(() => expect(result.current).toEqual(undefined))
    expect(resolve).toHaveBeenCalledTimes(2)

    // fix problem and wait for the next retry refresh
    resolve.mockImplementationOnce(async () => rawSchedule)
    vi.advanceTimersByTime(1000)

    await vi.waitFor(() => expect(result.current).toEqual(parsedSchedule))
    expect(resolve).toHaveBeenCalledTimes(3)
  })
})
