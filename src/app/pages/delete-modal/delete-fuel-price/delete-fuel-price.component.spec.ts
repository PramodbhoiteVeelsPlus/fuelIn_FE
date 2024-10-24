import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFuelPriceComponent } from './delete-fuel-price.component';

describe('DeleteFuelPriceComponent', () => {
  let component: DeleteFuelPriceComponent;
  let fixture: ComponentFixture<DeleteFuelPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteFuelPriceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteFuelPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
