import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccountingComponent } from './view-accounting.component';

describe('ViewAccountingComponent', () => {
  let component: ViewAccountingComponent;
  let fixture: ComponentFixture<ViewAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAccountingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
