import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-widget1',
  templateUrl: './cards-widget1.component.html',
  styleUrls: ['./cards-widget1.component.scss'],
})
export class CardsWidget1Component implements OnInit {
  @Input() cssClass: string = '';
  @Input() description: string = '';
  @Input() color: string = '';
  @Input() img: string = '';
  constructor() {}

  ngOnInit(): void {}
}
