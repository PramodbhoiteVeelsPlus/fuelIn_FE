import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookLedgerComponent } from './book-ledger.component';

describe('BookLedgerComponent', () => {
  let component: BookLedgerComponent;
  let fixture: ComponentFixture<BookLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookLedgerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
