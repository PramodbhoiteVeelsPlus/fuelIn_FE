import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FeedsService } from '../feeds.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';


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
  selector: 'app-feeds-widget9',
  templateUrl: './feeds-widget9.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FeedsWidget9Component implements OnInit {
  profitReportData: any = [];
  month: any;
  year: any;
  dealerLoginVPId: any;
  accessGroupId: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  fuelPurchaseData: any = [];
  lubePurchaseData: any = [];
  fuelSalesData: any = [];
  lubeSalesData: any = [];
  expenseData: any = [];
  dealerCompanyName: any;
  dealerCity: any;
  createdDate: any;
  profitReportFuelPurchase: any;
  profitReportLubePurchase: any;
  profitReportFuelSales: any;
  profitReportLubeSales: any;
  profitReportAdvAmt: any;
  profitReportExpenseAmt: any;
  cashBillLubeData: any = [];
  variationData: any = [];
  totalVariation: any = 0;
  totalVariationAmt: any = 0;
  totalVariationAmt1: any = 0;
  monthlyVariationData: any = [];
  totalVariationQuantity: any;
  totalMonthVariationAmt: any;
  monthVariationData: any = [];

  constructor(private post: FeedsService,
    private spinner: NgxSpinnerService,
    public router: Router,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {   
    var element = JSON.parse(localStorage.getItem('element')|| '');
    this.accessGroupId = element.accessGroupId;  
    if(this.post.profitReportData){
      this.profitReportData = this.post.profitReportData
      this.month = this.profitReportData.profitReportMonth
      this.year = this.profitReportData.profitReportYear
      this.createdDate = this.profitReportData.profitReportCreatedDate
      this.profitReportFuelPurchase = this.profitReportData.profitReportFuelPurchase
      this.profitReportLubePurchase = this.profitReportData.profitReportLubePurchase
      this.profitReportFuelSales = this.profitReportData.profitReportFuelSales
      this.profitReportLubeSales = this.profitReportData.profitReportLubeSales
      this.profitReportAdvAmt = this.profitReportData.profitReportAdvAmt
      this.profitReportExpenseAmt = this.profitReportData.profitReportExpenseAmt
      this.fuelDealerId = localStorage.getItem('dealerId');
      if(this.accessGroupId == '12'){
        var dealerData = JSON.parse(localStorage.getItem('dealerData') || '');
        this.dealerCompanyName = dealerData.companyName;
        this.dealerCity = dealerData.city;
      } 
      if(this.accessGroupId == '14'){
        var managerData = JSON.parse(localStorage.getItem('managerData') || '');
        this.dealerCompanyName = managerData.companyName;
        this.dealerCity = managerData.city;
      } 
  
      this.cd.detectChanges();
      this.getAllProfitReport(this.fuelDealerId);
    }else{
      this.router.navigate(['/report/profitReport']);
    }
  }

  //getAllProfitReport
  getAllProfitReport(fuelDealerId: any){
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId,
      year: this.year,
      month: this.month,
    }
    this.post.getProfitReportInDetailPOST(data)
    .subscribe(res =>{
      if(res.status == "OK"){
        this.fuelPurchaseData = res.fuelPurchaseData;
        this.lubePurchaseData = res.lubePurchaseData;
        this.fuelSalesData = res.fuelSalesData;
        this.lubeSalesData = res.lubeSalesData;
        this.cashBillLubeData = res.cashBillLubeData;
        this.expenseData = res.expenseData;
        this.cd.detectChanges();
        this.spinner.hide()
      }else{
        this.router.navigate(['/report/profitReport']);
        this.spinner.hide()
      }
    })
    this.post.getDSRVariationByDatePOST(data)
    .subscribe(res =>{
      if(res.status == "OK"){
        if(res.data.length){
          this.variationData = res.data;
          this.totalVariation = res.data1[0].totalVariation;
          if(Number(res.data1[0].totalVariationAmt)< 0){
            this.totalVariationAmt = res.data1[0].totalVariationAmt;
          }
          this.totalVariationAmt1 = res.data1[0].totalVariationAmt;
          this.spinner.hide()
          this.cd.detectChanges();
        }
      }else{
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })

    this.post.getMonthlyVaritionByMonthPOST(data)
    .subscribe(res =>{
      if(res.status == "OK"){          
        this.monthlyVariationData = res.variationData;        
        if(res.variationTotalData){
        this.totalVariationQuantity = res.variationTotalData[0].totalQuantity;
        this.totalMonthVariationAmt = res.variationTotalData[0].totalAmount;
        } else {
          this.totalVariationQuantity = 0;
        this.totalMonthVariationAmt = 0;
        } 
        this.cd.detectChanges();
        this.spinner.hide()
      }else{
        this.spinner.hide()
      }
    })
  }


}