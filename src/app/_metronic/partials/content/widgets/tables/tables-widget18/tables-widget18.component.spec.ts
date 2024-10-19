import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget18Component } from './tables-widget18.component';

describe('TablesWidget18Component', () => {
  let component: TablesWidget18Component;
  let fixture: ComponentFixture<TablesWidget18Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget18Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget18Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
