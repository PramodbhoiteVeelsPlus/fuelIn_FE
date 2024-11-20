import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelCreditInvoiceVehicleComponent } from './fuel-credit-invoice-vehicle.component';

describe('FuelCreditInvoiceVehicleComponent', () => {
  let component: FuelCreditInvoiceVehicleComponent;
  let fixture: ComponentFixture<FuelCreditInvoiceVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelCreditInvoiceVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuelCreditInvoiceVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
