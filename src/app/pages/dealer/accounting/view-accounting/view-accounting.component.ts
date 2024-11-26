import { Component } from '@angular/core';
import { WidgetsModule } from 'src/app/_metronic/partials';

@Component({
  selector: 'app-view-accounting',
  standalone: true,
  imports: [WidgetsModule],
  templateUrl: './view-accounting.component.html',
  styleUrl: './view-accounting.component.scss'
})
export class ViewAccountingComponent {

}
