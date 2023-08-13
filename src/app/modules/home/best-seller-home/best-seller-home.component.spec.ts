import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestSellerHomeComponent } from './best-seller-home.component';

describe('BestSellerHomeComponent', () => {
  let component: BestSellerHomeComponent;
  let fixture: ComponentFixture<BestSellerHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestSellerHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestSellerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
