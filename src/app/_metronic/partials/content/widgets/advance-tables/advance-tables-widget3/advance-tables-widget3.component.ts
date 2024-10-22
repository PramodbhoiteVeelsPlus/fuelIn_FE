import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advance-tables-widget3',
  templateUrl: './advance-tables-widget3.component.html',
})
export class AdvanceTablesWidget3Component implements OnInit {
  currentTab = 'Day';

  constructor() {}

  ngOnInit(): void {}

  setCurrentTab(tab: string) {
    this.currentTab = tab;
  }
}
