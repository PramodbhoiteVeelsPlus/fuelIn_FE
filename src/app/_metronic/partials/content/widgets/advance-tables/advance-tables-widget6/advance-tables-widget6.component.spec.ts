import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceTablesWidget6Component } from './advance-tables-widget6.component';

describe('AdvanceTablesWidget6Component', () => {
  let component: AdvanceTablesWidget6Component;
  let fixture: ComponentFixture<AdvanceTablesWidget6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceTablesWidget6Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvanceTablesWidget6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
