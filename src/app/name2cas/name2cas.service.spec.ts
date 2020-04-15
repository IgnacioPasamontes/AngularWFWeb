import { TestBed } from '@angular/core/testing';

import { Name2casService } from './name2cas.service';

describe('Name2casService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Name2casService = TestBed.get(Name2casService);
    expect(service).toBeTruthy();
  });
});
