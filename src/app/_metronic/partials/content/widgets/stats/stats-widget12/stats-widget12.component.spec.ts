import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsWidget12Component } from './stats-widget12.component';

describe('StatsWidget12Component', () => {
  let component: StatsWidget12Component;
  let fixture: ComponentFixture<StatsWidget12Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsWidget12Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsWidget12Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
