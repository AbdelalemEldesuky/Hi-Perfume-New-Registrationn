import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterWhiteComponent } from './footer_white.component';

describe('FooterWhiteComponent', () => {
  let component: FooterWhiteComponent;
  let fixture: ComponentFixture<FooterWhiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterWhiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterWhiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
