import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelCrInvoiceComponent } from './fuel-cr-invoice.component';

describe('FuelCrInvoiceComponent', () => {
  let component: FuelCrInvoiceComponent;
  let fixture: ComponentFixture<FuelCrInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelCrInvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuelCrInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
