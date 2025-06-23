import { describe, expect, it } from 'vitest'
import { useGtfsRealtime } from '../lib/index.js'

describe('entrypoint', () => {
  it('exports a useGtfsRealtime hook', () => {
    expect(useGtfsRealtime).toBeTypeOf('function')
  })
})
