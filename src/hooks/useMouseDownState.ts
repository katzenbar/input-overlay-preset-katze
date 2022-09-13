import React, { Reducer } from "react";
import { useSubscribeToInputEvent } from "./useSubscribeToInputEvent";

export type MouseDownState = {
  [buttonId: number]: boolean | undefined;
};

const mouseDownState: MouseDownState = {};

type Action = { type: "mousePressed"; button: number } | { type: "mouseReleased"; button: number };

const reducer: Reducer<MouseDownState, Action> = (prevState, action) => {
  switch (action.type) {
    case "mousePressed":
      return { ...prevState, [action.button]: true };
    case "mouseReleased":
      return { ...prevState, [action.button]: false };
    default:
      throw new Error();
  }
};

export const useMouseDownState = () => {
  const [state, dispatch] = React.useReducer(reducer, mouseDownState);
  const subscribeToInputEvent = useSubscribeToInputEvent();

  React.useEffect(
    () =>
      subscribeToInputEvent("mouse_pressed", (data) => {
        dispatch({ type: "mousePressed", button: data.button });
      }),
    [subscribeToInputEvent],
  );

  React.useEffect(
    () =>
      subscribeToInputEvent("mouse_released", (data) => {
        dispatch({ type: "mouseReleased", button: data.button });
      }),
    [subscribeToInputEvent],
  );

  return state;
};
