import { TestBed } from '@angular/core/testing';

import { TcCharacterizationService } from './tc-characterization.service';

describe('TcCharacterizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TcCharacterizationService = TestBed.get(TcCharacterizationService);
    expect(service).toBeTruthy();
  });
});
