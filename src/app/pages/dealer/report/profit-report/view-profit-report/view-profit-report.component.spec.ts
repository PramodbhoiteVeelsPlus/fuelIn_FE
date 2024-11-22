import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfitReportComponent } from './view-profit-report.component';

describe('ViewProfitReportComponent', () => {
  let component: ViewProfitReportComponent;
  let fixture: ComponentFixture<ViewProfitReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProfitReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewProfitReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
