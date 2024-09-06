import { Component } from '@angular/core';

type Tabs =
  | 'kt_table_widget_9_tab_1'
  | 'kt_table_widget_9_tab_2'
  | 'kt_table_widget_9_tab_3';


@Component({
  selector: 'app-tables-widget9',
  templateUrl: './tables-widget9.component.html',
})
export class TablesWidget9Component {
selectEntity: any = "";
  constructor() {}
  
  activeTab: Tabs = 'kt_table_widget_9_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }
  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }
}
