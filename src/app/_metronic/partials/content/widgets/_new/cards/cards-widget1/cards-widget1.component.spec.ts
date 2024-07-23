import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsWidget1Component } from './cards-widget1.component';

describe('CardsWidget1Component', () => {
  let component: CardsWidget1Component;
  let fixture: ComponentFixture<CardsWidget1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardsWidget1Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsWidget1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
