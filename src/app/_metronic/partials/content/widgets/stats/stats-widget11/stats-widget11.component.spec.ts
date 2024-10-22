import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsWidget11Component } from './stats-widget11.component';

describe('StatsWidget11Component', () => {
  let component: StatsWidget11Component;
  let fixture: ComponentFixture<StatsWidget11Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsWidget11Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsWidget11Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
