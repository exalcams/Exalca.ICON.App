import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcedefinationComponent } from './sourcedefination.component';

describe('SourcedefinationComponent', () => {
  let component: SourcedefinationComponent;
  let fixture: ComponentFixture<SourcedefinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SourcedefinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourcedefinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
