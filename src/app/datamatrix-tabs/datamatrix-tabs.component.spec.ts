import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatamatrixTabsComponent } from './datamatrix-tabs.component';

describe('DatamatrixTabsComponent', () => {
  let component: DatamatrixTabsComponent;
  let fixture: ComponentFixture<DatamatrixTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatamatrixTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatamatrixTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
