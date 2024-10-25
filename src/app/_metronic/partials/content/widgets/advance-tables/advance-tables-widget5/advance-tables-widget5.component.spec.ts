import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceTablesWidget5Component } from './advance-tables-widget5.component';

describe('AdvanceTablesWidget5Component', () => {
  let component: AdvanceTablesWidget5Component;
  let fixture: ComponentFixture<AdvanceTablesWidget5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceTablesWidget5Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvanceTablesWidget5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
