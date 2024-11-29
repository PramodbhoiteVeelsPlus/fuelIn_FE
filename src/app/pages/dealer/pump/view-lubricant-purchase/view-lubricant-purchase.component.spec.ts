import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLubricantPurchaseComponent } from './view-lubricant-purchase.component';

describe('ViewLubricantPurchaseComponent', () => {
  let component: ViewLubricantPurchaseComponent;
  let fixture: ComponentFixture<ViewLubricantPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewLubricantPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewLubricantPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
