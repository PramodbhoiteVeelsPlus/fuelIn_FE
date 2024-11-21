import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubeTaxStatementComponent } from './lube-tax-statement.component';

describe('LubeTaxStatementComponent', () => {
  let component: LubeTaxStatementComponent;
  let fixture: ComponentFixture<LubeTaxStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LubeTaxStatementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LubeTaxStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
