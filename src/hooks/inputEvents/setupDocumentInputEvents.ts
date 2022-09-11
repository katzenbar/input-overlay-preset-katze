import { EmitInputEventFn } from "../useSubscribeToInputEvent";

export const setupDocumentInputEvents = (emitInputEvent: EmitInputEventFn): (() => void) => {
  const handleMouseEvent = (key: Parameters<EmitInputEventFn>[0]) => (ev: MouseEvent) => {
    emitInputEvent(key, {
      event_type: key,
      event_source: "web",
      time: Math.trunc(ev.timeStamp * 1000),
      button: ev.button,
      clicks: 0,
      mask: 0,
      x: ev.clientX,
      y: ev.clientY,
    });
  };

  const onMouseDown = handleMouseEvent("mouse_pressed");
  const onMouseUp = handleMouseEvent("mouse_released");
  const onMouseMove = handleMouseEvent("mouse_moved");

  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);

  return () => {
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousedown", onMouseDown);
    document.removeEventListener("mousemove", onMouseMove);
  };
};
