import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreweriesDetailComponent } from './breweries-detail.component';

describe('BreweriesDetailComponent', () => {
  let component: BreweriesDetailComponent;
  let fixture: ComponentFixture<BreweriesDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreweriesDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreweriesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
