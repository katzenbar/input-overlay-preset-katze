import { z } from "zod";

type FindByType<Union, Type> = Union extends { event_type: Type } ? Union : never;

const baseEventSchema = z.object({
  time: z.number(),
  event_source: z.string(),
});

const baseMouseEventSchema = baseEventSchema.merge(
  z.object({
    button: z.number(),
    clicks: z.number(),
    mask: z.number(),
    x: z.number(),
    y: z.number(),
  }),
);

// TODO: I want to be able to use an array to reduce duplication here, but I haven't been able to get Typescript
// to work with all of the inferred types below.
const mousePressedSchema = baseMouseEventSchema.merge(
  z.object({
    event_type: z.literal("mouse_pressed"),
  }),
);
const mouseReleasedSchema = baseMouseEventSchema.merge(
  z.object({
    event_type: z.literal("mouse_released"),
  }),
);
const mouseMovedSchema = baseMouseEventSchema.merge(
  z.object({
    event_type: z.literal("mouse_moved"),
  }),
);
const mouseClickedSchema = baseMouseEventSchema.merge(
  z.object({
    event_type: z.literal("mouse_clicked"),
  }),
);
const mouseDraggedSchema = baseMouseEventSchema.merge(
  z.object({
    event_type: z.literal("mouse_dragged"),
  }),
);

const baseKeyEventSchema = baseEventSchema.merge(
  z.object({
    keycode: z.number(),
    mask: z.number(),
    rawcode: z.number(),
  }),
);

const keyPressedSchema = baseKeyEventSchema.merge(
  z.object({
    event_type: z.literal("key_pressed"),
  }),
);

const keyReleasedSchema = baseKeyEventSchema.merge(
  z.object({
    event_type: z.literal("key_released"),
  }),
);

const keyTypedSchema = baseKeyEventSchema.merge(
  z.object({
    event_type: z.literal("key_typed"),
    char: z.string(),
  }),
);

export const inputEventSchema = z.discriminatedUnion("event_type", [
  mousePressedSchema,
  mouseReleasedSchema,
  mouseMovedSchema,
  mouseClickedSchema,
  mouseDraggedSchema,
  keyPressedSchema,
  keyReleasedSchema,
  keyTypedSchema,
]);

export type MouseEvent = z.infer<typeof baseMouseEventSchema>;
export type InputEvent = z.infer<typeof inputEventSchema>;

export type InputEvents = {
  [K in InputEvent["event_type"]]: FindByType<InputEvent, K>;
};
