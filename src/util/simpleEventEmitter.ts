export type SimpleEventEmitterUnsubscribeFn = () => void;

export type SimpleEventEmitter<EventMap extends { [eventName: string]: unknown }> = {
  on: (
    eventName: keyof EventMap,
    callback: (data: EventMap[typeof eventName]) => void,
  ) => SimpleEventEmitterUnsubscribeFn;

  emit: (eventName: keyof EventMap, data: EventMap[typeof eventName]) => void;
};

export function simpleEventEmitter<EventMap extends { [eventName: string]: unknown }>(): SimpleEventEmitter<EventMap> {
  type SubcribersMap = { [eventName in keyof EventMap]?: Array<(data: EventMap[eventName]) => void> };

  const subscribers: SubcribersMap = {};

  const on: SimpleEventEmitter<EventMap>["on"] = (eventName, callback) => {
    subscribers[eventName] ||= [];
    subscribers[eventName]!.push(callback);

    return () => {
      const eventSubscribers = subscribers[eventName];
      if (eventSubscribers) {
        eventSubscribers.splice(eventSubscribers.indexOf(callback), 1);
      }
    };
  };

  const emit: SimpleEventEmitter<EventMap>["emit"] = (eventName, data) => {
    const eventSubscribers = subscribers[eventName];
    if (eventSubscribers) {
      eventSubscribers.map((callback) => callback(data));
    }
  };

  return {
    on,
    emit,
  };
}
