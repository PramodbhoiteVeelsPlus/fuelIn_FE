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
  thisMonthCrSale: any = 0;
  thisMonthCrPayment: any = 0;
  totalOS: any = 0;
  isOS: boolean;
  isSales: boolean;
  isPayment: boolean;
  accessGroupId: any;
  personId: any;
  dealerId: any;
  dealerCorporateId: any;

  constructor(
    private post: StatsService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.spinner.show();
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.totalOS = JSON.parse(localStorage.getItem("totalOS") || '{}');
    this.thisMonthCrSale = JSON.parse(localStorage.getItem("thisMonthCrSale") || '{}');
    this.thisMonthCrPayment = JSON.parse(localStorage.getItem("thisMonthCrPayment") || '{}');
    this.dealerMobile = element.phone1;
    this.accessGroupId = element.accessGroupId;

    if (this.title == "Credit O/s") {
      this.isOS = true;
      this.isSales = false;
      this.isPayment = false;
      if (this.totalOS) {
        this.getCreditOsByDealerId1(this.fuelDealerId)
      } else {
        this.getCreditOsByDealerId(this.fuelDealerId)
      }
    } else if (this.title == "Credit Sales") {
      this.isOS = false;
      this.isSales = true;
      this.isPayment = false;
      if (this.thisMonthCrSale) {
        this.getCreditSalesDetailsByDealerId1(this.fuelDealerId)
      } else {
        this.getCreditSalesDetailsByDealerId(this.fuelDealerId)
      }
    } else if (this.title == "Credit Payment") {
      this.isOS = false;
      this.isSales = false;
      this.isPayment = true;
      if (this.thisMonthCrPayment) {
        this.getCreditPaymentDetailsByDealerId1(this.fuelDealerId)
      } else {
        this.getCreditPaymentDetailsByDealerId(this.fuelDealerId)
      }
    }

    // this.getCreditDetailsByDealerId(this.fuelDealerId);
    // setTimeout(() => {
    //   /** spinner ends after 5 seconds */
    //   this.spinner.hide();
    // }, 5000);
    this.cd.detectChanges()
  }

  getDealerIdByPhone(dealerMobile: any) {
    this.spinner.show();
    let data = {
      mobileNumber: dealerMobile,
    };
    this.post.searchDealerByMobilePOST(data)
      .subscribe(res => {
        if (res.status = "OK") {
          this.fuelDealerId = res.data[0].fuelDealerId;
          // this.getCreditDetailsByDealerId(this.fuelDealerId);
          if (this.title == "Credit O/s") {
            this.isOS = true;
            this.isSales = false;
            this.isPayment = false;
            this.getCreditOsByDealerId(this.fuelDealerId)
          } else if (this.title == "Credit Sales") {
            this.isOS = false;
            this.isSales = true;
            this.isPayment = false;
            this.getCreditSalesDetailsByDealerId(this.fuelDealerId)
          } else if (this.title == "Credit Payment") {
            this.isOS = false;
            this.isSales = false;
            this.isPayment = true;
            this.getCreditPaymentDetailsByDealerId(this.fuelDealerId)
          }
          // this.spinner.hide();
          this.cd.detectChanges()
        } else {
        }
        // this.spinner.hide();
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
          // setTimeout(() => {
          //   /** spinner ends after 5 seconds */
          //   this.spinner.hide();
          // }, 5000);
          this.cd.detectChanges()
        } else {
          // setTimeout(() => {
          //   /** spinner ends after 5 seconds */
          //   this.spinner.hide();
          // }, 5000); 
          this.cd.detectChanges()
        }
      })
  }

  getCreditSalesDetailsByDealerId(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getCreditSalesDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (this.title == "Credit Sales") {
            this.isOS = false;
            this.isSales = true;
            this.isPayment = false;
          }
          if (res.dataSales[0].totalPurchase) {
            this.thisMonthCrSale = res.dataSales[0].totalPurchase
            localStorage.setItem('thisMonthCrSale', this.thisMonthCrSale);
          } else {
            this.thisMonthCrSale = 0
            localStorage.setItem('thisMonthCrSale', '');
          }

          // setTimeout(() => {
          //   /** spinner ends after 5 seconds */
          //   this.spinner.hide();
          // }, 5000);
          this.cd.detectChanges()
        } else {
          // setTimeout(() => {
          //   /** spinner ends after 5 seconds */
          //   this.spinner.hide();
          // }, 5000);
          this.cd.detectChanges()
        }
      })
  }

  getCreditSalesDetailsByDealerId1(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getCreditSalesDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (this.title == "Credit Sales") {
            this.isOS = false;
            this.isSales = true;
            this.isPayment = false;
          }
          if (res.dataSales[0].totalPurchase) {
            this.thisMonthCrSale = res.dataSales[0].totalPurchase
            localStorage.setItem('thisMonthCrSale', this.thisMonthCrSale);
          } else {
            this.thisMonthCrSale = 0
            localStorage.setItem('thisMonthCrSale', '');
          }

          // this.spinner.hide();
          this.cd.detectChanges()
        } else {
          // this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  getCreditPaymentDetailsByDealerId(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getCreditPaymentDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (this.title == "Credit Payment") {
            this.isOS = false;
            this.isSales = false;
            this.isPayment = true;
          }


          if (res.dataPayment[0].totalPayment) {
            this.thisMonthCrPayment = res.dataPayment[0].totalPayment
            localStorage.setItem('thisMonthCrPayment', this.thisMonthCrPayment);
          } else {
            this.thisMonthCrPayment = 0
            localStorage.setItem('thisMonthCrPayment', '');
          }

          // setTimeout(() => {
          //   /** spinner ends after 5 seconds */
          //   this.spinner.hide();
          // }, 5000);
          this.cd.detectChanges()
        } else {
          // setTimeout(() => {
          //   /** spinner ends after 5 seconds */
          //   this.spinner.hide();
          // }, 5000); 
          this.cd.detectChanges()
        }
      })
  }

  getCreditPaymentDetailsByDealerId1(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getCreditPaymentDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (this.title == "Credit Payment") {
            this.isOS = false;
            this.isSales = false;
            this.isPayment = true;
          }


          if (res.dataPayment[0].totalPayment) {
            this.thisMonthCrPayment = res.dataPayment[0].totalPayment
            localStorage.setItem('thisMonthCrPayment', this.thisMonthCrPayment);
          } else {
            this.thisMonthCrPayment = 0
            localStorage.setItem('thisMonthCrPayment', '');
          }
          // this.spinner.hide();
          this.cd.detectChanges()
        } else {
          // this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  getCreditOsByDealerId(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getCreditOsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (this.title == "Credit O/s") {
            this.isOS = true;
            this.isSales = false;
            this.isPayment = false;
          }

          this.totalOS = Number(res.outstanding).toFixed(2);
          localStorage.setItem('totalOS', this.totalOS);
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);
          this.cd.detectChanges()
        } else {
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 5000);
          this.cd.detectChanges()
        }
      })
  }

  getCreditOsByDealerId1(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getCreditOsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (this.title == "Credit O/s") {
            this.isOS = true;
            this.isSales = false;
            this.isPayment = false;
          }

          this.totalOS = Number(res.outstanding).toFixed(2);
          localStorage.setItem('totalOS', this.totalOS);
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

}