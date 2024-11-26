import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBankComponent } from './view-bank.component';

describe('ViewBankComponent', () => {
  let component: ViewBankComponent;
  let fixture: ComponentFixture<ViewBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
