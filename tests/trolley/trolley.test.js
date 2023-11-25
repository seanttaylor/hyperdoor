import { HDTrolleyIdleState, HDTrolleyMovingState } from '../../states/trolley.js';
import { TROLLEY_DIRECTION } from '../../enums/trolley-direction.js';
import { IHDTrolley } from '../../interfaces/trolley.js';
import { IHDTrolleyState } from '../../interfaces/trolley-state.js';

describe('HDTrolleyIdleState', () => {
  /**
   * @type {IHDTrolley}
   */
  let mockTrolley;

  /**
   * @type {IHDTrolleyState}
   */
  let idleState;

  beforeEach(() => {
    mockTrolley = {
      // Provide mock implementations or properties as needed
    };

    // Create an instance of HDTrolleyIdleState
    idleState = new HDTrolleyIdleState(mockTrolley);
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


describe('HDTrolleyMovingState', () => {
  /**
   * @type {IHDTrolley}
   */
  let mockTrolley;
  /**
   * @type {IHDTrolleyState}
   */
  let movingState;

  beforeEach(() => {
    mockTrolley = {};
    movingState = new HDTrolleyMovingState(mockTrolley);
  });

  describe('constructor', () => {
    it('Should be able to initialize the TrolleyMovingState ', () => {
      expect(movingState.statusMessage).toBe('Trolley is in motion...');
      expect(movingState.name).toBe('self:status:running;mode:normal;ops:moving');
    });
  });

  describe('stop', () => {
    it('Should be able to stop a trolley in motion resulting in an idle state', () => {
      const result = movingState.stop();
      
      expect(movingState.statusMessage).toBe('Trolley is idle.');
      expect(movingState.name).toBe('self:idle');
      expect(result).toBe(mockTrolley);
    });
  });

  describe('start', () => {
    it('Should NOT be able to start a trolley already in motion', () => {
      /**
       * @type {IHDTrolley}
       */
      const result = movingState.start();
      expect(movingState.statusMessage).toBe('Trolley is in motion...');
      expect(movingState.name).toBe('self:status:running;mode:normal;ops:moving');
      expect(result).toBe(mockTrolley);
    });
  });
});

