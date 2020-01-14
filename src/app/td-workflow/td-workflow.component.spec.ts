import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TdWorkflowComponent } from './td-workflow.component';

describe('TdWorkflowComponent', () => {
  let component: TdWorkflowComponent;
  let fixture: ComponentFixture<TdWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TdWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TdWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
