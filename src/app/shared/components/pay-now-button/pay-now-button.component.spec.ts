import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PayNowButtonComponent } from './pay-now-button.component';

describe('PayNowButtonComponent', () => {
  let component: PayNowButtonComponent;
  let fixture: ComponentFixture<PayNowButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PayNowButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PayNowButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
