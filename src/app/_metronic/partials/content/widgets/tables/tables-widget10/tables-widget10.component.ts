import { Component, OnInit } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-tables-widget10',
  templateUrl: './tables-widget10.component.html',
})
export class TablesWidget10Component implements OnInit {
  closingDate = moment(new Date()).format("YYYY-MM-DD")
  openingDate = moment(new Date()).format("YYYY-MM-01")
  constructor() {}

  ngOnInit(): void {
  }
}
