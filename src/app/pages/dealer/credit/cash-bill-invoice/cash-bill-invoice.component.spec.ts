import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashBillInvoiceComponent } from './cash-bill-invoice.component';

describe('CashBillInvoiceComponent', () => {
  let component: CashBillInvoiceComponent;
  let fixture: ComponentFixture<CashBillInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashBillInvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashBillInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
