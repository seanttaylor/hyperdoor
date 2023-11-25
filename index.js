import petname from 'node-petname';
import generateId from 'firebase-auto-ids';
import {
  DoorOpenState,
  DoorCloseState,
  DoorFaultState,
} from './states/door.js';
import { HDTrolleyIdleState, HDTrolleyMovingState } from './states/trolley.js';

import { TROLLEY_DIRECTION } from './enums/trolley-direction.js';

/******** GLOBAL INTERFACES ********/
import { IDeviceStatus } from './interfaces/device-status.js';
import { IHyperDoor } from './interfaces/hyperdoor.js';
import { IDoorState } from './interfaces/door-state.js';
import { IHyperDoorEvent } from './interfaces/hyperdoor-event.js';

/******** LOCAL INTERFACES ********/

/**
 * @typedef IHyperDoorEventConfiguration
 * @property {IHyperDoorEvent} detail
 */

/**
 *
 */
class HyperDoor {
  deviceName;
  events;
  id;
  state;
  settings;
  applicationVersion = '0.0.1';
  createdDate = new Date().toISOString();
  #trolley;

  /**
   * @param {EventTarget} events
   * @param {HDTrolley} trolley
   */
  constructor({ events, name = petname(2, '-'), settings = {}, trolley } = {}) {
    this.id = generateId(new Date().getTime());
    this.deviceName = name;
    this.events = events;
    this.settings = settings;
    this.state = {};
    this.#trolley = trolley;

    events.addEventListener(
      'evt.hyperdoor.door_open_request_received',
      this.#onDoorOpenRequest.bind(this)
    );

    events.addEventListener(
      'evt.hyperdoor.door_close_request_received',
      this.#onDoorClosedRequest.bind(this)
    );

    events.addEventListener(
      'evt.hyperdoor.door_error',
      this.#onDoorError.bind(this)
    );

    events.addEventListener(
      'evt.switches.limit_engaged',
      this.#onLimitSwitchEngaged.bind(this)
    );
  }

  /**
   * @param {IHyperDoorEventConfiguration} detail
   */
  #onDoorOpenRequest({ detail }) {
    const { state: trolleyState } = this.#trolley.start(TROLLEY_DIRECTION.REV);
    const { state: doorState } = this;
    console.info('Door opening...', {
      door: doorState,
      trolley: trolleyState,
    });
  }

  /**
   * @param {IHyperDoorEventConfiguration} detail
   */
  #onDoorError({ detail }) {
    const { state: trolleyState } = this.#trolley.stop();
    const { state: doorState } = this;
    console.info('Door error', {
      door: doorState,
      trolley: trolleyState,
    });
  }

  /**
   * @param {IHyperDoorEventConfiguration} detail
   */
  #onLimitSwitchEngaged({ detail }) {
    const { state: trolleyState } = this.#trolley.stop();
    const { state: doorState } = this;

    doorState.name = 'self:console.log(open';

    console.info('Trolley stopping...', {
      door: doorState,
      trolley: trolleyState,
    });
  }

  /**
   * @param {IHyperDoorEventConfiguration} detail
   */
  #onDoorClosedRequest({ detail }) {
    const { state: trolleyState } = this.#trolley.start(TROLLEY_DIRECTION.FWD);
    const { state: doorState } = this;
    console.info('Door closing...', {
      door: doorState,
      trolley: trolleyState,
    });
  }

  /******** PUBLIC API ********/

  /**
   * @returns {IHyperDoor}
   */
  open() {
    try {
      this.state = new DoorOpenState(this);
      return this.state.open();
    } catch (e) {
      this.state = new DoorFaultState(this);
      return this.state.open();
    }
  }

  /**
   * @returns {IHyperDoor}
   */
  close() {
    try {
      this.state = new DoorCloseState(this);
      return this.state.close();
    } catch (e) {
      //console.error(e);
      this.state = new DoorFaultState(this, e);
      this.events.dispatchEvent(new HyperDoorEvent('evt.hyperdoor.door_error'));
      return this.state.close();
    }
  }

  /**
   * @param {IDoorState} state
   */
  setState(state) {
    console.log(state);
    this.state = state;
  }

  /**
   * @returns {IDeviceStatus}
   */
  getStatus() {
    return {
      applicationVersion: this.applicationVersion,
      deviceName: this.deviceName,
      settings: this.settings,
      ...this.state,
    };
  }
}

/**
 *
 */
class HDTrolley {
  mode = 'normal';
  state;

  constructor() {
    this.state = new HDTrolleyIdleState(this);
  }

  /**
   * @returns {HDTrolley}
   */
  start() {
    this.state = new HDTrolleyMovingState(this);
    return this;
  }

  /**
   * @returns {HDTrolley}
   */
  stop() {
    this.state = new HDTrolleyIdleState(this);
    return this;
  }
}

/**
 * A wrapper for the CustomEvent interface
 */
class HyperDoorEvent {
  /**
   * @param {String} name
   * @param {Object} payload
   */
  constructor(name, payload = {}) {
    const event = new CustomEvent(name, {
      detail: {
        header: {
          name,
          timestamp: new Date().toISOString(),
          schema: null,
        },
        payload: payload || {},
      },
    });
    return event;
  }
}

/******** MAIN ********/

const events = new EventTarget();
const hd = new HyperDoor({
  events,
  trolley: new HDTrolley(),
});

console.log(hd.open());

events.dispatchEvent(
  new HyperDoorEvent('evt.switches.limit_engaged', {
    name: 'open',
  })
);
