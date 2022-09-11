import React from "react";
import { simpleEventEmitter } from "../util/simpleEventEmitter";
import { InputEvents } from "./inputEvents/inputEventSchema";
import { setupDocumentInputEvents } from "./inputEvents/setupDocumentInputEvents";
import { setupWebSocketInputEvents } from "./inputEvents/setupWebSocketInputEvents";
import { useConfiguration } from "./useConfiguration";

export type { InputEvents, MouseEvent } from "./inputEvents/inputEventSchema";

const inputEventEmitter = simpleEventEmitter<InputEvents>();

type InputEventEmitter = typeof inputEventEmitter;
export type EmitInputEventFn = InputEventEmitter["emit"];
export type SubscribeToInputEventFn = InputEventEmitter["on"];

export const useSubscribeToInputEvent = () => {
  const { configuration } = useConfiguration();

  React.useEffect(() => {
    let inputEventSource: (emitter: EmitInputEventFn) => () => void;

    if (configuration.event_source === "document") {
      inputEventSource = setupDocumentInputEvents;
    } else {
      inputEventSource = setupWebSocketInputEvents;
    }

    return inputEventSource(inputEventEmitter.emit);
  }, [configuration]);

  return inputEventEmitter.on;
};
