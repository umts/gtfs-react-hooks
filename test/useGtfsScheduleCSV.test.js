import { renderHook } from "@testing-library/react";
import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";
import useGtfsScheduleCsv from "../lib/useGtfsScheduleCsv.js";

import parsedFile from "./fixtures/routes.json";
const rawFile = fs.readFileSync("test/fixtures/routes.txt");

describe("useGtfsScheduleCsv", () => {
  it("returns undefined when unresolved", () => {
    const { result } = renderHook(() => useGtfsScheduleCsv(() => Promise.resolve(rawFile), 1000));

    expect(result.current).toBeUndefined();
  });

  it("returns undefined when resolved to undefined", async () => {
    const resolve = vi.fn();
    resolve.mockImplementationOnce(() => Promise.resolve(rawFile));
    const { result } = renderHook(() => useGtfsScheduleCsv(resolve, 1000));
    await vi.waitFor(() => expect(result.current).toEqual(parsedFile));

    resolve.mockImplementationOnce(() => Promise.resolve());
    vi.advanceTimersByTime(1000);

    await vi.waitFor(() => expect(result.current).toBeUndefined());
  });

  it("returns parsed route data when resolved to a csv file", async () => {
    const { result } = renderHook(() => useGtfsScheduleCsv(() => Promise.resolve(rawFile), 1000));
    await vi.waitFor(() => expect(result.current).toEqual(parsedFile));
  });

  it("periodically re-resolves according to the given timeout and retry values", async () => {
    const resolve = vi.fn();
    resolve.mockImplementationOnce(() => Promise.resolve(rawFile));
    const { result } = renderHook(() => useGtfsScheduleCsv(resolve, 5000, 1000));

    await vi.waitFor(() => expect(result.current).toEqual(parsedFile));
    expect(resolve).toHaveBeenCalledTimes(1);

    // create a problem and wait for the next regular refresh
    resolve.mockImplementationOnce(() => Promise.resolve());
    vi.advanceTimersByTime(5000);

    await vi.waitFor(() => expect(result.current).toEqual(undefined));
    expect(resolve).toHaveBeenCalledTimes(2);

    // fix problem and wait for the next retry refresh
    resolve.mockImplementationOnce(() => Promise.resolve(rawFile));
    vi.advanceTimersByTime(1000);

    await vi.waitFor(() => expect(result.current).toEqual(parsedFile));
    expect(resolve).toHaveBeenCalledTimes(3);
  });
});
