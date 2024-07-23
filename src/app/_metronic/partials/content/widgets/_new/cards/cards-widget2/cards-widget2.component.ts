import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards-widget2',
  templateUrl: './cards-widget2.component.html',
  styleUrls: ['./cards-widget2.component.scss'],
})
export class CardsWidget2Component implements OnInit {
  @Input() cssClass: string = '';
  @Input() description: string = '';
  @Input() color: string = '';
  @Input() img: string = '';
  constructor() {}

  ngOnInit(): void {}
}
