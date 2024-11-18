import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccountDetailsComponent } from './view-account-details.component';

describe('ViewAccountDetailsComponent', () => {
  let component: ViewAccountDetailsComponent;
  let fixture: ComponentFixture<ViewAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAccountDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
