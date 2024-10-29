import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastagLQComponent } from './fastag-lq.component';

describe('FastagLQComponent', () => {
  let component: FastagLQComponent;
  let fixture: ComponentFixture<FastagLQComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FastagLQComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FastagLQComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
