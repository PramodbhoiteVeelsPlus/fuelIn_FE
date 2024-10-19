import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget17Component } from './tables-widget17.component';

describe('TablesWidget17Component', () => {
  let component: TablesWidget17Component;
  let fixture: ComponentFixture<TablesWidget17Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget17Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget17Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
