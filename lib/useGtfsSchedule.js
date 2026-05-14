import { camelCase } from "change-case";
import JSZip from "jszip";
import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import useRefresh from "./useRefresh.js";

export default function useGtfsSchedule(resolve, timeout, retry = 1000) {
  const rawScheduleData = useRefresh(resolve, timeout, retry);
  const dataCache = useRef({});
  const [data, setData] = useState();
  useEffect(() => {
    if (rawScheduleData === undefined) {
      setData(undefined);
    } else {
      // oxlint-disable-next-line promise/catch-or-return
      JSZip.loadAsync(rawScheduleData).then((zip) => {
        const parses = [];
        for (const [filename, file] of Object.entries(zip.files)) {
          const parse = file
            .async("text")
            .then(parseCsv)
            .then((json) => {
              dataCache.current[camelCase(removeExtension(filename))] = json;
              setData({ ...dataCache.current });
              return json;
            });
          parses.push(parse);
        }
        return Promise.all(parses);
      });
    }
  }, [rawScheduleData]);
  return data;
}

function parseCsv(csvString) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvString, {
      header: true,
      transformHeader: camelCase,
      skipEmptyLines: true,
      complete: (result) => resolve(result.data),
      error: reject,
    });
  });
}

function removeExtension(filename) {
  return filename.replace(/\.[^/.]+$/u, "");
}
