import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget15Component } from './tables-widget15.component';

describe('TablesWidget15Component', () => {
  let component: TablesWidget15Component;
  let fixture: ComponentFixture<TablesWidget15Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget15Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
