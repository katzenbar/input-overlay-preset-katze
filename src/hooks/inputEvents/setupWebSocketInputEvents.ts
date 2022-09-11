/* eslint-disable no-console */
import { EmitInputEventFn } from "../useSubscribeToInputEvent";
import { inputEventSchema } from "./inputEventSchema";

let webSocket: WebSocket | null = null;

export const setupWebSocketInputEvents = (emitInputEvent: EmitInputEventFn): (() => void) => {
  const createWebSocket = () => {
    const webSocket = new WebSocket("ws://localhost:16899/");

    webSocket.onmessage = (e) => {
      try {
        const eventData = JSON.parse(e.data);
        const result = inputEventSchema.safeParse(eventData);

        if (result.success) {
          emitInputEvent(result.data.event_type, result.data);
        } else {
          console.warn("Unsupported event data:", e.data, result.error);
        }
      } catch {
        console.error("Error parsing message:", e.data);
      }
    };

    webSocket.onerror = (er) => {
      console.error("WebSocket error occurred:", er);
    };

    return webSocket;
  };

  webSocket = createWebSocket();

  return () => {
    webSocket?.close();
    webSocket = null;
  };
};
