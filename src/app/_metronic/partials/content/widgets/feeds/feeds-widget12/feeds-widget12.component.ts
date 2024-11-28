import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FeedsService } from '../feeds.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import * as htmlToImage from 'html-to-image';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from "xlsx";


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
  selector: 'app-feeds-widget12',
  templateUrl: './feeds-widget12.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FeedsWidget12Component implements OnInit {
  filterForm1 = new FormGroup({
    month: new FormControl("", Validators.required),
    year: new FormControl(),
    product: new FormControl("", Validators.required),
  });

  filterForm = new FormGroup({
    month: new FormControl("", Validators.required),
    year: new FormControl("", Validators.required),
    product: new FormControl("", Validators.required),
    fiscalyear: new FormControl("", Validators.required),
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
  currentYear: any;
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
  accessGroup: any;
  fiscalyear: string;
  fiscalyear2: string;
  fiscalyear3: string;
  fiscalyear4: string;
  lastfiscalyear: string;
  isMonthSale: boolean = false;
  isProductPurchase: boolean = false;
  isYear: boolean = false;
  month1: string;
  yearMonth1: string;
  isMonth1: boolean = false;
  productPurchaseDetailsMonth1: any = [];
  purchaseTotalMonth1: number;
  productWiseMeterSalesMonth1: any = [];
  vatSalesDetailsMonth1: any;
  salesTotalMonth1: number;
  month2: string;
  yearMonth2: string;
  isMonth2: boolean = false;
  productPurchaseDetailsMonth2: any = [];
  purchaseTotalMonth2: number;
  productWiseMeterSalesMonth2: any = [];
  vatSalesDetailsMonth2: any;
  salesTotalMonth2: number;
  month3: string;
  yearMonth3: string;
  isMonth3: boolean = false;
  purchaseTotalMonth3: number;
  productWiseMeterSalesMonth3: any = [];
  vatSalesDetailsMonth3: any;
  productPurchaseDetailsMonth3: any;
  salesTotalMonth3: number;
  month4: string;
  yearMonth4: string;
  isMonth4: boolean = false;
  productPurchaseDetailsMonth4: any;
  purchaseTotalMonth4: number;
  productWiseMeterSalesMonth4: any;
  vatSalesDetailsMonth4: any;
  salesTotalMonth4: number;
  month5: string;
  yearMonth5: string;
  isMonth5: boolean;
  productPurchaseDetailsMonth5: any;
  purchaseTotalMonth5: number;
  productWiseMeterSalesMonth5: any;
  vatSalesDetailsMonth5: any;
  salesTotalMonth5: number;
  month6: string;
  yearMonth6: string;
  isMonth6: boolean;
  productPurchaseDetailsMonth6: any;
  purchaseTotalMonth6: number;
  productWiseMeterSalesMonth6: any;
  vatSalesDetailsMonth6: any;
  salesTotalMonth6: number;
  month7: string;
  yearMonth7: string;
  isMonth7: boolean;
  productPurchaseDetailsMonth7: any;
  purchaseTotalMonth7: number;
  productWiseMeterSalesMonth7: any;
  vatSalesDetailsMonth7: any;
  salesTotalMonth7: number;
  month8: string;
  yearMonth8: string;
  isMonth8: boolean;
  productPurchaseDetailsMonth8: any;
  purchaseTotalMonth8: number;
  productWiseMeterSalesMonth8: any;
  vatSalesDetailsMonth8: any;
  salesTotalMonth8: number;
  month9: string;
  yearMonth9: string;
  isMonth9: boolean;
  productPurchaseDetailsMonth9: any;
  purchaseTotalMonth9: number;
  productWiseMeterSalesMonth9: any;
  vatSalesDetailsMonth9: any;
  salesTotalMonth9: number;
  month10: string;
  yearMonth10: string;
  isMonth10: boolean;
  productPurchaseDetailsMonth10: any;
  purchaseTotalMonth10: number;
  productWiseMeterSalesMonth10: any;
  vatSalesDetailsMonth10: any;
  salesTotalMonth10: number;
  month11: string;
  yearMonth11: string;
  isMonth11: boolean;
  productPurchaseDetailsMonth11: any;
  purchaseTotalMonth11: number;
  productWiseMeterSalesMonth11: any;
  vatSalesDetailsMonth11: any;
  salesTotalMonth11: number;
  month12: string;
  yearMonth12: string;
  isMonth12: boolean;
  productPurchaseDetailsMonth12: any;
  purchaseTotalMonth12: number;
  productWiseMeterSalesMonth12: any;
  vatSalesDetailsMonth12: any;
  salesTotalMonth12: number;
  oilCompanyDetailsForYear: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  brandName: any;

  constructor(private post: FeedsService,
    private spinner: NgxSpinnerService,
    public router: Router,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.spinner.show();
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '');
    this.dealerCompanyName = dealerData.companyName;
    this.brandName = dealerData.brandName;
    this.dealerCity = dealerData.city;
    this.month = moment(new Date()).format("MMM");
    this.year = moment(new Date()).format("YYYY");
    this.currentYear = new Date().getFullYear();
    this.accessGroup = element.accessGroupId;
    this.filterForm.controls['year'].setValue(this.currentYear);
    this.filterForm.controls['month'].setValue(moment(new Date()).format("MMM"));
    this.filterForm1.controls['year'].setValue(this.currentYear);
    this.filterForm1.controls['month'].setValue(moment(new Date()).format("MMM"));
    this.lastYear = Number(this.currentYear) - 1;
    this.lastThirdYear = Number(this.currentYear) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
    this.lastFifthYear = Number(this.currentYear) - 4;
    this.getCurrentFinancialYear()
    this.getLastCurrentFinancialYear()
    this.cd.detectChanges();
  }

  getCurrentFinancialYear() {
  
    var today = new Date();
    if ((today.getMonth() + 1) <= 3) {
      this.fiscalyear = "Apr " +(today.getFullYear() - 1) + " - " + "Mar "+today.getFullYear()
      this.filterForm.controls['fiscalyear'].setValue('1')
    } else {
      this.fiscalyear = "Apr "+today.getFullYear() + " - " + "Mar "+(today.getFullYear() + 1)
      this.filterForm.controls['fiscalyear'].setValue('1')
    }
  
    if ((today.getMonth() + 1) <= 3) {
      this.fiscalyear2 = "Apr " +(today.getFullYear() - 2) + " - " + "Mar "+(today.getFullYear()-1)
    } else {
      this.fiscalyear2 = "Apr "+(today.getFullYear()-1) + " - " + "Mar "+(today.getFullYear() )
    }
  
    if ((today.getMonth() + 1) <= 3) {
      this.fiscalyear3 = "Apr " +(today.getFullYear() - 3) + " - " + "Mar "+(today.getFullYear()-2)
    } else {
      this.fiscalyear3 = "Apr "+(today.getFullYear()-2) + " - " + "Mar "+(today.getFullYear()-1)
    }
  
    if ((today.getMonth() + 1) <= 3) {
      this.fiscalyear4 = "Apr " +(today.getFullYear() - 4) + " - " + "Mar "+(today.getFullYear()-3)
    } else {
      this.fiscalyear4 = "Apr "+(today.getFullYear()-3) + " - " + "Mar "+(today.getFullYear()-2)
    }
  }
  
  getLastCurrentFinancialYear() {
   
   var today = new Date();
   if ((today.getMonth() + 1) <= 3) {
     this.lastfiscalyear = "Apr " +(today.getFullYear() - 2) + " - " + "Mar "+(today.getFullYear() - 1)
   } else {
     this.lastfiscalyear = "Apr "+(today.getFullYear() - 1) + " - " + "Mar "+(today.getFullYear() )
   }
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
  
viewFiscalYearWise(){
  this.isProductPurchase = false;
  this.isMonthSale = false;
  this.isYear = true;
  
  if(this.filterForm.value.fiscalyear == '1'){

  if(moment(new Date()).format("MM") == '04'){
      this.month1 = 'Apr'
      this.yearMonth1 = moment(new Date()).format("YYYY")
      this.spinner.show()
    let data = {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"31",
      month: moment(new Date()).format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth1 = true;
        }else{
          this.isMonth1 = false;
        }

        this.productPurchaseDetailsMonth1 = res.purchaseData;   
        
        let purchaseTotalMonth1 = 0
        this.productPurchaseDetailsMonth1.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth1 = purchaseTotalMonth1 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth1 = purchaseTotalMonth1
         
        this.productWiseMeterSalesMonth1 = res.data; 
  
        this.vatSalesDetailsMonth1.length = 0;
        let salesTotalMonth1 = 0
        this.productWiseMeterSalesMonth1.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth1.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth1 = salesTotalMonth1 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth1.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth1 = salesTotalMonth1
        
        this.spinner.hide()
  
      }
  });

  }else{
    if(moment(new Date()).format("MM") == '05'){
      this.month1 = 'Apr'
      this.yearMonth1 = moment(new Date()).format("YYYY")
      this.spinner.show()
    let data = {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(1,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth1 = true;
        }else{
          this.isMonth1 = false;
        }

        this.productPurchaseDetailsMonth1 = res.purchaseData;   
        
        let purchaseTotalMonth1 = 0
        this.productPurchaseDetailsMonth1.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth1 = purchaseTotalMonth1 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth1 = purchaseTotalMonth1
         
        this.productWiseMeterSalesMonth1 = res.data; 
  
        this.vatSalesDetailsMonth1.length = 0;
        let salesTotalMonth1 = 0
        this.productWiseMeterSalesMonth1.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth1.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth1 = salesTotalMonth1 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth1.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth1 = salesTotalMonth1
        
        this.spinner.hide()
  


        this.month2 = 'May'
        this.yearMonth2 = moment(new Date()).format("YYYY")
        this.spinner.show()
      let data = {
        dealerId: this.fuelDealerId,
        startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"01",
        endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"31",
        month: moment(new Date()).format("MMM"),
        year: moment(new Date()).format("YYYY"),
    };
    this.post.getFinancialYearWiseVATBookPOST(data)
    .subscribe((res) => {
        if (res.status == 'OK') {
          this.isViewPDF = true;
  
          if(res.purchaseData.length || res.data.length){
            this.isMonth2 = true;
          }else{
            this.isMonth2 = false;
          }
  
          this.productPurchaseDetailsMonth2 = res.purchaseData;   
          
          let purchaseTotalMonth2 = 0
          this.productPurchaseDetailsMonth2.map((res1: { vatAmt: any; }) =>{  
            purchaseTotalMonth2 = purchaseTotalMonth2 + Number(res1.vatAmt)
          }) 
          this.purchaseTotalMonth2 = purchaseTotalMonth2
           
          this.productWiseMeterSalesMonth2 = res.data; 
    
          this.vatSalesDetailsMonth2.length = 0;
          let salesTotalMonth2 = 0
          this.productWiseMeterSalesMonth2.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
              this.productPurchaseDetailsMonth2.map((res2: { productId: any; vatPercent: any; }) => {
                const dataJson = {
                  productName: '',
                  basicAmount: 0,
                  vat: 0,
                  vatAmount: 0, 
                  totalAmount: 0, 
    
                  };
                if(res1.productId == res2.productId){
                  dataJson.productName = res1.productName;
                  dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                  dataJson.vat = Number(res2.vatPercent);
                  dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                  dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
    
                  salesTotalMonth2 = salesTotalMonth2 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
    
                  this.vatSalesDetailsMonth2.push(dataJson); 
                } 
              
              })
            })
    
            this.salesTotalMonth2 = salesTotalMonth2
          
          this.spinner.hide()
    
        }
    });
  

      }
  });

  }else{
    if(moment(new Date()).format("MM") == '06'){
      this.month1 = 'Apr'
      this.yearMonth1 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data = { 
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(2,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth1 = true;
        }else{
          this.isMonth1 = false;
        }

        this.productPurchaseDetailsMonth1 = res.purchaseData;   
        
        let purchaseTotalMonth1 = 0
        this.productPurchaseDetailsMonth1.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth1 = purchaseTotalMonth1 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth1 = purchaseTotalMonth1
         
        this.productWiseMeterSalesMonth1 = res.data; 
  
        this.vatSalesDetailsMonth1.length = 0;
        let salesTotalMonth1 = 0
        this.productWiseMeterSalesMonth1.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth1.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth1 = salesTotalMonth1 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth1.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth1 = salesTotalMonth1
        
        this.spinner.hide()
  


        this.month2 = 'May'
        this.yearMonth2 = moment(new Date()).format("YYYY")
      this.spinner.show()
      let data =  {
        dealerId: this.fuelDealerId,
        startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"01",
        endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"31",
        month: moment(new Date()).subtract(1,'month').format("MMM"),
        year: moment(new Date()).format("YYYY"),
    };
    this.post.getFinancialYearWiseVATBookPOST(data)
    .subscribe((res) => {
        if (res.status == 'OK') {
          this.isViewPDF = true;
  
          if(res.purchaseData.length || res.data.length){
            this.isMonth2 = true;
          }else{
            this.isMonth2 = false;
          }
  
          this.productPurchaseDetailsMonth2 = res.purchaseData;   
          
          let purchaseTotalMonth2 = 0
          this.productPurchaseDetailsMonth2.map((res1: { vatAmt: any; }) =>{  
            purchaseTotalMonth2 = purchaseTotalMonth2 + Number(res1.vatAmt)
          }) 
          this.purchaseTotalMonth2 = purchaseTotalMonth2
           
          this.productWiseMeterSalesMonth2 = res.data; 
    
          this.vatSalesDetailsMonth2.length = 0;
          let salesTotalMonth2 = 0
          this.productWiseMeterSalesMonth2.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
              this.productPurchaseDetailsMonth2.map((res2: { productId: any; vatPercent: any; }) => {
                const dataJson = {
                  productName: '',
                  basicAmount: 0,
                  vat: 0,
                  vatAmount: 0, 
                  totalAmount: 0, 
    
                  };
                if(res1.productId == res2.productId){
                  dataJson.productName = res1.productName;
                  dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                  dataJson.vat = Number(res2.vatPercent);
                  dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                  dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
    
                  salesTotalMonth2 = salesTotalMonth2 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
    
                  this.vatSalesDetailsMonth2.push(dataJson); 
                } 
              
              })
            })
    
            this.salesTotalMonth2 = salesTotalMonth2
          
          this.spinner.hide()
    

          this.month3 = 'Jun'
          this.yearMonth3 = moment(new Date()).format("YYYY")
        this.spinner.show()
      let data =  {
          dealerId: this.fuelDealerId,
          startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"01",
          endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"31",
          month: moment(new Date()).format("MMM"),
          year: moment(new Date()).format("YYYY"),
      };
      this.post.getFinancialYearWiseVATBookPOST(data)
      .subscribe((res) => {
          if (res.status == 'OK') {
            this.isViewPDF = true;
    
            if(res.purchaseData.length || res.data.length){
              this.isMonth3 = true;
            }else{
              this.isMonth3 = false;
            }
    
            this.productPurchaseDetailsMonth1 = res.purchaseData;   
            
            let purchaseTotalMonth3 = 0
            this.productPurchaseDetailsMonth1.map((res1: { vatAmt: any; }) =>{  
              purchaseTotalMonth3 = purchaseTotalMonth3 + Number(res1.vatAmt)
            }) 
            this.purchaseTotalMonth3 = purchaseTotalMonth3
             
            this.productWiseMeterSalesMonth3 = res.data; 
      
            this.vatSalesDetailsMonth3.length = 0;
            let salesTotalMonth3 = 0
            this.productWiseMeterSalesMonth3.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                this.productPurchaseDetailsMonth3.map((res2: { productId: any; vatPercent: any; }) => {
                  const dataJson = {
                    productName: '',
                    basicAmount: 0,
                    vat: 0,
                    vatAmount: 0, 
                    totalAmount: 0, 
      
                    };
                  if(res1.productId == res2.productId){
                    dataJson.productName = res1.productName;
                    dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                    dataJson.vat = Number(res2.vatPercent);
                    dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                    dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
      
                    salesTotalMonth3 = salesTotalMonth3 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
      
                    this.vatSalesDetailsMonth3.push(dataJson); 
                  } 
                
                })
              })
      
              this.salesTotalMonth3 = salesTotalMonth3
            
            this.spinner.hide()
      
          }
      });
    
        }
    });
  

      }
  });

  }else{
    if(moment(new Date()).format("MM") == '07'){
      this.month1 = 'Apr'
      this.yearMonth1 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(3,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth1 = true;
        }else{
          this.isMonth1 = false;
        }

        this.productPurchaseDetailsMonth1 = res.purchaseData;   
        
        let purchaseTotalMonth1 = 0
        this.productPurchaseDetailsMonth1.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth1 = purchaseTotalMonth1 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth1 = purchaseTotalMonth1
         
        this.productWiseMeterSalesMonth1 = res.data; 
  
        this.vatSalesDetailsMonth1.length = 0;
        let salesTotalMonth1 = 0
        this.productWiseMeterSalesMonth1.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth1.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth1 = salesTotalMonth1 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth1.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth1 = salesTotalMonth1
        
        this.spinner.hide()
  


        this.month2 = 'May'
        this.yearMonth2 = moment(new Date()).format("YYYY")
      this.spinner.show()
      let data =  {
        dealerId: this.fuelDealerId,
        startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"01",
        endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"31",
        month: moment(new Date()).subtract(2,'month').format("MMM"),
        year: moment(new Date()).format("YYYY"),
    };
    this.post.getFinancialYearWiseVATBookPOST(data)
    .subscribe((res) => {
        if (res.status == 'OK') {
          this.isViewPDF = true;
  
          if(res.purchaseData.length || res.data.length){
            this.isMonth2 = true;
          }else{
            this.isMonth2 = false;
          }
  
          this.productPurchaseDetailsMonth2 = res.purchaseData;   
          
          let purchaseTotalMonth2 = 0
          this.productPurchaseDetailsMonth2.map((res1: { vatAmt: any; }) =>{  
            purchaseTotalMonth2 = purchaseTotalMonth2 + Number(res1.vatAmt)
          }) 
          this.purchaseTotalMonth2 = purchaseTotalMonth2
           
          this.productWiseMeterSalesMonth2 = res.data; 
    
          this.vatSalesDetailsMonth2.length = 0;
          let salesTotalMonth2 = 0
          this.productWiseMeterSalesMonth2.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
              this.productPurchaseDetailsMonth2.map((res2: { productId: any; vatPercent: any; }) => {
                const dataJson = {
                  productName: '',
                  basicAmount: 0,
                  vat: 0,
                  vatAmount: 0, 
                  totalAmount: 0, 
    
                  };
                if(res1.productId == res2.productId){
                  dataJson.productName = res1.productName;
                  dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                  dataJson.vat = Number(res2.vatPercent);
                  dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                  dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
    
                  salesTotalMonth2 = salesTotalMonth2 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
    
                  this.vatSalesDetailsMonth2.push(dataJson); 
                } 
              
              })
            })
    
            this.salesTotalMonth2 = salesTotalMonth2
          
          this.spinner.hide()
    

          this.month3 = 'Jun'
          this.yearMonth3 = moment(new Date()).format("YYYY")
        this.spinner.show()
      let data =  {
          dealerId: this.fuelDealerId,
          startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"01",
          endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"31",
          month: moment(new Date()).subtract(1,'month').format("MMM"),
          year: moment(new Date()).format("YYYY"),
      };
      this.post.getFinancialYearWiseVATBookPOST(data)
      .subscribe((res) => {
          if (res.status == 'OK') {
            this.isViewPDF = true;
    
            if(res.purchaseData.length || res.data.length){
              this.isMonth3 = true;
            }else{
              this.isMonth3 = false;
            }
    
            this.productPurchaseDetailsMonth3 = res.purchaseData;   
            
            let purchaseTotalMonth3 = 0
            this.productPurchaseDetailsMonth3.map((res1: { vatAmt: any; }) =>{  
              purchaseTotalMonth3 = purchaseTotalMonth3 + Number(res1.vatAmt)
            }) 
            this.purchaseTotalMonth3 = purchaseTotalMonth3
             
            this.productWiseMeterSalesMonth3 = res.data; 
      
            this.vatSalesDetailsMonth3.length = 0;
            let salesTotalMonth3 = 0
            this.productWiseMeterSalesMonth3.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                this.productPurchaseDetailsMonth3.map((res2: { productId: any; vatPercent: any; }) => {
                  const dataJson = {
                    productName: '',
                    basicAmount: 0,
                    vat: 0,
                    vatAmount: 0, 
                    totalAmount: 0, 
      
                    };
                  if(res1.productId == res2.productId){
                    dataJson.productName = res1.productName;
                    dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                    dataJson.vat = Number(res2.vatPercent);
                    dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                    dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
      
                    salesTotalMonth3 = salesTotalMonth3 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
      
                    this.vatSalesDetailsMonth3.push(dataJson); 
                  } 
                
                })
              })
      
              this.salesTotalMonth3 = salesTotalMonth3
            
            this.spinner.hide()
      


            this.month4 = 'Jul'
            this.yearMonth4 = moment(new Date()).format("YYYY")
          this.spinner.show()
      let data =  {
            dealerId: this.fuelDealerId,
            startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"01",
            endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"31",
            month: moment(new Date()).format("MMM"),
            year: moment(new Date()).format("YYYY"),
        };
        this.post.getFinancialYearWiseVATBookPOST(data)
        .subscribe((res) => {
            if (res.status == 'OK') {
              this.isViewPDF = true;
      
              if(res.purchaseData.length || res.data.length){
                this.isMonth4 = true;
              }else{
                this.isMonth4 = false;
              }
      
              this.productPurchaseDetailsMonth4 = res.purchaseData;   
              
              let purchaseTotalMonth4 = 0
              this.productPurchaseDetailsMonth4.map((res1: { vatAmt: any; }) =>{  
                purchaseTotalMonth4 = purchaseTotalMonth4 + Number(res1.vatAmt)
              }) 
              this.purchaseTotalMonth4 = purchaseTotalMonth4
               
              this.productWiseMeterSalesMonth4 = res.data; 
        
              this.vatSalesDetailsMonth4.length = 0;
              let salesTotalMonth4 = 0
              this.productWiseMeterSalesMonth4.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                  this.productPurchaseDetailsMonth4.map((res2: { productId: any; vatPercent: any; }) => {
                    const dataJson = {
                      productName: '',
                      basicAmount: 0,
                      vat: 0,
                      vatAmount: 0, 
                      totalAmount: 0, 
        
                      };
                    if(res1.productId == res2.productId){
                      dataJson.productName = res1.productName;
                      dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                      dataJson.vat = Number(res2.vatPercent);
                      dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                      dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
        
                      salesTotalMonth4 = salesTotalMonth4 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
        
                      this.vatSalesDetailsMonth4.push(dataJson); 
                    } 
                  
                  })
                })
        
                this.salesTotalMonth4 = salesTotalMonth4
              
              this.spinner.hide()
      
            }
        });
      




          }
      });
    

        }
    });
  

      }
  });

  }else{
    if(moment(new Date()).format("MM") == '08'){
      this.month1 = 'Apr'
      this.yearMonth1 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(4,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth1 = true;
        }else{
          this.isMonth1 = false;
        }

        this.productPurchaseDetailsMonth1 = res.purchaseData;   
        
        let purchaseTotalMonth1 = 0
        this.productPurchaseDetailsMonth1.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth1 = purchaseTotalMonth1 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth1 = purchaseTotalMonth1
         
        this.productWiseMeterSalesMonth1 = res.data; 
  
        this.vatSalesDetailsMonth1.length = 0;
        let salesTotalMonth1 = 0
        this.productWiseMeterSalesMonth1.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth1.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth1 = salesTotalMonth1 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth1.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth1 = salesTotalMonth1
        
        this.spinner.hide()
  


        this.month2 = 'May'
        this.yearMonth2 = moment(new Date()).format("YYYY")
      this.spinner.show()
      let data =  {
        dealerId: this.fuelDealerId,
        startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"01",
        endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"31",
        month: moment(new Date()).subtract(3,'month').format("MMM"),
        year: moment(new Date()).format("YYYY"),
    };
    this.post.getFinancialYearWiseVATBookPOST(data)
    .subscribe((res) => {
        if (res.status == 'OK') {
          this.isViewPDF = true;
  
          if(res.purchaseData.length || res.data.length){
            this.isMonth2 = true;
          }else{
            this.isMonth2 = false;
          }
  
          this.productPurchaseDetailsMonth2 = res.purchaseData;   
          
          let purchaseTotalMonth2 = 0
          this.productPurchaseDetailsMonth2.map((res1: { vatAmt: any; }) =>{  
            purchaseTotalMonth2 = purchaseTotalMonth2 + Number(res1.vatAmt)
          }) 
          this.purchaseTotalMonth2 = purchaseTotalMonth2
           
          this.productWiseMeterSalesMonth2 = res.data; 
    
          this.vatSalesDetailsMonth2.length = 0;
          let salesTotalMonth2 = 0
          this.productWiseMeterSalesMonth2.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
              this.productPurchaseDetailsMonth2.map((res2: { productId: any; vatPercent: any; }) => {
                const dataJson = {
                  productName: '',
                  basicAmount: 0,
                  vat: 0,
                  vatAmount: 0, 
                  totalAmount: 0, 
    
                  };
                if(res1.productId == res2.productId){
                  dataJson.productName = res1.productName;
                  dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                  dataJson.vat = Number(res2.vatPercent);
                  dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                  dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
    
                  salesTotalMonth2 = salesTotalMonth2 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
    
                  this.vatSalesDetailsMonth2.push(dataJson); 
                } 
              
              })
            })
    
            this.salesTotalMonth2 = salesTotalMonth2
          
          this.spinner.hide()
    

          this.month3 = 'Jun'
          this.yearMonth3 = moment(new Date()).format("YYYY")
        this.spinner.show()
      let data =  {
          dealerId: this.fuelDealerId,
          startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"01",
          endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"31",
          month: moment(new Date()).subtract(2,'month').format("MMM"),
          year: moment(new Date()).format("YYYY"),
      };
      this.post.getFinancialYearWiseVATBookPOST(data)
      .subscribe((res) => {
          if (res.status == 'OK') {
            this.isViewPDF = true;
    
            if(res.purchaseData.length || res.data.length){
              this.isMonth3 = true;
            }else{
              this.isMonth3 = false;
            }
    
            this.productPurchaseDetailsMonth3 = res.purchaseData;   
            
            let purchaseTotalMonth3 = 0
            this.productPurchaseDetailsMonth3.map((res1: { vatAmt: any; }) =>{  
              purchaseTotalMonth3 = purchaseTotalMonth3 + Number(res1.vatAmt)
            }) 
            this.purchaseTotalMonth3 = purchaseTotalMonth3
             
            this.productWiseMeterSalesMonth3 = res.data; 
      
            this.vatSalesDetailsMonth3.length = 0;
            let salesTotalMonth3 = 0
            this.productWiseMeterSalesMonth3.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                this.productPurchaseDetailsMonth3.map((res2: { productId: any; vatPercent: any; }) => {
                  const dataJson = {
                    productName: '',
                    basicAmount: 0,
                    vat: 0,
                    vatAmount: 0, 
                    totalAmount: 0, 
      
                    };
                  if(res1.productId == res2.productId){
                    dataJson.productName = res1.productName;
                    dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                    dataJson.vat = Number(res2.vatPercent);
                    dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                    dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
      
                    salesTotalMonth3 = salesTotalMonth3 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
      
                    this.vatSalesDetailsMonth3.push(dataJson); 
                  } 
                
                })
              })
      
              this.salesTotalMonth3 = salesTotalMonth3
            
            this.spinner.hide()
      


            this.month4 = 'Jul'
            this.yearMonth4 = moment(new Date()).format("YYYY")
          this.spinner.show()
      let data =  {
            dealerId: this.fuelDealerId,
            startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"01",
            endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"31",
            month: moment(new Date()).subtract(1,'month').format("MMM"),
            year: moment(new Date()).format("YYYY"),
        };
        this.post.getFinancialYearWiseVATBookPOST(data)
        .subscribe((res) => {
            if (res.status == 'OK') {
              this.isViewPDF = true;
      
              if(res.purchaseData.length || res.data.length){
                this.isMonth4 = true;
              }else{
                this.isMonth4 = false;
              }
      
              this.productPurchaseDetailsMonth4 = res.purchaseData;   
              
              let purchaseTotalMonth4 = 0
              this.productPurchaseDetailsMonth4.map((res1: { vatAmt: any; }) =>{  
                purchaseTotalMonth4 = purchaseTotalMonth4 + Number(res1.vatAmt)
              }) 
              this.purchaseTotalMonth4 = purchaseTotalMonth4
               
              this.productWiseMeterSalesMonth4 = res.data; 
        
              this.vatSalesDetailsMonth4.length = 0;
              let salesTotalMonth4 = 0
              this.productWiseMeterSalesMonth4.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                  this.productPurchaseDetailsMonth4.map((res2: { productId: any; vatPercent: any; }) => {
                    const dataJson = {
                      productName: '',
                      basicAmount: 0,
                      vat: 0,
                      vatAmount: 0, 
                      totalAmount: 0, 
        
                      };
                    if(res1.productId == res2.productId){
                      dataJson.productName = res1.productName;
                      dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                      dataJson.vat = Number(res2.vatPercent);
                      dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                      dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
        
                      salesTotalMonth4 = salesTotalMonth4 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
        
                      this.vatSalesDetailsMonth4.push(dataJson); 
                    } 
                  
                  })
                })
        
                this.salesTotalMonth4 = salesTotalMonth4
              
              this.spinner.hide()
        


              
      this.month5 = 'Aug'
      this.yearMonth5 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"31",
      month: moment(new Date()).format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth5 = true;
        }else{
          this.isMonth5 = false;
        }

        this.productPurchaseDetailsMonth5 = res.purchaseData;   
        
        let purchaseTotalMonth5 = 0
        this.productPurchaseDetailsMonth5.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth5 = purchaseTotalMonth5 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth5 = purchaseTotalMonth5
         
        this.productWiseMeterSalesMonth5 = res.data; 
  
        this.vatSalesDetailsMonth5.length = 0;
        let salesTotalMonth5 = 0
        this.productWiseMeterSalesMonth5.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth5.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth5 = salesTotalMonth5 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth5.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth5 = salesTotalMonth5
        
        this.spinner.hide()

      }
  });

            }
        });
      
          }
      });
    
        }
    });
  

      }
  });

  }else{
    if(moment(new Date()).format("MM") == '09'){
      this.month1 = 'Apr'
      this.yearMonth1 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(5,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth1 = true;
        }else{
          this.isMonth1 = false;
        }

        this.productPurchaseDetailsMonth1 = res.purchaseData;   
        
        let purchaseTotalMonth1 = 0
        this.productPurchaseDetailsMonth1.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth1 = purchaseTotalMonth1 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth1 = purchaseTotalMonth1
         
        this.productWiseMeterSalesMonth1 = res.data; 
  
        this.vatSalesDetailsMonth1.length = 0;
        let salesTotalMonth1 = 0
        this.productWiseMeterSalesMonth1.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth1.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth1 = salesTotalMonth1 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth1.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth1 = salesTotalMonth1
        
        this.spinner.hide()
  


        this.month2 = 'May'
        this.yearMonth2 = moment(new Date()).format("YYYY")
      this.spinner.show()
      let data =  {
        dealerId: this.fuelDealerId,
        startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"01",
        endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"31",
        month: moment(new Date()).subtract(4,'month').format("MMM"),
        year: moment(new Date()).format("YYYY"),
    };
    this.post.getFinancialYearWiseVATBookPOST(data)
    .subscribe((res) => {
        if (res.status == 'OK') {
          this.isViewPDF = true;
  
          if(res.purchaseData.length || res.data.length){
            this.isMonth2 = true;
          }else{
            this.isMonth2 = false;
          }
  
          this.productPurchaseDetailsMonth2 = res.purchaseData;   
          
          let purchaseTotalMonth2 = 0
          this.productPurchaseDetailsMonth2.map((res1: { vatAmt: any; }) =>{  
            purchaseTotalMonth2 = purchaseTotalMonth2 + Number(res1.vatAmt)
          }) 
          this.purchaseTotalMonth2 = purchaseTotalMonth2
           
          this.productWiseMeterSalesMonth2 = res.data; 
    
          this.vatSalesDetailsMonth2.length = 0;
          let salesTotalMonth2 = 0
          this.productWiseMeterSalesMonth2.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
              this.productPurchaseDetailsMonth2.map((res2: { productId: any; vatPercent: any; }) => {
                const dataJson = {
                  productName: '',
                  basicAmount: 0,
                  vat: 0,
                  vatAmount: 0, 
                  totalAmount: 0, 
    
                  };
                if(res1.productId == res2.productId){
                  dataJson.productName = res1.productName;
                  dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                  dataJson.vat = Number(res2.vatPercent);
                  dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                  dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
    
                  salesTotalMonth2 = salesTotalMonth2 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
    
                  this.vatSalesDetailsMonth2.push(dataJson); 
                } 
              
              })
            })
    
            this.salesTotalMonth2 = salesTotalMonth2
          
          this.spinner.hide()
    

          this.month3 = 'Jun'
          this.yearMonth3 = moment(new Date()).format("YYYY")
        this.spinner.show()
      let data =  {
          dealerId: this.fuelDealerId,
          startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"01",
          endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"31",
          month: moment(new Date()).subtract(3,'month').format("MMM"),
          year: moment(new Date()).format("YYYY"),
      };
      this.post.getFinancialYearWiseVATBookPOST(data)
      .subscribe((res) => {
          if (res.status == 'OK') {
            this.isViewPDF = true;
    
            if(res.purchaseData.length || res.data.length){
              this.isMonth3 = true;
            }else{
              this.isMonth3 = false;
            }
    
            this.productPurchaseDetailsMonth3 = res.purchaseData;   
            
            let purchaseTotalMonth3 = 0
            this.productPurchaseDetailsMonth3.map((res1: { vatAmt: any; }) =>{  
              purchaseTotalMonth3 = purchaseTotalMonth3 + Number(res1.vatAmt)
            }) 
            this.purchaseTotalMonth3 = purchaseTotalMonth3
             
            this.productWiseMeterSalesMonth3 = res.data; 
      
            this.vatSalesDetailsMonth3.length = 0;
            let salesTotalMonth3 = 0
            this.productWiseMeterSalesMonth3.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                this.productPurchaseDetailsMonth3.map((res2: { productId: any; vatPercent: any; }) => {
                  const dataJson = {
                    productName: '',
                    basicAmount: 0,
                    vat: 0,
                    vatAmount: 0, 
                    totalAmount: 0, 
      
                    };
                  if(res1.productId == res2.productId){
                    dataJson.productName = res1.productName;
                    dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                    dataJson.vat = Number(res2.vatPercent);
                    dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                    dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
      
                    salesTotalMonth3 = salesTotalMonth3 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
      
                    this.vatSalesDetailsMonth3.push(dataJson); 
                  } 
                
                })
              })
      
              this.salesTotalMonth3 = salesTotalMonth3
            
            this.spinner.hide()
      


            this.month4 = 'Jul'
            this.yearMonth4 = moment(new Date()).format("YYYY")
          this.spinner.show()
      let data =  {
            dealerId: this.fuelDealerId,
            startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"01",
            endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"31",
            month: moment(new Date()).subtract(2,'month').format("MMM"),
            year: moment(new Date()).format("YYYY"),
        };
        this.post.getFinancialYearWiseVATBookPOST(data)
        .subscribe((res) => {
            if (res.status == 'OK') {
              this.isViewPDF = true;
      
              if(res.purchaseData.length || res.data.length){
                this.isMonth4 = true;
              }else{
                this.isMonth4 = false;
              }
      
              this.productPurchaseDetailsMonth4 = res.purchaseData;   
              
              let purchaseTotalMonth4 = 0
              this.productPurchaseDetailsMonth4.map((res1: { vatAmt: any; }) =>{  
                purchaseTotalMonth4 = purchaseTotalMonth4 + Number(res1.vatAmt)
              }) 
              this.purchaseTotalMonth4 = purchaseTotalMonth4
               
              this.productWiseMeterSalesMonth4 = res.data; 
        
              this.vatSalesDetailsMonth4.length = 0;
              let salesTotalMonth4 = 0
              this.productWiseMeterSalesMonth4.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                  this.productPurchaseDetailsMonth4.map((res2: { productId: any; vatPercent: any; }) => {
                    const dataJson = {
                      productName: '',
                      basicAmount: 0,
                      vat: 0,
                      vatAmount: 0, 
                      totalAmount: 0, 
        
                      };
                    if(res1.productId == res2.productId){
                      dataJson.productName = res1.productName;
                      dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                      dataJson.vat = Number(res2.vatPercent);
                      dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                      dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
        
                      salesTotalMonth4 = salesTotalMonth4 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
        
                      this.vatSalesDetailsMonth4.push(dataJson); 
                    } 
                  
                  })
                })
        
                this.salesTotalMonth4 = salesTotalMonth4
              
              this.spinner.hide()
        


              
      this.month5 = 'Aug'
      this.yearMonth5 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(1,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth5 = true;
        }else{
          this.isMonth5 = false;
        }

        this.productPurchaseDetailsMonth5 = res.purchaseData;   
        
        let purchaseTotalMonth5 = 0
        this.productPurchaseDetailsMonth5.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth5 = purchaseTotalMonth5 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth5 = purchaseTotalMonth5
         
        this.productWiseMeterSalesMonth5 = res.data; 
  
        this.vatSalesDetailsMonth5.length = 0;
        let salesTotalMonth5 = 0
        this.productWiseMeterSalesMonth5.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth5.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth5 = salesTotalMonth5 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth5.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth5 = salesTotalMonth5
        
        this.spinner.hide()



          
      this.month6 = 'Sep'
      this.yearMonth6 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"31",
      month: moment(new Date()).format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth6 = true;
        }else{
          this.isMonth6 = false;
        }

        this.productPurchaseDetailsMonth6 = res.purchaseData;   
        
        let purchaseTotalMonth6 = 0
        this.productPurchaseDetailsMonth6.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth6 = purchaseTotalMonth6 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth6 = purchaseTotalMonth6
         
        this.productWiseMeterSalesMonth6 = res.data; 
  
        this.vatSalesDetailsMonth6.length = 0;
        let salesTotalMonth6 = 0
        this.productWiseMeterSalesMonth6.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth6.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth6 = salesTotalMonth6 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth6.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth6 = salesTotalMonth6
        
        this.spinner.hide()
  
      }
  });

      }
  });

            }
        });
      
          }
      });
    

        }
    });
  

      }
  });

  }else{
    if(moment(new Date()).format("MM") == '10'){
      this.month1 = 'Apr'
      this.yearMonth1 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(6,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(6,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(6,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth1 = true;
        }else{
          this.isMonth1 = false;
        }

        this.productPurchaseDetailsMonth1 = res.purchaseData;   
        
        let purchaseTotalMonth1 = 0
        this.productPurchaseDetailsMonth1.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth1 = purchaseTotalMonth1 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth1 = purchaseTotalMonth1
         
        this.productWiseMeterSalesMonth1 = res.data; 
  
        this.vatSalesDetailsMonth1.length = 0;
        let salesTotalMonth1 = 0
        this.productWiseMeterSalesMonth1.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth1.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth1 = salesTotalMonth1 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth1.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth1 = salesTotalMonth1
        
        this.spinner.hide()
  


        this.month2 = 'May'
        this.yearMonth2 = moment(new Date()).format("YYYY")
      this.spinner.show()
      let data =  {
        dealerId: this.fuelDealerId,
        startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"01",
        endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"31",
        month: moment(new Date()).subtract(5,'month').format("MMM"),
        year: moment(new Date()).format("YYYY"),
    };
    this.post.getFinancialYearWiseVATBookPOST(data)
    .subscribe((res) => {
        if (res.status == 'OK') {
          this.isViewPDF = true;
  
          if(res.purchaseData.length || res.data.length){
            this.isMonth2 = true;
          }else{
            this.isMonth2 = false;
          }
  
          this.productPurchaseDetailsMonth2 = res.purchaseData;   
          
          let purchaseTotalMonth2 = 0
          this.productPurchaseDetailsMonth2.map((res1: { vatAmt: any; }) =>{  
            purchaseTotalMonth2 = purchaseTotalMonth2 + Number(res1.vatAmt)
          }) 
          this.purchaseTotalMonth2 = purchaseTotalMonth2
           
          this.productWiseMeterSalesMonth2 = res.data; 
    
          this.vatSalesDetailsMonth2.length = 0;
          let salesTotalMonth2 = 0
          this.productWiseMeterSalesMonth2.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
              this.productPurchaseDetailsMonth2.map((res2: { productId: any; vatPercent: any; }) => {
                const dataJson = {
                  productName: '',
                  basicAmount: 0,
                  vat: 0,
                  vatAmount: 0, 
                  totalAmount: 0, 
    
                  };
                if(res1.productId == res2.productId){
                  dataJson.productName = res1.productName;
                  dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                  dataJson.vat = Number(res2.vatPercent);
                  dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                  dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
    
                  salesTotalMonth2 = salesTotalMonth2 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
    
                  this.vatSalesDetailsMonth2.push(dataJson); 
                } 
              
              })
            })
    
            this.salesTotalMonth2 = salesTotalMonth2
          
          this.spinner.hide()
    

          this.month3 = 'Jun'
          this.yearMonth3 = moment(new Date()).format("YYYY")
        this.spinner.show()
      let data =  {
          dealerId: this.fuelDealerId,
          startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"01",
          endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"31",
          month: moment(new Date()).subtract(4,'month').format("MMM"),
          year: moment(new Date()).format("YYYY"),
      };
      this.post.getFinancialYearWiseVATBookPOST(data)
      .subscribe((res) => {
          if (res.status == 'OK') {
            this.isViewPDF = true;
    
            if(res.purchaseData.length || res.data.length){
              this.isMonth3 = true;
            }else{
              this.isMonth3 = false;
            }
    
            this.productPurchaseDetailsMonth3 = res.purchaseData;   
            
            let purchaseTotalMonth3 = 0
            this.productPurchaseDetailsMonth3.map((res1: { vatAmt: any; }) =>{  
              purchaseTotalMonth3 = purchaseTotalMonth3 + Number(res1.vatAmt)
            }) 
            this.purchaseTotalMonth3 = purchaseTotalMonth3
             
            this.productWiseMeterSalesMonth3 = res.data; 
      
            this.vatSalesDetailsMonth3.length = 0;
            let salesTotalMonth3 = 0
            this.productWiseMeterSalesMonth3.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                this.productPurchaseDetailsMonth3.map((res2: { productId: any; vatPercent: any; }) => {
                  const dataJson = {
                    productName: '',
                    basicAmount: 0,
                    vat: 0,
                    vatAmount: 0, 
                    totalAmount: 0, 
      
                    };
                  if(res1.productId == res2.productId){
                    dataJson.productName = res1.productName;
                    dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                    dataJson.vat = Number(res2.vatPercent);
                    dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                    dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
      
                    salesTotalMonth3 = salesTotalMonth3 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
      
                    this.vatSalesDetailsMonth3.push(dataJson); 
                  } 
                
                })
              })
      
              this.salesTotalMonth3 = salesTotalMonth3
            
            this.spinner.hide()
      


            this.month4 = 'Jul'
            this.yearMonth4 = moment(new Date()).format("YYYY")
          this.spinner.show()
      let data =  {
            dealerId: this.fuelDealerId,
            startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"01",
            endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"31",
            month: moment(new Date()).subtract(3,'month').format("MMM"),
            year: moment(new Date()).format("YYYY"),
        };
        this.post.getFinancialYearWiseVATBookPOST(data)
        .subscribe((res) => {
            if (res.status == 'OK') {
              this.isViewPDF = true;
      
              if(res.purchaseData.length || res.data.length){
                this.isMonth4 = true;
              }else{
                this.isMonth4 = false;
              }
      
              this.productPurchaseDetailsMonth4 = res.purchaseData;   
              
              let purchaseTotalMonth4 = 0
              this.productPurchaseDetailsMonth4.map((res1: { vatAmt: any; }) =>{  
                purchaseTotalMonth4 = purchaseTotalMonth4 + Number(res1.vatAmt)
              }) 
              this.purchaseTotalMonth4 = purchaseTotalMonth4
               
              this.productWiseMeterSalesMonth4 = res.data; 
        
              this.vatSalesDetailsMonth4.length = 0;
              let salesTotalMonth4 = 0
              this.productWiseMeterSalesMonth4.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                  this.productPurchaseDetailsMonth4.map((res2: { productId: any; vatPercent: any; }) => {
                    const dataJson = {
                      productName: '',
                      basicAmount: 0,
                      vat: 0,
                      vatAmount: 0, 
                      totalAmount: 0, 
        
                      };
                    if(res1.productId == res2.productId){
                      dataJson.productName = res1.productName;
                      dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                      dataJson.vat = Number(res2.vatPercent);
                      dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                      dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
        
                      salesTotalMonth4 = salesTotalMonth4 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
        
                      this.vatSalesDetailsMonth4.push(dataJson); 
                    } 
                  
                  })
                })
        
                this.salesTotalMonth4 = salesTotalMonth4
              
              this.spinner.hide()
        


              
      this.month5 = 'Aug'
      this.yearMonth5 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(2,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth5 = true;
        }else{
          this.isMonth5 = false;
        }

        this.productPurchaseDetailsMonth5 = res.purchaseData;   
        
        let purchaseTotalMonth5 = 0
        this.productPurchaseDetailsMonth5.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth5 = purchaseTotalMonth5 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth5 = purchaseTotalMonth5
         
        this.productWiseMeterSalesMonth5 = res.data; 
  
        this.vatSalesDetailsMonth5.length = 0;
        let salesTotalMonth5 = 0
        this.productWiseMeterSalesMonth5.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth5.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth5 = salesTotalMonth5 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth5.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth5 = salesTotalMonth5
        
        this.spinner.hide()



          
      this.month6 = 'Sep'
      this.yearMonth6 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(1,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth6 = true;
        }else{
          this.isMonth6 = false;
        }

        this.productPurchaseDetailsMonth6 = res.purchaseData;   
        
        let purchaseTotalMonth6 = 0
        this.productPurchaseDetailsMonth6.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth6 = purchaseTotalMonth6 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth6 = purchaseTotalMonth6
         
        this.productWiseMeterSalesMonth6 = res.data; 
  
        this.vatSalesDetailsMonth6.length = 0;
        let salesTotalMonth6 = 0
        this.productWiseMeterSalesMonth6.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth6.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth6 = salesTotalMonth6 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth6.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth6 = salesTotalMonth6
        
        this.spinner.hide()
  

        
      this.month7 = 'Oct'
      this.yearMonth7 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"31",
      month: moment(new Date()).format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth7 = true;
        }else{
          this.isMonth7 = false;
        }

        this.productPurchaseDetailsMonth7 = res.purchaseData;   
        
        let purchaseTotalMonth7 = 0
        this.productPurchaseDetailsMonth7.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth7 = purchaseTotalMonth7 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth7 = purchaseTotalMonth7
         
        this.productWiseMeterSalesMonth7 = res.data; 
  
        this.vatSalesDetailsMonth7.length = 0;
        let salesTotalMonth7 = 0
        this.productWiseMeterSalesMonth7.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth7.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth7 = salesTotalMonth7 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth7.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth7 = salesTotalMonth7
        
        this.spinner.hide()

  
      }
  });
  
      }
  });

      }
  });
           }
        });
    

          }
      });
    
        }
    });
  

      }
  });

  }else{
    if(moment(new Date()).format("MM") == '11'){
      this.month1 = 'Apr'
      this.yearMonth1 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(7,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(7,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(7,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth1 = true;
        }else{
          this.isMonth1 = false;
        }

        this.productPurchaseDetailsMonth1 = res.purchaseData;   
        
        let purchaseTotalMonth1 = 0
        this.productPurchaseDetailsMonth1.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth1 = purchaseTotalMonth1 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth1 = purchaseTotalMonth1
         
        this.productWiseMeterSalesMonth1 = res.data; 
  
        this.vatSalesDetailsMonth1.length = 0;
        let salesTotalMonth1 = 0
        this.productWiseMeterSalesMonth1.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth1.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth1 = salesTotalMonth1 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth1.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth1 = salesTotalMonth1
        
        this.spinner.hide()
  


        this.month2 = 'May'
        this.yearMonth2 = moment(new Date()).format("YYYY")
      this.spinner.show()
      let data =  {
        dealerId: this.fuelDealerId,
        startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(6,'month').format("MM")+'-'+"01",
        endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(6,'month').format("MM")+'-'+"31",
        month: moment(new Date()).subtract(6,'month').format("MMM"),
        year: moment(new Date()).format("YYYY"),
    };
    this.post.getFinancialYearWiseVATBookPOST(data)
    .subscribe((res) => {
        if (res.status == 'OK') {
          this.isViewPDF = true;
  
          if(res.purchaseData.length || res.data.length){
            this.isMonth2 = true;
          }else{
            this.isMonth2 = false;
          }
  
          this.productPurchaseDetailsMonth2 = res.purchaseData;   
          
          let purchaseTotalMonth2 = 0
          this.productPurchaseDetailsMonth2.map((res1: { vatAmt: any; }) =>{  
            purchaseTotalMonth2 = purchaseTotalMonth2 + Number(res1.vatAmt)
          }) 
          this.purchaseTotalMonth2 = purchaseTotalMonth2
           
          this.productWiseMeterSalesMonth2 = res.data; 
    
          this.vatSalesDetailsMonth2.length = 0;
          let salesTotalMonth2 = 0
          this.productWiseMeterSalesMonth2.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
              this.productPurchaseDetailsMonth2.map((res2: { productId: any; vatPercent: any; }) => {
                const dataJson = {
                  productName: '',
                  basicAmount: 0,
                  vat: 0,
                  vatAmount: 0, 
                  totalAmount: 0, 
    
                  };
                if(res1.productId == res2.productId){
                  dataJson.productName = res1.productName;
                  dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                  dataJson.vat = Number(res2.vatPercent);
                  dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                  dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
    
                  salesTotalMonth2 = salesTotalMonth2 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
    
                  this.vatSalesDetailsMonth2.push(dataJson); 
                } 
              
              })
            })
    
            this.salesTotalMonth2 = salesTotalMonth2
          
          this.spinner.hide()
    

          this.month3 = 'Jun'
          this.yearMonth3 = moment(new Date()).format("YYYY")
        this.spinner.show()
      let data =  {
          dealerId: this.fuelDealerId,
          startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"01",
          endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"31",
          month: moment(new Date()).subtract(5,'month').format("MMM"),
          year: moment(new Date()).format("YYYY"),
      };
      this.post.getFinancialYearWiseVATBookPOST(data)
      .subscribe((res) => {
          if (res.status == 'OK') {
            this.isViewPDF = true;
    
            if(res.purchaseData.length || res.data.length){
              this.isMonth3 = true;
            }else{
              this.isMonth3 = false;
            }
    
            this.productPurchaseDetailsMonth3 = res.purchaseData;   
            
            let purchaseTotalMonth3 = 0
            this.productPurchaseDetailsMonth3.map((res1: { vatAmt: any; }) =>{  
              purchaseTotalMonth3 = purchaseTotalMonth3 + Number(res1.vatAmt)
            }) 
            this.purchaseTotalMonth3 = purchaseTotalMonth3
             
            this.productWiseMeterSalesMonth3 = res.data; 
      
            this.vatSalesDetailsMonth3.length = 0;
            let salesTotalMonth3 = 0
            this.productWiseMeterSalesMonth3.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                this.productPurchaseDetailsMonth3.map((res2: { productId: any; vatPercent: any; }) => {
                  const dataJson = {
                    productName: '',
                    basicAmount: 0,
                    vat: 0,
                    vatAmount: 0, 
                    totalAmount: 0, 
      
                    };
                  if(res1.productId == res2.productId){
                    dataJson.productName = res1.productName;
                    dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                    dataJson.vat = Number(res2.vatPercent);
                    dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                    dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
      
                    salesTotalMonth3 = salesTotalMonth3 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
      
                    this.vatSalesDetailsMonth3.push(dataJson); 
                  } 
                
                })
              })
      
              this.salesTotalMonth3 = salesTotalMonth3
            
            this.spinner.hide()
      


            this.month4 = 'Jul'
            this.yearMonth4 = moment(new Date()).format("YYYY")
          this.spinner.show()
      let data =  {
            dealerId: this.fuelDealerId,
            startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"01",
            endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"31",
            month: moment(new Date()).subtract(4,'month').format("MMM"),
            year: moment(new Date()).format("YYYY"),
        };
        this.post.getFinancialYearWiseVATBookPOST(data)
        .subscribe((res) => {
            if (res.status == 'OK') {
              this.isViewPDF = true;
      
              if(res.purchaseData.length || res.data.length){
                this.isMonth4 = true;
              }else{
                this.isMonth4 = false;
              }
      
              this.productPurchaseDetailsMonth4 = res.purchaseData;   
              
              let purchaseTotalMonth4 = 0
              this.productPurchaseDetailsMonth4.map((res1: { vatAmt: any; }) =>{  
                purchaseTotalMonth4 = purchaseTotalMonth4 + Number(res1.vatAmt)
              }) 
              this.purchaseTotalMonth4 = purchaseTotalMonth4
               
              this.productWiseMeterSalesMonth4 = res.data; 
        
              this.vatSalesDetailsMonth4.length = 0;
              let salesTotalMonth4 = 0
              this.productWiseMeterSalesMonth4.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                  this.productPurchaseDetailsMonth4.map((res2: { productId: any; vatPercent: any; }) => {
                    const dataJson = {
                      productName: '',
                      basicAmount: 0,
                      vat: 0,
                      vatAmount: 0, 
                      totalAmount: 0, 
        
                      };
                    if(res1.productId == res2.productId){
                      dataJson.productName = res1.productName;
                      dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                      dataJson.vat = Number(res2.vatPercent);
                      dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                      dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
        
                      salesTotalMonth4 = salesTotalMonth4 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
        
                      this.vatSalesDetailsMonth4.push(dataJson); 
                    } 
                  
                  })
                })
        
                this.salesTotalMonth4 = salesTotalMonth4
              
              this.spinner.hide()
        


              
      this.month5 = 'Aug'
      this.yearMonth5 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(3,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth5 = true;
        }else{
          this.isMonth5 = false;
        }

        this.productPurchaseDetailsMonth5 = res.purchaseData;   
        
        let purchaseTotalMonth5 = 0
        this.productPurchaseDetailsMonth5.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth5 = purchaseTotalMonth5 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth5 = purchaseTotalMonth5
         
        this.productWiseMeterSalesMonth5 = res.data; 
  
        this.vatSalesDetailsMonth5.length = 0;
        let salesTotalMonth5 = 0
        this.productWiseMeterSalesMonth5.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth5.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth5 = salesTotalMonth5 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth5.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth5 = salesTotalMonth5
        
        this.spinner.hide()



          
      this.month6 = 'Sep'
      this.yearMonth6 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(2,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth6 = true;
        }else{
          this.isMonth6 = false;
        }

        this.productPurchaseDetailsMonth6 = res.purchaseData;   
        
        let purchaseTotalMonth6 = 0
        this.productPurchaseDetailsMonth6.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth6 = purchaseTotalMonth6 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth6 = purchaseTotalMonth6
         
        this.productWiseMeterSalesMonth6 = res.data; 
  
        this.vatSalesDetailsMonth6.length = 0;
        let salesTotalMonth6 = 0
        this.productWiseMeterSalesMonth6.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth6.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth6 = salesTotalMonth6 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth6.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth6 = salesTotalMonth6
        
        this.spinner.hide()
  

        
      this.month7 = 'Oct'
      this.yearMonth7 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(1,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth7 = true;
        }else{
          this.isMonth7 = false;
        }

        this.productPurchaseDetailsMonth7 = res.purchaseData;   
        
        let purchaseTotalMonth7 = 0
        this.productPurchaseDetailsMonth7.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth7 = purchaseTotalMonth7 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth7 = purchaseTotalMonth7
         
        this.productWiseMeterSalesMonth7 = res.data; 
  
        this.vatSalesDetailsMonth7.length = 0;
        let salesTotalMonth7 = 0
        this.productWiseMeterSalesMonth7.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth7.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth7 = salesTotalMonth7 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth7.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth7 = salesTotalMonth7
        
        this.spinner.hide()



          
      this.month8 = 'Nov'
      this.yearMonth8 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"31",
      month: moment(new Date()).format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth8 = true;
        }else{
          this.isMonth8 = false;
        }

        this.productPurchaseDetailsMonth8 = res.purchaseData;   
        
        let purchaseTotalMonth8 = 0
        this.productPurchaseDetailsMonth8.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth8 = purchaseTotalMonth8 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth8 = purchaseTotalMonth8
         
        this.productWiseMeterSalesMonth8 = res.data; 
  
        this.vatSalesDetailsMonth8.length = 0;
        let salesTotalMonth8 = 0
        this.productWiseMeterSalesMonth8.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth8.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth8 = salesTotalMonth8 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth8.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth8 = salesTotalMonth8
        
        this.spinner.hide()

      }
  });

  
      }
  });

  
      }
  });

      }
  });

            }
        });
      
          }
      });
    

        }
    });
  

      }
  });

  }else{
    if(moment(new Date()).format("MM") == '12'){
      this.month1 = 'Apr'
      this.yearMonth1 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(8,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(8,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(8,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth1 = true;
        }else{
          this.isMonth1 = false;
        }

        this.productPurchaseDetailsMonth1 = res.purchaseData;   
        
        let purchaseTotalMonth1 = 0
        this.productPurchaseDetailsMonth1.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth1 = purchaseTotalMonth1 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth1 = purchaseTotalMonth1
         
        this.productWiseMeterSalesMonth1 = res.data; 
  
        this.vatSalesDetailsMonth1.length = 0;
        let salesTotalMonth1 = 0
        this.productWiseMeterSalesMonth1.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth1.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth1 = salesTotalMonth1 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth1.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth1 = salesTotalMonth1
        
        this.spinner.hide()
  


        this.month2 = 'May'
        this.yearMonth2 = moment(new Date()).format("YYYY")
      this.spinner.show()
      let data =  {
        dealerId: this.fuelDealerId,
        startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(7,'month').format("MM")+'-'+"01",
        endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(7,'month').format("MM")+'-'+"31",
        month: moment(new Date()).subtract(7,'month').format("MMM"),
        year: moment(new Date()).format("YYYY"),
    };
    this.post.getFinancialYearWiseVATBookPOST(data)
    .subscribe((res) => {
        if (res.status == 'OK') {
          this.isViewPDF = true;
  
          if(res.purchaseData.length || res.data.length){
            this.isMonth2 = true;
          }else{
            this.isMonth2 = false;
          }
  
          this.productPurchaseDetailsMonth2 = res.purchaseData;   
          
          let purchaseTotalMonth2 = 0
          this.productPurchaseDetailsMonth2.map((res1: { vatAmt: any; }) =>{  
            purchaseTotalMonth2 = purchaseTotalMonth2 + Number(res1.vatAmt)
          }) 
          this.purchaseTotalMonth2 = purchaseTotalMonth2
           
          this.productWiseMeterSalesMonth2 = res.data; 
    
          this.vatSalesDetailsMonth2.length = 0;
          let salesTotalMonth2 = 0
          this.productWiseMeterSalesMonth2.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
              this.productPurchaseDetailsMonth2.map((res2: { productId: any; vatPercent: any; }) => {
                const dataJson = {
                  productName: '',
                  basicAmount: 0,
                  vat: 0,
                  vatAmount: 0, 
                  totalAmount: 0, 
    
                  };
                if(res1.productId == res2.productId){
                  dataJson.productName = res1.productName;
                  dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                  dataJson.vat = Number(res2.vatPercent);
                  dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                  dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
    
                  salesTotalMonth2 = salesTotalMonth2 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
    
                  this.vatSalesDetailsMonth2.push(dataJson); 
                } 
              
              })
            })
    
            this.salesTotalMonth2 = salesTotalMonth2
          
          this.spinner.hide()
    

          this.month3 = 'Jun'
          this.yearMonth3 = moment(new Date()).format("YYYY")
        this.spinner.show()
      let data =  {
          dealerId: this.fuelDealerId,
          startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(6,'month').format("MM")+'-'+"01",
          endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(6,'month').format("MM")+'-'+"31",
          month: moment(new Date()).subtract(6,'month').format("MMM"),
          year: moment(new Date()).format("YYYY"),
      };
      this.post.getFinancialYearWiseVATBookPOST(data)
      .subscribe((res) => {
          if (res.status == 'OK') {
            this.isViewPDF = true;
    
            if(res.purchaseData.length || res.data.length){
              this.isMonth3 = true;
            }else{
              this.isMonth3 = false;
            }
    
            this.productPurchaseDetailsMonth3 = res.purchaseData;   
            
            let purchaseTotalMonth3 = 0
            this.productPurchaseDetailsMonth3.map((res1: { vatAmt: any; }) =>{  
              purchaseTotalMonth3 = purchaseTotalMonth3 + Number(res1.vatAmt)
            }) 
            this.purchaseTotalMonth3 = purchaseTotalMonth3
             
            this.productWiseMeterSalesMonth3 = res.data; 
      
            this.vatSalesDetailsMonth3.length = 0;
            let salesTotalMonth3 = 0
            this.productWiseMeterSalesMonth3.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                this.productPurchaseDetailsMonth3.map((res2: { productId: any; vatPercent: any; }) => {
                  const dataJson = {
                    productName: '',
                    basicAmount: 0,
                    vat: 0,
                    vatAmount: 0, 
                    totalAmount: 0, 
      
                    };
                  if(res1.productId == res2.productId){
                    dataJson.productName = res1.productName;
                    dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                    dataJson.vat = Number(res2.vatPercent);
                    dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                    dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
      
                    salesTotalMonth3 = salesTotalMonth3 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
      
                    this.vatSalesDetailsMonth3.push(dataJson); 
                  } 
                
                })
              })
      
              this.salesTotalMonth3 = salesTotalMonth3
            
            this.spinner.hide()
      


            this.month4 = 'Jul'
            this.yearMonth4 = moment(new Date()).format("YYYY")
          this.spinner.show()
      let data =  {
            dealerId: this.fuelDealerId,
            startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"01",
            endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"31",
            month: moment(new Date()).subtract(5,'month').format("MMM"),
            year: moment(new Date()).format("YYYY"),
        };
        this.post.getFinancialYearWiseVATBookPOST(data)
        .subscribe((res) => {
            if (res.status == 'OK') {
              this.isViewPDF = true;
      
              if(res.purchaseData.length || res.data.length){
                this.isMonth4 = true;
              }else{
                this.isMonth4 = false;
              }
      
              this.productPurchaseDetailsMonth4 = res.purchaseData;   
              
              let purchaseTotalMonth4 = 0
              this.productPurchaseDetailsMonth4.map((res1: { vatAmt: any; }) =>{  
                purchaseTotalMonth4 = purchaseTotalMonth4 + Number(res1.vatAmt)
              }) 
              this.purchaseTotalMonth4 = purchaseTotalMonth4
               
              this.productWiseMeterSalesMonth4 = res.data; 
        
              this.vatSalesDetailsMonth4.length = 0;
              let salesTotalMonth4 = 0
              this.productWiseMeterSalesMonth4.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                  this.productPurchaseDetailsMonth4.map((res2: { productId: any; vatPercent: any; }) => {
                    const dataJson = {
                      productName: '',
                      basicAmount: 0,
                      vat: 0,
                      vatAmount: 0, 
                      totalAmount: 0, 
        
                      };
                    if(res1.productId == res2.productId){
                      dataJson.productName = res1.productName;
                      dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                      dataJson.vat = Number(res2.vatPercent);
                      dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                      dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
        
                      salesTotalMonth4 = salesTotalMonth4 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
        
                      this.vatSalesDetailsMonth4.push(dataJson); 
                    } 
                  
                  })
                })
        
                this.salesTotalMonth4 = salesTotalMonth4
              
              this.spinner.hide()
        


              
      this.month5 = 'Aug'
      this.yearMonth5 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(4,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth5 = true;
        }else{
          this.isMonth5 = false;
        }

        this.productPurchaseDetailsMonth5 = res.purchaseData;   
        
        let purchaseTotalMonth5 = 0
        this.productPurchaseDetailsMonth5.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth5 = purchaseTotalMonth5 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth5 = purchaseTotalMonth5
         
        this.productWiseMeterSalesMonth5 = res.data; 
  
        this.vatSalesDetailsMonth5.length = 0;
        let salesTotalMonth5 = 0
        this.productWiseMeterSalesMonth5.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth5.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth5 = salesTotalMonth5 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth5.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth5 = salesTotalMonth5
        
        this.spinner.hide()



          
      this.month6 = 'Sep'
      this.yearMonth6 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(3,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth6 = true;
        }else{
          this.isMonth6 = false;
        }

        this.productPurchaseDetailsMonth6 = res.purchaseData;   
        
        let purchaseTotalMonth6 = 0
        this.productPurchaseDetailsMonth6.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth6 = purchaseTotalMonth6 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth6 = purchaseTotalMonth6
         
        this.productWiseMeterSalesMonth6 = res.data; 
  
        this.vatSalesDetailsMonth6.length = 0;
        let salesTotalMonth6 = 0
        this.productWiseMeterSalesMonth6.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth6.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth6 = salesTotalMonth6 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth6.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth6 = salesTotalMonth6
        
        this.spinner.hide()
  

        
      this.month7 = 'Oct'
      this.yearMonth7 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(2,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth7 = true;
        }else{
          this.isMonth7 = false;
        }

        this.productPurchaseDetailsMonth7 = res.purchaseData;   
        
        let purchaseTotalMonth7 = 0
        this.productPurchaseDetailsMonth7.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth7 = purchaseTotalMonth7 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth7 = purchaseTotalMonth7
         
        this.productWiseMeterSalesMonth7 = res.data; 
  
        this.vatSalesDetailsMonth7.length = 0;
        let salesTotalMonth7 = 0
        this.productWiseMeterSalesMonth7.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth7.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth7 = salesTotalMonth7 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth7.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth7 = salesTotalMonth7
        
        this.spinner.hide()



          
      this.month8 = 'Nov'
      this.yearMonth8 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(1,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth8 = true;
        }else{
          this.isMonth8 = false;
        }

        this.productPurchaseDetailsMonth8 = res.purchaseData;   
        
        let purchaseTotalMonth8 = 0
        this.productPurchaseDetailsMonth8.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth8 = purchaseTotalMonth8 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth8 = purchaseTotalMonth8
         
        this.productWiseMeterSalesMonth8 = res.data; 
  
        this.vatSalesDetailsMonth8.length = 0;
        let salesTotalMonth8 = 0
        this.productWiseMeterSalesMonth8.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth8.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth8 = salesTotalMonth8 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth8.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth8 = salesTotalMonth8
        
        this.spinner.hide()




        
      this.month9 = 'Dec'
      this.yearMonth9 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"31",
      month: moment(new Date()).format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth9 = true;
        }else{
          this.isMonth9 = false;
        }

        this.productPurchaseDetailsMonth9 = res.purchaseData;   
        
        let purchaseTotalMonth9 = 0
        this.productPurchaseDetailsMonth9.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth9 = purchaseTotalMonth9 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth9 = purchaseTotalMonth9
         
        this.productWiseMeterSalesMonth9 = res.data; 
  
        this.vatSalesDetailsMonth9.length = 0;
        let salesTotalMonth9 = 0
        this.productWiseMeterSalesMonth9.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth9.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth9 = salesTotalMonth9 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth9.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth9 = salesTotalMonth9
        
        this.spinner.hide()
  

      }
  });

  
      }
  });

  
      }
  });

  
      }
  });

  
      }
  });

            }
        });
    

          }
      });
    




        }
    });
  

      }
  });

  }else{
    if(moment(new Date()).format("MM") == '01'){
      this.month1 = 'Apr'
      this.yearMonth1 = moment(new Date()).subtract(9,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(9,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(9,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(9,'month').format("MMM"),
      year: moment(new Date()).subtract(9,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth1 = true;
        }else{
          this.isMonth1 = false;
        }

        this.productPurchaseDetailsMonth1 = res.purchaseData;   
        
        let purchaseTotalMonth1 = 0
        this.productPurchaseDetailsMonth1.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth1 = purchaseTotalMonth1 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth1 = purchaseTotalMonth1
         
        this.productWiseMeterSalesMonth1 = res.data; 
  
        this.vatSalesDetailsMonth1.length = 0;
        let salesTotalMonth1 = 0
        this.productWiseMeterSalesMonth1.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth1.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth1 = salesTotalMonth1 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth1.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth1 = salesTotalMonth1
        
        this.spinner.hide()
  


        this.month2 = 'May'
        this.yearMonth2 = moment(new Date()).subtract(8,'month').format("YYYY")
      this.spinner.show()
      let data =  {
        dealerId: this.fuelDealerId,
        startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(8,'month').format("MM")+'-'+"01",
        endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(8,'month').format("MM")+'-'+"31",
        month: moment(new Date()).subtract(8,'month').format("MMM"),
        year: moment(new Date()).subtract(8,'month').format("YYYY"),
    };
    this.post.getFinancialYearWiseVATBookPOST(data)
    .subscribe((res) => {
        if (res.status == 'OK') {
          this.isViewPDF = true;
  
          if(res.purchaseData.length || res.data.length){
            this.isMonth2 = true;
          }else{
            this.isMonth2 = false;
          }
  
          this.productPurchaseDetailsMonth2 = res.purchaseData;   
          
          let purchaseTotalMonth2 = 0
          this.productPurchaseDetailsMonth2.map((res1: { vatAmt: any; }) =>{  
            purchaseTotalMonth2 = purchaseTotalMonth2 + Number(res1.vatAmt)
          }) 
          this.purchaseTotalMonth2 = purchaseTotalMonth2
           
          this.productWiseMeterSalesMonth2 = res.data; 
    
          this.vatSalesDetailsMonth2.length = 0;
          let salesTotalMonth2 = 0
          this.productWiseMeterSalesMonth2.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
              this.productPurchaseDetailsMonth2.map((res2: { productId: any; vatPercent: any; }) => {
                const dataJson = {
                  productName: '',
                  basicAmount: 0,
                  vat: 0,
                  vatAmount: 0, 
                  totalAmount: 0, 
    
                  };
                if(res1.productId == res2.productId){
                  dataJson.productName = res1.productName;
                  dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                  dataJson.vat = Number(res2.vatPercent);
                  dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                  dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
    
                  salesTotalMonth2 = salesTotalMonth2 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
    
                  this.vatSalesDetailsMonth2.push(dataJson); 
                } 
              
              })
            })
    
            this.salesTotalMonth2 = salesTotalMonth2
          
          this.spinner.hide()
    

          this.month3 = 'Jun'
          this.yearMonth3 = moment(new Date()).subtract(7,'month').format("YYYY")
        this.spinner.show()
      let data =  {
          dealerId: this.fuelDealerId,
          startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(7,'month').format("MM")+'-'+"01",
          endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(7,'month').format("MM")+'-'+"31",
          month: moment(new Date()).subtract(7,'month').format("MMM"),
          year: moment(new Date()).subtract(7,'month').format("YYYY"),
      };
      this.post.getFinancialYearWiseVATBookPOST(data)
      .subscribe((res) => {
          if (res.status == 'OK') {
            this.isViewPDF = true;
    
            if(res.purchaseData.length || res.data.length){
              this.isMonth3 = true;
            }else{
              this.isMonth3 = false;
            }
    
            this.productPurchaseDetailsMonth3 = res.purchaseData;   
            
            let purchaseTotalMonth3 = 0
            this.productPurchaseDetailsMonth3.map((res1: { vatAmt: any; }) =>{  
              purchaseTotalMonth3 = purchaseTotalMonth3 + Number(res1.vatAmt)
            }) 
            this.purchaseTotalMonth3 = purchaseTotalMonth3
             
            this.productWiseMeterSalesMonth3 = res.data; 
      
            this.vatSalesDetailsMonth3.length = 0;
            let salesTotalMonth3 = 0
            this.productWiseMeterSalesMonth3.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                this.productPurchaseDetailsMonth3.map((res2: { productId: any; vatPercent: any; }) => {
                  const dataJson = {
                    productName: '',
                    basicAmount: 0,
                    vat: 0,
                    vatAmount: 0, 
                    totalAmount: 0, 
      
                    };
                  if(res1.productId == res2.productId){
                    dataJson.productName = res1.productName;
                    dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                    dataJson.vat = Number(res2.vatPercent);
                    dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                    dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
      
                    salesTotalMonth3 = salesTotalMonth3 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
      
                    this.vatSalesDetailsMonth3.push(dataJson); 
                  } 
                
                })
              })
      
              this.salesTotalMonth3 = salesTotalMonth3
            
            this.spinner.hide()
      


            this.month4 = 'Jul'
            this.yearMonth4 = moment(new Date()).subtract(6,'month').format("YYYY")
          this.spinner.show()
      let data =  {
            dealerId: this.fuelDealerId,
            startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(6,'month').format("MM")+'-'+"01",
            endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(6,'month').format("MM")+'-'+"31",
            month: moment(new Date()).subtract(6,'month').format("MMM"),
            year: moment(new Date()).subtract(6,'month').format("YYYY"),
        };
        this.post.getFinancialYearWiseVATBookPOST(data)
        .subscribe((res) => {
            if (res.status == 'OK') {
              this.isViewPDF = true;
      
              if(res.purchaseData.length || res.data.length){
                this.isMonth4 = true;
              }else{
                this.isMonth4 = false;
              }
      
              this.productPurchaseDetailsMonth4 = res.purchaseData;   
              
              let purchaseTotalMonth4 = 0
              this.productPurchaseDetailsMonth4.map((res1: { vatAmt: any; }) =>{  
                purchaseTotalMonth4 = purchaseTotalMonth4 + Number(res1.vatAmt)
              }) 
              this.purchaseTotalMonth4 = purchaseTotalMonth4
               
              this.productWiseMeterSalesMonth4 = res.data; 
        
              this.vatSalesDetailsMonth4.length = 0;
              let salesTotalMonth4 = 0
              this.productWiseMeterSalesMonth4.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                  this.productPurchaseDetailsMonth4.map((res2: { productId: any; vatPercent: any; }) => {
                    const dataJson = {
                      productName: '',
                      basicAmount: 0,
                      vat: 0,
                      vatAmount: 0, 
                      totalAmount: 0, 
        
                      };
                    if(res1.productId == res2.productId){
                      dataJson.productName = res1.productName;
                      dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                      dataJson.vat = Number(res2.vatPercent);
                      dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                      dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
        
                      salesTotalMonth4 = salesTotalMonth4 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
        
                      this.vatSalesDetailsMonth4.push(dataJson); 
                    } 
                  
                  })
                })
        
                this.salesTotalMonth4 = salesTotalMonth4
              
              this.spinner.hide()
        


              
      this.month5 = 'Aug'
      this.yearMonth5 = moment(new Date()).subtract(5,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(5,'month').format("MMM"),
      year: moment(new Date()).subtract(5,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth5 = true;
        }else{
          this.isMonth5 = false;
        }

        this.productPurchaseDetailsMonth5 = res.purchaseData;   
        
        let purchaseTotalMonth5 = 0
        this.productPurchaseDetailsMonth5.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth5 = purchaseTotalMonth5 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth5 = purchaseTotalMonth5
         
        this.productWiseMeterSalesMonth5 = res.data; 
  
        this.vatSalesDetailsMonth5.length = 0;
        let salesTotalMonth5 = 0
        this.productWiseMeterSalesMonth5.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth5.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth5 = salesTotalMonth5 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth5.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth5 = salesTotalMonth5
        
        this.spinner.hide()



          
      this.month6 = 'Sep'
      this.yearMonth6 = moment(new Date()).subtract(4,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(4,'month').format("MMM"),
      year: moment(new Date()).subtract(4,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth6 = true;
        }else{
          this.isMonth6 = false;
        }

        this.productPurchaseDetailsMonth6 = res.purchaseData;   
        
        let purchaseTotalMonth6 = 0
        this.productPurchaseDetailsMonth6.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth6 = purchaseTotalMonth6 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth6 = purchaseTotalMonth6
         
        this.productWiseMeterSalesMonth6 = res.data; 
  
        this.vatSalesDetailsMonth6.length = 0;
        let salesTotalMonth6 = 0
        this.productWiseMeterSalesMonth6.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth6.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth6 = salesTotalMonth6 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth6.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth6 = salesTotalMonth6
        
        this.spinner.hide()
  

        
      this.month7 = 'Oct'
      this.yearMonth7 = moment(new Date()).subtract(3,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(3,'month').format("MMM"),
      year: moment(new Date()).subtract(3,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth7 = true;
        }else{
          this.isMonth7 = false;
        }

        this.productPurchaseDetailsMonth7 = res.purchaseData;   
        
        let purchaseTotalMonth7 = 0
        this.productPurchaseDetailsMonth7.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth7 = purchaseTotalMonth7 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth7 = purchaseTotalMonth7
         
        this.productWiseMeterSalesMonth7 = res.data; 
  
        this.vatSalesDetailsMonth7.length = 0;
        let salesTotalMonth7 = 0
        this.productWiseMeterSalesMonth7.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth7.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth7 = salesTotalMonth7 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth7.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth7 = salesTotalMonth7
        
        this.spinner.hide()



          
      this.month8 = 'Nov'
      this.yearMonth8 = moment(new Date()).subtract(2,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(2,'month').format("MMM"),
      year: moment(new Date()).subtract(2,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth8 = true;
        }else{
          this.isMonth8 = false;
        }

        this.productPurchaseDetailsMonth8 = res.purchaseData;   
        
        let purchaseTotalMonth8 = 0
        this.productPurchaseDetailsMonth8.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth8 = purchaseTotalMonth8 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth8 = purchaseTotalMonth8
         
        this.productWiseMeterSalesMonth8 = res.data; 
  
        this.vatSalesDetailsMonth8.length = 0;
        let salesTotalMonth8 = 0
        this.productWiseMeterSalesMonth8.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth8.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth8 = salesTotalMonth8 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth8.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth8 = salesTotalMonth8
        
        this.spinner.hide()




        
      this.month9 = 'Dec'
      this.yearMonth9 = moment(new Date()).subtract(1,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(1,'month').format("MMM"),
      year: moment(new Date()).subtract(1,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth9 = true;
        }else{
          this.isMonth9 = false;
        }

        this.productPurchaseDetailsMonth9 = res.purchaseData;   
        
        let purchaseTotalMonth9 = 0
        this.productPurchaseDetailsMonth9.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth9 = purchaseTotalMonth9 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth9 = purchaseTotalMonth9
         
        this.productWiseMeterSalesMonth9 = res.data; 
  
        this.vatSalesDetailsMonth9.length = 0;
        let salesTotalMonth9 = 0
        this.productWiseMeterSalesMonth9.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth9.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth9 = salesTotalMonth9 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth9.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth9 = salesTotalMonth9
        
        this.spinner.hide()
  


          
      this.month10 = 'Jan'
      this.yearMonth10 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"31",
      month: moment(new Date()).format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth10 = true;
        }else{
          this.isMonth10 = false;
        }

        this.productPurchaseDetailsMonth10 = res.purchaseData;   
        
        let purchaseTotalMonth10 = 0
        this.productPurchaseDetailsMonth10.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth10 = purchaseTotalMonth10 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth10 = purchaseTotalMonth10
         
        this.productWiseMeterSalesMonth10 = res.data; 
  
        this.vatSalesDetailsMonth10.length = 0;
        let salesTotalMonth10 = 0
        this.productWiseMeterSalesMonth10.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth10.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth10 = salesTotalMonth10 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth10.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth10 = salesTotalMonth10
        
        this.spinner.hide()
  
      }
  });

  





      }
  });

  




  
      }
  });

  



  
      }
  });

  
      }
  });

  



  
      }
  });

  




            }
        });
      




          }
      });
    




        }
    });
  

      }
  });

  }else{
    if(moment(new Date()).format("MM") == '02'){
      this.month1 = 'Apr'
      this.yearMonth1 = moment(new Date()).subtract(10,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(10,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(10,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(10,'month').format("MMM"),
      year: moment(new Date()).subtract(10,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth1 = true;
        }else{
          this.isMonth1 = false;
        }

        this.productPurchaseDetailsMonth1 = res.purchaseData;   
        
        let purchaseTotalMonth1 = 0
        this.productPurchaseDetailsMonth1.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth1 = purchaseTotalMonth1 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth1 = purchaseTotalMonth1
         
        this.productWiseMeterSalesMonth1 = res.data; 
  
        this.vatSalesDetailsMonth1.length = 0;
        let salesTotalMonth1 = 0
        this.productWiseMeterSalesMonth1.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth1.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth1 = salesTotalMonth1 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth1.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth1 = salesTotalMonth1
        
        this.spinner.hide()
  


        this.month2 = 'May'
        this.yearMonth2 = moment(new Date()).subtract(9,'month').format("YYYY")
      this.spinner.show()
      let data =  {
        dealerId: this.fuelDealerId,
        startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(9,'month').format("MM")+'-'+"01",
        endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(9,'month').format("MM")+'-'+"31",
        month: moment(new Date()).subtract(9,'month').format("MMM"),
        year: moment(new Date()).subtract(9,'month').format("YYYY"),
    };
    this.post.getFinancialYearWiseVATBookPOST(data)
    .subscribe((res) => {
        if (res.status == 'OK') {
          this.isViewPDF = true;
  
          if(res.purchaseData.length || res.data.length){
            this.isMonth2 = true;
          }else{
            this.isMonth2 = false;
          }
  
          this.productPurchaseDetailsMonth2 = res.purchaseData;   
          
          let purchaseTotalMonth2 = 0
          this.productPurchaseDetailsMonth2.map((res1: { vatAmt: any; }) =>{  
            purchaseTotalMonth2 = purchaseTotalMonth2 + Number(res1.vatAmt)
          }) 
          this.purchaseTotalMonth2 = purchaseTotalMonth2
           
          this.productWiseMeterSalesMonth2 = res.data; 
    
          this.vatSalesDetailsMonth2.length = 0;
          let salesTotalMonth2 = 0
          this.productWiseMeterSalesMonth2.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
              this.productPurchaseDetailsMonth2.map((res2: { productId: any; vatPercent: any; }) => {
                const dataJson = {
                  productName: '',
                  basicAmount: 0,
                  vat: 0,
                  vatAmount: 0, 
                  totalAmount: 0, 
    
                  };
                if(res1.productId == res2.productId){
                  dataJson.productName = res1.productName;
                  dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                  dataJson.vat = Number(res2.vatPercent);
                  dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                  dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
    
                  salesTotalMonth2 = salesTotalMonth2 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
    
                  this.vatSalesDetailsMonth2.push(dataJson); 
                } 
              
              })
            })
    
            this.salesTotalMonth2 = salesTotalMonth2
          
          this.spinner.hide()
    

          this.month3 = 'Jun'
          this.yearMonth3 = moment(new Date()).subtract(8,'month').format("YYYY")
        this.spinner.show()
      let data =  {
          dealerId: this.fuelDealerId,
          startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(8,'month').format("MM")+'-'+"01",
          endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(8,'month').format("MM")+'-'+"31",
          month: moment(new Date()).subtract(8,'month').format("MMM"),
          year: moment(new Date()).subtract(8,'month').format("YYYY"),
      };
      this.post.getFinancialYearWiseVATBookPOST(data)
      .subscribe((res) => {
          if (res.status == 'OK') {
            this.isViewPDF = true;
    
            if(res.purchaseData.length || res.data.length){
              this.isMonth3 = true;
            }else{
              this.isMonth3 = false;
            }
    
            this.productPurchaseDetailsMonth3 = res.purchaseData;   
            
            let purchaseTotalMonth3 = 0
            this.productPurchaseDetailsMonth3.map((res1: { vatAmt: any; }) =>{  
              purchaseTotalMonth3 = purchaseTotalMonth3 + Number(res1.vatAmt)
            }) 
            this.purchaseTotalMonth3 = purchaseTotalMonth3
             
            this.productWiseMeterSalesMonth3 = res.data; 
      
            this.vatSalesDetailsMonth3.length = 0;
            let salesTotalMonth3 = 0
            this.productWiseMeterSalesMonth3.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                this.productPurchaseDetailsMonth3.map((res2: { productId: any; vatPercent: any; }) => {
                  const dataJson = {
                    productName: '',
                    basicAmount: 0,
                    vat: 0,
                    vatAmount: 0, 
                    totalAmount: 0, 
      
                    };
                  if(res1.productId == res2.productId){
                    dataJson.productName = res1.productName;
                    dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                    dataJson.vat = Number(res2.vatPercent);
                    dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                    dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
      
                    salesTotalMonth3 = salesTotalMonth3 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
      
                    this.vatSalesDetailsMonth3.push(dataJson); 
                  } 
                
                })
              })
      
              this.salesTotalMonth3 = salesTotalMonth3
            
            this.spinner.hide()
      


            this.month4 = 'Jul'
            this.yearMonth4 = moment(new Date()).subtract(7,'month').format("YYYY")
          this.spinner.show()
      let data =  {
            dealerId: this.fuelDealerId,
            startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(7,'month').format("MM")+'-'+"01",
            endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(7,'month').format("MM")+'-'+"31",
            month: moment(new Date()).subtract(7,'month').format("MMM"),
            year: moment(new Date()).subtract(7,'month').format("YYYY"),
        };
        this.post.getFinancialYearWiseVATBookPOST(data)
        .subscribe((res) => {
            if (res.status == 'OK') {
              this.isViewPDF = true;
      
              if(res.purchaseData.length || res.data.length){
                this.isMonth4 = true;
              }else{
                this.isMonth4 = false;
              }
      
              this.productPurchaseDetailsMonth4 = res.purchaseData;   
              
              let purchaseTotalMonth4 = 0
              this.productPurchaseDetailsMonth4.map((res1: { vatAmt: any; }) =>{  
                purchaseTotalMonth4 = purchaseTotalMonth4 + Number(res1.vatAmt)
              }) 
              this.purchaseTotalMonth4 = purchaseTotalMonth4
               
              this.productWiseMeterSalesMonth4 = res.data; 
        
              this.vatSalesDetailsMonth4.length = 0;
              let salesTotalMonth4 = 0
              this.productWiseMeterSalesMonth4.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                  this.productPurchaseDetailsMonth4.map((res2: { productId: any; vatPercent: any; }) => {
                    const dataJson = {
                      productName: '',
                      basicAmount: 0,
                      vat: 0,
                      vatAmount: 0, 
                      totalAmount: 0, 
        
                      };
                    if(res1.productId == res2.productId){
                      dataJson.productName = res1.productName;
                      dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                      dataJson.vat = Number(res2.vatPercent);
                      dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                      dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
        
                      salesTotalMonth4 = salesTotalMonth4 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
        
                      this.vatSalesDetailsMonth4.push(dataJson); 
                    } 
                  
                  })
                })
        
                this.salesTotalMonth4 = salesTotalMonth4
              
              this.spinner.hide()
        


              
      this.month5 = 'Aug'
      this.yearMonth5 = moment(new Date()).subtract(6,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(6,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(6,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(6,'month').format("MMM"),
      year: moment(new Date()).subtract(6,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth5 = true;
        }else{
          this.isMonth5 = false;
        }

        this.productPurchaseDetailsMonth5 = res.purchaseData;   
        
        let purchaseTotalMonth5 = 0
        this.productPurchaseDetailsMonth5.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth5 = purchaseTotalMonth5 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth5 = purchaseTotalMonth5
         
        this.productWiseMeterSalesMonth5 = res.data; 
  
        this.vatSalesDetailsMonth5.length = 0;
        let salesTotalMonth5 = 0
        this.productWiseMeterSalesMonth5.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth5.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth5 = salesTotalMonth5 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth5.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth5 = salesTotalMonth5
        
        this.spinner.hide()



          
      this.month6 = 'Sep'
      this.yearMonth6 = moment(new Date()).subtract(5,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(5,'month').format("MMM"),
      year: moment(new Date()).subtract(5,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth6 = true;
        }else{
          this.isMonth6 = false;
        }

        this.productPurchaseDetailsMonth6 = res.purchaseData;   
        
        let purchaseTotalMonth6 = 0
        this.productPurchaseDetailsMonth6.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth6 = purchaseTotalMonth6 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth6 = purchaseTotalMonth6
         
        this.productWiseMeterSalesMonth6 = res.data; 
  
        this.vatSalesDetailsMonth6.length = 0;
        let salesTotalMonth6 = 0
        this.productWiseMeterSalesMonth6.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth6.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth6 = salesTotalMonth6 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth6.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth6 = salesTotalMonth6
        
        this.spinner.hide()
  

        
      this.month7 = 'Oct'
      this.yearMonth7 = moment(new Date()).subtract(4,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(4,'month').format("MMM"),
      year: moment(new Date()).subtract(4,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth7 = true;
        }else{
          this.isMonth7 = false;
        }

        this.productPurchaseDetailsMonth7 = res.purchaseData;   
        
        let purchaseTotalMonth7 = 0
        this.productPurchaseDetailsMonth7.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth7 = purchaseTotalMonth7 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth7 = purchaseTotalMonth7
         
        this.productWiseMeterSalesMonth7 = res.data; 
  
        this.vatSalesDetailsMonth7.length = 0;
        let salesTotalMonth7 = 0
        this.productWiseMeterSalesMonth7.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth7.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth7 = salesTotalMonth7 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth7.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth7 = salesTotalMonth7
        
        this.spinner.hide()



          
      this.month8 = 'Nov'
      this.yearMonth8 = moment(new Date()).subtract(3,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(3,'month').format("MMM"),
      year: moment(new Date()).subtract(3,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth8 = true;
        }else{
          this.isMonth8 = false;
        }

        this.productPurchaseDetailsMonth8 = res.purchaseData;   
        
        let purchaseTotalMonth8 = 0
        this.productPurchaseDetailsMonth8.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth8 = purchaseTotalMonth8 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth8 = purchaseTotalMonth8
         
        this.productWiseMeterSalesMonth8 = res.data; 
  
        this.vatSalesDetailsMonth8.length = 0;
        let salesTotalMonth8 = 0
        this.productWiseMeterSalesMonth8.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth8.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth8 = salesTotalMonth8 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth8.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth8 = salesTotalMonth8
        
        this.spinner.hide()




        
      this.month9 = 'Dec'
      this.yearMonth9 = moment(new Date()).subtract(2,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(2,'month').format("MMM"),
      year: moment(new Date()).subtract(2,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth9 = true;
        }else{
          this.isMonth9 = false;
        }

        this.productPurchaseDetailsMonth9 = res.purchaseData;   
        
        let purchaseTotalMonth9 = 0
        this.productPurchaseDetailsMonth9.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth9 = purchaseTotalMonth9 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth9 = purchaseTotalMonth9
         
        this.productWiseMeterSalesMonth9 = res.data; 
  
        this.vatSalesDetailsMonth9.length = 0;
        let salesTotalMonth9 = 0
        this.productWiseMeterSalesMonth9.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth9.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth9 = salesTotalMonth9 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth9.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth9 = salesTotalMonth9
        
        this.spinner.hide()
  


          
      this.month10 = 'Jan'
      this.yearMonth10 = moment(new Date()).subtract(1,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(1,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth10 = true;
        }else{
          this.isMonth10 = false;
        }

        this.productPurchaseDetailsMonth10 = res.purchaseData;   
        
        let purchaseTotalMonth10 = 0
        this.productPurchaseDetailsMonth10.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth10 = purchaseTotalMonth10 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth10 = purchaseTotalMonth10
         
        this.productWiseMeterSalesMonth10 = res.data; 
  
        this.vatSalesDetailsMonth10.length = 0;
        let salesTotalMonth10 = 0
        this.productWiseMeterSalesMonth10.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth10.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth10 = salesTotalMonth10 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth10.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth10 = salesTotalMonth10
        
        this.spinner.hide()



        
      this.month11 = 'Feb'
      this.yearMonth11 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"31",
      month: moment(new Date()).format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth11 = true;
        }else{
          this.isMonth11 = false;
        }

        this.productPurchaseDetailsMonth11 = res.purchaseData;   
        
        let purchaseTotalMonth11 = 0
        this.productPurchaseDetailsMonth11.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth11 = purchaseTotalMonth11 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth11 = purchaseTotalMonth11
         
        this.productWiseMeterSalesMonth11 = res.data; 
  
        this.vatSalesDetailsMonth11.length = 0;
        let salesTotalMonth11 = 0
        this.productWiseMeterSalesMonth11.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth11.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth11 = salesTotalMonth11 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth11.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth11 = salesTotalMonth11
        
        this.spinner.hide()
  
      }
  });

      }
  });

      }
  });

      }
  });

      }
  });

      }
  });

      }
  });

            }
        });
      
          }
      });
    

        }
    });
  

      }
  });

  }else{
    if(moment(new Date()).format("MM") == '03'){
      this.month1 = 'Apr'
      this.yearMonth1 = moment(new Date()).subtract(11,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(11,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(11,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(11,'month').format("MMM"),
      year: moment(new Date()).subtract(11,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth1 = true;
        }else{
          this.isMonth1 = false;
        }

        this.productPurchaseDetailsMonth1 = res.purchaseData;   
        
        let purchaseTotalMonth1 = 0
        this.productPurchaseDetailsMonth1.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth1 = purchaseTotalMonth1 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth1 = purchaseTotalMonth1
         
        this.productWiseMeterSalesMonth1 = res.data; 
  
        this.vatSalesDetailsMonth1.length = 0;
        let salesTotalMonth1 = 0
        this.productWiseMeterSalesMonth1.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth1.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth1 = salesTotalMonth1 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth1.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth1 = salesTotalMonth1
        
        this.spinner.hide()
  


        this.month2 = 'May'
        this.yearMonth2 = moment(new Date()).subtract(10,'month').format("YYYY")
      this.spinner.show()
      let data =  {
        dealerId: this.fuelDealerId,
        startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(10,'month').format("MM")+'-'+"01",
        endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(10,'month').format("MM")+'-'+"31",
        month: moment(new Date()).subtract(10,'month').format("MMM"),
        year: moment(new Date()).subtract(10,'month').format("YYYY"),
    };
    this.post.getFinancialYearWiseVATBookPOST(data)
    .subscribe((res) => {
        if (res.status == 'OK') {
          this.isViewPDF = true;
  
          if(res.purchaseData.length || res.data.length){
            this.isMonth2 = true;
          }else{
            this.isMonth2 = false;
          }
  
          this.productPurchaseDetailsMonth2 = res.purchaseData;   
          
          let purchaseTotalMonth2 = 0
          this.productPurchaseDetailsMonth2.map((res1: { vatAmt: any; }) =>{  
            purchaseTotalMonth2 = purchaseTotalMonth2 + Number(res1.vatAmt)
          }) 
          this.purchaseTotalMonth2 = purchaseTotalMonth2
           
          this.productWiseMeterSalesMonth2 = res.data; 
    
          this.vatSalesDetailsMonth2.length = 0;
          let salesTotalMonth2 = 0
          this.productWiseMeterSalesMonth2.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
              this.productPurchaseDetailsMonth2.map((res2: { productId: any; vatPercent: any; }) => {
                const dataJson = {
                  productName: '',
                  basicAmount: 0,
                  vat: 0,
                  vatAmount: 0, 
                  totalAmount: 0, 
    
                  };
                if(res1.productId == res2.productId){
                  dataJson.productName = res1.productName;
                  dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                  dataJson.vat = Number(res2.vatPercent);
                  dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                  dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
    
                  salesTotalMonth2 = salesTotalMonth2 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
    
                  this.vatSalesDetailsMonth2.push(dataJson); 
                } 
              
              })
            })
    
            this.salesTotalMonth2 = salesTotalMonth2
          
          this.spinner.hide()
    

          this.month3 = 'Jun'
          this.yearMonth3 = moment(new Date()).subtract(9,'month').format("YYYY")
        this.spinner.show()
      let data =  {
          dealerId: this.fuelDealerId,
          startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(9,'month').format("MM")+'-'+"01",
          endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(9,'month').format("MM")+'-'+"31",
          month: moment(new Date()).subtract(9,'month').format("MMM"),
          year: moment(new Date()).subtract(9,'month').format("YYYY"),
      };
      this.post.getFinancialYearWiseVATBookPOST(data)
      .subscribe((res) => {
          if (res.status == 'OK') {
            this.isViewPDF = true;
    
            if(res.purchaseData.length || res.data.length){
              this.isMonth3 = true;
            }else{
              this.isMonth3 = false;
            }
    
            this.productPurchaseDetailsMonth3 = res.purchaseData;   
            
            let purchaseTotalMonth3 = 0
            this.productPurchaseDetailsMonth3.map((res1: { vatAmt: any; }) =>{  
              purchaseTotalMonth3 = purchaseTotalMonth3 + Number(res1.vatAmt)
            }) 
            this.purchaseTotalMonth3 = purchaseTotalMonth3
             
            this.productWiseMeterSalesMonth3 = res.data; 
      
            this.vatSalesDetailsMonth3.length = 0;
            let salesTotalMonth3 = 0
            this.productWiseMeterSalesMonth3.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                this.productPurchaseDetailsMonth3.map((res2: { productId: any; vatPercent: any; }) => {
                  const dataJson = {
                    productName: '',
                    basicAmount: 0,
                    vat: 0,
                    vatAmount: 0, 
                    totalAmount: 0, 
      
                    };
                  if(res1.productId == res2.productId){
                    dataJson.productName = res1.productName;
                    dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                    dataJson.vat = Number(res2.vatPercent);
                    dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                    dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
      
                    salesTotalMonth3 = salesTotalMonth3 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
      
                    this.vatSalesDetailsMonth3.push(dataJson); 
                  } 
                
                })
              })
      
              this.salesTotalMonth3 = salesTotalMonth3
            
            this.spinner.hide()
      


            this.month4 = 'Jul'
            this.yearMonth4 = moment(new Date()).subtract(9,'month').format("YYYY")
          this.spinner.show()
      let data =  {
            dealerId: this.fuelDealerId,
            startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(9,'month').format("MM")+'-'+"01",
            endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(9,'month').format("MM")+'-'+"31",
            month: moment(new Date()).subtract(9,'month').format("MMM"),
            year: moment(new Date()).subtract(9,'month').format("YYYY"),
        };
        this.post.getFinancialYearWiseVATBookPOST(data)
        .subscribe((res) => {
            if (res.status == 'OK') {
              this.isViewPDF = true;
      
              if(res.purchaseData.length || res.data.length){
                this.isMonth4 = true;
              }else{
                this.isMonth4 = false;
              }
      
              this.productPurchaseDetailsMonth4 = res.purchaseData;   
              
              let purchaseTotalMonth4 = 0
              this.productPurchaseDetailsMonth4.map((res1: { vatAmt: any; }) =>{  
                purchaseTotalMonth4 = purchaseTotalMonth4 + Number(res1.vatAmt)
              }) 
              this.purchaseTotalMonth4 = purchaseTotalMonth4
               
              this.productWiseMeterSalesMonth4 = res.data; 
        
              this.vatSalesDetailsMonth4.length = 0;
              let salesTotalMonth4 = 0
              this.productWiseMeterSalesMonth4.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
                  this.productPurchaseDetailsMonth4.map((res2: { productId: any; vatPercent: any; }) => {
                    const dataJson = {
                      productName: '',
                      basicAmount: 0,
                      vat: 0,
                      vatAmount: 0, 
                      totalAmount: 0, 
        
                      };
                    if(res1.productId == res2.productId){
                      dataJson.productName = res1.productName;
                      dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                      dataJson.vat = Number(res2.vatPercent);
                      dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                      dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
        
                      salesTotalMonth4 = salesTotalMonth4 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
        
                      this.vatSalesDetailsMonth4.push(dataJson); 
                    } 
                  
                  })
                })
        
                this.salesTotalMonth4 = salesTotalMonth4
              
              this.spinner.hide()
        


              
      this.month5 = 'Aug'
      this.yearMonth5 = moment(new Date()).subtract(7,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(7,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(7,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(7,'month').format("MMM"),
      year: moment(new Date()).subtract(7,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth5 = true;
        }else{
          this.isMonth5 = false;
        }

        this.productPurchaseDetailsMonth5 = res.purchaseData;   
        
        let purchaseTotalMonth5 = 0
        this.productPurchaseDetailsMonth5.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth5 = purchaseTotalMonth5 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth5 = purchaseTotalMonth5
         
        this.productWiseMeterSalesMonth5 = res.data; 
  
        this.vatSalesDetailsMonth5.length = 0;
        let salesTotalMonth5 = 0
        this.productWiseMeterSalesMonth5.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth5.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth5 = salesTotalMonth5 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth5.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth5 = salesTotalMonth5
        
        this.spinner.hide()



          
      this.month6 = 'Sep'
      this.yearMonth6 = moment(new Date()).subtract(6,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(6,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(6,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(6,'month').format("MMM"),
      year: moment(new Date()).subtract(6,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth6 = true;
        }else{
          this.isMonth6 = false;
        }

        this.productPurchaseDetailsMonth6 = res.purchaseData;   
        
        let purchaseTotalMonth6 = 0
        this.productPurchaseDetailsMonth6.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth6 = purchaseTotalMonth6 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth6 = purchaseTotalMonth6
         
        this.productWiseMeterSalesMonth6 = res.data; 
  
        this.vatSalesDetailsMonth6.length = 0;
        let salesTotalMonth6 = 0
        this.productWiseMeterSalesMonth6.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth6.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth6 = salesTotalMonth6 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth6.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth6 = salesTotalMonth6
        
        this.spinner.hide()
  

        
      this.month7 = 'Oct'
      this.yearMonth7 = moment(new Date()).subtract(5,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(5,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(5,'month').format("MMM"),
      year: moment(new Date()).subtract(5,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth7 = true;
        }else{
          this.isMonth7 = false;
        }

        this.productPurchaseDetailsMonth7 = res.purchaseData;   
        
        let purchaseTotalMonth7 = 0
        this.productPurchaseDetailsMonth7.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth7 = purchaseTotalMonth7 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth7 = purchaseTotalMonth7
         
        this.productWiseMeterSalesMonth7 = res.data; 
  
        this.vatSalesDetailsMonth7.length = 0;
        let salesTotalMonth7 = 0
        this.productWiseMeterSalesMonth7.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth7.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth7 = salesTotalMonth7 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth7.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth7 = salesTotalMonth7
        
        this.spinner.hide()



          
      this.month8 = 'Nov'
      this.yearMonth8 = moment(new Date()).subtract(4,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(4,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(4,'month').format("MMM"),
      year: moment(new Date()).subtract(4,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth8 = true;
        }else{
          this.isMonth8 = false;
        }

        this.productPurchaseDetailsMonth8 = res.purchaseData;   
        
        let purchaseTotalMonth8 = 0
        this.productPurchaseDetailsMonth8.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth8 = purchaseTotalMonth8 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth8 = purchaseTotalMonth8
         
        this.productWiseMeterSalesMonth8 = res.data; 
  
        this.vatSalesDetailsMonth8.length = 0;
        let salesTotalMonth8 = 0
        this.productWiseMeterSalesMonth8.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth8.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth8 = salesTotalMonth8 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth8.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth8 = salesTotalMonth8
        
        this.spinner.hide()




        
      this.month9 = 'Dec'
      this.yearMonth9 = moment(new Date()).subtract(3,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(3,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(3,'month').format("MMM"),
      year: moment(new Date()).subtract(3,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth9 = true;
        }else{
          this.isMonth9 = false;
        }

        this.productPurchaseDetailsMonth9 = res.purchaseData;   
        
        let purchaseTotalMonth9 = 0
        this.productPurchaseDetailsMonth9.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth9 = purchaseTotalMonth9 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth9 = purchaseTotalMonth9
         
        this.productWiseMeterSalesMonth9 = res.data; 
  
        this.vatSalesDetailsMonth9.length = 0;
        let salesTotalMonth9 = 0
        this.productWiseMeterSalesMonth9.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth9.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth9 = salesTotalMonth9 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth9.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth9 = salesTotalMonth9
        
        this.spinner.hide()
  


          
      this.month10 = 'Jan'
      this.yearMonth10 = moment(new Date()).subtract(2,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(2,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(2,'month').format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth10 = true;
        }else{
          this.isMonth10 = false;
        }

        this.productPurchaseDetailsMonth10 = res.purchaseData;   
        
        let purchaseTotalMonth10 = 0
        this.productPurchaseDetailsMonth10.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth10 = purchaseTotalMonth10 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth10 = purchaseTotalMonth10
         
        this.productWiseMeterSalesMonth10 = res.data; 
  
        this.vatSalesDetailsMonth10.length = 0;
        let salesTotalMonth10 = 0
        this.productWiseMeterSalesMonth10.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth10.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth10 = salesTotalMonth10 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth10.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth10 = salesTotalMonth10
        
        this.spinner.hide()



        
      this.month11 = 'Feb'
      this.yearMonth11 = moment(new Date()).subtract(1,'month').format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).subtract(1,'month').format("MM")+'-'+"31",
      month: moment(new Date()).subtract(1,'month').format("MMM"),
      year: moment(new Date()).subtract(1,'month').format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth11 = true;
        }else{
          this.isMonth11 = false;
        }

        this.productPurchaseDetailsMonth11 = res.purchaseData;   
        
        let purchaseTotalMonth11 = 0
        this.productPurchaseDetailsMonth11.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth11 = purchaseTotalMonth11 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth11 = purchaseTotalMonth11
         
        this.productWiseMeterSalesMonth11 = res.data; 
  
        this.vatSalesDetailsMonth11.length = 0;
        let salesTotalMonth11 = 0
        this.productWiseMeterSalesMonth11.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth11.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth11 = salesTotalMonth11 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth11.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth11 = salesTotalMonth11
        
        this.spinner.hide()





        
      this.month12 = 'Mar'
      this.yearMonth12 = moment(new Date()).format("YYYY")
    this.spinner.show()
      let data =  {
      dealerId: this.fuelDealerId,
      startDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"01",
      endDate: this.filterForm.value.year +'-'+ moment(this.filterForm.value.month,["MMM"]).format("MM")+'-'+"31",
      month: moment(new Date()).format("MMM"),
      year: moment(new Date()).format("YYYY"),
  };
  this.post.getFinancialYearWiseVATBookPOST(data)
  .subscribe((res) => {
      if (res.status == 'OK') {
        this.isViewPDF = true;

        if(res.purchaseData.length || res.data.length){
          this.isMonth12 = true;
        }else{
          this.isMonth12 = false;
        }

        this.productPurchaseDetailsMonth12 = res.purchaseData;   
        
        let purchaseTotalMonth12 = 0
        this.productPurchaseDetailsMonth12.map((res1: { vatAmt: any; }) =>{  
          purchaseTotalMonth12 = purchaseTotalMonth12 + Number(res1.vatAmt)
        }) 
        this.purchaseTotalMonth12 = purchaseTotalMonth12
         
        this.productWiseMeterSalesMonth12 = res.data; 
  
        this.vatSalesDetailsMonth12.length = 0;
        let salesTotalMonth12 = 0
        this.productWiseMeterSalesMonth12.map((res1: { productId: any; productName: string; totalMeterSalesAmt: any; }) => {
            this.productPurchaseDetailsMonth12.map((res2: { productId: any; vatPercent: any; }) => {
              const dataJson = {
                productName: '',
                basicAmount: 0,
                vat: 0,
                vatAmount: 0, 
                totalAmount: 0, 
  
                };
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);
  
                salesTotalMonth12 = salesTotalMonth12 + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 
  
                this.vatSalesDetailsMonth12.push(dataJson); 
              } 
            
            })
          })
  
          this.salesTotalMonth12 = salesTotalMonth12
        
        this.spinner.hide()
  
      }
  });
}
  });
  
      }
  });
  
      }
  });
  
      }
  });

  
      }
  });
  
      }
  });

      }
  });

            }
        });
          }
      });
        }
    });
      }
  });
  }else{
  }
  }
  }
  }
  }
  }
  }
  }
  }
  }
  }
  }
  this.spinner.hide()
}else{
  this.spinner.hide()
}

}

  /*name of the excel-file which will be downloaded. */ 
  fileName= 'yearwiseVATPayable.xlsx'; 

  
  exportexcel(): void 
    {
       /* table id is passed over here */   
       let element = document.getElementById('excel-table'); 
       const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

       /* save to file */
       XLSX.writeFile(wb, this.fileName);
			
    }
    
