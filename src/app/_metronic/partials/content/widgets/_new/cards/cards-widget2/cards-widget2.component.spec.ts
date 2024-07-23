import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsWidget2Component } from './cards-widget2.component';

describe('CardsWidget2Component', () => {
  let component: CardsWidget2Component;
  let fixture: ComponentFixture<CardsWidget2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardsWidget2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsWidget2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
