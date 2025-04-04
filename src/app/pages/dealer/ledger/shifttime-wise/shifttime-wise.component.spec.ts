import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShifttimeWiseComponent } from './shifttime-wise.component';

describe('ShifttimeWiseComponent', () => {
  let component: ShifttimeWiseComponent;
  let fixture: ComponentFixture<ShifttimeWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShifttimeWiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShifttimeWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
