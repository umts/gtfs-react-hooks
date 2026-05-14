import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useRefresh from "../lib/useRefresh.js";

describe("useRefresh", () => {
  it("returns undefined when unresolved", () => {
    const { result } = renderHook(() => useRefresh(() => Promise.resolve("data"), 1000));
    expect(result.current).toBeUndefined();
  });

  it("returns resolution when resolved", async () => {
    const { result } = renderHook(() => useRefresh(() => Promise.resolve("data"), 5000, 1000));
    await vi.waitFor(() => expect(result.current).toEqual("data"));
  });

  it("periodically re-resolves according to the given timeout and retry values", async () => {
    const resolve = vi.fn();
    resolve.mockImplementationOnce(() => Promise.resolve("data"));
    const { result } = renderHook(() => useRefresh(resolve, 5000, 1000));

    await vi.waitFor(() => expect(result.current).toEqual("data"));
    expect(resolve).toHaveBeenCalledTimes(1);

    // create a problem and wait for the next regular refresh
    resolve.mockImplementationOnce(() => Promise.resolve());
    vi.advanceTimersByTime(5000);

    await vi.waitFor(() => expect(result.current).toEqual(undefined));
    expect(resolve).toHaveBeenCalledTimes(2);

    // fix problem and wait for the next retry refresh
    resolve.mockImplementationOnce(() => Promise.resolve("data"));
    vi.advanceTimersByTime(1000);

    await vi.waitFor(() => expect(result.current).toEqual("data"));
    expect(resolve).toHaveBeenCalledTimes(3);

    // wait for the next regular refresh
    vi.advanceTimersByTime(5000);

    expect(resolve).toHaveBeenCalledTimes(4);
  });
});
