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
    (async () => {
      const text = new TextDecoder().decode(rawData);
      const json = await parseCsvAsync(text);
      setData({ json });
      return json;
    })();
  }, [rawData]);
  return data;
}
