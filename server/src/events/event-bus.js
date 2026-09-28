const listeners = new Map();

export const EventBus = {
  on(eventName, handler) {
    if (!listeners.has(eventName)) listeners.set(eventName, []);
    listeners.get(eventName).push(handler);
  },

  emit(eventName, payload) {
    for (const handler of listeners.get(eventName) ?? []) handler(payload);
  },
};
