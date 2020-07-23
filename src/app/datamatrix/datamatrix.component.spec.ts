import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatamatrixComponent } from './datamatrix.component';

describe('DatamatrixComponent', () => {
  let component: DatamatrixComponent;
  let fixture: ComponentFixture<DatamatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatamatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatamatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
