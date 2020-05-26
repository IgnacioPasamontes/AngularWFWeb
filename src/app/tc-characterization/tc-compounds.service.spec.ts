import { TestBed } from '@angular/core/testing';

import { TcCompoundsService } from './tc-compounds.service';

describe('TcCompoundsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TcCompoundsService = TestBed.get(TcCompoundsService);
    expect(service).toBeTruthy();
  });
});
