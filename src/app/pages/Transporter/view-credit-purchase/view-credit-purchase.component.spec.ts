import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCreditPurchaseComponent } from './view-credit-purchase.component';

describe('ViewCreditPurchaseComponent', () => {
  let component: ViewCreditPurchaseComponent;
  let fixture: ComponentFixture<ViewCreditPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCreditPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCreditPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
