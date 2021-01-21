import { TestBed } from '@angular/core/testing';

import { Node4InitialRaxHypothesisService } from './node4-initial-rax-hypothesis.service';

describe('Node4InitialRaxHypothesisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Node4InitialRaxHypothesisService = TestBed.get(Node4InitialRaxHypothesisService);
    expect(service).toBeTruthy();
  });
});
