import { renderHook } from '@testing-library/react'
import fs from 'fs'
import { describe, expect, it, vi } from 'vitest'
import useGtfsSchedule from '../lib/useGtfsSchedule.js'

const scheduleBuffer = fs.readFileSync('test/schedule.zip')

describe('useGtfsSchedule', () => {
  it('returns undefined when unresolved', async () => {
    const resolve = async () => scheduleBuffer
    const { result } = renderHook(() => useGtfsSchedule(resolve, 1000))
    expect(result.current).toBeUndefined()
  })

  it('returns a parsed object representation of the schedule file when resolved', async () => {
    const resolve = async () => scheduleBuffer
    const { result } = renderHook(() => useGtfsSchedule(resolve, 1000))
    await vi.waitFor(() => expect(result.current).toEqual({
      agency: [{
        agencyId: 'SATCo',
        agencyName: 'PVTA',
        agencyUrl: 'http://www.pvta.com',
        agencyTimezone: 'America/New_York',
        agencyLang: 'EN',
        agencyPhone: '413 781 7882',
        agencyFareUrl: 'https://www.pvta.com/faresPassesBus.php',
      }],
      routes: [{
        routeId: '30',
        routeShortName: '30',
        routeLongName: 'North Amherst / Old Belchertown Rd',
        routeDesc: '',
        routeType: '3',
        routeUrl: '',
        routeColor: 'FBB033',
        routeTextColor: '000000',
        networkId: 'UM',
        routeSortOrder: '22',
      }, {
        routeId: '31',
        routeShortName: '31',
        routeLongName: 'Sunderland / South Amherst',
        routeDesc: '',
        routeType: '3',
        routeUrl: '',
        routeColor: 'EF4E91',
        routeTextColor: '000000',
        networkId: 'UM',
        routeSortOrder: '23',
      }]
    }))
  })
})
