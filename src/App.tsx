import { ConfigurationEditor } from "./components/ConfigurationEditor";
import { KeyboardInput } from "./components/KeyboardInput";
import { MouseClickHighlight } from "./components/MouseClickHighlight";
import { ConfigurationProvider } from "./hooks/useConfiguration";
import { InputEventEmitterProvider } from "./hooks/useSubscribeToInputEvent";

function App() {
  return (
    <ConfigurationProvider>
      <InputEventEmitterProvider>
        <ConfigurationEditor />
        <MouseClickHighlight />
        <KeyboardInput />
      </InputEventEmitterProvider>
    </ConfigurationProvider>
  );
}

export default App;
