import { ComponentFixture, TestBed } from '@angular/core/testing';

import { requestComponent } from './request.component';

describe('requestComponent', () => {
  let component: requestComponent;
  let fixture: ComponentFixture<requestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [requestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(requestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
