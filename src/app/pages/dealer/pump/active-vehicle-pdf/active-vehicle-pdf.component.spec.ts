import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveVehiclePdfComponent } from './active-vehicle-pdf.component';

describe('ActiveVehiclePdfComponent', () => {
  let component: ActiveVehiclePdfComponent;
  let fixture: ComponentFixture<ActiveVehiclePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveVehiclePdfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActiveVehiclePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
