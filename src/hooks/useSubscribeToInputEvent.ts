import queryString from "query-string";
import React from "react";
import { simpleEventEmitter } from "../util/simpleEventEmitter";
import { setupDocumentInputEvents } from "./inputEvents/setupDocumentInputEvents";
import { setupWebSocketInputEvents } from "./inputEvents/setupWebSocketInputEvents";

type BaseEvent<EventType extends string> = {
  event_type: EventType;
  time: number;
  event_source: string;
};

type BaseMouseEvent<EventType extends string> = BaseEvent<EventType> & {
  button: number;
  clicks: number;
  mask: number;
  x: number;
  y: number;
};

export type InputEvents = {
  mouse_pressed: BaseMouseEvent<"mouse_pressed">;
  mouse_released: BaseMouseEvent<"mouse_released">;
  mouse_clicked: BaseMouseEvent<"mouse_clicked">;
  mouse_moved: BaseMouseEvent<"mouse_moved">;
  mouse_dragged: BaseMouseEvent<"mouse_dragged">;
};

const inputEventEmitter = simpleEventEmitter<InputEvents>();

type InputEventEmitter = typeof inputEventEmitter;
export type EmitInputEventFn = InputEventEmitter["emit"];
export type SubscribeToInputEventFn = InputEventEmitter["on"];

const queryParams = queryString.parse(location.search, { parseBooleans: true });

export const useSubscribeToInputEvent = () => {
  React.useEffect(() => {
    let inputEventSource: (emitter: EmitInputEventFn) => () => void;

    if (queryParams.event_source === "document") {
      inputEventSource = setupDocumentInputEvents;
    } else {
      inputEventSource = setupWebSocketInputEvents;
    }

    return inputEventSource(inputEventEmitter.emit);
  });

  return inputEventEmitter.on;
};
