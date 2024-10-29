import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastagReplacementComponent } from './fastag-replacement.component';

describe('FastagReplacementComponent', () => {
  let component: FastagReplacementComponent;
  let fixture: ComponentFixture<FastagReplacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FastagReplacementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FastagReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
