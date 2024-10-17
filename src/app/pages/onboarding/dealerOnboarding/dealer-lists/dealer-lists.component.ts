import { Component } from '@angular/core';

@Component({
  selector: 'app-dealer-lists',
  templateUrl: './dealer-lists.component.html',
  styleUrl: './dealer-lists.component.scss'
})
export class DealerListsComponent {
  isDealer: boolean = false;
  isTransporter: boolean = false;
  isAdmin: boolean = true;

}
