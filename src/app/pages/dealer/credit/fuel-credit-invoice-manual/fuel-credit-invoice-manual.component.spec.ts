import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelCreditInvoiceManualComponent } from './fuel-credit-invoice-manual.component';

describe('FuelCreditInvoiceManualComponent', () => {
  let component: FuelCreditInvoiceManualComponent;
  let fixture: ComponentFixture<FuelCreditInvoiceManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelCreditInvoiceManualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuelCreditInvoiceManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
