/**
 *
 */
class HDTrolleyState {
  mode;
  timestamp;

  /**
   * @param {HDTrolley} hdt
   */
  constructor(hdt) {
    this.timestamp = new Date().toISOString();
  }
}

export class HDTrolleyIdleState extends HDTrolleyState {
  #trolley;
  name;
  mode;
  statusMessage;

  /**
   * @param {HDTrolley} hdt
   */
  constructor(hdt) {
    super();

    this.name = 'self:idle';
    this.mode = 'self:mode:normal';
    this.statusMessage = 'Trolley is idle';
    this.timestamp = new Date().toISOString();
    this.#trolley = hdt;
  }

  stop() {
    console.info('Trolley is already idle...');
    return this.#trolley;
  }

  start() {
    this.statusMessage = 'Trolley is in motion...';
    this.name = 'self:running:moving';
    return this.#trolley;
  }
}

export class HDTrolleyMovingState extends HDTrolleyState {
  #trolley;
  name;
  statusMessage;

  /**
   * @param {HDTrolley} hdt
   */
  constructor(hdt) {
    super();

    this.mode = 'normal';
    this.name = 'self:running:moving';
    this.statusMessage = 'Trolley is in motion...';
    this.timestamp = new Date().toISOString();
    this.#trolley = hdt;
  }

  stop() {
    this.statusMessage = 'Trolley is idle.';
    this.name = 'self:idle';
    return this.#trolley;
  }

  start() {
    console.info('Trolley is already in  motion...');
    return this.#trolley;
  }
}
