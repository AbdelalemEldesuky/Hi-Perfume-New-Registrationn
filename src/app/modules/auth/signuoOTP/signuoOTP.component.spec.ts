import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { signuoOTPComponent } from './signuoOTP.component';


describe('signuoOTPComponent', () => {
  let component: signuoOTPComponent;
  let fixture: ComponentFixture<signuoOTPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ signuoOTPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(signuoOTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
