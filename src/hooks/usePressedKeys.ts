import React from "react";
import { scanCodeToKeyCode } from "../util/keyCodeMappings";
import { useSubscribeToInputEvent } from "./useSubscribeToInputEvent";

type PressedKeyOptions = {
  minHoldTime?: number;
};

type PressedKeysState = {
  pressedKeys: Set<string>;
  pressedKeyTimers: Record<string, { timePressed: number; timeoutId: number | undefined } | undefined>;
  keyCurrentlyPressed: boolean;
};

const isKeyCurrentlyPressed = (pressedKeyTimers: PressedKeysState["pressedKeyTimers"]): boolean =>
  Object.values(pressedKeyTimers).some((timer) => timer !== undefined && timer?.timeoutId === undefined);

const defaultState: Readonly<PressedKeysState> = {
  pressedKeys: new Set(),
  pressedKeyTimers: {},
  keyCurrentlyPressed: false,
};

type Action =
  | { type: "keyDown"; keycode: string }
  | { type: "keyUp"; keycode: string; timeoutId: number }
  | { type: "keyUpAndRemove"; keycode: string };

const reducer: React.Reducer<PressedKeysState, Action> = (prevState, action) => {
  switch (action.type) {
    case "keyDown": {
      const pressedKeys = new Set(prevState.pressedKeys);
      pressedKeys.add(action.keycode);

      const pressedKeyTimers = {
        ...prevState.pressedKeyTimers,
        [action.keycode]: { timePressed: Date.now(), timeoutId: undefined },
      };

      // If any keys have a timeout (implying key is up but not removed from display), clear it and remove from set
      Object.entries(prevState.pressedKeyTimers).forEach(([keycode, value]) => {
        if (value?.timeoutId !== undefined) {
          window.clearTimeout(value.timeoutId);
          pressedKeys.delete(keycode);
          pressedKeyTimers[keycode] = undefined;
        }
      });

      return {
        pressedKeys,
        pressedKeyTimers,
        keyCurrentlyPressed: true,
      };
    }

    case "keyUp": {
      const pressedKeyTimers = {
        ...prevState.pressedKeyTimers,
        [action.keycode]: {
          timePressed: prevState.pressedKeyTimers[action.keycode]?.timePressed || 0,
          timeoutId: action.timeoutId,
        },
      };
      const keyCurrentlyPressed = isKeyCurrentlyPressed(pressedKeyTimers);

      return {
        pressedKeys: prevState.pressedKeys,
        pressedKeyTimers,
        keyCurrentlyPressed,
      };
    }

    case "keyUpAndRemove": {
      const pressedKeyTimers = { ...prevState.pressedKeyTimers, [action.keycode]: undefined };
      const keyCurrentlyPressed = isKeyCurrentlyPressed(pressedKeyTimers);
      const numTimers = Object.values(pressedKeyTimers).filter((timer) => timer?.timeoutId !== undefined).length;

      let pressedKeys = new Set(prevState.pressedKeys);
      if (keyCurrentlyPressed) {
        pressedKeys.delete(action.keycode);
      } else if (numTimers === 0) {
        pressedKeys = new Set();
      }

      return {
        pressedKeys,
        pressedKeyTimers,
        keyCurrentlyPressed,
      };
    }

    default:
      throw new Error();
  }
};

export const usePressedKeys = (options: PressedKeyOptions = {}) => {
  const { minHoldTime = 1000 } = options;

  const [state, dispatch] = React.useReducer<React.Reducer<PressedKeysState, Action>>(reducer, defaultState);
  const subscribeToInputEvent = useSubscribeToInputEvent();

  React.useEffect(
    () =>
      subscribeToInputEvent("key_pressed", (data) => {
        dispatch({ type: "keyDown", keycode: scanCodeToKeyCode(data.keycode) });
      }),
    [subscribeToInputEvent],
  );

  React.useEffect(
    () =>
      subscribeToInputEvent("key_released", (data) => {
        const keycode = scanCodeToKeyCode(data.keycode);
        const pressedKeyTimer = state.pressedKeyTimers[keycode];
        const durationPressed = Date.now() - (pressedKeyTimer?.timePressed || 0);

        if (durationPressed > minHoldTime) {
          dispatch({ type: "keyUpAndRemove", keycode });
        } else {
          const timeoutId = window.setTimeout(() => {
            dispatch({ type: "keyUpAndRemove", keycode });
          }, minHoldTime - durationPressed);

          dispatch({ type: "keyUp", keycode, timeoutId });
        }
      }),
    [subscribeToInputEvent, state.pressedKeyTimers, minHoldTime],
  );

  return { pressedKeys: state.pressedKeys, keyCurrentlyPressed: state.keyCurrentlyPressed };
};
