import { describe, expect, it } from 'vitest'
import { useSample } from '../lib/index.js'

describe('exports', () => {
  it('exports a useSample hook', () => {
    expect(useSample).toBeTypeOf('function')
  })
})
