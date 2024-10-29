import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceTablesWidget9Component } from './advance-tables-widget9.component';

describe('AdvanceTablesWidget9Component', () => {
  let component: AdvanceTablesWidget9Component;
  let fixture: ComponentFixture<AdvanceTablesWidget9Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceTablesWidget9Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvanceTablesWidget9Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
