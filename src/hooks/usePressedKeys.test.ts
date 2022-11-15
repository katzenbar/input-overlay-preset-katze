import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { asMockedFunction } from "../util/testHelpers";
import { usePressedKeys } from "./usePressedKeys";
import { useSubscribeToInputEvent } from "./useSubscribeToInputEvent";

vi.mock("./useSubscribeToInputEvent", () => ({
  useSubscribeToInputEvent: vi.fn().mockReturnValue(() => undefined),
}));
const useSubscribeToInputEventMock = asMockedFunction(useSubscribeToInputEvent);

describe.concurrent("usePressedKeys", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("starts with an empty default state", () => {
    const { result } = renderHook(() => usePressedKeys());

    expect(result.current).toEqual({
      pressedKeys: new Set(),
      keyCurrentlyPressed: false,
    });
  });

  it("maintains the key press for 500ms", () => {
    const subscribeMock = vi.fn();
    useSubscribeToInputEventMock.mockReturnValue(subscribeMock);

    const { result } = renderHook(() => usePressedKeys({ minDisplayTime: 500, minUpDisplayTime: 0 }));

    const keyPressedMock = subscribeMock.mock.calls.find((args) => args[0] === "key_pressed")?.at(1) as any;
    const keyReleasedMock = subscribeMock.mock.calls.find((args) => args[0] === "key_released")?.at(1) as any;
    expect(keyPressedMock).toBeTruthy();

    act(() => {
      keyPressedMock({ keycode: 0x001e });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_A"]),
      keyCurrentlyPressed: true,
    });

    act(() => {
      vi.setSystemTime(200);
      keyReleasedMock({ keycode: 0x001e });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_A"]),
      keyCurrentlyPressed: false,
    });

    act(() => {
      vi.setSystemTime(500);
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(),
      keyCurrentlyPressed: false,
    });
  });

  it("continues to show the up state for the specified time, if held longer than minDisplayTime", () => {
    const subscribeMock = vi.fn();
    useSubscribeToInputEventMock.mockReturnValue(subscribeMock);

    const { result } = renderHook(() => usePressedKeys({ minDisplayTime: 250, minUpDisplayTime: 400 }));

    const keyPressedMock = subscribeMock.mock.calls.find((args) => args[0] === "key_pressed")?.at(1) as any;
    const keyReleasedMock = subscribeMock.mock.calls.find((args) => args[0] === "key_released")?.at(1) as any;
    expect(keyPressedMock).toBeTruthy();

    act(() => {
      keyPressedMock({ keycode: 0x001e });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_A"]),
      keyCurrentlyPressed: true,
    });

    act(() => {
      vi.setSystemTime(300);
      keyReleasedMock({ keycode: 0x001e });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_A"]),
      keyCurrentlyPressed: false,
    });

    act(() => {
      vi.setSystemTime(600);
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_A"]),
      keyCurrentlyPressed: false,
    });

    act(() => {
      vi.setSystemTime(701);
      vi.advanceTimersByTime(101);
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(),
      keyCurrentlyPressed: false,
    });
  });

  it("shows up for the min display time, if the min up display time is less than the time remaining", () => {
    const subscribeMock = vi.fn();
    useSubscribeToInputEventMock.mockReturnValue(subscribeMock);

    const { result } = renderHook(() => usePressedKeys({ minDisplayTime: 700, minUpDisplayTime: 200 }));

    const keyPressedMock = subscribeMock.mock.calls.find((args) => args[0] === "key_pressed")?.at(1) as any;
    const keyReleasedMock = subscribeMock.mock.calls.find((args) => args[0] === "key_released")?.at(1) as any;
    expect(keyPressedMock).toBeTruthy();

    act(() => {
      keyPressedMock({ keycode: 0x001e });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_A"]),
      keyCurrentlyPressed: true,
    });

    act(() => {
      vi.setSystemTime(300);
      keyReleasedMock({ keycode: 0x001e });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_A"]),
      keyCurrentlyPressed: false,
    });

    act(() => {
      vi.setSystemTime(600);
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_A"]),
      keyCurrentlyPressed: false,
    });

    act(() => {
      vi.setSystemTime(701);
      vi.advanceTimersByTime(101);
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(),
      keyCurrentlyPressed: false,
    });
  });

  it("handles multiple keys being pressed and released", () => {
    const subscribeMock = vi.fn();
    useSubscribeToInputEventMock.mockReturnValue(subscribeMock);

    const { result } = renderHook(() => usePressedKeys({ minUpDisplayTime: 0 }));

    const keyPressedMock = subscribeMock.mock.calls.find((args) => args[0] === "key_pressed")?.at(1) as any;
    const keyReleasedMock = subscribeMock.mock.calls.find((args) => args[0] === "key_released")?.at(1) as any;
    expect(keyPressedMock).toBeTruthy();

    act(() => {
      keyPressedMock({ keycode: 0x0e5b });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_META_L"]),
      keyCurrentlyPressed: true,
    });

    act(() => {
      vi.setSystemTime(200);
      keyPressedMock({ keycode: 0x001e });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_META_L", "VC_A"]),
      keyCurrentlyPressed: true,
    });

    act(() => {
      vi.setSystemTime(500);
      keyReleasedMock({ keycode: 0x001e });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_META_L", "VC_A"]),
      keyCurrentlyPressed: true,
    });

    act(() => {
      vi.advanceTimersByTime(501);
      vi.setSystemTime(1001);
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_META_L"]),
      keyCurrentlyPressed: true,
    });

    act(() => {
      keyReleasedMock({ keycode: 0x0e5b });
      vi.advanceTimersByTime(501);
      vi.setSystemTime(1001);
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(),
      keyCurrentlyPressed: false,
    });
  });

  it("separates keys being pressed in quick succession, but not at the same time", () => {
    const subscribeMock = vi.fn();
    useSubscribeToInputEventMock.mockReturnValue(subscribeMock);

    const { result } = renderHook(() => usePressedKeys({ minUpDisplayTime: 0 }));

    const keyPressedMock = subscribeMock.mock.calls.find((args) => args[0] === "key_pressed")?.at(1) as any;
    const keyReleasedMock = subscribeMock.mock.calls.find((args) => args[0] === "key_released")?.at(1) as any;
    expect(keyPressedMock).toBeTruthy();

    act(() => {
      keyPressedMock({ keycode: 0x001e });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_A"]),
      keyCurrentlyPressed: true,
    });

    act(() => {
      vi.setSystemTime(50);
      keyReleasedMock({ keycode: 0x001e });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_A"]),
      keyCurrentlyPressed: false,
    });

    act(() => {
      keyPressedMock({ keycode: 0x0030 });
      vi.setSystemTime(150);
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_B"]),
      keyCurrentlyPressed: true,
    });

    act(() => {
      vi.setSystemTime(200);
      keyReleasedMock({ keycode: 0x0030 });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_B"]),
      keyCurrentlyPressed: false,
    });
  });

  it("releases keys pressed as a chord at the same time as the last key", () => {
    const subscribeMock = vi.fn();
    useSubscribeToInputEventMock.mockReturnValue(subscribeMock);

    const { result } = renderHook(() => usePressedKeys({ minDisplayTime: 500, minUpDisplayTime: 0 }));

    const keyPressedMock = subscribeMock.mock.calls.find((args) => args[0] === "key_pressed")?.at(1) as any;
    const keyReleasedMock = subscribeMock.mock.calls.find((args) => args[0] === "key_released")?.at(1) as any;
    expect(keyPressedMock).toBeTruthy();

    act(() => {
      keyPressedMock({ keycode: 0x0e5b });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_META_L"]),
      keyCurrentlyPressed: true,
    });

    act(() => {
      vi.setSystemTime(50);
      keyPressedMock({ keycode: 0x001e });
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_META_L", "VC_A"]),
      keyCurrentlyPressed: true,
    });

    act(() => {
      vi.setSystemTime(150);
      keyReleasedMock({ keycode: 0x001e });
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_META_L", "VC_A"]),
      keyCurrentlyPressed: true,
    });

    act(() => {
      vi.setSystemTime(200);
      keyReleasedMock({ keycode: 0x0e5b });
      vi.advanceTimersByTime(50);
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_META_L", "VC_A"]),
      keyCurrentlyPressed: false,
    });

    act(() => {
      vi.setSystemTime(600);
      vi.advanceTimersByTime(50);
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(["VC_META_L", "VC_A"]),
      keyCurrentlyPressed: false,
    });
    act(() => {
      vi.setSystemTime(650);
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toEqual({
      pressedKeys: new Set(),
      keyCurrentlyPressed: false,
    });
  });
});
