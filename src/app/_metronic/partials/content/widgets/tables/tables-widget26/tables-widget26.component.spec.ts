import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget26Component } from './tables-widget26.component';

describe('TablesWidget26Component', () => {
  let component: TablesWidget26Component;
  let fixture: ComponentFixture<TablesWidget26Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget26Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget26Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
