import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesWidget22Component } from './tables-widget22.component';

describe('TablesWidget22Component', () => {
  let component: TablesWidget22Component;
  let fixture: ComponentFixture<TablesWidget22Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablesWidget22Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablesWidget22Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
