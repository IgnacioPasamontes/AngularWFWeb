import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Name2casComponent } from './name2cas.component';

describe('Name2casComponent', () => {
  let component: Name2casComponent;
  let fixture: ComponentFixture<Name2casComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Name2casComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Name2casComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
