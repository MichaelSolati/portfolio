import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinComponent } from './linkedin.component';

describe('LinkedinComponent', () => {
  let component: LinkedinComponent;
  let fixture: ComponentFixture<LinkedinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
