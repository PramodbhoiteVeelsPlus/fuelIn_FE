import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccountingComponent } from './add-accounting.component';

describe('AddAccountingComponent', () => {
  let component: AddAccountingComponent;
  let fixture: ComponentFixture<AddAccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAccountingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
