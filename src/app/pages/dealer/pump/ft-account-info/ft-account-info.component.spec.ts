import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FtAccountInfoComponent } from './ft-account-info.component';

describe('FtAccountInfoComponent', () => {
  let component: FtAccountInfoComponent;
  let fixture: ComponentFixture<FtAccountInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FtAccountInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FtAccountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
