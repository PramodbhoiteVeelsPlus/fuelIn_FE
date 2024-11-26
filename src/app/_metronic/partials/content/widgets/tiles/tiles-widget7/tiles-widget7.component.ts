import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tiles-widget7',
  templateUrl: './tiles-widget7.component.html',
})
export class TilesWidget7Component {
  @Input() cssClass = '';
  @Input() widgetHeight = '130px';

  constructor() {}
}
