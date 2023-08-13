import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionComponentComponent } from './selection-component.component';

describe('SelectionComponentComponent', () => {
  let component: SelectionComponentComponent;
  let fixture: ComponentFixture<SelectionComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
