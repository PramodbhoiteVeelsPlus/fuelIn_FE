import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorWiseComponent } from './operator-wise.component';

describe('OperatorWiseComponent', () => {
  let component: OperatorWiseComponent;
  let fixture: ComponentFixture<OperatorWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorWiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperatorWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
