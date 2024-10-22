import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget20Component } from './tables-widget20.component';

describe('TablesWidget20Component', () => {
  let component: TablesWidget20Component;
  let fixture: ComponentFixture<TablesWidget20Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget20Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
