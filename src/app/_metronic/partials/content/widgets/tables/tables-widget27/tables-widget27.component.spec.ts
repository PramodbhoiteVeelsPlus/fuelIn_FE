import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget27Component } from './tables-widget27.component';

describe('TablesWidget27Component', () => {
  let component: TablesWidget27Component;
  let fixture: ComponentFixture<TablesWidget27Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget27Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget27Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
