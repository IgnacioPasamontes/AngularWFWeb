import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemblComponent } from './chembl.component';

describe('ChemblComponent', () => {
  let component: ChemblComponent;
  let fixture: ComponentFixture<ChemblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemblComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
