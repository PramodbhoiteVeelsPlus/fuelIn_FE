import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOilCompanyPurchaseComponent } from './view-oil-company-purchase.component';

describe('ViewOilCompanyPurchaseComponent', () => {
  let component: ViewOilCompanyPurchaseComponent;
  let fixture: ComponentFixture<ViewOilCompanyPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOilCompanyPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewOilCompanyPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
