import { TestBed } from '@angular/core/testing';

import { WorkflowsService } from './workflows.service';

describe('WorkflowsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkflowsService = TestBed.get(WorkflowsService);
    expect(service).toBeTruthy();
  });
});
