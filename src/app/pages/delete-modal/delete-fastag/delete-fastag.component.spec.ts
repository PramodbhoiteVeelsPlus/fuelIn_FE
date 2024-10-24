import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteFastagComponent } from './delete-fastag.component';

describe('DeleteFastagComponent', () => {
  let component: DeleteFastagComponent;
  let fixture: ComponentFixture<DeleteFastagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteFastagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteFastagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
