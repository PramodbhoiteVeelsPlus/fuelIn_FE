import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-widget5',
  templateUrl: './stats-widget5.component.html',
})
export class StatsWidget5Component {
  @Input() svgIcon = '';
  @Input() iconColor = '';
  @Input() color = '';
  @Input() amount = '';
  @Input() title = '';

  constructor() {}
  ngOnInit(): void {
    if(this.title == "Credit O/s"){
      this.amount = '1000';
    } else if(this.title == "Credit Sales"){
      this.amount = '9999.99';
    } else if(this.title == "Credit Payment"){
      this.amount = '8999.99';
    } else{
      this.amount = ''
    }
  }
}