import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAppendAndHold } from "./useAppendAndHold";

describe.concurrent("useAppendAndHold", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("initializes to an empty list", () => {
    const { result } = renderHook(() => useAppendAndHold());
    expect(result.current.value).toEqual([]);
  });

  it("adds a value", () => {
    const { result } = renderHook(() => useAppendAndHold<string>());

    act(() => {
      result.current.addValue("A");
    });

    expect(result.current.value).toEqual(["A"]);
  });

  it("clears value after 1 second timeout", () => {
    const { result } = renderHook(() => useAppendAndHold<string>());

    act(() => {
      result.current.addValue("A");
    });
    expect(result.current.value).toEqual(["A"]);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.value).toEqual(["A"]);

    act(() => {
      vi.advanceTimersByTime(501);
    });
    expect(result.current.value).toEqual([]);
  });

  it("resets the clear timer when another value is added", () => {
    const { result } = renderHook(() => useAppendAndHold<string>());

    act(() => {
      result.current.addValue("A");
    });
    expect(result.current.value).toEqual(["A"]);

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(result.current.value).toEqual(["A"]);

    act(() => {
      result.current.addValue("B");
    });
    expect(result.current.value).toEqual(["A", "B"]);

    act(() => {
      vi.advanceTimersByTime(501);
    });
    expect(result.current.value).toEqual(["A", "B"]);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.value).toEqual([]);
  });
});
