import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtVehicleSummaryComponent } from './ft-vehicle-summary.component';

describe('FtVehicleSummaryComponent', () => {
  let component: FtVehicleSummaryComponent;
  let fixture: ComponentFixture<FtVehicleSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FtVehicleSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FtVehicleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
