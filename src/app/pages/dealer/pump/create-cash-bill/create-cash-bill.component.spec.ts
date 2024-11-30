import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCashBillComponent } from './create-cash-bill.component';

describe('CreateCashBillComponent', () => {
  let component: CreateCashBillComponent;
  let fixture: ComponentFixture<CreateCashBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCashBillComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateCashBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
