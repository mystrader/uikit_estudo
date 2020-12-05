import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreweriesUpdateComponent } from './breweries-update.component';

describe('BreweriesUpdateComponent', () => {
  let component: BreweriesUpdateComponent;
  let fixture: ComponentFixture<BreweriesUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreweriesUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreweriesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
