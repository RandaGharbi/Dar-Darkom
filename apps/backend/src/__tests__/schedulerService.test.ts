import * as schedulerService from '../services/schedulerService';

describe('schedulerService', () => {
  afterAll(() => {
    schedulerService.schedulerService.stop();
  });
  it('devrait être défini', () => {
    expect(schedulerService).toBeDefined();
  });
}); 