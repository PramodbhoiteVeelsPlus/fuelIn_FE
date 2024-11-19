import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatBookComponent } from './vat-book.component';

describe('VatBookComponent', () => {
  let component: VatBookComponent;
  let fixture: ComponentFixture<VatBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VatBookComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VatBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
