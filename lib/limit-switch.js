import { ILimitSwitch } from '../interfaces/limit-switch.js';

export class LimitSwitch extends ILimitSwitch {
  #button;
  #LED;

  /** 
   * 
   * @param {IGPIO} button - a physical button having the IGPIO interface
   * @param {IGPIO} LED - an LED having the IGPIO interface
   * @param {Function} callback
   */
  constructor(button, LED) {
    this.
    this.#button = button;
    this.#LED = LED;
  }
}