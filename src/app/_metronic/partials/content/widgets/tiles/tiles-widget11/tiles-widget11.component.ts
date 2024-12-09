import { dsrModel } from './../tiles-widget9/dsrModel.model';
import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TilesService } from '../tiles.services';
import moment from 'moment';

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
  selector: 'app-tiles-widget11',
  templateUrl: './tiles-widget11.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TilesWidget11Component implements OnInit {
  @Input() cssClass = '';
  @Input() widgetHeight = '150px';
  @Input() baseColor = 'success';
  textInverseCSSClass = '';
  userName: string;
  fuelDealerId: any;
  accessGroup: string;
  openingDate = moment(new Date()).format("YYYY-MM-01")
  closingDate = moment(new Date()).format("YYYY-MM-DD")
  dealerCorporateId: string | null;
  oilCoAcUpdate: boolean = false;
  fuelExpenseIdOil: any;
  oilCoAcTotalAmount: any;
  oilCoAcDate: string;
  oilCoAcDate1: any;
  data3totalDebit1: number;
  data4totalCredit1: number;
  data5totalDebit1: number;
  data1totalDebit1: any = 0;
  data2totalCredit1: number;
  oilCoAcTotalAmount1: number;
  totalOilCoACDebit: any = 0;
  totalOilCOPurchase: any = 0;
  totalOilCoCredit: number;
  closingOilCoACBlc: number;
  oilCoStatus: boolean = false;
  bankWiseDetailsOPEN: any = [];
  totalOpenDBBankWiseData: any = [];
  totalOpenCREDITBankWiseData: any = [];
  totalOpenCRBankWiseData: any = [];
  bankStatusWise: any = [];
  totalOpenCrPay: any = [];
  balanceBankData: any = [];
  bankwiseBalanceData: any = [];
  bankwiseBalanceData1: any = [];
  bankBlc: number;
  overallBankWiseDetails: any = [];
  totalCREDITBankWiseData: any = [];
  totalCRBankWiseData: any = [];
  totalDBBankWiseData: any = [];
  totalCreditBankWiseData: any = [];
  cashAcUpdate: boolean = false;
  fuelExpenseId: any;
  cashAcTotalAmount: any;
  cashAcDate: string;
  balanceCashData: any = [];
  cashAcDate1: any;
  cashAcTotalAmount1: number;
  totalCashACDebit: number;
  totalCashACCredit: number;
  closingCashACBlc: number;
  cashStatus: boolean = false;
  dealerId: any;

  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private post: TilesService,
    private cd: ChangeDetectorRef,
    config: NgbDatepickerConfig,) {
    const currentDate = new Date();

    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.userName = element.firstName + ' ' + element.lastName;
    this.accessGroup = element.accessGroupId;
    if(this.accessGroup == '12'){
      this.fuelDealerId = localStorage.getItem('dealerId');
      this.dealerCorporateId = localStorage.getItem('dealerCorporateId');
      this.getOILCOMPANYDataInFuelExpense(this.fuelDealerId)
      this.getBankAcBalance1()
      this.getCashAcBalance1()
      this.cd.detectChanges()
    } else if(this.accessGroup == '14'){
      var managerData = JSON.parse(localStorage.getItem("managerData") || '{}');
      this.dealerId = managerData.fuelDealerId;
      this.getOILCOMPANYDataInFuelExpense(this.dealerId)
      this.getBankAcBalance1()
      this.getCashAcBalance1()
      this.cd.detectChanges()
  }
  }

  getOILCOMPANYDataInFuelExpense(fuelDealerId: any) {
    let data = {
        dealerId: fuelDealerId,
        startDate: this.openingDate,
        endDate: this.closingDate,
    }
    this.post.getOILCOMPANYDataInFuelExpensePOST(data)
        .subscribe(res => {
            if (res.data.length) {
                this.totalOilCOPurchase = res.data3[0].totalAmount
                this.getOilCoAcBalance1();
            } else {
                this.getOilCoAcBalance1();
            }
        })
}

  getOilCoAcBalance1() {
    let data = {
      fuelDealerId: this.fuelDealerId,
      expenseCategory: "BALANCE OIL COMPANY A/C",
      corporateId: this.dealerCorporateId,
      startDate: this.openingDate,
      endDate: this.closingDate,
    }
    this.post.getBalanceByExpenseCategoryPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data.length) {
            this.oilCoAcUpdate = true;
            this.fuelExpenseIdOil = res.data[0].fuelExpenseId;
            this.oilCoAcTotalAmount = res.data[0].expenseAmount;
            this.oilCoAcDate = moment(res.data[0].expenseDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY")
            this.oilCoAcDate1 = res.data[0].expenseDate

            if (res.data3.length) {
              this.data3totalDebit1 = Number(res.data3[0].totalDebit)
            }
            if (res.data4.length) {
              this.data4totalCredit1 = Number(res.data4[0].totalCredit)
            }

            if (res.data5.length) {
              this.data5totalDebit1 = Number(res.data5[0].totalAmount)
            }
          } else {
            this.oilCoAcUpdate = false;
          }
          if (res.data1.length) {
            this.data1totalDebit1 = Number(res.data1[0].totalDebit)
          }
          if (res.data2.length) {
            this.data2totalCredit1 = Number(res.data2[0].totalCredit)
          }

          this.oilCoAcTotalAmount1 = Number(this.oilCoAcTotalAmount) - Number(this.data3totalDebit1) + ((Number(this.data4totalCredit1))) - Number(this.data5totalDebit1);

          this.totalOilCoACDebit = Number(this.data1totalDebit1) + this.totalOilCOPurchase
          this.totalOilCoCredit = (Number(this.data2totalCredit1))
          this.closingOilCoACBlc = Number(this.oilCoAcTotalAmount1) - Number(this.totalOilCoACDebit) + Number(this.totalOilCoCredit)

          if (this.openingDate >= this.oilCoAcDate1) {
            this.oilCoStatus = true;
          } else {
            this.oilCoStatus = false;
          }
          if (this.openingDate >= this.oilCoAcDate1) {
            this.oilCoStatus = true;
          } else {
            this.oilCoStatus = false;
          }
          this.cd.detectChanges()
        } else {
          alert("Error")
          this.cd.detectChanges()
        }
      })
  }


  getBankAcBalance1() {
    this.balanceBankData.length = 0
    this.overallBankWiseDetails.length = 0
    let data = {
      fuelDealerId: this.fuelDealerId,
      corporateId: this.dealerCorporateId,
      expenseCategory: "BALANCE BANK/LOAN A/C",
      startDate: this.openingDate,
      endDate: this.closingDate,

    }
    this.post.getBalanceByExpenseCategoryPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.balanceBankData = res.data;
          this.totalCREDITBankWiseData = res.data2;
          this.totalCRBankWiseData = res.data1;
          this.totalDBBankWiseData = res.data3;
          this.totalCreditBankWiseData = res.dataPay;
          this.getBankAcBalanceOPEN(this.balanceBankData, this.totalCREDITBankWiseData, this.totalCRBankWiseData, this.totalDBBankWiseData, this.totalCreditBankWiseData)
          this.cd.detectChanges()
        } else {
          alert("Error")
          this.cd.detectChanges()
        }
      })
  }

  getBankAcBalanceOPEN(balanceBankData: any, totalCREDITBankWiseData: any[], totalCRBankWiseData: any[], totalDBBankWiseData: any[], totalCreditBankWiseData: any[]) {
    this.bankWiseDetailsOPEN.length = 0
    let data = {
      dealerId: this.fuelDealerId,
      corporateId: this.dealerCorporateId,
      startDate: this.openingDate,
      endDate: this.closingDate,
      bankDetails: balanceBankData,

    }
    this.post.getOpeningDBCRBalanceBANKPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.totalOpenDBBankWiseData = res.data;
          this.totalOpenCREDITBankWiseData = res.data1;
          this.totalOpenCRBankWiseData = res.data2;
          this.bankStatusWise = res.data3;
          this.totalOpenCrPay = res.data4;

          this.balanceBankData.map((res1: { bankName: string; accountNumber: string; expenseDate: string; expenseAmount: any; bankAccountId: string; type: string; }) => {
            const dataJson = {
              bankName: '',
              accountNumber: '',
              expenseDate: '',
              expenseAmount: 0,
              totalDebit: 0,
              totalCredit: 0,
              totalCreditPayment: 0,
              totalOpeningDb: 0,
              totalOpeningCr: 0,
              totalOpeningCrPayment: 0,
              bankId: '',
              status: 'TRUE',
              accType: '',
              totalCreditPay: 0,
              totalOpeningCrPay: 0
            };

            dataJson.bankName = res1.bankName;
            dataJson.accountNumber = res1.accountNumber;
            dataJson.expenseDate = res1.expenseDate;
            dataJson.expenseAmount = Number(res1.expenseAmount);
            dataJson.bankId = res1.bankAccountId;
            dataJson.accType = res1.type;

            totalDBBankWiseData.map(res2 => {
              if (res1.bankAccountId == res2.bankAccountId) {
                dataJson.totalDebit = Number(res2.totalDebit);
              }
            })

            totalCRBankWiseData.map(res3 => {
              if (res1.bankAccountId == res3.bankAccountId) {
                dataJson.totalCredit = Number(res3.totalCredit);
              }
            })

            totalCREDITBankWiseData.map(res4 => {
              if (res1.bankAccountId == res4.accountId) {
                dataJson.totalCreditPayment = Number(res4.totalCredit);
              }
            })

            this.totalOpenDBBankWiseData.map((res5: { bankAccountId: string; totalDbBANKINGAmt: any; }) => {
              if (res1.bankAccountId == res5.bankAccountId) {
                dataJson.totalOpeningDb = Number(res5.totalDbBANKINGAmt);
              }
            })

            this.totalOpenCREDITBankWiseData.map((res6: { accountId: string; totalCredit: any; }) => {
              if (res1.bankAccountId == res6.accountId) {
                dataJson.totalOpeningCrPayment = Number(res6.totalCredit);
              }
            })

            this.totalOpenCRBankWiseData.map((res7: { bankAccountId: string; totalCrBANKINGAmt: any; }) => {
              if (res1.bankAccountId == res7.bankAccountId) {
                dataJson.totalOpeningCr = Number(res7.totalCrBANKINGAmt);
              }
            })

            this.bankStatusWise.map((res8: { bankAccountId: string; status: string; }) => {
              if (res1.bankAccountId == res8.bankAccountId) {
                dataJson.status = res8.status;
              }
            })


            totalCreditBankWiseData.map(res9 => {
              if (res1.bankAccountId == res9.accountId) {
                dataJson.totalCreditPay = Number(res9.totalCredit);
              }
            })

            this.totalOpenCrPay.map((res10: { accountId: string; totalCredit: any; }) => {
              if (res1.bankAccountId == res10.accountId) {
                dataJson.totalOpeningCrPay = Number(res10.totalCredit);
              }
            })

            this.bankWiseDetailsOPEN.push(dataJson);
          })

          let bankwiseBalance = 0
          this.bankWiseDetailsOPEN.map((data: { expenseAmount: any; totalOpeningDb: any; totalOpeningCr: any; totalOpeningCrPayment: any; totalDebit: any; totalCredit: any; totalCreditPayment: any; totalCreditPay: any; status: string; accType: string; }) => {
            const JSON = {
              bankwiseBalance: 0
            }
            if (((Number(data.expenseAmount) - Number(data.totalOpeningDb) + Number(data.totalOpeningCr) + Number(data.totalOpeningCrPayment)) - Number(data.totalDebit) + Number(data.totalCredit) + Number(data.totalCreditPayment) + Number(data.totalCreditPay)) > 0 || data.status == 'FALSE' || data.accType == 'SAVING') {
              bankwiseBalance = Number(bankwiseBalance) + ((Number(data.expenseAmount) - Number(data.totalOpeningDb) + Number(data.totalOpeningCr) + Number(data.totalOpeningCrPayment)) - Number(data.totalDebit) + Number(data.totalCredit) + Number(data.totalCreditPayment) + Number(data.totalCreditPay))
              JSON.bankwiseBalance = bankwiseBalance

              this.bankwiseBalanceData.push(JSON);
              this.bankwiseBalanceData1 = this.bankwiseBalanceData.reverse()
              this.bankBlc = Number(this.bankwiseBalanceData1[0].bankwiseBalance)

            }
          })

          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()

        }
      })

  }

  getCashAcBalance1() {
    let data = {
      fuelDealerId: this.fuelDealerId,
      corporateId: this.dealerCorporateId,
      expenseCategory: "BALANCE CASH A/C",
      startDate: this.openingDate,
      endDate: this.closingDate,
    }
    this.post.getBalanceByExpenseCategoryPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.cashAcUpdate = true;
          if (res.data.length) {
            this.fuelExpenseId = res.data[0].fuelExpenseId;
            this.cashAcTotalAmount = res.data[0].expenseAmount;
            this.cashAcDate = moment(res.data[0].expenseDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY")
            this.balanceCashData = res.data;
            this.cashAcDate1 = res.data[0].expenseDate
            this.cashAcTotalAmount1 = Number(res.data[0].expenseAmount) - Number(res.data6[0].totalDebit) + ((Number(res.data4[0].totalCredit) + Number(res.data5[0].totalCredit)))

          }


          this.totalCashACDebit = Number(res.data3[0].totalDebit)
          this.totalCashACCredit = (Number(res.data1[0].totalCredit) + Number(res.data2[0].totalCredit))

          this.closingCashACBlc = Number(this.cashAcTotalAmount1) - Number(this.totalCashACDebit) + Number(this.totalCashACCredit)

          if (this.openingDate >= this.cashAcDate1) {
            this.cashStatus = true;
          } else {
            this.cashStatus = false;
          }
          this.cd.detectChanges()
        } else {
          alert("Error")
          this.cd.detectChanges()
        }
      })
  }
}
