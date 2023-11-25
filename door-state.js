import { IHyperDoor } from './hyperdoor';

/**
 * Interface for describing a discrete state in the garage
 * door operational cycle
 * @typedef IDoorState
 * @property {String} name
 * @property {String} statusMessage
 * @property {String} timestamp
 */
export class IDoorState {
  name;
  statusMessage;
  timestamp;

  /**
   * Method signature for opening the door in this state
   * @returns {IHyperDoor}
   */
  open() {}

  /**
   * Method signature for closing the door in this state
   * @returns {IHyperDoor}
   */
  close() {}
}
