import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSummaryReportComponent } from './update-summary-report.component';

describe('UpdateSummaryReportComponent', () => {
  let component: UpdateSummaryReportComponent;
  let fixture: ComponentFixture<UpdateSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSummaryReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
