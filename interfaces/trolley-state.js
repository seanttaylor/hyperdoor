import { TROLLEY_DIRECTION } from '../enums/trolley-direction.js';
import { IHDTrolley } from '../interfaces/trolley.js';

/**
 * @typedef IHDTrolleyState
 * @property {TROLLEY_DIRECTION} direction
 * @property {String} mode
 * @property {String} name
 * @property {String} statusMessage
 * @property {String} timestamp
 */
export class IHDTrolleyState {
  direction;
  mode;
  name;
  statusMessage;
  timestamp;

  /**
   * @param {String} direction
   * @returns {IHDTrolley}
   */
  start(direction) {}

  /**
   * @returns {IHDTrolley}
   */
  stop() {}
}
