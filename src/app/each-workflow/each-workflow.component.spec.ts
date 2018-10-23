import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EachWorkflowComponent } from './each-workflow.component';

describe('EachWorkflowComponent', () => {
  let component: EachWorkflowComponent;
  let fixture: ComponentFixture<EachWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EachWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EachWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
