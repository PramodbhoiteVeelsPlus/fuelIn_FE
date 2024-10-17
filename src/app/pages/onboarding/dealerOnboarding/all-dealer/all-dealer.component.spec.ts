import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDealerComponent } from './all-dealer.component';

describe('AllDealerComponent', () => {
  let component: AllDealerComponent;
  let fixture: ComponentFixture<AllDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllDealerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
