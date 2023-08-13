import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomePartnersComponent } from './become-ppartners.component';

describe('BecomePartnersComponent', () => {
  let component: BecomePartnersComponent;
  let fixture: ComponentFixture<BecomePartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BecomePartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BecomePartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
