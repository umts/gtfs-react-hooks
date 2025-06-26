import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useFetchResolver from '../lib/useFetchResolver.js'

describe('useFetchResolver', () => {
  it('returns undefined when an error is raised', async () => {
    const fetchMock = vi.fn(async () => { throw new Error() })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useFetchResolver('https://example.com'))
    const data = await result.current()

    expect(data).toEqual(undefined)
  })

  it('returns undefined when the response is not a 200', async () => {
    const fetchMock = vi.fn(async () => ({ status: 503 }))
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useFetchResolver('https://example.com'))
    const data = await result.current()

    expect(data).toEqual(undefined)
  })

  it('returns the raw response body as a Uint8Array when response is a 200', async () => {
    const fetchMock = vi.fn(async () => {
      const buffer = new ArrayBuffer(8)
      const view = new Uint8Array(buffer)
      for (let i = 0; i < 8; i++) {
        view[i] = i
      }
      return { status: 200, arrayBuffer: async () => buffer }
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useFetchResolver('https://example.com'))
    const data = await result.current()

    expect(data).toBeInstanceOf(Uint8Array)
    expect(Array.from(data)).toEqual([0, 1, 2, 3, 4, 5, 6, 7])
  })
})
