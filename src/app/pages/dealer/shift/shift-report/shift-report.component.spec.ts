import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftReportComponent } from './shift-report.component';

describe('ShiftReportComponent', () => {
  let component: ShiftReportComponent;
  let fixture: ComponentFixture<ShiftReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
