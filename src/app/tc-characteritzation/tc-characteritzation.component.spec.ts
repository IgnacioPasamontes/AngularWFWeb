import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcCharacteritzationComponent } from './tc-characteritzation.component';

describe('TcCharacteritzationComponent', () => {
  let component: TcCharacteritzationComponent;
  let fixture: ComponentFixture<TcCharacteritzationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcCharacteritzationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcCharacteritzationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
