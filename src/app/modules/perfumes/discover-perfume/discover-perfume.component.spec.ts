import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverPerfumeComponent } from './discover-perfume.component';

describe('DiscoverPerfumeComponent', () => {
  let component: DiscoverPerfumeComponent;
  let fixture: ComponentFixture<DiscoverPerfumeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverPerfumeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverPerfumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
