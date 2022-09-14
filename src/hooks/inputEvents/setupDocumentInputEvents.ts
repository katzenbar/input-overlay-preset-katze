import { EmitInputEventFn } from "../useSubscribeToInputEvent";

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

export const setupDocumentInputEvents = (emitInputEvent: EmitInputEventFn): (() => void) => {
  const handleMouseEvent = (key: Parameters<EmitInputEventFn>[0]) => (ev: MouseEvent) => {
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

  const blockContextMenu = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
  };

  document.addEventListener("contextmenu", blockContextMenu);

  const onMouseDown = handleMouseEvent("mouse_pressed");
  const onMouseUp = handleMouseEvent("mouse_released");
  const onMouseMove = handleMouseEvent("mouse_moved");

  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);

  return () => {
    document.removeEventListener("contextmenu", blockContextMenu);
    document.removeEventListener("mouseup", onMouseUp);
    document.removeEventListener("mousedown", onMouseDown);
    document.removeEventListener("mousemove", onMouseMove);
  };
};
