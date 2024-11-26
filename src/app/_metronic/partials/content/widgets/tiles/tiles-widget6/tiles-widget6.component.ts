import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tiles-widget6',
  templateUrl: './tiles-widget6.component.html',
})
export class TilesWidget6Component {
  @Input() cssClass = '';
  @Input() widgetHeight = '130px';

  constructor() {}
}
