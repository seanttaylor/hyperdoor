import { TROLLEY_DIRECTION } from '../enums/trolley-direction.js';
import { IHDTrolleyState } from './trolley-state.js';


/**
 * @typedef IHDTrolley
 * @property {IHDTrolleyState} state
 */
export class IHDTrolley {
  state;

  /**
   * @param {TROLLEY_DIRECTION} direction
   * @returns {IHDTrolley}
   */
  start(direction) {

  }

  /**
   * @returns {IHDTrolley}
   */
  stop() {

  };
}