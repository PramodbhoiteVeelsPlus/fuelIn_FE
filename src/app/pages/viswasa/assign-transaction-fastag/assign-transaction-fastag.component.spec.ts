import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTransactionFastagComponent } from './assign-transaction-fastag.component';

describe('AssignTransactionFastagComponent', () => {
  let component: AssignTransactionFastagComponent;
  let fixture: ComponentFixture<AssignTransactionFastagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignTransactionFastagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignTransactionFastagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
