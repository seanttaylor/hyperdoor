import { ILimitSwitch } from '../interfaces/limit-switch.js';
import { IGPIO } from '../interfaces/gpio.js';
import { HyperDoorEvent } from './hyperdoor-event.js';

/**
 * The context of the limit switch is any properties or 
 * methods pertinent to the operation of the LimitSwitch 
 * @typedef LimitSwitchContext
 * @property {IGPIO} BTN - the button associated with the limit switch
 * @property {IGPIO} LED - the LED associated with the limit switch
 * @property {String} name - the name associated with the limit switch
 * @property {EventTarget} events - application event bus; an instance of the `EventTarget` interface
 */

/**
 * A client-provided callback to execute when the LimitSwitch detects a hardware interrupt
 * @callback LimitSwitchWatchFunction
 * @param {LimitSwitchContext} ctx
 * @param {Error} error - any error detected
 * @param {Number} value - 0 or 1 indicating button state
 */

/**
 * Config map for initializing new LimitSwitch instances
 * @typedef LimitSwitchConfigurationObject
 * @property {String} name - unique name for the limit switch
 * @property {IGPIO} button - a physical button having the IGPIO interface
 * @property {IGPIO} LED - an LED having the IGPIO interface
 * @property {EventTarget} events - the application event bus; an instance of `EventTarget` interface
 * @property {LimitSwitchWatchFunction} callback - a client-provided callback to execute when the LimitSwitch detects a hardware interrupt
 */


export class LimitSwitch extends ILimitSwitch {
  /**
   * @type {IGPIO}
   */
  #button;
  /**
   * @type {IGPIO}
   */
  #LED;

  /** 
   * @param {LimitSwitchConfigurationObject} config
   */
  constructor(config) {
    super();
    this.evt = config.events;
    this.name = config.name;
    this.#button = config.button;
    this.#LED = config.LED;

    this.#button.watch(config.callback.bind(this, { 
      BTN: this.#button, 
      LED: this.#LED, 
      events: this.evt,
      name: this.name 
    }));
  }

  /**
   * Be it dreadfully named, a default behavior for handling the two states of the LimitSwitch as
   * the associated button is pressed or released
   * @type {LimitSwitchWatchFunction}
   */
  static onSwitch(ctx, error, value) {
    ctx.events.dispatchEvent(
      new HyperDoorEvent('evt.switches.limit_engaged', {
       name: ctx.name
      })
    );
  }

}