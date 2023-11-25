import { TROLLEY_DIRECTION } from '../enums/trolley-direction.js';
import { IHDTrolley } from '../interfaces/trolley.js';

/**
 *
 */
class HDTrolleyState {
  direction;
  mode;
  name;
  statusMessage;
  timestamp;

  /**
   * @param {IHDTrolley} hdt
   */
  constructor(hdt) {
    this.timestamp = new Date().toISOString();
  }

  /**
   * @param {TROLLEY_DIRECTION} direction
   * @returns {IHDTrolley}
   */
  start(direction) {

  }

  /**
   * @returns {IHDTrolley}
   */
  stop() {

  }
}

export class HDTrolleyIdleState extends HDTrolleyState {
  #trolley;
  direction;
  mode;
  name;
  statusMessage;
  timestamp;

  /**
   * @param {IHDTrolley} hdt
   */
  constructor(hdt) {
    super();

    this.direction = null;
    this.mode = 'self:mode:normal';
    this.name = 'self:idle';
    this.statusMessage = 'Trolley is idle';
    this.timestamp = new Date().toISOString();
    this.#trolley = hdt;
  }

  stop() {
    //console.info('Trolley is already idle...');
    return this.#trolley;
  }

  /**
   * @param {TROLLEY_DIRECTION} direction
   * @returns {IHDTrolley}
   */
  start(direction) {
    this.direction = direction;
    this.name = 'self:running:moving';
    this.statusMessage = 'Trolley is in motion...';
    return this.#trolley;
  }
}

export class HDTrolleyMovingState extends HDTrolleyState {
  #trolley;
  name;
  statusMessage;

  /**
   * @param {IHDTrolley} hdt
   */
  constructor(hdt) {
    super();

    this.name = 'self:status:running;mode:normal;ops:moving';
    this.mode = 'normal';
    this.statusMessage = 'Trolley is in motion...';
    this.timestamp = new Date().toISOString();
    this.#trolley = hdt;
  }

  /**
   * @returns {IHDTrolley}
   */
  stop() {
    this.statusMessage = 'Trolley is idle.';
    this.name = 'self:idle';
    return this.#trolley;
  }

  /**
   * @returns {IHDTrolley}
   */
  start() {
    //console.info('Trolley is already in  motion...');
    return this.#trolley;
  }
}
