import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelCreditInvoiceDocComponent } from './fuel-credit-invoice-doc.component';

describe('FuelCreditInvoiceDocComponent', () => {
  let component: FuelCreditInvoiceDocComponent;
  let fixture: ComponentFixture<FuelCreditInvoiceDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelCreditInvoiceDocComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuelCreditInvoiceDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
