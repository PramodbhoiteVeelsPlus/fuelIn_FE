import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftWiseComponent } from './shift-wise.component';

describe('ShiftWiseComponent', () => {
  let component: ShiftWiseComponent;
  let fixture: ComponentFixture<ShiftWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShiftWiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShiftWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
