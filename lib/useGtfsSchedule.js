import { camelCase } from 'change-case'
import JSZip from 'jszip'
import Papa from 'papaparse'
import { useEffect, useState } from 'react'
import useRefresh from './useRefresh.js'

export default function useGtfsSchedule (resolve, timeout) {
  const rawScheduleData = useRefresh(resolve, timeout)
  const [data, setData] = useState(undefined)
  useEffect(() => {
    if (rawScheduleData === undefined) {
      setData(undefined)
    } else {
      JSZip.loadAsync(rawScheduleData).then((zip) => {
        const cache = { ...data }
        for (const [filename, file] of Object.entries(zip.files)) {
          file.async('text').then(parseCsv).then((json) => {
            cache[camelCase(removeExtension(filename))] = json
            setData({ ...cache })
          })
        }
      })
    }
  }, [rawScheduleData])
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
