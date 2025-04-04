import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperaterWiseComponent } from './operater-wise.component';

describe('OperaterWiseComponent', () => {
  let component: OperaterWiseComponent;
  let fixture: ComponentFixture<OperaterWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperaterWiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OperaterWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
