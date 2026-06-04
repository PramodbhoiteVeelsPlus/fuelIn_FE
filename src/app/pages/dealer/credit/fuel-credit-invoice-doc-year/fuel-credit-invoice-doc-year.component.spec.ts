import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelCreditInvoiceDocYearComponent } from './fuel-credit-invoice-doc-year.component';

describe('FuelCreditInvoiceDocYearComponent', () => {
  let component: FuelCreditInvoiceDocYearComponent;
  let fixture: ComponentFixture<FuelCreditInvoiceDocYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelCreditInvoiceDocYearComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuelCreditInvoiceDocYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
