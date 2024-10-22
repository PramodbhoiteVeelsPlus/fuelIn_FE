import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget25Component } from './tables-widget25.component';

describe('TablesWidget25Component', () => {
  let component: TablesWidget25Component;
  let fixture: ComponentFixture<TablesWidget25Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget25Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget25Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
