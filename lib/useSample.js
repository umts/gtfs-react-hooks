// TODO: Remove this example once we actually have a real hook.

import { useEffect, useState } from 'react'

export default function useSample () {
  const [sample, setSample] = useState(null)
  useEffect(() => {
    sleep(20).then(() => setSample('sample'))
  }, [])
  return sample
}

function sleep (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
