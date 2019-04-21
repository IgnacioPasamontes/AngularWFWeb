import { TestBed } from '@angular/core/testing';

import { EachWorkflowService } from './each-workflow.service';

describe('EachWorkflowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EachWorkflowService = TestBed.get(EachWorkflowService);
    expect(service).toBeTruthy();
  });
});
