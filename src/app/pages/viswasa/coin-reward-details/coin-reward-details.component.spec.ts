import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinRewardDetailsComponent } from './coin-reward-details.component';

describe('CoinRewardDetailsComponent', () => {
  let component: CoinRewardDetailsComponent;
  let fixture: ComponentFixture<CoinRewardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinRewardDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoinRewardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
