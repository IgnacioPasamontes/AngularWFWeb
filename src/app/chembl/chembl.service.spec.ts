import { TestBed } from '@angular/core/testing';

import { ChemblService } from './chembl.service';

describe('ChemblService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChemblService = TestBed.get(ChemblService);
    expect(service).toBeTruthy();
  });
});
