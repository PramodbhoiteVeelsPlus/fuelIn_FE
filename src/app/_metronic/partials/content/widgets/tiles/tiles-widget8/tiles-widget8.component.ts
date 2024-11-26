import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tiles-widget8',
  templateUrl: './tiles-widget8.component.html',
})
export class TilesWidget8Component {
  @Input() cssClass = '';
  @Input() widgetHeight = '130px';

  constructor() {}
}
