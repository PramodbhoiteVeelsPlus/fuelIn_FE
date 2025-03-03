import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { ChartsService } from '../charts.services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-charts-widget1',
  templateUrl: './charts-widget1.component.html',
})
export class ChartsWidget1Component implements OnInit {
  chartOptions: any = {};
  months: any = [];
  os: any = [];
  purchase: any = [];
  payment: any = [];
  fuelDealerId: any;
  month1: any;
  month2: any;
  month3: any;
  month4: any;
  month5: any;
  month6: any = '';
  os1: any = 0;
  os2: any = 0;
  os3: any = 0;
  os4: any = 0;
  os5: any = 0;
  os6: any = 0;
  purchase1: any = 0;
  purchase2: any = 0;
  purchase3: any = 0;
  purchase4: any = 0;
  purchase5: any = 0;
  purchase6: any = 0;
  payment1: any = 0;
  payment2: any = 0;
  payment3: any = 0;
  payment4: any = 0;
  payment5: any = 0;
  payment6: any = 0;
  accessGroupId: any;
  dealerId: any;
  dealerCorporateId: any;
  graphData: any = [];

  constructor(private post: ChartsService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.spinner.hide();
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.graphData = JSON.parse(localStorage.getItem("graphData") || '{}');
    this.accessGroupId = element.accessGroupId;
    if (!this.graphData.length) {
      this.getGraphDataByDealerId(this.fuelDealerId);
    } else {
      this.getGraphDataByDealerId1(this.fuelDealerId);
    }
    this.cd.detectChanges()
  }


