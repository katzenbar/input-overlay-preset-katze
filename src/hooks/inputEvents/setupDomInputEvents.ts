import { EmitInputEventFn } from "../useSubscribeToInputEvent";
import { mapDomEventToScanCode } from "./keyCodeMappings";

const convertMouseButtonToUiohook = (domButton: number): number => {
  switch (domButton) {
    case 0:
      return 1;
    case 1:
      return 3;
    case 2:
      return 2;
    case 3:
      return 4;
    case 4:
      return 5;
    default:
      return 0;
  }
};

const maskFromKeyboardEvent = (ev: KeyboardEvent): number => {
  let mask = 0;

  if (ev.shiftKey) {
    mask |= 1 << 0;
  }

  if (ev.ctrlKey) {
    mask |= 1 << 1;
  }

  if (ev.metaKey) {
    mask |= 1 << 2;
  }

  if (ev.altKey) {
    mask |= 1 << 3;
  }

  return mask;
};

export const setupDomInputEvents = (emitInputEvent: EmitInputEventFn): (() => void) => {
  const handleMouseEvent = (key: "mouse_pressed" | "mouse_released" | "mouse_moved") => (ev: MouseEvent) => {
    emitInputEvent(key, {
      event_type: key,
      event_source: "web",
      time: Math.trunc(ev.timeStamp * 1000),
      button: convertMouseButtonToUiohook(ev.button),
      clicks: 0,
      mask: 0,
      x: ev.clientX,
      y: ev.clientY,
    });
  };

  const handleKeyEvent = (key: "key_pressed" | "key_released") => (ev: KeyboardEvent) => {
    emitInputEvent(key, {
      event_type: key,
      event_source: "web",
      time: Math.trunc(ev.timeStamp * 1000),
      mask: maskFromKeyboardEvent(ev),
      keycode: mapDomEventToScanCode(ev),
      rawcode: 0,
    });
  };

  const handleKeyTypedEvent = (key: "key_typed") => (ev: KeyboardEvent) => {
    emitInputEvent(key, {
      event_type: key,
      event_source: "web",
      time: Math.trunc(ev.timeStamp * 1000),
      char: ev.key,
      mask: maskFromKeyboardEvent(ev),
      keycode: 0,
      rawcode: 0,
    });
  };

  const blockContextMenu = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
  };

  const onMouseDown = handleMouseEvent("mouse_pressed");
  const onMouseUp = handleMouseEvent("mouse_released");
  const onMouseMove = handleMouseEvent("mouse_moved");

  const onKeyPress = handleKeyTypedEvent("key_typed");
  const onKeyDown = handleKeyEvent("key_pressed");
  const onKeyUp = handleKeyEvent("key_released");

  document.addEventListener("contextmenu", blockContextMenu);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("keypress", onKeyPress);
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  return () => {
    document.removeEventListener("contextmenu", blockContextMenu);
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousedown", onMouseDown);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("keypress", onKeyPress);
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
  };
};