viewYearTables(){
  this.isProductPurchase = false;
  this.isMonthSale = false;
  this.isYear = true;
  this.oilCompanyDetails.length = 0
  this.productPurchaseDetails.length = 0
  this.vatSalesDetails.length = 0;
  this.productWiseMeterSales.length = 0 
  this.purchaseTotal = 0
  this.salesTotal = 0
}

getAllProductPurchaseForYear(month: moment.MomentInput,year: string) {  
  this.oilCompanyDetails.length = 0 

  let data = {
    dealerId: this.fuelDealerId,
    startDate:  year +'-'+ moment(month,["MMM"]).format("MM")+'-'+"01",
    endDate:  year +'-'+ moment(month,["MMM"]).format("MM")+'-'+"31",
   
  }
  this.post.getAllProductPurchasePOST(data)
    .subscribe(res => {
      if (res.status == 'OK') {
        if(res.data1.length){
          this.isProductPurchase = true;  
          this.isMonthSale = false;
          this.isYear = false; 
          this.oilCompanyDetailsForYear = res.data1;  
 
        }else{
          this.isProductPurchase = false;
          this.isMonthSale = false;
          this.isYear = true; 
          alert("Data not found..!")
        }

      }
    })
}

getMonthSales(month: moment.MomentInput,year: string) { 
  this.productPurchaseDetails.length = 0
  this.vatSalesDetails.length = 0;
  this.productWiseMeterSales.length = 0
  this.oilCompanyDetails.length = 0
  this.purchaseTotal = 0
  this.salesTotal = 0

  let data = {
    dealerId: this.fuelDealerId,
    startDate: year +'-'+ moment(month,["MMM"]).format("MM")+'-'+"01",
    endDate: year +'-'+ moment(month,["MMM"]).format("MM")+'-'+"31",
   
  }
  this.post.getAllProductPurchasePOST(data)
    .subscribe(res => {
      if (res.status == 'OK') {
        if(res.data.length){
          this.isProductPurchase = false;
          this.isMonthSale = true;
          this.isYear = false;  
          this.productPurchaseDetails = res.data;
          this.oilCompanyDetails = res.data1;          
          
          let purchaseTotal = 0
          this.productPurchaseDetails.map((res1: { vatAmt: any; }) =>{  
            purchaseTotal = purchaseTotal + Number(res1.vatAmt)
          })
          // console.log("purchaseTotal ",purchaseTotal)
          this.purchaseTotal = purchaseTotal

          this.getProductWiseMonthSales(month,year);
        }else{
          this.isProductPurchase = false;
          this.isMonthSale = false;
          this.isYear = true;  
          alert("Data not found..!")
        }

      }
    })
}

