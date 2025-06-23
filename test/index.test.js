import { describe, expect, it } from 'vitest'
import { useGtfsSchedule } from '../lib/index.js'

describe('entrypoint', () => {
  it('exports a useGtfsSchedule hook', () => {
    expect(useGtfsSchedule).toBeTypeOf('function')
  })
})
