import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget28Component } from './tables-widget28.component';

describe('TablesWidget28Component', () => {
  let component: TablesWidget28Component;
  let fixture: ComponentFixture<TablesWidget28Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget28Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget28Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
