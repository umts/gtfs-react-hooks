import { describe, expect, it } from 'vitest'
import nothing from '../lib/index.js'

describe('entrypoint', () => {
  it('exports nothing', () => {
    expect(nothing).toBeNull()
  })
})
