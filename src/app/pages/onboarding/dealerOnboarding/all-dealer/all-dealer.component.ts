import { Component } from '@angular/core';

@Component({
  selector: 'app-all-dealer',
  templateUrl: './all-dealer.component.html',
  styleUrl: './all-dealer.component.scss'
})
export class AllDealerComponent {
  isDealer: boolean = false;
  isTransporter: boolean = false;
  isAdmin: boolean = true;

}
