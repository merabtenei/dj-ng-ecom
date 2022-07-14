import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedInNavbarStatusComponent } from './logged-in-navbar-status.component';

describe('LoggedInNavbarStatusComponent', () => {
  let component: LoggedInNavbarStatusComponent;
  let fixture: ComponentFixture<LoggedInNavbarStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoggedInNavbarStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggedInNavbarStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
