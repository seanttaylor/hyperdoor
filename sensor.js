/**
 *
 */
class HDSensorState {
  timestamp;

  /**
   * @param {HDSensor}
   */
  constructor(hds) {
    this.timestamp = new Date().toISOString();
  }
}

export class HDSensorClearState extends HDSensorState {}
