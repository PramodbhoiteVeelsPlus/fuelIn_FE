import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget24Component } from './tables-widget24.component';

describe('TablesWidget24Component', () => {
  let component: TablesWidget24Component;
  let fixture: ComponentFixture<TablesWidget24Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget24Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget24Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
