import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculePickerComponent } from './molecule-picker.component';

describe('MoleculePickerComponent', () => {
  let component: MoleculePickerComponent;
  let fixture: ComponentFixture<MoleculePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoleculePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
