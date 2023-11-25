/**
 * @typedef {EventHeader}
 * @property {String} name
 * @property {String} schema
 * @property {String} timestamp
 */

/**
 * @typedef IHyperDoorEvent
 * @property {EventHeader} header
 * @property {Object} payload
 */
export class IHyperDoorEvent {
  header = {
    name,
    schema,
    timestamp,
  };
  payload = {};
}
