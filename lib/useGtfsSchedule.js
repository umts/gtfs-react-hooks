import { camelCase } from "change-case";
import { unzip } from "fflate";
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

function unzipAsync(data) {
  return new Promise((resolve, reject) => {
    unzip(data, (error, files) => {
      // istanbul ignore if
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });
}

function parseCsvAsync(csvString) {
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
