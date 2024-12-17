import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransDashboardComponent } from './trans-dashboard.component';

describe('TransDashboardComponent', () => {
  let component: TransDashboardComponent;
  let fixture: ComponentFixture<TransDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
