import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSaleComponent } from './dashboard-sale.component';

describe('DashboardSaleComponent', () => {
  let component: DashboardSaleComponent;
  let fixture: ComponentFixture<DashboardSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
