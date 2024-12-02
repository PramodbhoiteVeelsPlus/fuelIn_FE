import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSummaryReportComponent } from './vehicle-summary-report.component';

describe('VehicleSummaryReportComponent', () => {
  let component: VehicleSummaryReportComponent;
  let fixture: ComponentFixture<VehicleSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleSummaryReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
