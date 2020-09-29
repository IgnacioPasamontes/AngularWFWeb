import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemblRaxComponent } from './chembl-rax.component';

describe('ChemblRaxComponent', () => {
  let component: ChemblRaxComponent;
  let fixture: ComponentFixture<ChemblRaxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemblRaxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemblRaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
