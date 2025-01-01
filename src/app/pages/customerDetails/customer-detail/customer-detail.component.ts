import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.scss'
})
export class CustomerDetailComponent {
  acceesGroup: any;

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.acceesGroup = element.accessGroupId
  }

}
