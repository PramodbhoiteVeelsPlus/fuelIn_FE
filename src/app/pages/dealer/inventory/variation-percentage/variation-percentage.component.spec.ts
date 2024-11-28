import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariationPercentageComponent } from './variation-percentage.component';

describe('VariationPercentageComponent', () => {
  let component: VariationPercentageComponent;
  let fixture: ComponentFixture<VariationPercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariationPercentageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VariationPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
