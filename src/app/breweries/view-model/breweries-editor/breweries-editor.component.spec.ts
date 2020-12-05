import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreweriesEditorComponent } from './breweries-editor.component';

describe('BreweriesEditorComponent', () => {
  let component: BreweriesEditorComponent;
  let fixture: ComponentFixture<BreweriesEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreweriesEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreweriesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
