import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtAllTollTransactionComponent } from './ft-all-toll-transaction.component';

describe('FtAllTollTransactionComponent', () => {
  let component: FtAllTollTransactionComponent;
  let fixture: ComponentFixture<FtAllTollTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FtAllTollTransactionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FtAllTollTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
