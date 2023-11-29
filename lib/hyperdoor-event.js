/**
 * A wrapper for the CustomEvent interface
 */
export class HyperDoorEvent {
  /**
   * @param {String} name
   * @param {Object} payload
   */
  constructor(name, payload = {}) {
    const event = new CustomEvent(name, {
      detail: {
        header: {
          name,
          timestamp: new Date().toISOString(),
          schema: null,
        },
        payload: payload || {},
      },
    });
    return event;
  }
}
