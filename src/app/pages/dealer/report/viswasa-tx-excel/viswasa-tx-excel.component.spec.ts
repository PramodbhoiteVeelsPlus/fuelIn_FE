import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViswasaTxExcelComponent } from './viswasa-tx-excel.component';

describe('ViswasaTxExcelComponent', () => {
  let component: ViswasaTxExcelComponent;
  let fixture: ComponentFixture<ViswasaTxExcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViswasaTxExcelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViswasaTxExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
