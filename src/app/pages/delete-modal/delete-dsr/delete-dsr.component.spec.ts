import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDsrComponent } from './delete-dsr.component';

describe('DeleteDsrComponent', () => {
  let component: DeleteDsrComponent;
  let fixture: ComponentFixture<DeleteDsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteDsrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteDsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
