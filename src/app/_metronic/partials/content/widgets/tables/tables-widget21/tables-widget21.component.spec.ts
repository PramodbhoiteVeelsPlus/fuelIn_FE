import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget21Component } from './tables-widget21.component';

describe('TablesWidget21Component', () => {
  let component: TablesWidget21Component;
  let fixture: ComponentFixture<TablesWidget21Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget21Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget21Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
