import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useGtfsSchedule from '../lib/useGtfsSchedule.js'

describe('useGtfsSchedule', () => {
  it('returns null', async () => {
    const { result } = renderHook(() => useGtfsSchedule())
    expect(result.current).toBeNull()
  })
})
