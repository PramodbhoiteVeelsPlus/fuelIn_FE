import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceTablesWidget10Component } from './advance-tables-widget10.component';

describe('AdvanceTablesWidget10Component', () => {
  let component: AdvanceTablesWidget10Component;
  let fixture: ComponentFixture<AdvanceTablesWidget10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceTablesWidget10Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvanceTablesWidget10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
