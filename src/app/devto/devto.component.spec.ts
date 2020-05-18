import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevtoComponent } from './devto.component';

describe('DevtoComponent', () => {
  let component: DevtoComponent;
  let fixture: ComponentFixture<DevtoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevtoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
