import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoatassemplyComponent } from './boatassemply.component';

describe('BoatassemplyComponent', () => {
  let component: BoatassemplyComponent;
  let fixture: ComponentFixture<BoatassemplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoatassemplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoatassemplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
