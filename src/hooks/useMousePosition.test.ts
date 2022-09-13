import { afterEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMousePosition } from "./useMousePosition";
import { useSubscribeToInputEvent } from "./useSubscribeToInputEvent";
import { asMockedFunction } from "../util/testHelpers";

vi.mock("./useSubscribeToInputEvent", () => ({
  useSubscribeToInputEvent: vi.fn(),
}));
const useSubscribeToInputEventMock = asMockedFunction(useSubscribeToInputEvent);

describe.concurrent("useMousePosition", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("updates the mouse position as events are sent", () => {
    const subscribeMock = vi.fn();
    useSubscribeToInputEventMock.mockImplementation(() => subscribeMock);

    const { result } = renderHook(() => useMousePosition());

    expect(subscribeMock).toHaveBeenCalledOnce();
    const callback = subscribeMock.mock.lastCall?.at(1);
    callback("mouse_moved", { x: 10, y: 50 });

    waitFor(() => {
      expect(result.current).toEqual({ x: 10, y: 50 });
    });

    callback("mouse_moved", { x: 100, y: 20 });

    waitFor(() => {
      expect(result.current).toEqual({ x: 100, y: 20 });
    });
  });
});
