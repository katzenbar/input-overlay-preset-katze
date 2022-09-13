import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMouseDownState } from "./useMouseDownState";
import { useSubscribeToInputEvent } from "./useSubscribeToInputEvent";
import { asMockedFunction } from "../util/testHelpers";

vi.mock("./useSubscribeToInputEvent", () => ({
  useSubscribeToInputEvent: vi.fn(),
}));
const useSubscribeToInputEventMock = asMockedFunction(useSubscribeToInputEvent);

describe.concurrent("useMouseDownState", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("tracks a mouse button as being pressed and released", () => {
    const subscribeMock = vi.fn();
    useSubscribeToInputEventMock.mockImplementation(() => subscribeMock);

    const { result } = renderHook(() => useMouseDownState());

    expect(subscribeMock).toHaveBeenCalledTimes(2);
    const mousePressedCallback = subscribeMock.mock.calls.find((args) => args[0] === "mouse_pressed")?.at(1) as any;
    const mouseReleasedCallback = subscribeMock.mock.calls.find((args) => args[0] === "mouse_released")?.at(1) as any;

    mousePressedCallback("mouse_pressed", { button: 1 });
    waitFor(() => {
      expect(result.current).toEqual({ 1: true });
    });

    mouseReleasedCallback("mouse_released", { button: 1 });
    waitFor(() => {
      expect(result.current).toEqual({ 1: false });
    });
  });

  it("handles multiple mouse buttons being manipulated at the same time", () => {
    const subscribeMock = vi.fn();
    useSubscribeToInputEventMock.mockImplementation(() => subscribeMock);

    const { result } = renderHook(() => useMouseDownState());

    expect(subscribeMock).toHaveBeenCalledTimes(2);
    const mousePressedCallback = subscribeMock.mock.calls.find((args) => args[0] === "mouse_pressed")?.at(1) as any;
    const mouseReleasedCallback = subscribeMock.mock.calls.find((args) => args[0] === "mouse_released")?.at(1) as any;

    mousePressedCallback("mouse_pressed", { button: 1 });
    waitFor(() => {
      expect(result.current).toEqual({ 1: true });
    });

    mousePressedCallback("mouse_pressed", { button: 2 });
    waitFor(() => {
      expect(result.current).toEqual({ 1: true, 2: true });
    });

    mouseReleasedCallback("mouse_released", { button: 1 });
    waitFor(() => {
      expect(result.current).toEqual({ 1: false, 2: true });
    });

    mouseReleasedCallback("mouse_released", { button: 2 });
    waitFor(() => {
      expect(result.current).toEqual({ 1: false, 2: false });
    });
  });
});
