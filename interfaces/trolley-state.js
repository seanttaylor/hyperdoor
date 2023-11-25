import { TROLLEY_DIRECTION } from '../enums/trolley-direction';
import { IHDTrolley } from '../states/trolley';

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
