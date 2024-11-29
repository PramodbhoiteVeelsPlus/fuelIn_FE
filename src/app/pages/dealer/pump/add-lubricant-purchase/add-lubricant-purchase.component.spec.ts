import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLubricantPurchaseComponent } from './add-lubricant-purchase.component';

describe('AddLubricantPurchaseComponent', () => {
  let component: AddLubricantPurchaseComponent;
  let fixture: ComponentFixture<AddLubricantPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLubricantPurchaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddLubricantPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
