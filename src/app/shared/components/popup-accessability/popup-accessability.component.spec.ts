import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupAccessabilityComponent } from './popup-accessability.component';

describe('PopupAccessabilityComponent', () => {
  let component: PopupAccessabilityComponent;
  let fixture: ComponentFixture<PopupAccessabilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupAccessabilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupAccessabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
