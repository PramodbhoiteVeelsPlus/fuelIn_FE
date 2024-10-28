import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsWidget15Component } from './stats-widget15.component';

describe('StatsWidget15Component', () => {
  let component: StatsWidget15Component;
  let fixture: ComponentFixture<StatsWidget15Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsWidget15Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsWidget15Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
