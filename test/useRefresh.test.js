import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useRefresh from '../lib/useRefresh.js'

describe('useRefresh', () => {
  it('returns undefined when unresolved', async () => {
    const resolve = async () => 'data'
    const { result } = renderHook(() => useRefresh(resolve, 1000))
    expect(result.current).toBeUndefined()
  })

  it('returns resolution when resolved', async () => {
    const resolve = async () => 'data'
    const { result } = renderHook(() => useRefresh(resolve, 5000, 1000))
    await vi.waitFor(() => expect(result.current).toEqual('data'))
  })

  it('periodically re-resolves according to the given timeout and retry values', async () => {
    const resolve = vi.fn()
    resolve.mockImplementationOnce(async () => 'data')
    const { result } = renderHook(() => useRefresh(resolve, 5000, 1000))

    await vi.waitFor(() => expect(result.current).toEqual('data'))
    expect(resolve).toHaveBeenCalledTimes(1)

    // create a problem and wait for the next regular refresh
    resolve.mockImplementationOnce(async () => undefined)
    vi.advanceTimersByTime(5000)

    await vi.waitFor(() => expect(result.current).toEqual(undefined))
    expect(resolve).toHaveBeenCalledTimes(2)

    // fix problem and wait for the next retry refresh
    resolve.mockImplementationOnce(async () => 'data')
    vi.advanceTimersByTime(1000)

    await vi.waitFor(() => expect(result.current).toEqual('data'))
    expect(resolve).toHaveBeenCalledTimes(3)
  })
})
