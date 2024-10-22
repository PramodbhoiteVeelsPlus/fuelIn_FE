import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelProductMasterComponent } from './fuel-product-master.component';

describe('FuelProductMasterComponent', () => {
  let component: FuelProductMasterComponent;
  let fixture: ComponentFixture<FuelProductMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelProductMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FuelProductMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
