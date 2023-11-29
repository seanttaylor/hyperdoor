import { IGPIO } from '../interfaces/gpio.js';


/**
 * Utility class for creating GPIO objects; primarily for testing
 */
export class GPIOFactory {

  /**
   * Creates a new instance of the GPIO interface
   * @returns {IGPIO}
   */
  static create() {
    return new IGPIO();
  }
}