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

  /**
   * Takes a callback that gets two arguments (err, value), where err is 
   * reserved for an error object and value is 
   * the number 0 or 1 and represents the state of the GPIO
   * @param {Function} callback - function to execute on button inputs
   */
  watch(callback) {
    
  }
}
