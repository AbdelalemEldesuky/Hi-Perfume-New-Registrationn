import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleFeaturedPropertyComponent } from './single-featuredProperty.component';

describe('SingleFeaturedPropertyComponent', () => {
  let component: SingleFeaturedPropertyComponent;
  let fixture: ComponentFixture<SingleFeaturedPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleFeaturedPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleFeaturedPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
