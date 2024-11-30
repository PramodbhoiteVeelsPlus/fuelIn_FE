import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtActiveVehicleComponent } from './ft-active-vehicle.component';

describe('FtActiveVehicleComponent', () => {
  let component: FtActiveVehicleComponent;
  let fixture: ComponentFixture<FtActiveVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FtActiveVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FtActiveVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
