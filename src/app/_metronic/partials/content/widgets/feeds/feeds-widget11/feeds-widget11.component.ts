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
  selector: 'app-feeds-widget11',
  templateUrl: './feeds-widget11.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FeedsWidget11Component implements OnInit {
  dealerLoginVPId: any;
  accessGroupId: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  dealerCompanyName: any;
  dealerCity: any;
  month: any;
  monthNumber: any;
  startDate: any;
  endDate: any;
  year: any;
  dealerCorporateId: any;
  netTotalForPrevious: any = 0;
  creditSalesForPrevious: any = 0;
  totalLubeCrAmountPrevious: any = 0;
  digitalTotalSalesForPrevious: any = 0;
  totalExpenseAmtForPrevious: any = 0;
  shiftExpenseAmtForPrevious: any = 0;
  shortAmtTotalForPrevious: any = 0;
  totalCrBankForPrevious: any = 0;
  openingBlcForPrevious: any = 0;
  totalAmountTallyForPrevious: any = 0;
  totalLubeAmountPrevious: any = 0;
  totalCrAmtForPrevious: any = 0;
  openingBlc: any = 0;
  netTotal: any = 0;
  creditSales: any = 0;
  totalLubeCrAmount: any = 0;
  digitalTotalSales: any = 0;
  totalExpenseAmt: any = 0;
  shiftExpenseAmt: any = 0;
  totalCrBank: any = 0;
  totalAmountTally: any = 0;
  totalLubeAmount: any = 0;
  totalCrAmt: any = 0;
  shortAmtTotal: any = 0;
  lastYear: any;
  last2Year: any;
  lastFourthYear: any;
  lastFifthYear: any;
  meterSalesDetails: any = [];
  creditSalesProductwise: any = [];
  totalMeterSalesDetails: any = 0;
  productWiseCreditData: any = [];
  totalCreditSalesAmount: any = 0;
  totalCreditWOCNGQuantity: any = 0;
  totalCreditCNGQuantity: any = 0;
  cashLubeDetails: any = [];
  crLubeDetails: any = [];
  cashLubeAmt: any = 0;
  crLubeAmt: any = 0;
  tallySalesDetails: any = [];
  totalSalesDetails: any = [];
  cashSales: any = 0;
  digitalSales: any = 0;
  totalExpenseCASHAmt: any = 0;
  totalExpenseOtherAmt: any = 0;
  overallReportDataData: any[];
  lubeWiseDetails: any = [];
  lubeWiseCashDetails: any = [];
  totalLubeCashAmount: any = 0;
  variationData: any = [];
  totalVariation: any = 0;
  totalVariationAmt: any = 0;
  totalLubeCashAmt: any;
  totalLubeCrAmt: any;
  digitalDetails: any = [];
  cashHandOverAmount: any = 0;
  totalCrAmtCash: any = 0;
  totalCrAmtOther: any = 0;
  salesCredit: any;
  openingAmt: any;
  closingBlcForPrevious: any = 0;
  closingBlc: any = 0;
  totalVariationPrevious: any = 0;
  totalVariationPrevAmt: any = 0;
  variationPreviousData: any = [];
  openingAmtDate: string;
  totalCrAmtCashForPrevious: any = 0;
  totalCrAmtOtherForPrevious: any = 0;
  cashSalesForPrevious: any = 0;
  digitalSalesForPrevious: any = 0;
  totalExpenseOtherAmtForPrevious: any = 0;
  totalExpenseCASHAmtForPrevious: any = 0;
  totalLubeCashAmountPrevious: any = 0;
  bankoverallReportData: any = [];

  constructor(private post: FeedsService,
    private spinner: NgxSpinnerService,
    public router: Router,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    this.accessGroupId = element.accessGroupId;
    if (this.accessGroupId == '12') {
      var dealerData = JSON.parse(localStorage.getItem('dealerData') || '');
      this.dealerCompanyName = dealerData.companyName;
      this.dealerCity = dealerData.city;
    }
    if (this.accessGroupId == '14') {
      var managerData = JSON.parse(localStorage.getItem('managerData') || '');
      this.dealerCompanyName = managerData.companyName;
      this.dealerCity = managerData.city;
    }

    this.startDate = moment(new Date()).format('YYYY-MM-01');
    this.endDate = moment(new Date()).format('YYYY-MM-31');
    this.month = moment(new Date()).format("MMM");
    this.year = moment(new Date()).format("YYYY");
    this.lastYear = moment(new Date()).subtract(1, "year").format("YYYY");
    this.last2Year = moment(new Date()).subtract(2, "year").format("YYYY");
    this.lastFourthYear = moment(new Date()).subtract(3, "year").format("YYYY");
    this.lastFifthYear = moment(new Date()).subtract(4, "year").format("YYYY");
    this.getOpeningBalance(this.fuelDealerId);
    // this.getDigitalTotalByDate(this.dealerCorporateId);
    // this.getSalesDetailsProductWise(this.fuelDealerId);
    this.getoverallReportData(this.fuelDealerId);
    // this.getPreviousVariation(this.fuelDealerId);
    this.cd.detectChanges();
  }


  selectMonth(id: any) {
    if (id.target.value == 'Jan') {
      this.monthNumber = "01"
      this.startDate = this.year + '-' + this.monthNumber + '-' + "01"
      this.endDate = this.year + '-' + this.monthNumber + '-' + "31"
      this.onSelection();
      this.cd.detectChanges();
    } else {
      if (id.target.value == 'Feb') {
        this.monthNumber = "02"
        this.startDate = this.year + '-' + this.monthNumber + '-' + "01"
        this.endDate = this.year + '-' + this.monthNumber + '-' + "29"
        this.onSelection();
        this.cd.detectChanges();
      } else {
        if (id.target.value == 'Mar') {
          this.monthNumber = "03"
          this.startDate = this.year + '-' + this.monthNumber + '-' + "01"
          this.endDate = this.year + '-' + this.monthNumber + '-' + "31"
          this.onSelection();
          this.cd.detectChanges();
        } else {
          if (id.target.value == 'Apr') {
            this.monthNumber = "04"
            this.startDate = this.year + '-' + this.monthNumber + '-' + "01"
            this.endDate = this.year + '-' + this.monthNumber + '-' + "30"
            this.onSelection();
            this.cd.detectChanges();
          } else {
            if (id.target.value == 'May') {
              this.monthNumber = "05"
              this.startDate = this.year + '-' + this.monthNumber + '-' + "01"
              this.endDate = this.year + '-' + this.monthNumber + '-' + "31"
              this.onSelection();
              this.cd.detectChanges();
            } else {
              if (id.target.value == 'Jun') {
                this.monthNumber = "06"
                this.startDate = this.year + '-' + this.monthNumber + '-' + "01"
                this.endDate = this.year + '-' + this.monthNumber + '-' + "30"
                this.onSelection();
                this.cd.detectChanges();
              } else {
                if (id.target.value == 'Jul') {
                  this.monthNumber = "07"
                  this.startDate = this.year + '-' + this.monthNumber + '-' + "01"
                  this.endDate = this.year + '-' + this.monthNumber + '-' + "31"
                  this.onSelection();
                  this.cd.detectChanges();
                } else {
                  if (id.target.value == 'Aug') {
                    this.monthNumber = "08"
                    this.startDate = this.year + '-' + this.monthNumber + '-' + "01"
                    this.endDate = this.year + '-' + this.monthNumber + '-' + "31"
                    this.onSelection();
                    this.cd.detectChanges();
                  } else {
                    if (id.target.value == 'Sep') {
                      this.monthNumber = "09"
                      this.startDate = this.year + '-' + this.monthNumber + '-' + "01"
                      this.endDate = this.year + '-' + this.monthNumber + '-' + "30"
                      this.onSelection();
                      this.cd.detectChanges();
                    } else {
                      if (id.target.value == 'Oct') {
                        this.monthNumber = "10"
                        this.startDate = this.year + '-' + this.monthNumber + '-' + "01"
                        this.endDate = this.year + '-' + this.monthNumber + '-' + "31"
                        this.onSelection();
                        this.cd.detectChanges();
                      } else {
                        if (id.target.value == 'Nov') {
                          this.monthNumber = "11"
                          this.startDate = this.year + '-' + this.monthNumber + '-' + "01"
                          this.endDate = this.year + '-' + this.monthNumber + '-' + "30"
                          this.onSelection();
                          this.cd.detectChanges();
                        } else {
                          if (id.target.value == 'Dec') {
                            this.monthNumber = "12"
                            this.startDate = this.year + '-' + this.monthNumber + '-' + "01"
                            this.endDate = this.year + '-' + this.monthNumber + '-' + "31"
                            this.onSelection();
                            this.cd.detectChanges();
                          } else {
                            alert("Please Select Valid Month..!")
                            this.cd.detectChanges();
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

  }


  onSelection() {
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
    this.getOpeningBalance(this.fuelDealerId);
    // this.getDigitalTotalByDate(this.dealerCorporateId);
    // this.getSalesDetailsProductWise(this.fuelDealerId);
    this.getoverallReportData(this.fuelDealerId);
    // this.getPreviousVariation(this.fuelDealerId);
    this.cd.detectChanges();
  }

  getOpeningBalance(fuelDealerId: any) {
    this.openingAmtDate = '';
    this.openingAmt = 0;
    this.spinner.show()
    let data = {
      overallReportDataFuelDealerId: fuelDealerId,
    }
    this.post.getOpeningBalancePOST(data).subscribe(res => {
      if (res.status == 'OK') {
        if (res.data.length) {
          this.openingAmt = res.data[0].overallReportDataAmount;
          this.openingAmtDate = res.data[0].overallReportDataDate;
          if (this.openingAmtDate == this.startDate) {
            // console.log("Case 1 ==")
            this.openingBlc = this.openingAmt;
            this.getFuelCreditPaymentDetails(this.dealerCorporateId);
          } else {
            if (this.openingAmtDate < this.startDate) {
              // console.log("Case 2 OpeningDate < StartDate")
              this.getFuelCreditPaymentDetailsForPrevious(this.dealerCorporateId);
              this.getFuelCreditPaymentDetails(this.dealerCorporateId);
            } else {
              // console.log("Case 3 OpeningDate > StartDate")
              this.getFuelCreditPaymentDetails(this.dealerCorporateId);
            }
          }
        } else {
          this.getFuelCreditPaymentDetails(this.dealerCorporateId);
        }
        this.getDigitalTotalByDate(this.dealerCorporateId);
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 2000);
        this.cd.detectChanges();
      } else {
        this.openingAmtDate = '';
        this.openingAmt = 0;
        this.getDigitalTotalByDate(this.dealerCorporateId);
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 2000); this.cd.detectChanges();
      }
    })
  }

  getFuelCreditPaymentDetailsForPrevious(dealerCorporateId: any) {
    this.spinner.show()
    this.totalCrAmtCashForPrevious = 0
    this.totalCrAmtOtherForPrevious = 0
    this.totalCrAmtForPrevious = 0
    const data = {
      startDate: this.openingAmtDate,
      endDate: (this.startDate),
      corporateId: this.dealerCorporateId,
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
      endDate: this.startDate,
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
      endDate: (this.startDate),
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

  selectYear(id: any) {
    this.startDate = id.target.value + '-' + this.monthNumber + '-' + "01"
    this.endDate = id.target.value + '-' + this.monthNumber + '-' + "31"
    this.onSelection();
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
      startDate: (this.startDate),
      endDate: (this.endDate),
    };
    this.post.getMETERSALESTotalDSRByMonthPOST(data)
      .subscribe((res) => {
        if (res.status == "OK") {
          this.meterSalesDetails = res.data;
          this.totalMeterSalesDetails = res.data1[0].meterSaleAmount;
          this.creditSalesProductwise = res.data2

          this.totalCreditSalesAmount = Number(res.data3[0].totalCreditSales) + Number(res.data4[0].totalCreditSales)
          this.totalCreditWOCNGQuantity = Number(res.data3[0].totalCreditQuantity)
          this.totalCreditCNGQuantity = Number(res.data4[0].totalCreditQuantity)
          this.cashLubeDetails = res.data5
          this.crLubeDetails = res.data6
          if (res.data5.length) {
            this.cashLubeAmt = res.data5[0].totalCashAmount;
          } else {
            this.cashLubeAmt = 0
          }

          if (res.data6.length) {
            this.crLubeAmt = res.data6[0].totalCreditAmount;
          } else {
            this.crLubeAmt = 0
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
            this.getoverallReportData(this.fuelDealerId);
            setTimeout(() => {
              /** spinner ends after 5 seconds */
              this.spinner.hide();
            }, 2000);
            this.cd.detectChanges();
          })
        } else {
          this.getoverallReportData(this.fuelDealerId);
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 2000);
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
      startDate: (this.startDate),
      endDate: (this.endDate),
      dealerId: fuelDealerId,
    };
    this.post.getShiftVStallyByMonthPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {

          this.tallySalesDetails = res.data;
          if (res.data1[0].totalAmountTally || res.data1[0].cashTallyAmt || res.data1[0].creditTally || res.data1[0].paytmTotal
            || res.data1[0].expenseAmt || res.data1[0].shortAmt) {
            this.totalSalesDetails = res.data1;
          }
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
      startDate: (this.startDate),
      endDate: (this.endDate),
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
      startDate: (this.startDate),
      endDate: (this.endDate),
    }
    this.post.getBankACwiseDetailsPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          // console.log("110",this.openingAmtDate, this.startDate, this.totalCrBank)
          if (res.data1[0].bankCrAmt) {
            this.totalCrBank = res.data1[0].bankCrAmt;
          }
          this.bankoverallReportData = res.data;
          if (this.openingAmtDate < (this.startDate)) {
            // console.log("110",this.openingAmtDate, this.startDate)
            this.netAmtForPrevious();
          } else {
            this.netAmt();
          }

          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      })
  }

  getoverallReportData(fuelDealerId: any) {
    this.spinner.show()
    this.overallReportDataData = []
    this.lubeWiseDetails = []
    this.lubeWiseCashDetails = []
    this.totalLubeCashAmount = 0
    this.totalLubeCrAmount = 0
    this.totalLubeAmount = 0
    this.variationData = []
    this.totalVariation = 0;
    this.totalVariationAmt = 0;

    let data = {
      accountingFuelDealerId: fuelDealerId,
      startDate: (this.startDate),
      endDate: (this.endDate),
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
          // if(res.data1[0].totalLubeCrAmount){
          // this.totalLubeCrAmount = res.data1[0].totalLubeCrAmount;
          // }
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
        }
        this.getPreviousVariation(this.fuelDealerId);
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 2000);
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
          this.getPreviousVariation(this.fuelDealerId);
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 2000);
        } else {
          this.getPreviousVariation(this.fuelDealerId);
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 2000);          // console.log(res.msg)
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
      startDate: (this.startDate),
      endDate: (this.endDate),
    };
    this.post.getDigitalTotalByMonthPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.digitalDetails = res.data;
          if (res.data1[0].digitalEntry) {
            this.digitalTotalSales = res.data1[0].digitalEntry
          }
          if (res.data2[0].totalAmount) {
            this.cashHandOverAmount = res.data2[0].totalAmount
          }
          this.getSalesDetailsProductWise(this.fuelDealerId);
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 2000);
          this.cd.detectChanges();
        } else {
          this.getSalesDetailsProductWise(this.fuelDealerId);

          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 2000); this.cd.detectChanges();
        }
      });
  }

  getFuelCreditPaymentDetails(dealerCorporateId: any) {
    this.spinner.show()
    this.totalCrAmtCash = 0
    this.totalCrAmtOther = 0
    this.totalCrAmt = 0
    const data = {
      startDate: (this.startDate),
      endDate: (this.endDate),
      corporateId: this.dealerCorporateId,
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
          this.getTotalCreditSales(this.fuelDealerId);

          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  getTotalCreditSales(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      dealerId: fuelDealerId,
      startDate: (this.startDate),
      endDate: (this.endDate),
    }

    this.post.getTotalCreditSalesByMonthPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.salesCredit = res.data[0].totalCreditAmount;
          this.spinner.hide()
        } else {
          this.salesCredit = 0;
          this.spinner.hide()

        }
      })
  }

  getPreviousVariation(fuelDealerId: any) {
    this.spinner.show()
    this.totalVariationPrevious = 0
    this.totalVariationPrevAmt = 0
    const data = {
      accountingFuelDealerId: fuelDealerId,
      startDate: moment(this.startDate).subtract(1, "month").format('YYYY-MM-01'),
      endDate: moment(this.endDate, ["YYYY-MM-31"]).subtract(1, "month").format('YYYY-MM-31'),
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
            // console.log("prevVariation", this.totalVariationPrevAmt, moment(this.startDate).subtract(1, "month").format('YYYY-MM-DD'), moment(this.endDate).subtract(1, "month").format('YYYY-MM-DD'))
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


  netAmtForPrevious() {
    this.netTotalForPrevious = 0
    this.netTotalForPrevious = Number(this.openingAmt) + Number(this.totalAmountTallyForPrevious) + Number(this.totalLubeAmountPrevious) + Number(this.totalCrAmtForPrevious)
    // console.log("netPrv ", this.openingAmt, '+', this.totalAmountTallyForPrevious, '+', this.totalLubeAmountPrevious, '+', this.totalCrAmtForPrevious)
    this.clsAmtForPrevious()
  }

  clsAmtForPrevious() {
    this.closingBlcForPrevious = 0
    this.openingBlc = 0
    this.closingBlcForPrevious = Number(this.netTotalForPrevious) - Number(this.creditSalesForPrevious) - Number(this.totalLubeCrAmountPrevious) - Number(this.digitalTotalSalesForPrevious) - Number(this.totalExpenseAmtForPrevious) - Number(this.shiftExpenseAmtForPrevious) - Number(this.totalCrBankForPrevious) - Number(this.shortAmtTotalForPrevious) + Number(this.totalVariationPrevAmt)
    this.openingBlc = this.closingBlcForPrevious
    // console.log("openingBlc ",this.openingBlc, '=', this.netTotalForPrevious ,'-', this.creditSalesForPrevious ,'-', this.totalLubeCrAmountPrevious ,'-', this.digitalTotalSalesForPrevious ,'-', this.totalExpenseAmtForPrevious ,'-', this.shiftExpenseAmtForPrevious ,'-', this.totalCrBankForPrevious, '-', this.shortAmtTotalForPrevious , this.totalVariationPrevAmt)
    this.netAmt()
  }

  netAmt() {
    this.netTotal = 0
    this.netTotal = Number(this.openingBlc) + Number(this.totalAmountTally) + Number(this.totalLubeAmount) + Number(this.totalCrAmt)
    // console.log("Net ", this.openingBlc, '+', this.totalAmountTally, '+', this.totalLubeAmount, '+', this.totalCrAmt)
    this.clsAmt()
  }

  clsAmt() {
    this.closingBlc = 0
    this.closingBlc = Number(this.netTotal) - Number(this.creditSales) - Number(this.totalLubeCrAmount) - Number(this.digitalTotalSales) - Number(this.totalExpenseAmt) - Number(this.shiftExpenseAmt) - Number(this.totalCrBank) - Number(this.shortAmtTotal) + Number(this.totalVariationAmt)
    // console.log("closingBlc ",this.closingBlc ,'=', this.netTotal ,'-', this.creditSales ,'-', this.totalLubeCrAmount ,'-', this.digitalTotalSales ,'-', this.totalExpenseAmt ,'-', this.shiftExpenseAmt ,'-', this.totalCrBank, '-', this.shortAmtTotal)
  }
}