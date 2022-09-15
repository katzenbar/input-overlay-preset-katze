import { describe, expect, it, vi } from "vitest";
import { simpleEventEmitter } from "./simpleEventEmitter";

describe.concurrent("simpleEventEmitter", () => {
  it("calls the registered callback", async () => {
    const callbackMock = vi.fn();
    const payload = { test: "event" };

    const emitter = simpleEventEmitter<{ test: typeof payload }>();

    emitter.on("test", callbackMock);
    emitter.emit("test", payload);

    expect(callbackMock).toHaveBeenCalledOnce();
    expect(callbackMock).toHaveBeenCalledWith(payload);
  });

  it("does not call a callback for another event name", () => {
    const callbackMock = vi.fn();

    const emitter = simpleEventEmitter<{ test: null; aDifferentEvent: { a: string } }>();

    emitter.on("aDifferentEvent", callbackMock);
    emitter.emit("test", null);

    expect(callbackMock).not.toHaveBeenCalled();
  });

  it("does not call a callback after its unsubscribe callback was called", () => {
    const callbackMock = vi.fn();

    const emitter = simpleEventEmitter<{ test: null }>();

    const unsubscribe = emitter.on("test", callbackMock);
    unsubscribe();
    emitter.emit("test", null);

    expect(callbackMock).not.toHaveBeenCalled();
  });
});
