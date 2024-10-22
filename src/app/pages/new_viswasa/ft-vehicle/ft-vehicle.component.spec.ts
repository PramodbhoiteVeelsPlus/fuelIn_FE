import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtVehicleComponent } from './ft-vehicle.component';

describe('FtVehicleComponent', () => {
  let component: FtVehicleComponent;
  let fixture: ComponentFixture<FtVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FtVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FtVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
