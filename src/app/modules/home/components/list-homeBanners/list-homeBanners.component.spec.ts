import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHomeBannersComponent } from './list-homeBanners.component';

describe('ListHomeBannersComponent', () => {
  let component: ListHomeBannersComponent;
  let fixture: ComponentFixture<ListHomeBannersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListHomeBannersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHomeBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
