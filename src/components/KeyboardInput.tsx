import React from "react";
import { useAppendAndHold } from "../hooks/useAppendAndHold";
import { useSubscribeToInputEvent } from "../hooks/useSubscribeToInputEvent";

export const KeyboardInput: React.FC = () => {
  const { value, addValue, setValue } = useAppendAndHold<React.ReactNode>();
  const subscribeToInputEvent = useSubscribeToInputEvent();

  React.useEffect(
    () =>
      subscribeToInputEvent("key_typed", (data) => {
        if (data.char === "Enter") {
          addValue("<ENTER>");
        } else if (data.mask > 0) {
          setValue(data.char);
        } else {
          addValue(data.char);
        }
      }),
    [subscribeToInputEvent, addValue, setValue],
  );

  return <div>You typed: {value}</div>;
};
