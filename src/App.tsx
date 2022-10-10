import { ConfigurationEditor } from "./components/ConfigurationEditor";
import { MouseClickHighlight } from "./components/MouseClickHighlight";
import { ConfigurationProvider } from "./hooks/useConfiguration";
import { InputEventEmitterProvider } from "./hooks/useSubscribeToInputEvent";

function App() {
  return (
    <ConfigurationProvider>
      <InputEventEmitterProvider>
        <ConfigurationEditor />
        <MouseClickHighlight />
      </InputEventEmitterProvider>
    </ConfigurationProvider>
  );
}

export default App;
