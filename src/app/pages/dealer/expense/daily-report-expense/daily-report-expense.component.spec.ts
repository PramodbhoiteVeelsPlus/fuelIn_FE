import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportExpenseComponent } from './daily-report-expense.component';

describe('DailyReportExpenseComponent', () => {
  let component: DailyReportExpenseComponent;
  let fixture: ComponentFixture<DailyReportExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyReportExpenseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyReportExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
