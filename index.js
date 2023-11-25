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
import { IHDTrolley } from './interfaces/trolley.js';

/******** LOCAL INTERFACES ********/

/**
 * Config map for initializing new HyperDoor instances
 * @typedef HyperDoorConfigurationObject
 * @property {EventTarget} events
 * @property {String} [name] - Optional name property
 * @property {Object} [settings] - Optional settings object
 * @property {IHDTrolley} trolley
 */

/**
 * A specified interface for capturing application events; always
 * used as the value for the `detail` property of a CustomEvent
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
   * @param {HyperDoorConfigurationObject} config
   * 
   */
  constructor(config) {
    this.id = generateId(new Date().getTime());
    this.deviceName = config.name || petname(2, '-');
    this.events = config.events;
    this.settings = config.settings || {};
    this.state = {};
    this.#trolley = config.trolley;

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
   * Takes the CustomEvent interface; handles requests to 
   * open the door
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
   * Takes the CustomEvent interface; handles any 
   * errors detected during door's operations
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
   * Takes the CustomEvent interface; handles notifications from 
   * the door's limit switches
   * @param {IHyperDoorEventConfiguration} detail
   */
  #onLimitSwitchEngaged({ detail }) {
    const { state: trolleyState } = this.#trolley.stop();
    const { state: doorState } = this;

    doorState.name = 'self:open';

    console.info('Trolley stopping...', {
      door: doorState,
      trolley: trolleyState,
    });
  }

  /**
   * Takes the CustomEvent interface; handles requests to 
   * close the door
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

  /******** PUB * @property {String} [name] - Optional name property.
 * @property {Object} [settings] - Optional settings object.LIC API ********/

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
