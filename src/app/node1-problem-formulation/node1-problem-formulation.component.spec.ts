import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Node1ProblemFormulationComponent } from './node1-problem-formulation.component';

describe('Node1ProblemFormulationComponent', () => {
  let component: Node1ProblemFormulationComponent;
  let fixture: ComponentFixture<Node1ProblemFormulationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Node1ProblemFormulationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Node1ProblemFormulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
