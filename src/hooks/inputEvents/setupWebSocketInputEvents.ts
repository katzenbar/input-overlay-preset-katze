import { EmitInputEventFn } from "../useSubscribeToInputEvent";

let webSocket: WebSocket | null = null;

export const setupWebSocketInputEvents = (emitInputEvent: EmitInputEventFn): (() => void) => {
  const createWebSocket = () => {
    const webSocket = new WebSocket("ws://localhost:16899/");

    webSocket.onmessage = (e) => {
      // TODO: emit events
      // eslint-disable-next-line no-console
      console.log(e);
    };

    webSocket.onerror = (er) => {
      // eslint-disable-next-line no-console
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
