import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tiles-widget5',
  templateUrl: './tiles-widget5.component.html',
})
export class TilesWidget5Component {
  @Input() cssClass = '';
  @Input() widgetHeight = '130px';

  constructor() {}
}
