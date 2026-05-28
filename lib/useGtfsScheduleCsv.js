import useRefresh from "./useRefresh.js";
import { useEffect, useState } from "react";
import { parseCsvAsync } from "./parsers.js";

export default function useGtfsScheduleCsv(resolve, timeout, retry = 1000) {
  const rawData = useRefresh(resolve, timeout, retry);
  const [data, setData] = useState();
  useEffect(() => {
    if (rawData === undefined) {
      setData(undefined);
    } else {
      // oxlint-disable-next-line promise/catch-or-return
      parseCsvAsync(new TextDecoder().decode(rawData)).then((parsed) => setData(parsed));
    }
  }, [rawData]);
  return data;
}
