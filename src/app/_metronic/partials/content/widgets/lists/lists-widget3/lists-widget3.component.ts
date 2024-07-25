import { Component } from '@angular/core';

@Component({
  selector: 'app-lists-widget3',
  templateUrl: './lists-widget3.component.html',
})
export class ListsWidget3Component {
  
   array = [
    {companyName: "1 A PRAMOD_S TRADERS", totalPurchase: 91160, totalPayment: 33000, netOS: 112970},
    {companyName: "A A AAA", totalPurchase: 110000, totalPayment: 0, netOS: 110000},
    {companyName: "A PRATHAM_S TRADERS", totalPurchase: 0, totalPayment: 0, netOS: 85100},
    {companyName: "REALMEOW TRANSLINES", totalPurchase: 0, totalPayment: 0, netOS: 84350},
    {companyName: "BB AAA", totalPurchase: 0, totalPayment: 0, netOS: 76220}]
  constructor() {}
  ngOnInit(){
console.log(this.array)
  }
}
