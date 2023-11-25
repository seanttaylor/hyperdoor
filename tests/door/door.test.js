import { DoorOpenState, DoorCloseState, DoorFaultState } from '../../states/door.js';
import { IHyperDoor } from '../../interfaces/hyperdoor.js';
import { IHyperDoorState } from '../../interfaces/door-state.js';

describe('DoorOpenState', () => {
  /**
   * @type {IHyperDoor}
   */
  let mockHyperDoor;
  /**
   * @type {IHyperDoorState}
   */
  let doorOpenState;

  beforeEach(() => {
    mockHyperDoor = {
      events: {
        dispatchEvent: jest.fn()
      },
      // Add any other necessary mock properties or methods
    };

    doorOpenState = new DoorOpenState(mockHyperDoor);
  });

  describe('constructor', () => {
    it('Should be able to dispatch `door_close_request_received` event', () => {
      expect(doorOpenState.statusMessage).toBe('Door is opening...');
      expect(mockHyperDoor.events.dispatchEvent).toHaveBeenCalledWith(
        expect.any(CustomEvent)
      );
    });
  });

  describe('open', () => {
    it('Should dispatch be able to dispatch `door_open_request_received` event if door is not already opening', () => {
      doorOpenState.name = ''; // Ensure door is not in 'running:opening' state
      doorOpenState.open();

      expect(doorOpenState.statusMessage).toBe('Door is opening...');
      expect(mockHyperDoor.events.dispatchEvent).toHaveBeenCalledWith(
        expect.any(CustomEvent)
      );
    });

    it('Should be able to indicate door is already opening if in `self:running:opening` state', () => {
      doorOpenState.name = 'self:status:running;mode:normal;ops:opening';
      doorOpenState.open();

      expect(doorOpenState.statusMessage).toBe('Door is opening...');
      expect(doorOpenState.name).toBe('self:status:running;mode:normal;ops:opening');
    });
  });

  describe('close', () => {
    it('Should be able to indicate the door is closed when `close` is called from the `open` state', () => {
      const updatedState = doorOpenState.close();

      expect(updatedState.statusMessage).toBe('Door is closing...');
      expect(updatedState.name).toBe('self:status:running;mode:normal;ops:closing');
    });
  });
});

describe('DoorCloseState', () => {
  /**
   * @type {IHyperDoor}
   */
  let mockHyperDoor;
  /**
   * @type {IHyperDoorState}
   */
  let doorCloseState;

  beforeEach(() => {
    mockHyperDoor = {
      events: {
        dispatchEvent: jest.fn()
      },
      // Add any other necessary mock properties or methods
    };

    doorCloseState = new DoorCloseState(mockHyperDoor);
  });

  describe('constructor', () => {
    it('Should be able to dispatch `door_close_request_received` event', () => {
      expect(doorCloseState.statusMessage).toBe('Door is closing...');
      expect(mockHyperDoor.events.dispatchEvent).toHaveBeenCalledWith(
        expect.any(CustomEvent)
      );
    });
  });

  describe('open', () => {
    it('Should be able to transition to DoorOpenState', () => {
      const newState = doorCloseState.open();

      expect(newState).toBeInstanceOf(DoorOpenState);
      expect(newState.statusMessage).toBe('Door is opening...');
      expect(newState.name).toBe('self:status:running;mode:normal;ops:opening');
    });
  });

  describe('close', () => {
    it('Should be able to maintain the current state if `close` is called', () => {
      const newState = doorCloseState.close();

      expect(newState).toBe(doorCloseState);
      expect(newState.name).toBe('self:status:running;mode:normal;ops:closing');

    });
  });
});

describe('DoorFaultState', () => {
  /**
   * @type {IHyperDoor}
   */
  let mockHyperDoor;
  /**
   * @type {IHyperDoorState}
   */
  let doorFaultState;
  /**
   * 
   */
  let mockError;

  beforeEach(() => {
    mockHyperDoor = {
      // Mock any necessary properties or methods
    };

    // Create an Error object to pass to the constructor
    mockError = new Error('Test Error');

    doorFaultState = new DoorFaultState(mockHyperDoor, mockError);
  });

  describe('constructor', () => {
    it('should set the status message to the error message', () => {
      expect(doorFaultState.statusMessage).toBe(mockError.message);
    });
  });

  describe('open', () => {
    it('Should be able to indicate when an error interrupts opening', () => {
      doorFaultState.open();
      expect(doorFaultState.name).toBe('self:status:error;mode:normal;ops:null');
    });
  });

  describe('close', () => {
    it('Should be able to indicate when an error interrupts closing', () => {
      doorFaultState.close();
      expect(doorFaultState.name).toBe('self:status:error;mode:normal;ops:null');
    });
  });
});


