import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useSample from '../lib/useSample.js'

describe('useSample', () => {
  it('returns undefined while waiting for a resolution', () => {
    const { result } = renderHook(() => useSample())
    expect(result.current).toBeNull()
  })

  it('returns the string sample once resolved', async () => {
    const { result } = renderHook(() => useSample())
    await vi.waitFor(() => expect(result.current).toEqual('sample'))
  })
})
