import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastagRechargeTransactionComponent } from './fastag-recharge-transaction.component';

describe('FastagRechargeTransactionComponent', () => {
  let component: FastagRechargeTransactionComponent;
  let fixture: ComponentFixture<FastagRechargeTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FastagRechargeTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FastagRechargeTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
