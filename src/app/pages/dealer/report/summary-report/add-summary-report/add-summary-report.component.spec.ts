import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSummaryReportComponent } from './add-summary-report.component';

describe('AddSummaryReportComponent', () => {
  let component: AddSummaryReportComponent;
  let fixture: ComponentFixture<AddSummaryReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSummaryReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
