/**
 * Interface for GPIO
 * @typedef IGPIO
 * @property {Function} readSync
 * @property {Function} writeSync
 */
export class IGPIO {
  /**
   * Read GPIO value synchronously. Returns the
   * number 0 or 1 to represent the state of the GPIO
   * @returns {Number}
   */
  readSync() {}

  /**
   * Write GPIO value synchronously
   * @param {Number} value - either a 0 or 1
   */
  writeSync(value) {}

  /**
   * Frees any resources associated with
   * this instance
   */
  unexport() {

  }
}
