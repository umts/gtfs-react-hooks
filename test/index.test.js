import { describe, expect, it } from 'vitest'
import { useGtfsRealtime, useGtfsSchedule } from '../lib/index.js'

describe('entrypoint', () => {
  it('exports a useGtfsRealtime hook', () => {
    expect(useGtfsRealtime).toBeTypeOf('function')
  })

  it('exports a useGtfsSchedule hook', () => {
    expect(useGtfsSchedule).toBeTypeOf('function')
  })
})
