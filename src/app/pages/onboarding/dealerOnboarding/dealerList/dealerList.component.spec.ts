import { ComponentFixture, TestBed } from '@angular/core/testing';

import { dealerListComponent } from './dealerList.component';

describe('Dashboard1Component', () => {
  let component: dealerListComponent;
  let fixture: ComponentFixture<dealerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [dealerListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(dealerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
