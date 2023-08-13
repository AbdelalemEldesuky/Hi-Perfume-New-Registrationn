import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueOrderComponent } from './continue-order.component';

describe('ContinueOrderComponent', () => {
  let component: ContinueOrderComponent;
  let fixture: ComponentFixture<ContinueOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContinueOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContinueOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
