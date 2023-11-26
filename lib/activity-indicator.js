import { IGPIO } from '../interfaces/gpio.js';
import { IHyperDoorEvent } from '../interfaces/hyperdoor-event.js';

/**
 * A specified interface for capturing application events; always
 * used as the value for the `detail` property of a native CustomEvent
 * @typedef IHyperDoorEventConfiguration
 * @property {IHyperDoorEvent} detail
 */

/**
 *
 */
export class ActivityIndicator {
  #events;
  /**
   * @type {IGPIO}
   */
  #LED;

  /**
   * @param {EventTarget} events
   * @param {IGPIO} LED
   */
  constructor(events, LED) {
    this.#events = events;
    this.#LED = LED;

    events.addEventListener(
      'evt.switches.limit_engaged',
      this.#onLimitSwitchEngaged.bind(this)
    );

    events.addEventListener(
      'evt.switches.limit_disengaged',
      this.#onLimitSwitchDisEngaged.bind(this)
    );
  }

  /**
   * @param {IHyperDoorEventConfiguration} customEvent
   */
  #onLimitSwitchDisEngaged({ detail }) {
    const LED_INDICATOR_OFF = this.#LED.readSync() === 0;

    try {  
      if(!LED_INDICATOR_OFF) {
       this.#LED.writeSync(0);
      }
    } catch(e) {
      console.error(e);
    }
  }


  /**
   * @param {IHyperDoorEventConfiguration} customEvent
   */
  #onLimitSwitchEngaged({ detail }) {
    const LED_INDICATOR_ON = this.#LED.readSync() === 1;

    try {     
      if (!LED_INDICATOR_ON) {
        this.#LED.writeSync(1);
        return;
      }
      
    } catch(e) {
      console.error(e);
    }
  }
}
