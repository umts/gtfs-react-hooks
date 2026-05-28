import useRefresh from "./useRefresh.js";
import { useEffect, useState } from "react";
import { parseCsvAsync } from "./parsers.js";

export default function useGtfsScheduleCSV(resolve, timeout, retry = 1000) {
  const rawData = useRefresh(resolve, timeout, retry);
  const [data, setData] = useState();
  useEffect(() => {
    if (rawData === undefined) {
      setData(undefined);
      return;
    }
    const text = new TextDecoder().decode(rawData);
    parseCsvAsync(text)
      .then((json) => {
        setData({ json });
        return json;
      })
      .catch(() => {
        // do nothing
      });
  }, [rawData]);
  return data;
}
