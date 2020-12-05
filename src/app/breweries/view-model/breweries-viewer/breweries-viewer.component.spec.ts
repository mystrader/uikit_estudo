import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreweriesViewerComponent } from './breweries-viewer.component';

describe('BreweriesViewerComponent', () => {
  let component: BreweriesViewerComponent;
  let fixture: ComponentFixture<BreweriesViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreweriesViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreweriesViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
