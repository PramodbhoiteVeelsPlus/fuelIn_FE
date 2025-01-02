import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FeedsService } from '../feeds.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import * as htmlToImage from 'html-to-image';


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
  selector: 'app-feeds-widget10',
  templateUrl: './feeds-widget10.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FeedsWidget10Component implements OnInit {
  dealerLoginVPId: any;
  accessGroupId: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  dealerCompanyName: any;
  dealerCity: any;
  selectedDate: string;
  netTotalForPrevious: number;
  creditSalesForPrevious: number;
  totalLubeCrAmountPrevious: number;
  digitalTotalSalesForPrevious: number;
  totalExpenseAmtForPrevious: number;
  shiftExpenseAmtForPrevious: number;
  shortAmtTotalForPrevious: number;
  totalCrBankForPrevious: number;
  openingBlcForPrevious: number;
  totalAmountTallyForPrevious: number;
  totalLubeAmountPrevious: number;
  totalCrAmtForPrevious: number;
  openingBlc: number;
  netTotal: number;
  creditSales: number;
  totalLubeCrAmount: number;
  digitalTotalSales: number;
  totalExpenseAmt: number;
  shiftExpenseAmt: number;
  totalCrBank: number;
  totalAmountTally: number;
  totalLubeAmount: number;
  totalCrAmt: number;
  shortAmtTotal: number;
  totalCrCustAmt: number;
  totalCrCustQty: number;
  reportDate: string;
  shiftNzDetails: any = [];
  totalNzDetails: any = [];
  meterSalesDetails: any = [];
  creditSalesProductwise: any = [];
  totalMeterSalesDetails: number;
  productWiseCreditData: any = [];
  totalCreditSalesAmount: number;
  totalCreditWOCNGQuantity: number;
  totalCreditCNGQuantity: number;
  cashLubeDetails: any = [];
  crLubeDetails: any;
  cashLubeAmt: any = 0;
  crLubeAmt: any;
  creditDetails: any = [];
  creditLubeDetails: any = [];
  cashLubeDetails1: any;
  tallySalesDetails: any = [];
  totalSalesDetails: any = [];
  cashSales: number;
  digitalSales: number;
  totalExpenseCASHAmt: number;
  totalExpenseOtherAmt: number;
  bankoverallReportData: any = [];
  openingAmtDate: string;
  openingAmt: number;
  totalCrAmtCash: number;
  totalCrAmtOther: number;
  closingBlcForPrevious: number;
  closingBlc: number;
  dealerCorporateId: any;
  totalCrAmtOtherForPrevious: number;
  totalCrAmtCashForPrevious: number;
  cashSalesForPrevious: number;
  digitalSalesForPrevious: number;
  totalExpenseCASHAmtForPrevious: number;
  totalExpenseOtherAmtForPrevious: number;
  totalLubeCashAmountPrevious: number;
  totalVariationPrevious: number;
  totalVariationPrevAmt: number;
  variationPreviousData: any = [];
  totalVariation: number;
  overallReportDataData: any = [];
  lubeWiseDetails: any = [];
  lubeWiseCashDetails: any = [];
  variationData: any = [];
  totalVariationAmt: number;
  totalLubeCashAmount: number;
  totalLubeCashAmt: any;
  totalLubeCrAmt: any;
  digitalDetails: any = [];
  cashHandOverAmount: number;
  creditPaymentDetails: any = [];

  constructor(private post: FeedsService,
    private spinner: NgxSpinnerService,
    public router: Router,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element')|| '');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    this.accessGroupId = element.accessGroupId;  
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

    this.selectedDate = moment(new Date()).format("DD-MM-YYYY");
    this.getOpeningBalance(this.fuelDealerId);
    this.getDigitalTotalByDate(this.dealerCorporateId);
    this.getFuelCreditPaymentByDate(this.dealerCorporateId);
    this.getNzWise(this.fuelDealerId);
    this.getSalesDetailsProductWise(this.fuelDealerId);
    this.getFuelCreditByDate(this.fuelDealerId);
    this.getoverallReportData(this.fuelDealerId);
    this.getPreviousVariation(this.fuelDealerId);
    this.cd.detectChanges();
  }

  onDateSelection() {
    this.netTotalForPrevious = 0
    this.creditSalesForPrevious = 0
    this.totalLubeCrAmountPrevious = 0
    this.digitalTotalSalesForPrevious = 0
    this.totalExpenseAmtForPrevious = 0
    this.shiftExpenseAmtForPrevious = 0
    this.shortAmtTotalForPrevious = 0
    this.totalCrBankForPrevious = 0
    this.openingBlcForPrevious = 0
    this.totalAmountTallyForPrevious = 0
    this.totalLubeAmountPrevious = 0
    this.totalCrAmtForPrevious = 0
    this.openingBlc = 0
    this.netTotal = 0
    this.creditSales = 0
    this.totalLubeCrAmount = 0
    this.digitalTotalSales = 0
    this.totalExpenseAmt = 0
    this.shiftExpenseAmt = 0
    this.totalCrBank = 0
    this.openingBlc = 0
    this.totalAmountTally = 0
    this.totalLubeAmount = 0
    this.totalCrAmt = 0
    this.shortAmtTotal = 0
    this.shortAmtTotalForPrevious = 0
    this.totalCrCustAmt = 0
    this.totalCrCustQty = 0
    this.reportDate = moment(this.selectedDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
    this.getOpeningBalance(this.fuelDealerId);
    this.getDigitalTotalByDate(this.dealerCorporateId);
    this.getFuelCreditPaymentByDate(this.dealerCorporateId);
    this.getNzWise(this.fuelDealerId);
    this.getSalesDetailsProductWise(this.fuelDealerId);
    this.getFuelCreditByDate(this.fuelDealerId);
    this.getoverallReportData(this.fuelDealerId);
    this.getPreviousVariation(this.fuelDealerId);
    this.cd.detectChanges();
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

  getNzWise(fuelDealerId: any) {
    this.spinner.show()
    this.shiftNzDetails = []
    this.totalNzDetails = []
    const data = {
      date: moment(this.reportDate).format('YYYY-MM-DD'),
      fuelDealerId: fuelDealerId,
    };
    this.post.getProductWiseDSRPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.shiftNzDetails = res.data
          this.totalNzDetails = res.data1
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  getSalesDetailsProductWise(fuelDealerId: any) {
    this.spinner.show()
    this.meterSalesDetails = [];
    this.creditSalesProductwise = []
    this.totalMeterSalesDetails = 0
    this.productWiseCreditData = []
    this.totalCreditSalesAmount = 0
    this.totalCreditWOCNGQuantity = 0
    this.totalCreditCNGQuantity = 0

    let data = {
      fuelDealerId: fuelDealerId,
      date: moment(this.reportDate).format('YYYY-MM-DD'),
    };
    this.post.getMETERSALESTotalDSRPOST(data)
      .subscribe((res) => {
        if (res.status == "OK") {
          this.meterSalesDetails = res.data;
          this.totalMeterSalesDetails = res.data1[0].meterSaleAmount;
          this.creditSalesProductwise = res.data2
          // console.log("len", this.meterSalesDetails.length)

          this.totalCreditSalesAmount = Number(res.data3[0].totalCreditSales) + Number(res.data4[0].totalCreditSales)
          this.totalCreditWOCNGQuantity = Number(res.data3[0].totalCreditQuantity)
          this.totalCreditCNGQuantity = Number(res.data4[0].totalCreditQuantity)
          this.cashLubeDetails = res.data5
          this.crLubeDetails = res.data6
          if(res.data5.length){
            this.cashLubeAmt = res.data5[0].totalCashAmount;
          } else {
            this.cashLubeAmt = 0;
          }

          if(res.data6.length){
            this.crLubeAmt = res.data6[0].totalCreditAmount;
          } else {
            this.crLubeAmt = 0;
          }

          this.meterSalesDetails.map((shift: { fuelProductId: string; productName: string; meterSaleAmount: number; meterSaleQuantity: number; totalPumpTesting: number; }) => {
            const shiftDataJSON = {
              fuelProductId: '',
              productName: '',
              meterSaleQuantity: 0,
              meterSaleAmount: 0,
              totalCreditSales: 0,
              totalCreditQuantity: 0,
              creditSaleShare: 0,
              creditQuantityShare: 0,
              totalPumpTesting: 0,
            };

            shiftDataJSON.fuelProductId = shift.fuelProductId;
            shiftDataJSON.productName = shift.productName;
            shiftDataJSON.meterSaleAmount = shift.meterSaleAmount;
            shiftDataJSON.meterSaleQuantity = shift.meterSaleQuantity;
            shiftDataJSON.totalPumpTesting = shift.totalPumpTesting;

            this.creditSalesProductwise.map((credit: { fuelProdId: any; totalCreditQuantity: number; totalCreditSales: number; }) => {
              if (credit.fuelProdId == shift.fuelProductId) {
                shiftDataJSON.totalCreditQuantity = credit.totalCreditQuantity;
                shiftDataJSON.totalCreditSales = credit.totalCreditSales;
                shiftDataJSON.creditQuantityShare = Number(credit.totalCreditQuantity) / Number(shift.meterSaleQuantity);
                shiftDataJSON.creditSaleShare = Number(credit.totalCreditSales) / Number(shift.meterSaleAmount);
              }
            })
            this.productWiseCreditData.push(shiftDataJSON);
          })
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  getFuelCreditByDate(fuelDealerId: any) {
    this.spinner.show()
    this.creditDetails = []
    this.creditLubeDetails = []
    const data = {
      date: moment(this.reportDate).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
    };
    this.post.getFuelCreditByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.creditDetails = res.data2;
          this.creditLubeDetails = res.data3;
          this.cashLubeDetails1 = res.res9;
          this.creditDetails.map((result: { actualCreditQuantity: any; creditAmount: any; }) => {
            // this.totalCrCustQty = this.totalCrCustQty + Number(result.actualCreditQuantity)
            // this.totalCrCustAmt = this.totalCrCustAmt + Number(result.creditAmount)

            if (this.creditLubeDetails.length) {
              this.creditLubeDetails.map((res: { quantityInPieces: any; creditAmount: any; }) => {
                this.totalCrCustQty = this.totalCrCustQty + Number(result.actualCreditQuantity) + Number(res.quantityInPieces)
                this.totalCrCustAmt = this.totalCrCustAmt + Number(result.creditAmount) + Number(res.creditAmount)
              })
            } else {

              this.totalCrCustQty = this.totalCrCustQty + Number(result.actualCreditQuantity)
              this.totalCrCustAmt = this.totalCrCustAmt + Number(result.creditAmount)
            }

          })
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  getTallyDetails(fuelDealerId: any) {
    this.spinner.show()
    this.tallySalesDetails = [];
    this.totalSalesDetails = []
    this.cashSales = 0
    this.digitalSales = 0
    this.creditSales = 0
    this.totalAmountTally = 0
    this.shiftExpenseAmt = 0
    this.shortAmtTotal = 0
    const data = {
      date: moment(this.reportDate).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
    };
    this.post.getShiftVStallyByDatePOST(data)
      .subscribe((res: { status: string; data: any[]; data1: any[]; }) => {
        if (res.status == 'OK') {

          this.tallySalesDetails = res.data;
          this.totalSalesDetails = res.data1;
          if (res.data1[0].totalAmountTally) {
            this.totalAmountTally = res.data1[0].totalAmountTally;
          }
          if (res.data1[0].cashTallyAmt) {
            this.cashSales = res.data1[0].cashTallyAmt
          }
          if (res.data1[0].creditTally) {
            this.creditSales = res.data1[0].creditTally
          }
          if (res.data1[0].paytmTotal) {
            this.digitalSales = res.data1[0].paytmTotal
          }
          if (res.data1[0].shortAmt) {
            this.shortAmtTotal = res.data1[0].shortAmt
          }
          if (res.data1[0].expenseAmt) {
            this.shiftExpenseAmt = res.data1[0].expenseAmt
          }
          this.getExpenseDetails(this.fuelDealerId);
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  getExpenseDetails(fuelDealerId: any) {
    this.spinner.show()
    this.totalExpenseCASHAmt = 0;
    this.totalExpenseOtherAmt = 0;
    this.totalExpenseAmt = 0;
    let data = {
      dealerId: fuelDealerId,
      startDate: moment(this.reportDate).format('YYYY-MM-DD'),
      endDate: moment(this.reportDate).format('YYYY-MM-DD'),
    }
    this.post.getExpenseAmtDetailsPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data[0].totalExpenseCASHAmt) {
            this.totalExpenseCASHAmt = res.data[0].totalExpenseCASHAmt;
          }
          if (res.data1[0].totalExpenseOtherAmt) {
            this.totalExpenseOtherAmt = res.data1[0].totalExpenseOtherAmt;
          }
          if (res.data2[0].totalExpenseAmt) {
            this.totalExpenseAmt = res.data2[0].totalExpenseAmt;
          }

          this.getBankACwiseDetails(this.fuelDealerId);
          this.spinner.hide()
          this.cd.detectChanges();

        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  getBankACwiseDetails(fuelDealerId: any) {
    this.spinner.show()
    this.totalCrBank = 0;
    this.bankoverallReportData = []
    let data = {
      dealerId: fuelDealerId,
      startDate: moment(this.reportDate).format('YYYY-MM-DD'),
      endDate: moment(this.reportDate).format('YYYY-MM-DD'),
    }
    this.post.getBankACwiseDetailsPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data1[0].bankCrAmt) {
            this.totalCrBank = res.data1[0].bankCrAmt;
          }
          this.bankoverallReportData = res.data;
          if (this.openingAmtDate < moment(this.selectedDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")) {
            this.netAmtForPrevious();
          } else {
            this.netAmt();
          }

          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  getOpeningBalance(fuelDealerId: any) {
    this.openingAmtDate = '';
    this.openingAmt = 0;
    this.spinner.show()
    let data = {
      overallReportDataFuelDealerId: fuelDealerId,
    }
    this.post.getOpeningBalancePOST(data).subscribe(res => {
      if (res.status == 'OK' && res.data.length) {
        this.openingAmt = res.data[0].overallReportDataAmount;
        this.openingAmtDate = res.data[0].overallReportDataDate;
        if (this.openingAmtDate == moment(this.selectedDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")) {
          // console.log("Case 1 ==")
          this.openingBlc = this.openingAmt;
          this.getFuelCreditPaymentDetails(this.dealerCorporateId);
        } else {
          if (this.openingAmtDate < moment(this.selectedDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")) {
            // console.log("Case 2 OpeningDate < SelectedDate")
            this.getFuelCreditPaymentDetailsForPrevious(this.dealerCorporateId);
            this.getFuelCreditPaymentDetails(this.dealerCorporateId);
          } else {
            // console.log("Case 3 OpeningDate > SelectedDate")
            this.getFuelCreditPaymentDetails(this.dealerCorporateId);
          }
        }
        this.spinner.hide();
        this.cd.detectChanges();
      } else {
        this.openingAmtDate = '';
        this.openingAmt = 0;
        this.spinner.hide();
        this.cd.detectChanges();
      }
    })
  }

  netAmtForPrevious() {
    this.netTotalForPrevious = 0
    this.netTotalForPrevious = Number(this.openingAmt) + Number(this.totalAmountTallyForPrevious) + Number(this.totalLubeAmountPrevious) + Number(this.totalCrAmtForPrevious)
    // this.netTotalForPrevious = Number(this.openingAmt) + Number(this.totalAmountTallyForPrevious) + Number(this.totalLubeAmountPrevious) + Number(this.totalCrAmtForPrevious) + Number(this.totalCrBankForPrevious)
    // console.log("netPrv ",this.openingAmt ,'+', this.totalAmountTallyForPrevious ,'+', this.totalLubeAmountPrevious ,'+', this.totalCrAmtForPrevious, this.totalCrBankForPrevious)
    this.clsAmtForPrevious()
  }

  getFuelCreditPaymentDetails(dealerCorporateId: any) {
    this.spinner.show()
    this.totalCrAmtCash = 0
    this.totalCrAmtOther = 0
    this.totalCrAmt = 0
    const data = {
      startDate: moment(this.reportDate).format('YYYY-MM-DD'),
      endDate: moment(this.reportDate).format('YYYY-MM-DD'),
      corporateId: dealerCorporateId,
    };
    this.post.getFuelCreditPaymentDetailsPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data[0].totalCrAmtCash) {
            this.totalCrAmtCash = res.data[0].totalCrAmtCash;
          }
          if (res.data1[0].totalCrAmtOther) {
            this.totalCrAmtOther = res.data1[0].totalCrAmtOther;
          }
          if (res.data2[0].totalCrAmt) {
            this.totalCrAmt = res.data2[0].totalCrAmt;
          }
          this.getTallyDetails(this.fuelDealerId);
          this.spinner.hide()
          this.cd.detectChanges();

        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }


  getoverallReportData(fuelDealerId: any) {
    this.spinner.show()
    this.overallReportDataData = []
    this.lubeWiseDetails = []
    this.lubeWiseCashDetails = []
    this.variationData = []
    this.totalVariationAmt = 0;
    this.totalVariation = 0;
    this.totalLubeCashAmount = 0
    this.totalLubeCrAmount = 0
    this.totalLubeAmount = 0

    let data = {
      accountingFuelDealerId: fuelDealerId,
      startDate: moment(this.reportDate).format('YYYY-MM-DD'),
      endDate: moment(this.reportDate).format('YYYY-MM-DD'),
    }
    this.post.getExpenseDetailsPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.overallReportDataData = res.data;
        }
        if (res.status == 'OK') {
          if (res.data8[0].totalLubeCashAmt) {
            this.totalLubeCashAmount = res.data8[0].totalLubeCashAmt;
          }
          if (res.data7[0].totalLubeCreditAmt) {
            this.totalLubeCrAmount = res.data7[0].totalLubeCreditAmt;
          }

          if (res.data6[0].totalLubeCashAmount) {
            this.totalLubeCashAmt = res.data6[0].totalLubeCashAmount;
          }
          if (res.data5[0].totalLubeCrAmount) {
            this.totalLubeCrAmt = res.data5[0].totalLubeCrAmount;
          }
          this.totalLubeAmount = this.totalLubeCashAmount + this.totalLubeCrAmount

          if (res.data3.length) {
            this.lubeWiseDetails = res.data3;
          }
          if (res.data4.length) {
            this.lubeWiseCashDetails = res.data4;
          }
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })

    this.post.getDSRVariationByDatePOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.variationData = res.data;
            this.totalVariation = res.data1[0].totalVariationAmt;
            if (Number(res.data1[0].totalVariationAmt) < 0) {
              this.totalVariationAmt = res.data1[0].totalVariationAmt;
            }
          }
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          // console.log(res.msg)
          this.cd.detectChanges();
        }
      })
  }

  clsAmtForPrevious() {
    this.closingBlcForPrevious = 0
    this.openingBlc = 0
    this.closingBlcForPrevious = Number(this.netTotalForPrevious) - Number(this.creditSalesForPrevious) - Number(this.totalLubeCrAmountPrevious) - Number(this.digitalTotalSalesForPrevious) - Number(this.totalExpenseAmtForPrevious) - Number(this.shiftExpenseAmtForPrevious) - Number(this.totalCrBankForPrevious) - Number(this.shortAmtTotalForPrevious) + Number(this.totalVariationPrevAmt)
    // this.closingBlcForPrevious = Number(this.netTotalForPrevious) - Number(this.creditSalesForPrevious) - Number(this.totalLubeCrAmountPrevious) - Number(this.digitalTotalSalesForPrevious) - Number(this.totalExpenseAmtForPrevious) - Number(this.shiftExpenseAmtForPrevious) - Number(this.totalCrBankForPrevious) - Number(this.shortAmtTotalForPrevious) - Number(this.totalVariationPrevAmt) - Number(this.totalCrAmtOtherForPrevious)
    this.openingBlc = this.closingBlcForPrevious
    // console.log("openingBlc ",this.openingBlc, '=', this.netTotalForPrevious ,'-', this.creditSalesForPrevious ,'-', this.totalLubeCrAmountPrevious ,'-', this.digitalTotalSalesForPrevious ,'-', this.totalExpenseAmtForPrevious ,'-', this.shiftExpenseAmtForPrevious ,'-', this.totalCrBankForPrevious, '-', this.shortAmtTotalForPrevious, this.totalVariationPrevAmt, this.totalCrAmtOtherForPrevious)
    this.netAmt()
  }

  netAmt() {
    this.netTotal = 0
    this.netTotal = Number(this.openingBlc) + Number(this.totalAmountTally) + Number(this.totalLubeAmount) + Number(this.totalCrAmt)
    // this.netTotal = Number(this.openingBlc) + Number(this.totalAmountTally) + Number(this.totalLubeAmount) + Number(this.totalCrAmt) +  Number(this.totalCrBank)
    // console.log("Net ", this.openingBlc, '+', this.totalAmountTally, '+', this.totalLubeAmount, '+', this.totalCrAmt, Number(this.totalCrBank))
    this.clsAmt()
  }

  clsAmt() {
    this.closingBlc = 0
    this.closingBlc = Number(this.netTotal) - Number(this.creditSales) - Number(this.totalLubeCrAmount) - Number(this.digitalTotalSales) - Number(this.totalExpenseAmt) - Number(this.shiftExpenseAmt) - Number(this.totalCrBank) - Number(this.shortAmtTotal) + Number(this.totalVariationAmt)
    // this.closingBlc = Number(this.netTotal) - Number(this.creditSales) - Number(this.totalLubeCrAmount) - Number(this.digitalTotalSales) - Number(this.totalExpenseAmt) - Number(this.shiftExpenseAmt) - Number(this.totalCrBank) - Number(this.shortAmtTotal) - Number(this.totalVariationAmt) - Number(this.totalCrAmtOther)
    // console.log("closingBlc ", this.closingBlc, '=', this.netTotal, '-', this.creditSales, '-', this.totalLubeCrAmount, '-', this.digitalTotalSales, '-', this.totalExpenseAmt, '-', this.shiftExpenseAmt, '-', this.totalCrBank, '-', this.shortAmtTotal, Number(this.totalVariationAmt), Number(this.totalCrAmtOther))
  }

  getFuelCreditPaymentDetailsForPrevious(dealerCorporateId: any) {
    this.spinner.show()
    this.totalCrAmtCashForPrevious = 0
    this.totalCrAmtOtherForPrevious = 0
    this.totalCrAmtForPrevious = 0
    const data = {
      startDate: this.openingAmtDate,
      endDate: moment(this.reportDate).format('YYYY-MM-DD'),
      corporateId: dealerCorporateId,
    };
    this.post.getFuelCreditPaymentDetailsForPreviousPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data[0].totalCrAmtCash) {
            this.totalCrAmtCashForPrevious = res.data[0].totalCrAmtCash;
          }
          if (res.data1[0].totalCrAmtOther) {
            this.totalCrAmtOtherForPrevious = res.data1[0].totalCrAmtOther;
          }
          if (res.data2[0].totalCrAmt) {
            this.totalCrAmtForPrevious = res.data2[0].totalCrAmt;
          }
          this.getTallyDetailsForPrevious(this.fuelDealerId);
          this.getPreviousVariation(this.fuelDealerId);
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  getTallyDetailsForPrevious(fuelDealerId: any) {
    this.spinner.show()
    this.cashSalesForPrevious = 0
    this.digitalSalesForPrevious = 0
    this.creditSalesForPrevious = 0
    this.totalAmountTallyForPrevious = 0
    this.shiftExpenseAmtForPrevious = 0
    this.shortAmtTotalForPrevious = 0
    this.digitalTotalSalesForPrevious = 0
    const data = {
      startDate: this.openingAmtDate,
      endDate: moment(this.reportDate).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
      corporateId: this.dealerCorporateId,
    };
    this.post.getShiftVStallyDigitalTotalForPreviousPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data[0].totalAmountTally) {
            this.totalAmountTallyForPrevious = res.data[0].totalAmountTally;
          }
          if (res.data[0].cashTallyAmt) {
            this.cashSalesForPrevious = res.data[0].cashTallyAmt
          }
          if (res.data[0].paytmTotal) {
            this.digitalSalesForPrevious = res.data[0].paytmTotal
          }
          if (res.data[0].shortAmt) {
            this.shortAmtTotalForPrevious = res.data[0].shortAmt
          }
          if (res.data[0].creditTally) {
            this.creditSalesForPrevious = res.data[0].creditTally
          }
          if (res.data[0].expenseAmt) {
            this.shiftExpenseAmtForPrevious = res.data[0].expenseAmt
          }
          if (res.data1[0].digitalEntry) {
            this.digitalTotalSalesForPrevious = res.data1[0].digitalEntry
          }
          this.getExpenseDetailsForPrevious(this.fuelDealerId);
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  getExpenseDetailsForPrevious(fuelDealerId: any) {
    this.spinner.show()
    this.totalExpenseCASHAmtForPrevious = 0
    this.totalExpenseOtherAmtForPrevious = 0
    this.totalExpenseAmtForPrevious = 0
    this.totalLubeCashAmountPrevious = 0
    this.totalLubeCrAmountPrevious = 0
    this.totalLubeAmountPrevious = 0
    let data = {
      dealerId: fuelDealerId,
      startDate: this.openingAmtDate,
      endDate: moment(this.reportDate).format('YYYY-MM-DD'),
    }
    this.post.getExpenseAmtDetailsForPreviousPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data[0].totalExpenseCASHAmt) {
            this.totalExpenseCASHAmtForPrevious = res.data[0].totalExpenseCASHAmt;
          }
          if (res.data1[0].totalExpenseOtherAmt) {
            this.totalExpenseOtherAmtForPrevious = res.data1[0].totalExpenseOtherAmt;
          }
          if (res.data2[0].totalExpenseAmt) {
            this.totalExpenseAmtForPrevious = res.data2[0].totalExpenseAmt;
          }

          if (res.data4[0].totalLubeCashAmount) {
            this.totalLubeCashAmountPrevious = res.data4[0].totalLubeCashAmount;
          }
          if (res.data3[0].totalLubeCrAmount) {
            this.totalLubeCrAmountPrevious = res.data3[0].totalLubeCrAmount;
          }
          this.totalLubeAmountPrevious = this.totalLubeCashAmountPrevious + this.totalLubeCrAmountPrevious

          if (res.data5[0].bankCrAmt) {
            this.totalCrBankForPrevious = res.data5[0].bankCrAmt;
          }

          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }


  getPreviousVariation(fuelDealerId: any) {
    this.spinner.show()
    this.totalVariationPrevious = 0
    this.totalVariationPrevAmt = 0
    const data = {
      accountingFuelDealerId: fuelDealerId,
      startDate: moment(this.reportDate).subtract(1, "day").format('YYYY-MM-DD'),
      endDate: moment(this.reportDate).subtract(1, "day").format('YYYY-MM-DD'),
    }
    this.post.getDSRVariationByDatePOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.variationPreviousData = res.data;
            this.totalVariationPrevious = res.data1[0].totalVariationAmt;
            if (Number(res.data1[0].totalVariationAmt) < 0) {
              this.totalVariationPrevAmt = res.data1[0].totalVariationAmt;
            }
            // console.log("prevVariation", this.totalVariationPrevious, moment(this.reportDate).subtract(1, "day").format('YYYY-MM-DD'))
          }
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          // console.log(res.msg)
          this.cd.detectChanges();
        }
      })
  }

  getDigitalTotalByDate(dealerCorporateId: any) {
    this.spinner.show()
    this.digitalDetails.length = 0
    this.digitalTotalSales = 0
    this.cashHandOverAmount = 0
    const data = {
      corporateId: dealerCorporateId,
      date: moment(this.reportDate).format('YYYY-MM-DD'),
    };
    this.post.getDigitalTotalByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.digitalDetails = res.data;
          if (res.data1[0].digitalEntry) {
            this.digitalTotalSales = res.data1[0].digitalEntry
          }
          if (res.data2[0].totalAmount) {
            this.cashHandOverAmount = res.data2[0].totalAmount
          }
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  getFuelCreditPaymentByDate(dealerCorporateId: any) {
    this.spinner.show()
    this.creditPaymentDetails.length = 0
    const data = {
      date: moment(this.reportDate).format('YYYY-MM-DD'),
      corporateId: dealerCorporateId,
    };
    this.post.getFuelCreditPaymentByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.creditPaymentDetails = res.data;
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }
}