import { TestBed } from '@angular/core/testing';

import { ChemblRaxService } from './chembl-rax.service';

describe('ChemblRaxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChemblRaxService = TestBed.get(ChemblRaxService);
    expect(service).toBeTruthy();
  });
});
