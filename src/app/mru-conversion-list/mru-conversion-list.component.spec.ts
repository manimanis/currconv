import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MruConversionListComponent } from './mru-conversion-list.component';

describe('MruConversionListComponent', () => {
  let component: MruConversionListComponent;
  let fixture: ComponentFixture<MruConversionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MruConversionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MruConversionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
