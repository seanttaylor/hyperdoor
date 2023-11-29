import petname from 'node-petname';
import generateId from 'firebase-auto-ids';
import { Gpio } from 'onoff';
import {
  DoorOpenState,
  DoorCloseState,
  DoorFaultState,
  DoorIdleState
} from './states/door.js';
import { HDTrolleyIdleState, HDTrolleyMovingState } from './states/trolley.js';
import { ActivityIndicator } from './lib/activity-indicator.js';
import { LimitSwitch } from './lib/limit-switch.js';
import { HyperDoorEvent } from './lib/hyperdoor-event.js';

import { TROLLEY_DIRECTION } from './enums/trolley-direction.js';

/******** GLOBAL INTERFACES ********/
import { IDeviceStatus } from './interfaces/device-status.js';
import { IHyperDoor } from './interfaces/hyperdoor.js';
import { IHyperDoorState } from './interfaces/door-state.js';
import { IHyperDoorEvent } from './interfaces/hyperdoor-event.js';
import { IHDTrolley } from './interfaces/trolley.js';
import { IGPIO } from './interfaces/gpio.js';
import { ILimitSwitch } from './interfaces/limit-switch.js';
import { GPIOFactory } from './factories/gpio.js';


const componentState = {
  'open-limit-switch': {
    engaged: null
  }
};

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
class HyperDoor extends IHyperDoor {
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
    super();
    this.id = generateId(new Date().getTime());
    this.deviceName = config.name || petname(2, '-');
    this.events = config.events;
    this.settings = config.settings || {};
    this.state = new DoorIdleState(this);
    this.#trolley = config.trolley;

    config.events.addEventListener(
      'evt.hyperdoor.door_open_request_received',
      this.#onDoorOpenRequest.bind(this)
    );

    config.events.addEventListener(
      'evt.hyperdoor.door_close_request_received',
      this.#onDoorClosedRequest.bind(this)
    );

    config.events.addEventListener(
      'evt.hyperdoor.door_error',
      this.#onDoorError.bind(this)
    );

    config.events.addEventListener(
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

    doorState.name = 'self:status:running;mode:normal:ops:braking';

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

  /******** PUBLIC API ********/

  /**
   * @returns {IHyperDoor}
   */
  open() {
    try {
      const updatedState = new DoorOpenState(this);
      this.state = updatedState;
      return this;
    } catch (e) {
      this.state = new DoorFaultState(this);
      return this;
    }
  }

  /**
   * @returns {IHyperDoor}
   */
  close() {
    try {
      this.state = new DoorCloseState(this);
      return this;
    } catch (e) {
      //console.error(e);
      this.state = new DoorFaultState(this, e);
      this.events.dispatchEvent(new HyperDoorEvent('evt.hyperdoor.door_error'));
      return this;
    }
  }

  /**
   * 
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
   * @param {TROLLEY_DIRECTION} direction
   * @returns {HDTrolley}
   */
  start(direction) {
    this.state = new HDTrolleyMovingState(this, direction);
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
 * Handler for key signal events to
 * ensure any resources are properly disposed and
 * and physical components are reset to the
 * most appropriate state 
 * @param {IGPIO} myLED
 */
function teardownResources(myLED) {
  return function() {
    myLED.writeSync(0);
    myLED.unexport();
  }
}

/**
 * Mock watch method for the GPIO interface;
 * just immediately executes whatever function is passed
 * @param {Function} fn
 */
function onWatch(fn) {
  fn(null, 0);
}

function onLimitSwitchEvent(ctx, error, value) {
  const { name } = ctx; 
  componentState[name].engaged = Boolean(value);
}

/**
 * @type {IGPIO}
 */
const LED_DOOR_CLOSE = GPIOFactory.create();

/**
 * @type {IGPIO}
 */
const LED_DOOR_OPEN = GPIOFactory.create();

/**
 * @type {IGPIO}
 */
const BTN_LIMIT_SWITCH_DOOR_OPEN = Object.assign(
  GPIOFactory.create(), { 
  watch: onWatch
})

/**
 * @type {IGPIO}
 */
const BTN_LIMIT_SWITCH_DOOR_CLOSE = Object.assign(
  GPIOFactory.create(), {
  watch: onWatch
});

/******** GPIO CONFIG ********/
//const LED = new Gpio(19, 'out');

const eventBus = new EventTarget();

/******** LIMIT SWITCHES ********/
const doorOpenLimitSwitch = new LimitSwitch({ 
  callback: onLimitSwitchEvent, 
  button: BTN_LIMIT_SWITCH_DOOR_OPEN, 
  events: eventBus,
  LED: LED_DOOR_OPEN,
  name: 'open-limit-switch',
})

const doorCloseLimitSwitch = new LimitSwitch({
  callback: LimitSwitch.onSwitch,
  button: BTN_LIMIT_SWITCH_DOOR_CLOSE,
  events: eventBus, 
  LED: LED_DOOR_CLOSE,
  name: 'close-limit-switch' 
});

/******** EVENT REGISTRATION ********/


const onResourceTeardown = teardownResources(LED_DOOR_OPEN);

/******** PROGRAM START ********/

const hd = new HyperDoor({
  events: eventBus,
  trolley: new HDTrolley(),
});

hd.open();

setTimeout(() => {
  eventBus.dispatchEvent(
    new HyperDoorEvent('evt.switches.limit_engaged', {
      name: 'open-limit-switch',
    })
  );
}, 3000);


setTimeout(() => {
  eventBus.dispatchEvent(
    new HyperDoorEvent('evt.switches.limit_engaged', {
      name: 'close-limit-switch',
    })
  );
}, 9000);

/******** PROGRAM TEARDOWN ********/

// Ensure resource teardown/cleanup on specified signals
process.on('exit', onResourceTeardown);
process.on('SIGINT', onResourceTeardown);
process.on('SIGTERM', onResourceTeardown);

// Ensure resource teardown/cleanup on uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  onResourceTeardown();
  process.exit(1);
});

