import { IHyperDoor } from './hyperdoor.js';

/**
 * Interface for describing a discrete state in the garage
 * door operational cycle
 * @typedef IHyperDoorState
 * @property {String} name
 * @property {String} statusMessage
 * @property {String} timestamp
 */
export class IHyperDoorState {
  name;
  statusMessage;
  timestamp;

  /**
   * Method signature for opening the door in this state
   * @returns {IHyperDoorState}
   */
  open() {}

  /**
   * Method signature for closing the door in this state
   * @returns {IHyperDoorState}
   */
  close() {}
}