getProductWiseMonthSales(month: moment.MomentInput,year: string) {
  this.productWiseMeterSales.length = 0
  this.salesTotal = 0
  this.spinner.show()
let data = {
  dealerId: this.fuelDealerId, 
  month: month,
  year: year,
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
              if(res1.productId == res2.productId){
                dataJson.productName = res1.productName;
                dataJson.basicAmount = Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1);
                dataJson.vat = Number(res2.vatPercent);
                dataJson.vatAmount = Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100)   ;
                dataJson.totalAmount = Number(res1.totalMeterSalesAmt);

                salesTotal = salesTotal + Number(((Number(res1.totalMeterSalesAmt) / ((Number(res2.vatPercent) / 100) + 1)))*(Number(res2.vatPercent)) / 100) 

                this.vatSalesDetails.push(dataJson);
                // console.log('vatSalesDetails',this.vatSalesDetails,(Number(res2.vatPercent) / 100) + 1) 
              } 
            
            })
          })

          this.salesTotal = salesTotal
        
        this.spinner.hide()
    }else{
      this.spinner.hide()
    }
});
}

downloadReport() {
  const element = document.getElementById('sanjay')
  if (element) {
    htmlToImage.toJpeg(element, { backgroundColor: 'white' })
      .then(function (dataUrl: string) {
        var link = document.createElement('a');
        link.download = 'report.png';
        link.href = dataUrl;
        link.click();
      });
  }
}
}