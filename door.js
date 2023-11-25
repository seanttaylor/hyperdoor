import { IHyperDoor } from '../hyperdoor.js';

/**
 * Describes a discrete state in the garage door operational cycle
 */
class DoorState {
  statusMessage;
  name;
  timestamp;

  /**
   * Runs the specified logic when `open`
   * method is called in this state
   * @returns {IHyperDoor}
   */
  open() {}

  /**
   * Runs the specified logic when `close`
   * method is called in this state
   * @returns {IHyperDoor}
   */
  close() {}
}

export class DoorOpenState extends DoorState {
  #door;

  /**
   * @param {IHyperDoor} hd
   */
  constructor(hd) {
    super();

    this.timestamp = new Date().toISOString();
    this.#door = hd;
  }

  /**
   * Runs the specified logic when `open`
   * method is called in this state
   * @returns {IHyperDoor}
   */
  open() {
    if (this.name === 'running:opening') {
      console.info('Door is already opening.');
      return this.#door;
    }

    this.name = 'self:running:opening';
    this.statusMessage = 'Door is opening...';
    this.#door.events.dispatchEvent(
      new CustomEvent('evt.hyperdoor.door_open_request_received')
    );
    return this.#door;
  }

  /**
   * Runs the specified logic when `close` method is
   * called in this state
   * @returns {IHyperDoor}
   */
  close() {
    console.log('Door is already closed.');
  }
}

export class DoorCloseState extends DoorState {
  #door;

  /**
   * @param {IHyperDoor} hd
   */
  constructor(hd) {
    super();

    this.timestamp = new Date().toISOString();
    this.#door = hd;
  }

  /**
   * Runs the specified logic when `open` method is
   * called in this state
   * @returns {IHyperDoor}
   */
  open() {
    console.info('Door is already open.');
  }

  /**
   * Runs the specified logic when `close` method is
   * called in this state
   * @returns {IHyperDoor}
   */
  close() {
    if (this.name === 'self:running:closing') {
      console.info('Door is already closing.');
      return;
    }
    this.name = 'self:running:closing';
    this.statusMessage = 'Door is closing...';
    this.#door.events.dispatchEvent(
      new CustomEvent('evt.hyperdoor.door_close_request_received')
    );
    return this.#door;
  }
}

export class DoorFaultState extends DoorState {
  #door;

  /**
   * @param {IHyperDoor} hd
   * @param {Error} error
   */
  constructor(hd, error) {
    super();

    this.name = 'self:error';
    this.statusMessage = error.message;
    this.timestamp = new Date().toISOString();
    this.#door = hd;
  }

  /**
   * Runs the specified logic when `open` method
   * is called in this state
   * @returns {IHyperDoor}
   */
  open() {
    console.error('There was an error opening/closing the door.');
  }

  /**
   * Runs the specified logic when `close` method
   * is called in this state
   * @returns {IHyperDoor}
   */
  close() {
    console.error('There was an error closing the door.');
    return this.#door;
  }
}
