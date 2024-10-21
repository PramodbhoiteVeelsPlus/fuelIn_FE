import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountTransporterComponent } from './count-transporter.component';

describe('CountTransporterComponent', () => {
  let component: CountTransporterComponent;
  let fixture: ComponentFixture<CountTransporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountTransporterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CountTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
