import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Node4InitialRaxHypothesisComponent } from './node4-initial-rax-hypothesis.component';

describe('Node4InitialRaxHypothesisComponent', () => {
  let component: Node4InitialRaxHypothesisComponent;
  let fixture: ComponentFixture<Node4InitialRaxHypothesisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Node4InitialRaxHypothesisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Node4InitialRaxHypothesisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
