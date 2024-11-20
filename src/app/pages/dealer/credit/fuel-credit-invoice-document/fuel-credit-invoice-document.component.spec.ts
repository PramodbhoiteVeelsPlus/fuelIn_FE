import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelCreditInvoiceDocumentComponent } from './fuel-credit-invoice-document.component';

describe('FuelCreditInvoiceDocumentComponent', () => {
  let component: FuelCreditInvoiceDocumentComponent;
  let fixture: ComponentFixture<FuelCreditInvoiceDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelCreditInvoiceDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuelCreditInvoiceDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
