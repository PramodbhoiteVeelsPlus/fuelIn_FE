import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityCountComponent } from './activity-count.component';

describe('ActivityCountComponent', () => {
  let component: ActivityCountComponent;
  let fixture: ComponentFixture<ActivityCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityCountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActivityCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
