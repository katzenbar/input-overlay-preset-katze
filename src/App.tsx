import React from "react";
import { useSubscribeToInputEvent } from "./hooks/useSubscribeToInputEvent";

function App() {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const subscribeToInputEvent = useSubscribeToInputEvent();

  React.useEffect(() => {
    const unsubFn = subscribeToInputEvent("mouse_moved", (data) => {
      setMousePosition({ x: data.x, y: data.y });
    });

    return unsubFn;
  });

  return (
    <>
      <div className="font-semibold">
        Current mouse position: {mousePosition.x}, {mousePosition.y}
      </div>
    </>
  );
}

export default App;
