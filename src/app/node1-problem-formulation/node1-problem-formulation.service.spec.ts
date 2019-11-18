import { TestBed } from '@angular/core/testing';

import { Node1ProblemFormulationService } from './node1-problem-formulation.service';

describe('Node1ProblemFormulationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Node1ProblemFormulationService = TestBed.get(Node1ProblemFormulationService);
    expect(service).toBeTruthy();
  });
});
