import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditStatementComponent } from './credit-statement.component';

describe('CreditStatementComponent', () => {
  let component: CreditStatementComponent;
  let fixture: ComponentFixture<CreditStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditStatementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
