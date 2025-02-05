import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbiCreditComponent } from './ubi-credit.component';

describe('UbiCreditComponent', () => {
  let component: UbiCreditComponent;
  let fixture: ComponentFixture<UbiCreditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbiCreditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UbiCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
