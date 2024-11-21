import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSummaryReportComponent } from './view-summary-report.component';

describe('ViewSummaryReportComponent', () => {
  let component: ViewSummaryReportComponent;
  let fixture: ComponentFixture<ViewSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSummaryReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
