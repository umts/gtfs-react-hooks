import { camelCase } from "change-case";
import { useEffect, useRef, useState } from "react";
import useRefresh from "./useRefresh.js";
import { parseCsvAsync, unzipAsync } from "./parsers.js";

export default function useGtfsSchedule(resolve, timeout, retry = 1000) {
  const rawScheduleData = useRefresh(resolve, timeout, retry);
  const dataCache = useRef({});
  const [data, setData] = useState();
  useEffect(() => {
    if (rawScheduleData === undefined) {
      setData(undefined);
    } else {
      // oxlint-disable-next-line promise/catch-or-return
      unzipAsync(rawScheduleData).then((files) => {
        const parses = Object.entries(files).map(([filename, uint8arr]) => {
          const text = new TextDecoder().decode(uint8arr);
          return parseCsvAsync(text).then((json) => {
            dataCache.current[camelCase(removeExtension(filename))] = json;
            setData({ ...dataCache.current });
            return json;
          });
        });
        return Promise.all(parses);
      });
    }
  }, [rawScheduleData]);
  return data;
}

function removeExtension(filename) {
  return filename.replace(/\.[^/.]+$/u, "");
}
