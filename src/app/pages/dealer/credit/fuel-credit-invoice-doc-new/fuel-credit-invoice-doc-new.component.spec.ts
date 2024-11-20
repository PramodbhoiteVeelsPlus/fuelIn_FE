import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelCreditInvoiceDocNewComponent } from './fuel-credit-invoice-doc-new.component';

describe('FuelCreditInvoiceDocNewComponent', () => {
  let component: FuelCreditInvoiceDocNewComponent;
  let fixture: ComponentFixture<FuelCreditInvoiceDocNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelCreditInvoiceDocNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuelCreditInvoiceDocNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
