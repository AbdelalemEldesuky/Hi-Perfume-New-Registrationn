import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsComponentComponent } from './terms.component';

describe('TermsComponentComponent', () => {
  let component: TermsComponentComponent;
  let fixture: ComponentFixture<TermsComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermsComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
