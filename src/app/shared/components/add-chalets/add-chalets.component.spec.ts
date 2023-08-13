import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChaletsComponent } from './add-chalets.component';

describe('AddChaletsComponent', () => {
  let component: AddChaletsComponent;
  let fixture: ComponentFixture<AddChaletsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChaletsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChaletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
