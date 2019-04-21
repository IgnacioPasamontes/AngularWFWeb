import { TestBed } from '@angular/core/testing';

import { NodeInfoService } from './node-info.service';

describe('NodeInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NodeInfoService = TestBed.get(NodeInfoService);
    expect(service).toBeTruthy();
  });
});
