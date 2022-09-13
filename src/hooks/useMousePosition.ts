import React from "react";
import { useSubscribeToInputEvent } from "./useSubscribeToInputEvent";

export type MousePosition = { x: number; y: number };

export const useMousePosition = (): MousePosition => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const subscribeToInputEvent = useSubscribeToInputEvent();

  React.useEffect(
    () =>
      subscribeToInputEvent("mouse_moved", (data) => {
        setMousePosition({ x: data.x, y: data.y });
      }),
    [subscribeToInputEvent],
  );

  return mousePosition;
};
