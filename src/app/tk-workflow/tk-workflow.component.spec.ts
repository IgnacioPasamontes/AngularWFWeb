import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TkWorkflowComponent } from './tk-workflow.component';

describe('TkWorkflowComponent', () => {
  let component: TkWorkflowComponent;
  let fixture: ComponentFixture<TkWorkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TkWorkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TkWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
