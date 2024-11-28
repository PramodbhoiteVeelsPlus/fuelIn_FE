import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OilCompanyPurchaseComponent } from './oil-company-purchase.component';

describe('OilCompanyPurchaseComponent', () => {
  let component: OilCompanyPurchaseComponent;
  let fixture: ComponentFixture<OilCompanyPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OilCompanyPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OilCompanyPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
