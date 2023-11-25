import { IDeviceStatus } from './device-status.js';
import { IDoorState } from './door-state.js';

/**
 * @typedef IHyperDoor
 * @property {String} deviceName
 * @property {EventTarget} events
 * @property {String} id
 * @property {IDoorState} state
 * @property {Object} settings
 * @property {String} applicationVersion
 * @property {String} createdDate
 */
export class IHyperDoor {
  deviceName;
  events;
  id;
  state;
  settings;
  applicationVersion;
  createdDate;

  /**
   * @returns {IHyperDoor}
   */
  open() {}

  /**
   * @returns {IHyperDoor}
   */
  close() {}

  /**
   *
   */
  setState(state) {}

  /**
   * @returns {IDeviceStatus}
   */
  getStatus() {}
}
