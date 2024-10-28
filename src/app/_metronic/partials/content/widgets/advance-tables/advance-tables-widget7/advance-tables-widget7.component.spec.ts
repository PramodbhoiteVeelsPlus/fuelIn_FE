import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceTablesWidget7Component } from './advance-tables-widget7.component';

describe('AdvanceTablesWidget7Component', () => {
  let component: AdvanceTablesWidget7Component;
  let fixture: ComponentFixture<AdvanceTablesWidget7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceTablesWidget7Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdvanceTablesWidget7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
