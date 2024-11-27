import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TankDsrComponent } from './tank-dsr.component';

describe('TankDsrComponent', () => {
  let component: TankDsrComponent;
  let fixture: ComponentFixture<TankDsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TankDsrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TankDsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
