import { ILimitSwitch } from '../interfaces/limit-switch.js';
import { IGPIO } from '../interfaces/gpio.js';

/**
 * The context of the limit switch is any properties or 
 * methods pertinent to the operation of the LimitSwitch 
 * @typedef LimitSwitchContext
 * @property {IGPIO} BTN - the button associated with the limit switch
 * @property {IGPIO} LED - the LED associated with the limit switch
 * @property {String} name - the name associated with the limit switch
 */

/**
 * A client-provided callback to execute when the LimitSwitch detects a hardware interrupt
 * @callback LimitSwitchWatchFunction
 * @param {LimitSwitchContext} ctx
 * @param {Error} error - any error detected
 * @param {Number} value - 0 or 1 indicating button state
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
   * 
   * @param {IGPIO} button - a physical button having the IGPIO interface
   * @param {IGPIO} LED - an LED having the IGPIO interface
   * @param {LimitSwitchWatchFunction} callback
   */
  constructor(name, button, LED, callback) {
    super();
    this.name = name;
    this.#button = button;
    this.#LED = LED;
    
    this.#button.watch(callback.bind(this, { BTN: this.#button, LED: this.#LED, name }));
  }

  /**
   * Be it dreadfully named, a default behavior for handling the two states of the LimitSwitch as
   * the associated button is pressed or released
   * @type {LimitSwitchWatchFunction}
   */
  static onSwitch(ctx, error, value) {
    console.log(ctx)
  }

}