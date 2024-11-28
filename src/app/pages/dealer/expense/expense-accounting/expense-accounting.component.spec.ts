import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseAccountingComponent } from './expense-accounting.component';

describe('ExpenseAccountingComponent', () => {
  let component: ExpenseAccountingComponent;
  let fixture: ComponentFixture<ExpenseAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseAccountingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpenseAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
