import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FeedsService } from '../feeds.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import * as htmlToImage from 'html-to-image';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '-';
  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }
  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}
/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';
  parse(value: string): NgbDateStruct | null {
    if (value) {
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }
  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}
@Component({
  selector: 'app-feeds-widget13',
  templateUrl: './feeds-widget13.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FeedsWidget13Component implements OnInit {
  filterForm1 = new FormGroup({
    month: new FormControl("", Validators.required),
    year: new FormControl(),
    product: new FormControl("", Validators.required),
  });

  dealerLoginVPId: any;
  accessGroupId: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  dealerCompanyName: any;
  dealerCity: any;
  month: any;
  monthNumber: string;
  startDate: string;
  endDate: string;
  year: any;
  dealerCorporateId: any;
  isPrint: boolean = false;
  isViewPDF: boolean = false;
  is31: boolean = false;
  is30: boolean = false;
  isLeap: boolean = false;
  isFeb: boolean = false;
  currentYear: number;
  lastYear: number;
  lastThirdYear: number;
  lastFourthYear: number;
  lastFifthYear: number;
  productPurchaseDetails: any = [];
  vatSalesDetails: any = [];
  productWiseMeterSales: any = [];
  oilCompanyDetails: any = [];
  purchaseTotal: number;
  salesTotal: number;
  isMonthTab: boolean = false;

  constructor(private post: FeedsService,
    private spinner: NgxSpinnerService,
    public router: Router,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.spinner.show();
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '');
    this.dealerCompanyName = dealerData.companyName;
    this.dealerCity = dealerData.city;
    this.month = moment(new Date()).format("MMM");
    this.year = moment(new Date()).format("YYYY");
    this.currentYear = new Date().getFullYear();
    // this.filterForm.controls['year'].setValue(this.currentYear);
    // this.filterForm.controls['month'].setValue(moment(new Date()).format("MMM"));
    this.filterForm1.controls['year'].setValue(this.currentYear);
    this.filterForm1.controls['month'].setValue(moment(new Date()).format("MMM"));
    this.lastYear = Number(this.currentYear) - 1;
    this.lastThirdYear = Number(this.currentYear) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
    this.lastFifthYear = Number(this.currentYear) - 4;
    this.cd.detectChanges();
  }

  viewPDF() {
    this.isPrint = true;
    this.month = this.filterForm1.value.month;
    this.year = this.filterForm1.value.year;

  }
  viewTables() {
    this.isViewPDF = true;
    this.isPrint = false;
  }

  getDates() {

    if ((moment(new Date()).format("MM")) >= moment(this.filterForm1.value.month, ["MMM"]).format("MM")) {
      if ((moment(new Date()).format("YYYY")) >= (this.filterForm1.value.year)) {
        // console.log((moment(new Date()).format('YYYY')) +'>='+(this.filterForm1.value.year))
        let dateConversion = this.filterForm1.value.year + '-' + this.filterForm1.value.month + '-' + "01"
        this.startDate = this.filterForm1.value.year + '-' + this.filterForm1.value.month + '-' + "01"
        // console.log('dateConversion',dateConversion)
        this.is31 = false;
        this.is30 = false;
        this.isLeap = false;
        this.isFeb = false;
        if (this.filterForm1.value.month == 'Jan' || this.filterForm1.value.month == 'Mar'
          || this.filterForm1.value.month == 'May' || this.filterForm1.value.month == 'Jul'
          || this.filterForm1.value.month == 'Aug' || this.filterForm1.value.month == 'Oct'
          || this.filterForm1.value.month == 'Dec') {
          this.is31 = true;
          this.is30 = false;
          this.isLeap = false;
          this.isFeb = false;
          // console.log("is31")
          this.endDate = this.filterForm1.value.year + '-' + this.filterForm1.value.month + '-' + "31"

        } else {
          if (this.filterForm1.value.month == 'Feb') {
            this.is31 = false;
            this.is30 = false;
            if (Number(this.filterForm1.value.year) % 4 == 0) {
              this.isLeap = true;
              this.isFeb = false;
              // console.log("isLeap")
              this.endDate = this.filterForm1.value.year + '-' + this.filterForm1.value.month + '-' + "29"

            } else {
              this.isLeap = false;
              this.isFeb = true;
              // console.log("isFeb")
              this.endDate = this.filterForm1.value.year + '-' + this.filterForm1.value.month + '-' + "28"

            }
          } else {
            this.is31 = false;
            this.is30 = true;
            this.isLeap = false;
            this.isFeb = false;
            // console.log("is30")
            this.endDate = this.filterForm1.value.year + '-' + this.filterForm1.value.month + '-' + "30"

          }
        }
      }
      else {
        alert("Please select valid year")
        this.filterForm1.controls["year"].setValue("")
      }
    }
    else {
      if ((moment(new Date()).format("YYYY")) >= (this.filterForm1.value.year)) {
        // console.log((moment(new Date()).format('YYYY')) +'>='+(this.filterForm1.value.year))
        let dateConversion = this.filterForm1.value.year + '-' + this.filterForm1.value.month + '-' + "01"
        this.startDate = this.filterForm1.value.year + '-' + this.filterForm1.value.month + '-' + "01"
        // console.log('dateConversion',dateConversion)
        this.is31 = false;
        this.is30 = false;
        this.isLeap = false;
        this.isFeb = false;
        if (this.filterForm1.value.month == 'Jan' || this.filterForm1.value.month == 'Mar'
          || this.filterForm1.value.month == 'May' || this.filterForm1.value.month == 'Jul'
          || this.filterForm1.value.month == 'Aug' || this.filterForm1.value.month == 'Oct'
          || this.filterForm1.value.month == 'Dec') {
          this.is31 = true;
          this.is30 = false;
          this.isLeap = false;
          this.isFeb = false;
          // console.log("is31")
          this.endDate = this.filterForm1.value.year + '-' + this.filterForm1.value.month + '-' + "31"

        } else {
          if (this.filterForm1.value.month == 'Feb') {
            this.is31 = false;
            this.is30 = false;
            if (Number(this.filterForm1.value.year) % 4 == 0) {
              this.isLeap = true;
              this.isFeb = false;
              // console.log("isLeap")
              this.endDate = this.filterForm1.value.year + '-' + this.filterForm1.value.month + '-' + "29"

            } else {
              this.isLeap = false;
              this.isFeb = true;
              // console.log("isFeb")
              this.endDate = this.filterForm1.value.year + '-' + this.filterForm1.value.month + '-' + "28"

            }
          } else {
            this.is31 = false;
            this.is30 = true;
            this.isLeap = false;
            this.isFeb = false;
            // console.log("is30")
            this.endDate = this.filterForm1.value.year + '-' + this.filterForm1.value.month + '-' + "30"

          }
        }
      }
      else {
        alert("Please select valid month & year")
        this.filterForm1.controls["month"].setValue("")
        this.filterForm1.controls["year"].setValue("")
      }

    }
  }

  view() {
    if (this.filterForm1.value.month && this.filterForm1.value.year) {

      this.getAllProductPurchase();
    } else {
      alert("please select month and year")
    }

  }

  getAllProductPurchase() {
    this.productPurchaseDetails.length = 0
    this.vatSalesDetails.length = 0;
    this.productWiseMeterSales.length = 0
    this.oilCompanyDetails.length = 0
    this.purchaseTotal = 0
    this.salesTotal = 0

    let data = {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm1.value.year + '-' + moment(this.filterForm1.value.month, ["MMM"]).format("MM") + '-' + "01",
      endDate: this.filterForm1.value.year + '-' + moment(this.filterForm1.value.month, ["MMM"]).format("MM") + '-' + "31",

    }
    this.post.getAllProductPurchasePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data.length) {
            this.isViewPDF = true;
            this.isMonthTab = true;
            this.productPurchaseDetails = res.data;
            this.oilCompanyDetails = res.data1;

            let purchaseTotal = 0
            this.productPurchaseDetails.map((res1: { vatAmt: any; }) => {
              purchaseTotal = purchaseTotal + Number(res1.vatAmt)
            })
            // console.log("purchaseTotal ",purchaseTotal)
            this.purchaseTotal = purchaseTotal

            this.getProductWiseMeterSales();
          } else {
            this.isViewPDF = false;
            this.isMonthTab = false;
            alert("Data not found..!")
          }
          this.cd.detectChanges()
        }
      })
  }

  getProductWiseMeterSales() {
    this.productWiseMeterSales.length = 0
    this.salesTotal = 0
    this.spinner.show()
    let data = {
      dealerId: this.fuelDealerId,
      month: this.filterForm1.value.month,
      year: this.filterForm1.value.year,
    };
    this.post.getMonthWiseMeterSalesPOST(data)
      .subscribe((res) => {
        if (res.data.length) {
          this.productWiseMeterSales = res.data;

          this.vatSalesDetails.length = 0;
          let salesTotal = 0
          this.productWiseMeterSales.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetails.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0,
                totalAmount: 0,

              };
              if (res1.productId == res2.productId) {
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1))) * (Number(res2.vatPercent)) / 100);
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);

                salesTotal = salesTotal + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1))) * (Number(res2.vatPercent)) / 100)

                this.vatSalesDetails.push(dataJson);
                // console.log('vatSalesDetails',this.vatSalesDetails,(Number(res2.vatPercent) / 100) + 1) 
              }

            })
          })

          this.salesTotal = salesTotal

          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }
}