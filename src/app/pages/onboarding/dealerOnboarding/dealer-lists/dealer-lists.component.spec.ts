import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerListsComponent } from './dealer-lists.component';

describe('DealerListsComponent', () => {
  let component: DealerListsComponent;
  let fixture: ComponentFixture<DealerListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerListsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DealerListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
