import { Component } from '@angular/core';

@Component({
  selector: 'app-demo-removed',
  templateUrl: './demo-removed.component.html',
  styleUrl: './demo-removed.component.scss'
})
export class DemoRemovedComponent {
  isDealer: boolean = false;
  isTransporter: boolean = false;
  isAdmin: boolean = true;

}
