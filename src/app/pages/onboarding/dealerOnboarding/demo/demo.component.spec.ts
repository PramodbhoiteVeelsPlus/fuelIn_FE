import { ComponentFixture, TestBed } from '@angular/core/testing';

import { demoComponent } from './demo.component';

describe('Dashboard3Component', () => {
  let component: demoComponent;
  let fixture: ComponentFixture<demoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [demoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(demoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
