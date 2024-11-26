import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tiles-widget9',
  templateUrl: './tiles-widget9.component.html',
})
export class TilesWidget9Component {
  @Input() cssClass = '';
  @Input() widgetHeight = '130px';

  constructor() {}
}
