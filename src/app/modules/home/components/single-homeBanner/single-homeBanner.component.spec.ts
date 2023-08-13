import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleHomeBannerComponent } from './single-homeBanner.component';

describe('SingleHomeBannerComponent', () => {
  let component: SingleHomeBannerComponent;
  let fixture: ComponentFixture<SingleHomeBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleHomeBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleHomeBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
