/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PCPartComponent } from './pcpart.component';

describe('PCPartComponent', () => {
  let component: PCPartComponent;
  let fixture: ComponentFixture<PCPartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PCPartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PCPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
