import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveVehicleLQPdfComponent } from './active-vehicle-lqpdf.component';

describe('ActiveVehicleLQPdfComponent', () => {
  let component: ActiveVehicleLQPdfComponent;
  let fixture: ComponentFixture<ActiveVehicleLQPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveVehicleLQPdfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActiveVehicleLQPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
