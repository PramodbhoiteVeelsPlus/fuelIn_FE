import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerDetailsComponent } from './dealer-details.component';

describe('DealerDetailsComponent', () => {
  let component: DealerDetailsComponent;
  let fixture: ComponentFixture<DealerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DealerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
