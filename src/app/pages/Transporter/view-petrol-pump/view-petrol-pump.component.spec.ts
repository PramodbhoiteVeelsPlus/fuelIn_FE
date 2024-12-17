import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPetrolPumpComponent } from './view-petrol-pump.component';

describe('ViewPetrolPumpComponent', () => {
  let component: ViewPetrolPumpComponent;
  let fixture: ComponentFixture<ViewPetrolPumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPetrolPumpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPetrolPumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
