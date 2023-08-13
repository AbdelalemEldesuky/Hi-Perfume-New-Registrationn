import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFeaturedPropertiesComponent } from './list-featuredProperties.component';

describe('ListFeaturedPropertiesComponent', () => {
  let component: ListFeaturedPropertiesComponent;
  let fixture: ComponentFixture<ListFeaturedPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListFeaturedPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFeaturedPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
