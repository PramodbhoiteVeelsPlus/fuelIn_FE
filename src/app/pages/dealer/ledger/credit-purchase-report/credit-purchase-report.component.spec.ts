import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditPurchaseReportComponent } from './credit-purchase-report.component';

describe('CreditPurchaseReportComponent', () => {
  let component: CreditPurchaseReportComponent;
  let fixture: ComponentFixture<CreditPurchaseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditPurchaseReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditPurchaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
