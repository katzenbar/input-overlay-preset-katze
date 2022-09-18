import React, { Reducer } from "react";

export type State<T> = {
  value: Array<T>;
  timeoutId: number | undefined;
};

const buildDefaultState = <T>(): State<T> => ({
  value: [],
  timeoutId: undefined,
});

type Action<T> =
  | { type: "addValue"; value: T; timeoutId: number }
  | { type: "setValue"; value: T; timeoutId: number }
  | { type: "clear" };
type AppendAndHoldReducer<T> = Reducer<State<T>, Action<T>>;

const reducer = <T>(prevState: State<T>, action: Action<T>): State<T> => {
  if (prevState.timeoutId) {
    window.clearTimeout(prevState.timeoutId);
  }

  switch (action.type) {
    case "addValue":
      return { value: [...prevState.value, action.value], timeoutId: action.timeoutId };

    case "setValue":
      return { value: [action.value], timeoutId: action.timeoutId };

    case "clear":
      return { value: [], timeoutId: undefined };

    default:
      new Error();
  }
  return prevState;
};

export const useAppendAndHold = <T>() => {
  const [state, dispatch] = React.useReducer<AppendAndHoldReducer<T>, null>(reducer, null, buildDefaultState);

  const addValue = React.useCallback((value: T): void => {
    const timeoutId = window.setTimeout(() => {
      dispatch({ type: "clear" });
    }, 1000);
    dispatch({ type: "addValue", value, timeoutId });
  }, []);

  const setValue = React.useCallback((value: T): void => {
    const timeoutId = window.setTimeout(() => {
      dispatch({ type: "clear" });
    }, 1000);
    dispatch({ type: "setValue", value, timeoutId });
  }, []);

  return { value: state.value, addValue, setValue };
};
