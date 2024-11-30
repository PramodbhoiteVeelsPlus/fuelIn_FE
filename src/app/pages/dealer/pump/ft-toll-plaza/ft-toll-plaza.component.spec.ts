import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtTollPlazaComponent } from './ft-toll-plaza.component';

describe('FtTollPlazaComponent', () => {
  let component: FtTollPlazaComponent;
  let fixture: ComponentFixture<FtTollPlazaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FtTollPlazaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FtTollPlazaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
