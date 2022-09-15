export type SimpleEventEmitterUnsubscribeFn = () => void;

export type SimpleEventEmitter<EventMap> = {
  on: <EventName extends keyof EventMap>(
    eventName: EventName,
    callback: (data: EventMap[EventName]) => void,
  ) => SimpleEventEmitterUnsubscribeFn;

  emit: <EventName extends keyof EventMap>(eventName: EventName, data: EventMap[EventName]) => void;
};

export function simpleEventEmitter<EventMap>(): SimpleEventEmitter<EventMap> {
  type SubcribersMap = {
    [eventName in keyof EventMap]?: Array<(data: EventMap[eventName]) => void>;
  };

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
