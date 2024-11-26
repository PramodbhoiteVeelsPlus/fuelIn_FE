import { Component } from '@angular/core';
import { WidgetsModule } from 'src/app/_metronic/partials';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [WidgetsModule],
  templateUrl: './pos.component.html',
  styleUrl: './pos.component.scss'
})
export class PosComponent {

}
