import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLubricantComponent } from './add-lubricant.component';

describe('AddLubricantComponent', () => {
  let component: AddLubricantComponent;
  let fixture: ComponentFixture<AddLubricantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddLubricantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddLubricantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
