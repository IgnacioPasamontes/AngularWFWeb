import { TestBed } from '@angular/core/testing';

import { DatamatrixTabsService } from './datamatrix-tabs.service';

describe('DatamatrixTabsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatamatrixTabsService = TestBed.get(DatamatrixTabsService);
    expect(service).toBeTruthy();
  });
});
