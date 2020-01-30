import { TestBed } from '@angular/core/testing';

import { TcCharacteritzationService } from './tc-characteritzation.service';

describe('TcCharacteritzationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TcCharacteritzationService = TestBed.get(TcCharacteritzationService);
    expect(service).toBeTruthy();
  });
});
