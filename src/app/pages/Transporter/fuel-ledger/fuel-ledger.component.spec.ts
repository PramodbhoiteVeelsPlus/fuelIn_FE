import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelLedgerComponent } from './fuel-ledger.component';

describe('FuelLedgerComponent', () => {
  let component: FuelLedgerComponent;
  let fixture: ComponentFixture<FuelLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelLedgerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuelLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
