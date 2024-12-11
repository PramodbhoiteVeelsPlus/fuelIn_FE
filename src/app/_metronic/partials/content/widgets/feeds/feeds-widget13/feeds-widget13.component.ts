import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FeedsService } from '../feeds.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import * as htmlToImage from 'html-to-image';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { addAccountingArray } from './accountingArray.model';


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
  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
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
  accessGroup: any;
  isAddExpense: boolean = false;
  countAddArray: any = 1;
  addAccountingArray: any = [];
  addAccountingArrayData = new addAccountingArray();
  isSubmit: boolean = false
  bankAllAccList: any = [];
  bankSavingAccList: any = [];
  bankLoanAccList: any = [];
  accountingData: any = [];
  accountingSearchData: any = [];
  selected: string;
  userName: string;

  constructor(private post: FeedsService,
    private spinner: NgxSpinnerService,
    public router: Router,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {    
    this.accountingData = JSON.parse(localStorage.getItem('accountingData') || '{}');
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '');
    this.dealerCompanyName = dealerData.companyName;
    this.dealerCity = dealerData.city;
    this.accessGroup = element.accessGroupId;
    this.userName = element.firstName + ' ' + element.lastName
    this.month = moment(new Date()).format("MMM");
    this.year = moment(new Date()).format("YYYY");
    this.filterForm.controls["startDate"].setValue("01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear())
    this.filterForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
    
    if (!this.accountingData.length) {
      this.getAccounting(this.fuelDealerId)
    } else {
      this.getAccounting1(this.fuelDealerId)
    }
    
    this.getAccounting(this.fuelDealerId)
    this.getBankDetailsByDealerId(this.fuelDealerId)
    this.addFormRequestBanking();
    this.cd.detectChanges();
  }


  isAddExp() {
    this.isAddExpense = true;
  }

  addFormRequestBanking() {
    this.countAddArray = this.countAddArray + 1;
    this.addAccountingArrayData = new addAccountingArray();
    this.addAccountingArray.push(this.addAccountingArrayData);
  }

  getByTransactionType(id: any, i: any) {
    if (this.addAccountingArray[i].book == 'Expense') {
      if (id.target.value) {
        this.addAccountingArray[i].paidFrom = '';
        this.addAccountingArray[i].inputFrom = ''
        this.addAccountingArray[i].isDefaultFrom = false;
        this.addAccountingArray[i].isInputBoxFrom = false;
        this.addAccountingArray[i].isCashBankFrom = true;
        this.addAccountingArray[i].isExpenseAccFrom = false;

        this.addAccountingArray[i].paidTo = '36';
        this.addAccountingArray[i].inputTo = '';
        this.addAccountingArray[i].isDefaultTo = false;
        this.addAccountingArray[i].isInputBoxTo = false;
        this.addAccountingArray[i].isCashBankTo = false;
        this.addAccountingArray[i].isExpenseAccTo = true;

        this.addAccountingArray[i].accountingExpenseCr = 'TRUE';
      } else {
        this.addAccountingArray[i].paidFrom = '';
        this.addAccountingArray[i].inputFrom = ''
        this.addAccountingArray[i].isDefaultFrom = true;
        this.addAccountingArray[i].isInputBoxFrom = false;
        this.addAccountingArray[i].isCashBankFrom = false;
        this.addAccountingArray[i].isExpenseAccFrom = false;

        this.addAccountingArray[i].paidTo = '';
        this.addAccountingArray[i].inputTo = '';
        this.addAccountingArray[i].isDefaultTo = true;
        this.addAccountingArray[i].isInputBoxTo = false;
        this.addAccountingArray[i].isCashBankTo = false;
        this.addAccountingArray[i].isExpenseAccTo = false;


        this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
      }
    } else {

      this.addAccountingArray[i].paidFrom = '';
      this.addAccountingArray[i].inputFrom = ''
      this.addAccountingArray[i].isDefaultFrom = true;
      this.addAccountingArray[i].isInputBoxFrom = false;
      this.addAccountingArray[i].isCashBankFrom = false;
      this.addAccountingArray[i].isExpenseAccFrom = false;

      this.addAccountingArray[i].paidTo = '';
      this.addAccountingArray[i].inputTo = '';
      this.addAccountingArray[i].isDefaultTo = true;
      this.addAccountingArray[i].isInputBoxTo = false;
      this.addAccountingArray[i].isCashBankTo = false;
      this.addAccountingArray[i].isExpenseAccTo = false;

      this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
    }

    this.checkValidation(i)
  }

  checkValidation(i: any) {
    if (this.addAccountingArray[i].details == null) {
      this.addAccountingArray[i].details = ''

      if (this.addAccountingArray[i].date
        && this.addAccountingArray[i].book && this.addAccountingArray[i].transactionType
        && (this.addAccountingArray[i].paidFrom || this.addAccountingArray[i].inputFrom)
        && (this.addAccountingArray[i].paidTo || this.addAccountingArray[i].inputTo)
        && this.addAccountingArray[i].amount) {
        if (Number(this.addAccountingArray[i].amount) > 0) {
          if (this.addAccountingArray[i].book == 'POS') {
            if (this.addAccountingArray[i].paidFrom != '22') {
              if (this.addAccountingArray[i].paidFrom == '21') {
                this.addAccountingArray[i].accountingOilCoDb = 'TRUE';
                // console.log("OIL DB")
              } else {
                this.addAccountingArray[i].accountingBankDb = 'TRUE'
                // console.log("BANK DB")
              }
            }
            if (this.addAccountingArray[i].paidTo != '22') {

              if (this.addAccountingArray[i].paidTo == '21') {
                this.addAccountingArray[i].accountingOilCoCr = 'TRUE';
                // console.log("OIL CR")
              } else {
                if (this.addAccountingArray[i].paidTo == '36') {
                  // console.log("EXPENSE CR")
                } else {
                  this.addAccountingArray[i].accountingBankCr = 'TRUE'
                  // console.log("BANK CR")
                }
              }
            }
          } else {
            if (this.addAccountingArray[i].book == 'Expense') {
              if (this.addAccountingArray[i].paidFrom == '20') {
                this.addAccountingArray[i].accountingCashDb = 'TRUE'
              } else {
                this.addAccountingArray[i].accountingBankDb = 'TRUE'
              }
            } else {
              if (this.addAccountingArray[i].transactionType == 'Loan – Repayment') {
                if (this.addAccountingArray[i].paidFrom == '20') {
                  this.addAccountingArray[i].accountingCashDb = 'TRUE'
                } else {
                  this.addAccountingArray[i].accountingBankDb = 'TRUE'
                }
              } else {

              }
            }
          }
          this.addAccountingArray[i].isAddRow = true;
          this.addAccountingArray[i].isRemoveRow = true;
          this.isSubmit = true;
        } else {
          this.isSubmit = false;
          this.addAccountingArray[i].isAddRow = false;
          this.addAccountingArray[i].isRemoveRow = true;
        }
      } else {
        this.isSubmit = false;
        this.addAccountingArray[i].isAddRow = false;
        this.addAccountingArray[i].isRemoveRow = true;
      }

    } else {
      if (this.addAccountingArray[i].date
        && this.addAccountingArray[i].book && this.addAccountingArray[i].transactionType
        && (this.addAccountingArray[i].paidFrom || this.addAccountingArray[i].inputFrom)
        && (this.addAccountingArray[i].paidTo || this.addAccountingArray[i].inputTo)
        && this.addAccountingArray[i].amount) {
        if (Number(this.addAccountingArray[i].amount) > 0) {

          if (this.addAccountingArray[i].book == 'POS') {
            if (this.addAccountingArray[i].paidFrom != '22') {
              if (this.addAccountingArray[i].paidFrom == '21') {
                this.addAccountingArray[i].accountingOilCoDb = 'TRUE';
                // console.log("OIL DB")
              } else {
                this.addAccountingArray[i].accountingBankDb = 'TRUE'
                // console.log("BANK DB")
              }
            }
            if (this.addAccountingArray[i].paidTo != '22') {

              if (this.addAccountingArray[i].paidTo == '21') {
                this.addAccountingArray[i].accountingOilCoCr = 'TRUE';
                // console.log("OIL CR")
              } else {
                if (this.addAccountingArray[i].paidTo == '36') {
                  // console.log("EXPENSE CR")
                } else {
                  this.addAccountingArray[i].accountingBankCr = 'TRUE'
                  // console.log("BANK CR")
                }
              }
            }
          } else {
            if (this.addAccountingArray[i].book == 'Expense') {
              if (this.addAccountingArray[i].paidFrom == '20') {
                this.addAccountingArray[i].accountingCashDb = 'TRUE'
              } else {
                this.addAccountingArray[i].accountingBankDb = 'TRUE'
              }
            } else {
              if (this.addAccountingArray[i].transactionType == 'Loan – Repayment') {
                if (this.addAccountingArray[i].paidFrom == '20') {
                  this.addAccountingArray[i].accountingCashDb = 'TRUE'
                } else {
                  this.addAccountingArray[i].accountingBankDb = 'TRUE'
                }
              } else {

              }
            }
          }
          this.addAccountingArray[i].isAddRow = true;
          this.addAccountingArray[i].isRemoveRow = true;
          this.isSubmit = true;
        } else {
          this.isSubmit = false;
          this.addAccountingArray[i].isAddRow = false;
          this.addAccountingArray[i].isRemoveRow = true;
        }
      } else {
        this.isSubmit = false;
        this.addAccountingArray[i].isAddRow = false;
        this.addAccountingArray[i].isRemoveRow = true;
      }
    }

  }

  getBankDetailsByDealerId(fuelDealerId: any) {
    let data = {
      dealerId: fuelDealerId
    }
    this.post.getBankDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.bankAllAccList = res.data;
          this.bankSavingAccList = res.data1;
          this.bankLoanAccList = res.data2;
        }
      })

  }

  addArrayRow(i: any) {
    if ((this.addAccountingArray[i].date)
      && this.addAccountingArray[i].book && this.addAccountingArray[i].transactionType
      && (this.addAccountingArray[i].paidFrom || this.addAccountingArray[i].inputFrom)
      && (this.addAccountingArray[i].paidTo || this.addAccountingArray[i].inputTo)
      && this.addAccountingArray[i].amount) {
      if (Number(this.addAccountingArray[i].amount) > 0) {

        this.countAddArray = this.countAddArray + 1;
        if (this.countAddArray < 12) {
          this.isSubmit = false;
          this.addAccountingArray[i].isAddRow = false;
          this.addAccountingArray[i].isRemoveRow = false;
          this.addAccountingArrayData = new addAccountingArray();
          this.addAccountingArray.push(this.addAccountingArrayData);
        } else {
          this.countAddArray = 11;
          alert("Please save 10 entries, before adding more entries..")
        }
      } else {
        this.isSubmit = false;
        this.addAccountingArray[i].isAddRow = false;
        this.addAccountingArray[i].isRemoveRow = true;
        alert("Please Enter Valid Amount..")
      }
    } else {
      this.isSubmit = false;
      this.addAccountingArray[i].isAddRow = false;
      this.addAccountingArray[i].isRemoveRow = true;
      alert("Please Select or Enter All Details..")
    }

  }

  removeArrayRow(i: any) {
    this.addAccountingArray.splice(i, 1);
    this.countAddArray = this.countAddArray - 1;
    this.checkValidation(Number(i - 1))
  }

  submitArray() {
    this.spinner.show()
    let data = {
      addAccountingArray: this.addAccountingArray,
      accountingFuelDealerId: this.fuelDealerId,
      accountingCreatedBy: this.userName,
    }
    this.post.addAccountingPOST(data)
      .subscribe(res => {
        if (res.status = "OK") {
          alert("Accounting Entries Submit Successfully..");
          this.spinner.hide()
          this.getAccounting(this.fuelDealerId);
          this.clearAll()
        } else {
          this.spinner.hide()
        }
      })
  }

  clearAll() {
    this.isAddExpense = false;
    this.addAccountingArray = [];
    this.isSubmit = false;
    this.countAddArray = 1;
    this.addFormRequestBanking();
  }

  filter() {
    this.spinner.show()
    this.accountingData = []
    this.accountingSearchData = [];
    let data = {
      accountingFuelDealerId: this.fuelDealerId,
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      accountingBook: 'Expense',
    }
    this.post.getAccountingPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.accountingData = res.data;
          this.accountingSearchData = res.data;
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  getAccounting(fuelDealerId: any) {
    this.spinner.show();
    this.accountingData = []
    this.accountingSearchData = [];
    let data = {
      accountingFuelDealerId: fuelDealerId,
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      accountingBook: 'Expense',
    }
    this.post.getAccountingPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.accountingData = res.data;
          this.accountingSearchData = res.data;
          localStorage.setItem('accountingData', JSON.stringify(this.accountingData));
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          localStorage.setItem('accountingData', JSON.stringify([]));
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  getAccounting1(fuelDealerId: any) {
    this.accountingData = []
    this.accountingSearchData = [];
    let data = {
      accountingFuelDealerId: fuelDealerId,
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      accountingBook: 'Expense',
    }
    this.post.getAccountingPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.accountingData = res.data;
          this.accountingSearchData = res.data;
          localStorage.setItem('accountingData', JSON.stringify(this.accountingData));
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          localStorage.setItem('accountingData', JSON.stringify([]));
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  cancel() {
    this.filterForm.controls["startDate"].setValue("01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear())
    this.filterForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
    this.selected = ("01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear()) + ' - ' + (moment(new Date()).format("DD-MM-YYYY"))
    // this.filterForm.controls["formRadios"].setValue("")
    this.getAccounting(this.fuelDealerId)
  }

  deleteAccounting(accountingId: any) {
    this.spinner.show();
    let data = {
      accountingId: accountingId
    }
    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteAccountingDataPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("details deleted successfully..!")
            this.filter();
            this.spinner.hide();
          } else {
            this.spinner.hide();
          }
        })
    }
    else {
    }
  }
}