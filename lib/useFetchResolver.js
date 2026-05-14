import { useCallback } from "react";

export default function useFetchResolver(url) {
  return useCallback(async () => {
    try {
      const response = await fetch(url);
      if (response.status === 200) {
        return new Uint8Array(await response.arrayBuffer());
      }
    } catch {
      // do nothing
    }
  }, [url]);
}
