import { Component, OnInit } from '@angular/core';
import moment from 'moment';

type Tabs =
  | 'kt_table_widget_10_tab_1'
  | 'kt_table_widget_10_tab_2'
  | 'kt_table_widget_10_tab_3';

@Component({
  selector: 'app-tables-widget10',
  templateUrl: './tables-widget10.component.html',
})
export class TablesWidget10Component implements OnInit {
  closingDate = moment(new Date()).format("YYYY-MM-DD")
  openingDate = moment(new Date()).format("YYYY-MM-01")
  selectMonth: any = "";
  selectYear: any = "";
  constructor() { }

  activeTab: Tabs = 'kt_table_widget_10_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }
  ngOnInit(): void {
  }
}
