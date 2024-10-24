import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCrPaymentComponent } from './delete-cr-payment.component';

describe('DeleteCrPaymentComponent', () => {
  let component: DeleteCrPaymentComponent;
  let fixture: ComponentFixture<DeleteCrPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCrPaymentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteCrPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
