import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { StatsService } from '../stats.services';

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
  dealerMobile: any;
  fuelDealerId: any;
  thisMonthCrSale: any;
  thisMonthCrPayment: any;
  totalOS: any;
  isOS: boolean;
  isSales: boolean;
  isPayment: boolean;

  constructor(
    private post: StatsService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.dealerMobile = element.phone1;
    this.getDealerIdByPhone(this.dealerMobile);
    this.cd.detectChanges()
  }

  getDealerIdByPhone(dealerMobile: any) {
    let data = {
      mobileNumber: dealerMobile,
    };
    this.post.searchDealerByMobilePOST(data)
      .subscribe(res => {
        if ((res.status = "OK")) {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.getCreditDetailsByDealerId(this.fuelDealerId);
          if (this.title == "Credit O/s") {
            this.isOS = true;
            this.isSales = false;
            this.isPayment = false;
          } else if (this.title == "Credit Sales") {
            this.isOS = false;
            this.isSales = true;
            this.isPayment = false;
          } else if (this.title == "Credit Payment") {
            this.isOS = false;
            this.isSales = false;
            this.isPayment = true;            
          }
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()
        }
        this.cd.detectChanges()
      });
  }

  getCreditDetailsByDealerId(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getCreditDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.dataSales[0].totalPurchase) {
            this.thisMonthCrSale = res.dataSales[0].totalPurchase
          } else {
            this.thisMonthCrSale = 0
          }
          if (res.dataPayment[0].totalPayment) {
            this.thisMonthCrPayment = res.dataPayment[0].totalPayment
          } else {
            this.thisMonthCrPayment = 0
          }
          this.totalOS = Number(res.outstanding).toFixed(2);
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  
}