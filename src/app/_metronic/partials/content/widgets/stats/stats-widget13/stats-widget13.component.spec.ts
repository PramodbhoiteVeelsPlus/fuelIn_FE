import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsWidget13Component } from './stats-widget13.component';

describe('StatsWidget13Component', () => {
  let component: StatsWidget13Component;
  let fixture: ComponentFixture<StatsWidget13Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsWidget13Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsWidget13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
