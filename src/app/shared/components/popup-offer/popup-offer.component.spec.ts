import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupOfferComponent } from './popup-offer.component';

describe('PopupOfferComponent', () => {
  let component: PopupOfferComponent;
  let fixture: ComponentFixture<PopupOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
