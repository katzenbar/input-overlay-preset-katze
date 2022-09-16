import React from "react";
import { scanCodeToKeyCode } from "../hooks/inputEvents/keyCodeMappings";
import { useSubscribeToInputEvent } from "../hooks/useSubscribeToInputEvent";

export const KeyboardInput: React.FC = () => {
  const [key, setKey] = React.useState("");
  const subscribeToInputEvent = useSubscribeToInputEvent();

  React.useEffect(
    () =>
      subscribeToInputEvent("key_pressed", (data) => {
        setKey(scanCodeToKeyCode(data.keycode));
      }),
    [subscribeToInputEvent],
  );

  return <div>KEY: {key}</div>;
};
