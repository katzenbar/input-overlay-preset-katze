import { MouseClickHighlight } from "./components/MouseClickHighlight";
import { InputEventEmitterProvider } from "./hooks/useSubscribeToInputEvent";

function App() {
  return (
    <InputEventEmitterProvider>
      <MouseClickHighlight />
    </InputEventEmitterProvider>
  );
}

export default App;
