import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsWidget10Component } from './stats-widget10.component';

describe('StatsWidget10Component', () => {
  let component: StatsWidget10Component;
  let fixture: ComponentFixture<StatsWidget10Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsWidget10Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsWidget10Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
