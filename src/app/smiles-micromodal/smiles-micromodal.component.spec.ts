import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmilesMicromodalComponent } from './smiles-micromodal.component';

describe('SmilesMicromodalComponent', () => {
  let component: SmilesMicromodalComponent;
  let fixture: ComponentFixture<SmilesMicromodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmilesMicromodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmilesMicromodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
