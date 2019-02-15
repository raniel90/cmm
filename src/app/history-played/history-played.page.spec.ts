import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPlayedPage } from './history-played.page';

describe('HistoryPlayedPage', () => {
  let component: HistoryPlayedPage;
  let fixture: ComponentFixture<HistoryPlayedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryPlayedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryPlayedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
