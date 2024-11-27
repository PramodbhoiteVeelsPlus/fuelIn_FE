import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTimeWiseComponent } from './shift-time-wise.component';

describe('ShiftTimeWiseComponent', () => {
  let component: ShiftTimeWiseComponent;
  let fixture: ComponentFixture<ShiftTimeWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftTimeWiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftTimeWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
