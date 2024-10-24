import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsWidget14Component } from './stats-widget14.component';

describe('StatsWidget14Component', () => {
  let component: StatsWidget14Component;
  let fixture: ComponentFixture<StatsWidget14Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsWidget14Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsWidget14Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
