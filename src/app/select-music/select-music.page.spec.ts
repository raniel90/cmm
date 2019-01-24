import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMusicPage } from './select-music.page';

describe('SelectMusicPage', () => {
  let component: SelectMusicPage;
  let fixture: ComponentFixture<SelectMusicPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMusicPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMusicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
