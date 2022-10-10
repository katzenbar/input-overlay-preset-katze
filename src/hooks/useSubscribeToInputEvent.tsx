import React, { PropsWithChildren } from "react";
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

// eslint-disable-next-line @typescript-eslint/no-empty-function
const InputEventEmitterContext = React.createContext<SubscribeToInputEventFn>(() => () => {});

export const InputEventEmitterProvider: React.FC<PropsWithChildren> = (props) => {
  const { configuration } = useConfiguration();

  React.useEffect(() => {
    let inputEventSource: (emitter: EmitInputEventFn) => () => void;

    if (configuration.event_source === "browser") {
      inputEventSource = setupDocumentInputEvents;
    } else {
      inputEventSource = setupWebSocketInputEvents;
    }

    return inputEventSource(inputEventEmitter.emit);
  }, [configuration]);

  return <InputEventEmitterContext.Provider {...props} value={inputEventEmitter.on} />;
};

export const useSubscribeToInputEvent = () => {
  return React.useContext(InputEventEmitterContext);
};