  getGraphDataByDealerId(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getLastSixMonthsCrPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.graphData = res.data.reverse()
          localStorage.setItem('graphData', JSON.stringify(this.graphData));
          if (res.data.length > 5) {
            //Months
            if (this.graphData[5]) {
              this.month1 = this.graphData[5].month + ' ' + this.graphData[5].year;
            }
            if (this.graphData[4]) {
              this.month2 = this.graphData[4].month + ' ' + this.graphData[4].year;
            }
            if (this.graphData[3]) {
              this.month3 = this.graphData[3].month + ' ' + this.graphData[3].year;
            }
            if (this.graphData[2]) {
              this.month4 = this.graphData[2].month + ' ' + this.graphData[2].year;
            }
            if (this.graphData[1]) {
              this.month5 = this.graphData[1].month + ' ' + this.graphData[1].year;
            }
            if (this.graphData[0]) {
              this.month6 = this.graphData[0].month + ' ' + this.graphData[0].year;
            }

            // OS          
            if (this.graphData[5]) {
              this.os1 = Number(this.graphData[5].balance).toFixed(0);
            }
            if (this.graphData[4]) {
              this.os2 = Number(this.graphData[4].balance).toFixed(0);
            }
            if (this.graphData[3]) {
              this.os3 = Number(this.graphData[3].balance).toFixed(0);
            }
            if (this.graphData[2]) {
              this.os4 = Number(this.graphData[2].balance).toFixed(0);
            }
            if (this.graphData[1]) {
              this.os5 = Number(this.graphData[1].balance).toFixed(0);
            }
            if (this.graphData[0]) {
              this.os6 = Number(this.graphData[0].balance).toFixed(0);
            }

            // Purchase          
            if (this.graphData[5]) {
              this.purchase1 = Number(this.graphData[5].purchase).toFixed(0);
            }
            if (this.graphData[4]) {
              this.purchase2 = Number(this.graphData[4].purchase).toFixed(0);
            }
            if (this.graphData[3]) {
              this.purchase3 = Number(this.graphData[3].purchase).toFixed(0);
            }
            if (this.graphData[2]) {
              this.purchase4 = Number(this.graphData[2].purchase).toFixed(0);
            }
            if (this.graphData[1]) {
              this.purchase5 = Number(this.graphData[1].purchase).toFixed(0);
            }
            if (this.graphData[0]) {
              this.purchase6 = Number(this.graphData[0].purchase).toFixed(0);
            }

            // Payment          
            if (this.graphData[5]) {
              this.payment1 = Number(this.graphData[5].payment).toFixed(0);
            }
            if (this.graphData[4]) {
              this.payment2 = Number(this.graphData[4].payment).toFixed(0);
            }
            if (this.graphData[3]) {
              this.payment3 = Number(this.graphData[3].payment).toFixed(0);
            }
            if (this.graphData[2]) {
              this.payment4 = Number(this.graphData[2].payment).toFixed(0);
            }
            if (this.graphData[1]) {
              this.payment5 = Number(this.graphData[1].payment).toFixed(0);
            }
            if (this.graphData[0]) {
              this.payment6 = Number(this.graphData[0].payment).toFixed(0);
            }

            this.months = [this.month1, this.month2, this.month3, this.month4, this.month5, this.month6];
            this.os = [this.os1, this.os2, this.os3, this.os4, this.os5, this.os6];
            this.purchase = [this.purchase1, this.purchase2, this.purchase3, this.purchase4, this.purchase5, this.purchase6];
            this.payment = [this.payment1, this.payment2, this.payment3, this.payment4, this.payment5, this.payment6];

          } else if (res.data.length == 5) {
            //Months
            if (this.graphData[4]) {
              this.month1 = this.graphData[4].month + ' ' + this.graphData[4].year;
            }
            if (this.graphData[3]) {
              this.month2 = this.graphData[3].month + ' ' + this.graphData[3].year;
            }
            if (this.graphData[2]) {
              this.month3 = this.graphData[2].month + ' ' + this.graphData[2].year;
            }
            if (this.graphData[1]) {
              this.month4 = this.graphData[1].month + ' ' + this.graphData[1].year;
            }
            if (this.graphData[0]) {
              this.month5 = this.graphData[0].month + ' ' + this.graphData[0].year;
            }

            // OS          
            if (this.graphData[4]) {
              this.os1 = Number(this.graphData[4].balance).toFixed(0);
            }
            if (this.graphData[3]) {
              this.os2 = Number(this.graphData[3].balance).toFixed(0);
            }
            if (this.graphData[2]) {
              this.os3 = Number(this.graphData[2].balance).toFixed(0);
            }
            if (this.graphData[1]) {
              this.os4 = Number(this.graphData[1].balance).toFixed(0);
            }
            if (res.data[0]) {
              this.os5 = Number(this.graphData[0].balance).toFixed(0);
            }

            // Purchase          
            if (this.graphData[4]) {
              this.purchase1 = Number(this.graphData[4].purchase).toFixed(0);
            }
            if (this.graphData[3]) {
              this.purchase2 = Number(this.graphData[3].purchase).toFixed(0);
            }
            if (this.graphData[2]) {
              this.purchase3 = Number(this.graphData[2].purchase).toFixed(0);
            }
            if (this.graphData[1]) {
              this.purchase4 = Number(this.graphData[1].purchase).toFixed(0);
            }
            if (this.graphData[0]) {
              this.purchase5 = Number(this.graphData[0].purchase).toFixed(0);
            }

            // Payment          
            if (this.graphData[4]) {
              this.payment1 = Number(this.graphData[4].payment).toFixed(0);
            }
            if (this.graphData[3]) {
              this.payment2 = Number(this.graphData[3].payment).toFixed(0);
            }
            if (this.graphData[2]) {
              this.payment3 = Number(this.graphData[2].payment).toFixed(0);
            }
            if (this.graphData[1]) {
              this.payment4 = Number(this.graphData[1].payment).toFixed(0);
            }
            if (this.graphData[0]) {
              this.payment5 = Number(this.graphData[0].payment).toFixed(0);
            }

            this.months = [this.month1, this.month2, this.month3, this.month4, this.month5];
            this.os = [this.os1, this.os2, this.os3, this.os4, this.os5];
            this.purchase = [this.purchase1, this.purchase2, this.purchase3, this.purchase4, this.purchase5];
            this.payment = [this.payment1, this.payment2, this.payment3, this.payment4, this.payment5];
          } else if (res.data.length == 4) {
            //Months
            if (this.graphData[3]) {
              this.month1 = this.graphData[3].month + ' ' + this.graphData[3].year;
            }
            if (this.graphData[2]) {
              this.month2 = this.graphData[2].month + ' ' + this.graphData[2].year;
            }
            if (this.graphData[1]) {
              this.month3 = this.graphData[1].month + ' ' + this.graphData[1].year;
            }
            if (this.graphData[0]) {
              this.month4 = this.graphData[0].month + ' ' + this.graphData[0].year;
            }

            // OS          
            if (this.graphData[3]) {
              this.os1 = Number(this.graphData[3].balance).toFixed(0);
            }
            if (this.graphData[2]) {
              this.os3 = Number(this.graphData[2].balance).toFixed(0);
            }
            if (this.graphData[1]) {
              this.os2 = Number(this.graphData[1].balance).toFixed(0);
            }
            if (this.graphData[0]) {
              this.os4 = Number(this.graphData[0].balance).toFixed(0);
            }

            // Purchase          
            if (this.graphData[3]) {
              this.purchase1 = Number(this.graphData[3].purchase).toFixed(0);
            }
            if (this.graphData[2]) {
              this.purchase2 = Number(this.graphData[2].purchase).toFixed(0);
            }
            if (this.graphData[1]) {
              this.purchase3 = Number(this.graphData[1].purchase).toFixed(0);
            }
            if (this.graphData[0]) {
              this.purchase4 = Number(this.graphData[0].purchase).toFixed(0);
            }

            // Payment          
            if (res.data[3]) {
              this.payment1 = Number(res.data[3].payment).toFixed(0);
            }
            if (res.data[2]) {
              this.payment2 = Number(res.data[2].payment).toFixed(0);
            }
            if (res.data[1]) {
              this.payment3 = Number(res.data[1].payment).toFixed(0);
            }
            if (res.data[0]) {
              this.payment4 = Number(this.graphData[0].payment).toFixed(0);
            }

            this.months = [this.month1, this.month2, this.month3, this.month4];
            this.os = [this.os1, this.os2, this.os3, this.os4];
            this.purchase = [this.purchase1, this.purchase2, this.purchase3, this.purchase4];
            this.payment = [this.payment1, this.payment2, this.payment3, this.payment4];
          } else if (res.data.length == 3) {
            //Months
            if (this.graphData[2]) {
              this.month1 = this.graphData[2].month + ' ' + this.graphData[2].year;
            }
            if (this.graphData[1]) {
              this.month2 = this.graphData[1].month + ' ' + this.graphData[1].year;
            }
            if (this.graphData[0]) {
              this.month3 = this.graphData[0].month + ' ' + this.graphData[0].year;
            }

            // OS          
            if (this.graphData[2]) {
              this.os1 = Number(this.graphData[2].balance).toFixed(0);
            }
            if (this.graphData[1]) {
              this.os2 = Number(this.graphData[1].balance).toFixed(0);
            }
            if (this.graphData[0]) {
              this.os3 = Number(this.graphData[0].balance).toFixed(0);
            }

            // Purchase          
            if (this.graphData[2]) {
              this.purchase1 = Number(this.graphData[2].purchase).toFixed(0);
            }
            if (this.graphData[1]) {
              this.purchase2 = Number(this.graphData[1].purchase).toFixed(0);
            }
            if (this.graphData[0]) {
              this.purchase3 = Number(this.graphData[0].purchase).toFixed(0);
            }

            // Payment          
            if (this.graphData[2]) {
              this.payment1 = Number(this.graphData[2].payment).toFixed(0);
            }
            if (this.graphData[1]) {
              this.payment2 = Number(this.graphData[1].payment).toFixed(0);
            }
            if (this.graphData[0]) {
              this.payment3 = Number(this.graphData[0].payment).toFixed(0);
            }

            this.months = [this.month1, this.month2, this.month3];
            this.os = [this.os1, this.os2, this.os3];
            this.purchase = [this.purchase1, this.purchase2, this.purchase3];
            this.payment = [this.payment1, this.payment2, this.payment3];
          } else if (res.data.length == 2) {
            //Months
            if (this.graphData[1]) {
              this.month1 = this.graphData[1].month + ' ' + this.graphData[1].year;
            }
            if (this.graphData[0]) {
              this.month2 = this.graphData[0].month + ' ' + this.graphData[0].year;
            }

            // OS          
            if (this.graphData[1]) {
              this.os1 = Number(this.graphData[1].balance).toFixed(0);
            }
            if (this.graphData[0]) {
              this.os2 = Number(this.graphData[0].balance).toFixed(0);
            }

            // Purchase          
            if (this.graphData[1]) {
              this.purchase1 = Number(this.graphData[1].purchase).toFixed(0);
            }
            if (this.graphData[0]) {
              this.purchase2 = Number(this.graphData[0].purchase).toFixed(0);
            }

            // Payment          
            if (this.graphData[1]) {
              this.payment1 = Number(this.graphData[1].payment).toFixed(0);
            }
            if (this.graphData[0]) {
              this.payment2 = Number(this.graphData[0].payment).toFixed(0);
            }

            this.months = [this.month1, this.month2];
            this.os = [this.os1, this.os2];
            this.purchase = [this.purchase1, this.purchase2];
            this.payment = [this.payment1, this.payment2];
          } else if (res.data.length == 1) {
            //Months
            if (this.graphData[0]) {
              this.month1 = this.graphData[0].month;
            }

            // OS          
            if (this.graphData[0]) {
              this.os1 = Number(this.graphData[0].balance).toFixed(0);
            }

            // Purchase          
            if (this.graphData[0]) {
              this.purchase1 = Number(this.graphData[0].purchase).toFixed(0);
            }

            // Payment          
            if (this.graphData[0]) {
              this.payment1 = Number(this.graphData[0].payment).toFixed(0);
            }

            this.months = [this.month1];
            this.os = [this.os1];
            this.purchase = [this.purchase1];
            this.payment = [this.payment1];
          } else {
            this.months = [];
            this.os = [];
            this.purchase = [];
            this.payment = [];
          }

          this.chartOptions = getChartOptions(350, this.months, this.os, this.purchase, this.payment);
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);
          this.cd.detectChanges();
        } else {
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);
          this.cd.detectChanges();
        }
      })
  }

  getGraphDataByDealerId1(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getLastSixMonthsCrPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.graphData = res.data.reverse()
          localStorage.setItem('graphData', JSON.stringify(this.graphData));
          if (res.data.length > 5) {
            //Months
            if (this.graphData[5]) {
              this.month1 = this.graphData[5].month + ' ' + this.graphData[5].year;
            }
            if (this.graphData[4]) {
              this.month2 = this.graphData[4].month + ' ' + this.graphData[4].year;
            }
            if (this.graphData[3]) {
              this.month3 = this.graphData[3].month + ' ' + this.graphData[3].year;
            }
            if (this.graphData[2]) {
              this.month4 = this.graphData[2].month + ' ' + this.graphData[2].year;
            }
            if (this.graphData[1]) {
              this.month5 = this.graphData[1].month + ' ' + this.graphData[1].year;
            }
            if (this.graphData[0]) {
              this.month6 = this.graphData[0].month + ' ' + this.graphData[0].year;
            }

            // OS          
            if (this.graphData[5]) {
              this.os1 = Number(this.graphData[5].balance).toFixed(0);
            }
            if (this.graphData[4]) {
              this.os2 = Number(this.graphData[4].balance).toFixed(0);
            }
            if (this.graphData[3]) {
              this.os3 = Number(this.graphData[3].balance).toFixed(0);
            }
            if (this.graphData[2]) {
              this.os4 = Number(this.graphData[2].balance).toFixed(0);
            }
            if (this.graphData[1]) {
              this.os5 = Number(this.graphData[1].balance).toFixed(0);
            }
            if (this.graphData[0]) {
              this.os6 = Number(this.graphData[0].balance).toFixed(0);
            }

            // Purchase          
            if (this.graphData[5]) {
              this.purchase1 = Number(this.graphData[5].purchase).toFixed(0);
            }
            if (this.graphData[4]) {
              this.purchase2 = Number(this.graphData[4].purchase).toFixed(0);
            }
            if (this.graphData[3]) {
              this.purchase3 = Number(this.graphData[3].purchase).toFixed(0);
            }
            if (this.graphData[2]) {
              this.purchase4 = Number(this.graphData[2].purchase).toFixed(0);
            }
            if (this.graphData[1]) {
              this.purchase5 = Number(this.graphData[1].purchase).toFixed(0);
            }
            if (this.graphData[0]) {
              this.purchase6 = Number(this.graphData[0].purchase).toFixed(0);
            }

            // Payment          
            if (this.graphData[5]) {
              this.payment1 = Number(this.graphData[5].payment).toFixed(0);
            }
            if (this.graphData[4]) {
              this.payment2 = Number(this.graphData[4].payment).toFixed(0);
            }
            if (this.graphData[3]) {
              this.payment3 = Number(this.graphData[3].payment).toFixed(0);
            }
            if (this.graphData[2]) {
              this.payment4 = Number(this.graphData[2].payment).toFixed(0);
            }
            if (this.graphData[1]) {
              this.payment5 = Number(this.graphData[1].payment).toFixed(0);
            }
            if (this.graphData[0]) {
              this.payment6 = Number(this.graphData[0].payment).toFixed(0);
            }

            this.months = [this.month1, this.month2, this.month3, this.month4, this.month5, this.month6];
            this.os = [this.os1, this.os2, this.os3, this.os4, this.os5, this.os6];
            this.purchase = [this.purchase1, this.purchase2, this.purchase3, this.purchase4, this.purchase5, this.purchase6];
            this.payment = [this.payment1, this.payment2, this.payment3, this.payment4, this.payment5, this.payment6];

          } else if (res.data.length == 5) {
            //Months
            if (this.graphData[4]) {
              this.month1 = this.graphData[4].month + ' ' + this.graphData[4].year;
            }
            if (this.graphData[3]) {
              this.month2 = this.graphData[3].month + ' ' + this.graphData[3].year;
            }
            if (this.graphData[2]) {
              this.month3 = this.graphData[2].month + ' ' + this.graphData[2].year;
            }
            if (this.graphData[1]) {
              this.month4 = this.graphData[1].month + ' ' + this.graphData[1].year;
            }
            if (this.graphData[0]) {
              this.month5 = this.graphData[0].month + ' ' + this.graphData[0].year;
            }

            // OS          
            if (this.graphData[4]) {
              this.os1 = Number(this.graphData[4].balance).toFixed(0);
            }
            if (this.graphData[3]) {
              this.os2 = Number(this.graphData[3].balance).toFixed(0);
            }
            if (this.graphData[2]) {
              this.os3 = Number(this.graphData[2].balance).toFixed(0);
            }
            if (this.graphData[1]) {
              this.os4 = Number(this.graphData[1].balance).toFixed(0);
            }
            if (res.data[0]) {
              this.os5 = Number(this.graphData[0].balance).toFixed(0);
            }

            // Purchase          
            if (this.graphData[4]) {
              this.purchase1 = Number(this.graphData[4].purchase).toFixed(0);
            }
            if (this.graphData[3]) {
              this.purchase2 = Number(this.graphData[3].purchase).toFixed(0);
            }
            if (this.graphData[2]) {
              this.purchase3 = Number(this.graphData[2].purchase).toFixed(0);
            }
            if (this.graphData[1]) {
              this.purchase4 = Number(this.graphData[1].purchase).toFixed(0);
            }
            if (this.graphData[0]) {
              this.purchase5 = Number(this.graphData[0].purchase).toFixed(0);
            }

            // Payment          
            if (this.graphData[4]) {
              this.payment1 = Number(this.graphData[4].payment).toFixed(0);
            }
            if (this.graphData[3]) {
              this.payment2 = Number(this.graphData[3].payment).toFixed(0);
            }
            if (this.graphData[2]) {
              this.payment3 = Number(this.graphData[2].payment).toFixed(0);
            }
            if (this.graphData[1]) {
              this.payment4 = Number(this.graphData[1].payment).toFixed(0);
            }
            if (this.graphData[0]) {
              this.payment5 = Number(this.graphData[0].payment).toFixed(0);
            }

            this.months = [this.month1, this.month2, this.month3, this.month4, this.month5];
            this.os = [this.os1, this.os2, this.os3, this.os4, this.os5];
            this.purchase = [this.purchase1, this.purchase2, this.purchase3, this.purchase4, this.purchase5];
            this.payment = [this.payment1, this.payment2, this.payment3, this.payment4, this.payment5];
          } else if (res.data.length == 4) {
            //Months
            if (this.graphData[3]) {
              this.month1 = this.graphData[3].month + ' ' + this.graphData[3].year;
            }
            if (this.graphData[2]) {
              this.month2 = this.graphData[2].month + ' ' + this.graphData[2].year;
            }
            if (this.graphData[1]) {
              this.month3 = this.graphData[1].month + ' ' + this.graphData[1].year;
            }
            if (this.graphData[0]) {
              this.month4 = this.graphData[0].month + ' ' + this.graphData[0].year;
            }

            // OS          
            if (this.graphData[3]) {
              this.os1 = Number(this.graphData[3].balance).toFixed(0);
            }
            if (this.graphData[2]) {
              this.os3 = Number(this.graphData[2].balance).toFixed(0);
            }
            if (this.graphData[1]) {
              this.os2 = Number(this.graphData[1].balance).toFixed(0);
            }
            if (this.graphData[0]) {
              this.os4 = Number(this.graphData[0].balance).toFixed(0);
            }

            // Purchase          
            if (this.graphData[3]) {
              this.purchase1 = Number(this.graphData[3].purchase).toFixed(0);
            }
            if (this.graphData[2]) {
              this.purchase2 = Number(this.graphData[2].purchase).toFixed(0);
            }
            if (this.graphData[1]) {
              this.purchase3 = Number(this.graphData[1].purchase).toFixed(0);
            }
            if (this.graphData[0]) {
              this.purchase4 = Number(this.graphData[0].purchase).toFixed(0);
            }

            // Payment          
            if (res.data[3]) {
              this.payment1 = Number(res.data[3].payment).toFixed(0);
            }
            if (res.data[2]) {
              this.payment2 = Number(res.data[2].payment).toFixed(0);
            }
            if (res.data[1]) {
              this.payment3 = Number(res.data[1].payment).toFixed(0);
            }
            if (res.data[0]) {
              this.payment4 = Number(this.graphData[0].payment).toFixed(0);
            }

            this.months = [this.month1, this.month2, this.month3, this.month4];
            this.os = [this.os1, this.os2, this.os3, this.os4];
            this.purchase = [this.purchase1, this.purchase2, this.purchase3, this.purchase4];
            this.payment = [this.payment1, this.payment2, this.payment3, this.payment4];
          } else if (res.data.length == 3) {
            //Months
            if (this.graphData[2]) {
              this.month1 = this.graphData[2].month + ' ' + this.graphData[2].year;
            }
            if (this.graphData[1]) {
              this.month2 = this.graphData[1].month + ' ' + this.graphData[1].year;
            }
            if (this.graphData[0]) {
              this.month3 = this.graphData[0].month + ' ' + this.graphData[0].year;
            }

            // OS          
            if (this.graphData[2]) {
              this.os1 = Number(this.graphData[2].balance).toFixed(0);
            }
            if (this.graphData[1]) {
              this.os2 = Number(this.graphData[1].balance).toFixed(0);
            }
            if (this.graphData[0]) {
              this.os3 = Number(this.graphData[0].balance).toFixed(0);
            }

            // Purchase          
            if (this.graphData[2]) {
              this.purchase1 = Number(this.graphData[2].purchase).toFixed(0);
            }
            if (this.graphData[1]) {
              this.purchase2 = Number(this.graphData[1].purchase).toFixed(0);
            }
            if (this.graphData[0]) {
              this.purchase3 = Number(this.graphData[0].purchase).toFixed(0);
            }

            // Payment          
            if (this.graphData[2]) {
              this.payment1 = Number(this.graphData[2].payment).toFixed(0);
            }
            if (this.graphData[1]) {
              this.payment2 = Number(this.graphData[1].payment).toFixed(0);
            }
            if (this.graphData[0]) {
              this.payment3 = Number(this.graphData[0].payment).toFixed(0);
            }

            this.months = [this.month1, this.month2, this.month3];
            this.os = [this.os1, this.os2, this.os3];
            this.purchase = [this.purchase1, this.purchase2, this.purchase3];
            this.payment = [this.payment1, this.payment2, this.payment3];
          } else if (res.data.length == 2) {
            //Months
            if (this.graphData[1]) {
              this.month1 = this.graphData[1].month + ' ' + this.graphData[1].year;
            }
            if (this.graphData[0]) {
              this.month2 = this.graphData[0].month + ' ' + this.graphData[0].year;
            }

            // OS          
            if (this.graphData[1]) {
              this.os1 = Number(this.graphData[1].balance).toFixed(0);
            }
            if (this.graphData[0]) {
              this.os2 = Number(this.graphData[0].balance).toFixed(0);
            }

            // Purchase          
            if (this.graphData[1]) {
              this.purchase1 = Number(this.graphData[1].purchase).toFixed(0);
            }
            if (this.graphData[0]) {
              this.purchase2 = Number(this.graphData[0].purchase).toFixed(0);
            }

            // Payment          
            if (this.graphData[1]) {
              this.payment1 = Number(this.graphData[1].payment).toFixed(0);
            }
            if (this.graphData[0]) {
              this.payment2 = Number(this.graphData[0].payment).toFixed(0);
            }

            this.months = [this.month1, this.month2];
            this.os = [this.os1, this.os2];
            this.purchase = [this.purchase1, this.purchase2];
            this.payment = [this.payment1, this.payment2];
          } else if (res.data.length == 1) {
            //Months
            if (this.graphData[0]) {
              this.month1 = this.graphData[0].month;
            }

            // OS          
            if (this.graphData[0]) {
              this.os1 = Number(this.graphData[0].balance).toFixed(0);
            }

            // Purchase          
            if (this.graphData[0]) {
              this.purchase1 = Number(this.graphData[0].purchase).toFixed(0);
            }

            // Payment          
            if (this.graphData[0]) {
              this.payment1 = Number(this.graphData[0].payment).toFixed(0);
            }

            this.months = [this.month1];
            this.os = [this.os1];
            this.purchase = [this.purchase1];
            this.payment = [this.payment1];
          } else {
            this.months = [];
            this.os = [];
            this.purchase = [];
            this.payment = [];
          }

          this.chartOptions = getChartOptions(350, this.months, this.os, this.purchase, this.payment);
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);
          this.cd.detectChanges();
        } else {
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);
          this.cd.detectChanges();
        }
      })
  }
}

function getChartOptions(height: number, months: any, os: any, purchase: any, payment: any) {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')

  return {
    series: [
      {
        name: 'O/s',
        data: [os[0], os[1], os[2], os[3], os[4], os[5]],
      },
      {
        name: 'Sales',
        data: [purchase[0], purchase[1], purchase[2], purchase[3], purchase[4], purchase[5]],
      },
      {
        name: 'Payment',
        data: [payment[0], payment[1], payment[2], payment[3], payment[4], payment[5]],
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'bar',
      height: height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 5,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      title: {
        text: 'Month'
      },
      categories: months,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      title: {
        text: '₹'
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val: number) {
          return '₹' + val;
        },
      },
    },
    colors: ['#F8285A', '#1B84FF', '#17C653'],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };
}
