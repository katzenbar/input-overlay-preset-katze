import React from "react";
import { useSubscribeToInputEvent } from "../hooks/useSubscribeToInputEvent";

export const KeyboardInput: React.FC = () => {
  const [key, setKey] = React.useState("");
  const subscribeToInputEvent = useSubscribeToInputEvent();

  React.useEffect(
    () =>
      subscribeToInputEvent("key_typed", (data) => {
        setKey(data.char);
      }),
    [subscribeToInputEvent],
  );

  return <div>KEY: {key}</div>;
};
