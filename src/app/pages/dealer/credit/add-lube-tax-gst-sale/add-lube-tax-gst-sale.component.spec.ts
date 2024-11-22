import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLubeTaxGstSaleComponent } from './add-lube-tax-gst-sale.component';

describe('AddLubeTaxGstSaleComponent', () => {
  let component: AddLubeTaxGstSaleComponent;
  let fixture: ComponentFixture<AddLubeTaxGstSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLubeTaxGstSaleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddLubeTaxGstSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
