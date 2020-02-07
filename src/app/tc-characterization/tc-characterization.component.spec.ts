import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcCharacterizationComponent } from './tc-characterization.component';

describe('TcCharacterizationComponent', () => {
  let component: TcCharacterizationComponent;
  let fixture: ComponentFixture<TcCharacterizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcCharacterizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcCharacterizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
