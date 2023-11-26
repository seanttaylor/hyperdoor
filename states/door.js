import { IHyperDoorState } from '../interfaces/door-state.js';
import { IHyperDoor } from '../interfaces/hyperdoor.js';

/**
 * Describes a discrete state in the garage door operational cycle
 */
class DoorState {
  name;
  statusMessage;
  timestamp;

  /**
   * Runs the specified logic when `open`
   * method is called in this state
   * @returns {IHyperDoorState}
   */
  open() {}

  /**
   * Runs the specified logic when `close`
   * method is called in this state
   * @returns {IHyperDoorState}
   */
  close() {}
}

export class DoorOpenState extends DoorState {
  #door;
  name;
  statusMessage;
  timestamp;

  /**
   * @param {IHyperDoor} hd
   */
  constructor(hd) {
    super();
    this.#door = hd;
    this.name = 'self:status:running;mode:normal;ops:opening';
    this.statusMessage = 'Door open';
    this.timestamp = new Date().toISOString();
    
    
    this.#door.events.dispatchEvent(
      new CustomEvent('evt.hyperdoor.door_open_request_received')
    );
  }

  /**
   * Runs the specified logic when `open`
   * method is called in this state
   * @returns {IHyperDoor}
   */
  open() {
    //console.info('Door is already opening.');
    return this;
  }

  /**
   * Runs the specified logic when `close` method is
   * called in this state
   * @returns {IHyperDoorState}
   */
  close() {
    return new DoorCloseState(this.#door);
  }
}

export class DoorCloseState extends DoorState {
  #door;
  name;
  statusMessage;
  timestamp;

  /**
   * @param {IHyperDoor} hd
   */
  constructor(hd) {
    super();

    this.#door = hd;
    this.name = 'self:status:running;mode:normal;ops:closing';
    this.statusMessage = 'Door is closing...';
    this.timestamp = new Date().toISOString();

    this.#door.events.dispatchEvent(
      new CustomEvent('evt.hyperdoor.door_close_request_received')
    );
  }

  /**
   * Runs the specified logic when `open` method is
   * called in this state
   * @returns {IHyperDoorState}
   */
  open() {
    return new DoorOpenState(this.#door);
  }

  /**
   * Runs the specified logic when `close` method is
   * called in this state
   * @returns {IHyperDoorState}
   */
  close() {
    //console.info('Door is already closing.');
    return this;
  }
}

export class DoorFaultState extends DoorState {
  #door;
  name;
  statusMessage;
  timestamp;

  /**
   * @param {IHyperDoor} hd
   * @param {Error} error
   */
  constructor(hd, error) {
    super();

    this.#door = hd;
    this.name = 'self:status:error;mode:normal;ops:null';
    this.statusMessage = error.message;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Runs the specified logic when `open` method
   * is called in this state
   * @returns {IHyperDoor}
   */
  open() {
    //console.error('There was an error opening/closing the door.');
    return this.#door;
  }

  /**
   * Runs the specified logic when `close` method
   * is called in this state
   * @returns {IHyperDoor}
   */
  close() {
    //console.error('There was an error closing the door.');
    return this.#door;
  }
}

export class DoorIdleState extends DoorState {
  #door;
  name;
  statusMessage;
  timestamp;

  /**
   * @param {IHyperDoor} hd
   */
  constructor(hd) {
    super();

    this.#door = hd;
    this.name = 'self:status:running;mode:normal;ops:null';
    this.statusMessage = 'Door idle';
    this.timestamp = new Date().toISOString();
  }

  /**
   * Runs the specified logic when `open` method
   * is called in this state
   * @returns {IHyperDoorState}
   */
  open() {
    return new DoorOpenState(this.#door);
  }

  /**
   * Runs the specified logic when `close` method
   * is called in this state
   * @returns {IHyperDoorState}
   */
  close() {
    return new DoorCloseState(this.#door);
  }
}
