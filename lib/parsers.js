import { camelCase } from "change-case";
import Papa from "papaparse";
import { unzip } from "fflate";
export { parseCsvAsync, unzipAsync };

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
