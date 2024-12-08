import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTimeReportComponent } from './shift-time-report.component';

describe('ShiftTimeReportComponent', () => {
  let component: ShiftTimeReportComponent;
  let fixture: ComponentFixture<ShiftTimeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftTimeReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftTimeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
