import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyReportEntriesComponent } from './daily-report-entries.component';

describe('DailyReportEntriesComponent', () => {
  let component: DailyReportEntriesComponent;
  let fixture: ComponentFixture<DailyReportEntriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyReportEntriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyReportEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
