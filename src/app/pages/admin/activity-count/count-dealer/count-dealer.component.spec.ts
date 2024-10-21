import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountDealerComponent } from './count-dealer.component';

describe('CountDealerComponent', () => {
  let component: CountDealerComponent;
  let fixture: ComponentFixture<CountDealerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountDealerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CountDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
