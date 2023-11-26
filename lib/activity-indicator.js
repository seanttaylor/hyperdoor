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
      this.#onSystemActivity.bind(this)
    );
  }

  /**
   * @param {IHyperDoorEventConfiguration} customEvent
   */
  #onSystemActivity({ detail }) {
    
    console.log("Here's where the light turns on...");
  }
}
