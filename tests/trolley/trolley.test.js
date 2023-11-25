import { HDTrolleyIdleState } from '../../states/trolley.js';
import { TROLLEY_DIRECTION } from '../../enums/trolley-direction.js';
import { IHDTrolley } from '../../interfaces/trolley.js';
import { IHDTrolleyState } from '../../interfaces/trolley-state.js';

describe('HDTrolleyIdleState', () => {
  /**
   * @type {IHDTrolley}
   */
  let trolley;

  /**
   * @type {IHDTrolleyState}
   */
  let idleState;

  beforeEach(() => {
    // Mock the IHDTrolley interface
    trolley = {
      // Provide mock implementations or properties as needed
    };

    // Create an instance of HDTrolleyIdleState
    idleState = new HDTrolleyIdleState(trolley);
  });

  describe('start', () => {
    it('Should be able to set the trolley in motion from idle', () => {
      const direction = TROLLEY_DIRECTION.FWD;
      idleState.start(direction);

      expect(idleState.direction).toBe(direction);
      expect(idleState.statusMessage).toBe('Trolley is in motion...');
      expect(idleState.name).toBe('self:running:moving');
    });
  });

  describe('stop', () => {
    it('Should be able to get indication trolley is already idle', () => {
      idleState.stop();

      expect(idleState.direction).toBeNull();
      expect(idleState.statusMessage).toBe('Trolley is idle');
    });
  });
});
