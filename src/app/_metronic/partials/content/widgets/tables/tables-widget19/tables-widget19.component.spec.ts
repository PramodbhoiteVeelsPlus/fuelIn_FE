import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget19Component } from './tables-widget19.component';

describe('TablesWidget19Component', () => {
  let component: TablesWidget19Component;
  let fixture: ComponentFixture<TablesWidget19Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget19Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget19Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
