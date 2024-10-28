import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadKitNumberComponent } from './upload-kit-number.component';

describe('UploadKitNumberComponent', () => {
  let component: UploadKitNumberComponent;
  let fixture: ComponentFixture<UploadKitNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadKitNumberComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadKitNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
