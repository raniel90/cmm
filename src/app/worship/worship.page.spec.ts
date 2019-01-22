import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorshipPage } from './worship.page';

describe('WorshipPage', () => {
  let component: WorshipPage;
  let fixture: ComponentFixture<WorshipPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorshipPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorshipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
