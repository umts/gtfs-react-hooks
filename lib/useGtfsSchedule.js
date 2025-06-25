import { camelCase } from 'change-case'
import JSZip from 'jszip'
import Papa from 'papaparse'
import { useEffect, useState } from 'react'
import useRefresh from './useRefresh.js'

export default function useGtfsSchedule (resolve, timeout) {
  const scheduleArrayBuffer = useRefresh(resolve, timeout)
  const [data, setData] = useState(undefined)
  useEffect(() => {
    if (scheduleArrayBuffer === undefined) {
      setData(scheduleArrayBuffer)
    } else {
      setData({})
      JSZip.loadAsync(scheduleArrayBuffer).then((zip) => {
        const cache = {}
        for (const [filename, file] of Object.entries(zip.files)) {
          file.async('text').then(parseCsv).then((json) => {
            cache[camelCase(removeExtension(filename))] = json
            setData({ ...cache })
          })
        }
      })
    }
  }, [scheduleArrayBuffer])
  return data
}

async function parseCsv (csvString) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      transformHeader: camelCase,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
    })
  })
}

function removeExtension (filename) {
  return filename.replace(/\.[^/.]+$/, '')
}
