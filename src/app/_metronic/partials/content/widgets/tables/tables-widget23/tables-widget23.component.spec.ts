import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget23Component } from './tables-widget23.component';

describe('TablesWidget23Component', () => {
  let component: TablesWidget23Component;
  let fixture: ComponentFixture<TablesWidget23Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget23Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget23Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
