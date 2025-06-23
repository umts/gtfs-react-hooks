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
    const { result } = renderHook(() => useRefresh(resolve, 1000))
    await vi.waitFor(() => expect(result.current).toEqual('data'))
  })

  it('periodically re-resolves according to the given timeout', async () => {
    const resolve = vi.fn()
    resolve.mockImplementationOnce(() => 'old data')
    const { result } = renderHook(() => useRefresh(resolve, 1000))
    await vi.waitFor(() => expect(result.current).toEqual('old data'))

    resolve.mockImplementationOnce(() => 'new data')
    vi.advanceTimersByTime(1000)
    await vi.waitFor(() => expect(result.current).toEqual('new data'))
    expect(resolve).toHaveBeenCalledTimes(2)

    resolve.mockImplementationOnce(() => 'newer data')
    vi.advanceTimersByTime(1000)
    await vi.waitFor(() => expect(result.current).toEqual('newer data'))
    expect(resolve).toHaveBeenCalledTimes(3)
  })

  it('returns null when an error is raised', async () => {
    const refresh = async () => { throw Error() }
    const { result } = renderHook(() => useRefresh(refresh, 1000))
    await vi.waitFor(() => expect(result.current).toBeNull())
  })
})
