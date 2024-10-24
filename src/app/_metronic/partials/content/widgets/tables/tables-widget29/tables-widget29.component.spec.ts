import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget29Component } from './tables-widget29.component';

describe('TablesWidget29Component', () => {
  let component: TablesWidget29Component;
  let fixture: ComponentFixture<TablesWidget29Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget29Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget29Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
