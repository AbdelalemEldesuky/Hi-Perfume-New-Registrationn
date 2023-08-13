import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmLoginBtnComponent } from './confirm-payment-btn.component';

describe('SaveBtnComponent', () => {
  let component: ConfirmLoginBtnComponent;
  let fixture: ComponentFixture<ConfirmLoginBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmLoginBtnComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmLoginBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
