import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtTotalRechargeComponent } from './ft-total-recharge.component';

describe('FtTotalRechargeComponent', () => {
  let component: FtTotalRechargeComponent;
  let fixture: ComponentFixture<FtTotalRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FtTotalRechargeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FtTotalRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
