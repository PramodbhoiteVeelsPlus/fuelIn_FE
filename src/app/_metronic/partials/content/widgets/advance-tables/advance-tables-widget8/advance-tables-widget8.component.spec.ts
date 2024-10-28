import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceTablesWidget8Component } from './advance-tables-widget8.component';

describe('AdvanceTablesWidget8Component', () => {
  let component: AdvanceTablesWidget8Component;
  let fixture: ComponentFixture<AdvanceTablesWidget8Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceTablesWidget8Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvanceTablesWidget8Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
