import { IDeviceStatus } from './device-status.js';
import { IHyperDoorState } from './door-state.js';


export class IHyperDoor {
  /**
   * a unique name for the device
   * @type {String}
   */
  deviceName;

  /**
   * an instance of the EventTarget interface for 
   * registering and dispatching events
   * @type {EventTarget}
   */
  events;

  /**
   * a unique identifier for the device
   * @type {String}
   */
  id;

  /**
   * the current state of the device
   * @type {IHyperDoorState}
   */
  state;

  /**
   * custom settings for the device configured by
   * the end user
   * @type {Object}
   */
  settings;

  /**
   * version of the application
   * @type {String}
   */
  applicationVersion;

  /**
   * date/time the device was created in ISO format
   * @type {String}
   */
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
   * @param {IHyperDoorState} state - an instance of the `HyperDoorState` interface
   */
  setState(state) {}

  /**
   * @returns {IDeviceStatus}
   */
  getStatus() {}
}
