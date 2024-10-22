import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFuelPartnerComponent } from './add-fuel-partner.component';

describe('AddFuelPartnerComponent', () => {
  let component: AddFuelPartnerComponent;
  let fixture: ComponentFixture<AddFuelPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFuelPartnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFuelPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
