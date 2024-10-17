import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoRemovedComponent } from './demo-removed.component';

describe('DemoRemovedComponent', () => {
  let component: DemoRemovedComponent;
  let fixture: ComponentFixture<DemoRemovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoRemovedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DemoRemovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
