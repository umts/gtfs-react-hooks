import { renderHook } from "@testing-library/react";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";
import useGtfsRealtime from "../lib/useGtfsRealtime.js";

import parsedRealtime from "./fixtures/realtime.json";
const rawRealtime = fs.readFileSync("test/fixtures/realtime.proto");

describe("useGtfsRealtime", () => {
  it("returns undefined when unresolved", () => {
    const { result } = renderHook(() => useGtfsRealtime(() => Promise.resolve(rawRealtime), 1000));

    expect(result.current).toBeUndefined();
  });

  it("returns undefined when resolved to undefined", async () => {
    const resolve = vi.fn();
    resolve.mockImplementationOnce(() => Promise.resolve(rawRealtime));
    const { result } = renderHook(() => useGtfsRealtime(resolve, 1000));
    await vi.waitFor(() => expect(result.current.toJSON()).toEqual(parsedRealtime));

    resolve.mockImplementationOnce(() => Promise.resolve());
    vi.advanceTimersByTime(1000);

    await vi.waitFor(() => expect(result.current).toBeUndefined());
  });

  it("returns parsed realtime data when resolved to a Uint8Array", async () => {
    const { result } = renderHook(() => useGtfsRealtime(() => Promise.resolve(rawRealtime), 1000));

    await vi.waitFor(() =>
      expect(result.current).toBeInstanceOf(GtfsRealtimeBindings.transit_realtime.FeedMessage),
    );
    expect(result.current.toJSON()).toEqual(parsedRealtime);
  });

  it("periodically re-resolves according to the given timeout and retry values", async () => {
    const resolve = vi.fn();
    resolve.mockImplementationOnce(() => Promise.resolve(rawRealtime));
    const { result } = renderHook(() => useGtfsRealtime(resolve, 5000, 1000));

    await vi.waitFor(() => expect(result.current.toJSON()).toEqual(parsedRealtime));
    expect(resolve).toHaveBeenCalledTimes(1);

    // create a problem and wait for the next regular refresh
    resolve.mockImplementationOnce(() => Promise.resolve());
    vi.advanceTimersByTime(5000);

    await vi.waitFor(() => expect(result.current).toEqual(undefined));
    expect(resolve).toHaveBeenCalledTimes(2);

    // fix problem and wait for the next retry refresh
    resolve.mockImplementationOnce(() => Promise.resolve(rawRealtime));
    vi.advanceTimersByTime(1000);

    await vi.waitFor(() => expect(result.current.toJSON()).toEqual(parsedRealtime));
    expect(resolve).toHaveBeenCalledTimes(3);
  });
});
