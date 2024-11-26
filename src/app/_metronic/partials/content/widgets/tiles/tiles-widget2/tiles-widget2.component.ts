import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { TilesService } from '../tiles.services';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { addAccountingArray } from './addAccountingArray.model';

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
  selector: 'app-tiles-widget2',
  templateUrl: './tiles-widget2.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TilesWidget2Component {
  dealerAccess: boolean = false;
  isSubmit: boolean = false;
  addAccountingArray: any = [];
  addAccountingArrayData = new addAccountingArray();
  countAddArray: any = 1;
  dealerLoginVPId: any;
  accessGroupId: any;
  userId: any;
  userName: string;
  personId: any;
  loginSQLCorporateId: any;
  petrolPumpName: any;
  loginSQLStaffId: any;
  fuelDealerId: any;
  bankSavingAccList: any = [];
  bankAllAccList: any = [];
  bankLoanAccList: any = [];
  fuelTerminalDetails: any = [];
  accountingData: any = [];
  isShow: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private post: TilesService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private cd: ChangeDetectorRef,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.accessGroupId = element.accessGroupId;
    this.userId = element.userId
    this.personId = element.personId
    this.userName = element.firstName + ' ' + element.lastName
    if (element.accessGroupId == 12 || element.accessGroupId == 14) {
      this.dealerAccess = true
    }
    this.addFormRequestBanking();
    this.getStaffIdByPersonId(this.personId, this.userId);
    this.getBankDetailsByDealerId(this.fuelDealerId);
    this.getFuelTerminal(this.fuelDealerId);
    this.getAccounting(this.fuelDealerId);
  }


  // getStaffIdByPersonIdPOST
  getStaffIdByPersonId(personId: any, userId: any) {
    let data = {
      personId: personId,
      userId: userId,
    }
    this.post.getStaffIdByPersonIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.loginSQLStaffId = res.data[0].fuelDealerStaffId;
            this.cd.detectChanges();
          }
          else {
            alert("Getting Error..! Please Logout & Login again..!")
            this.cd.detectChanges();
          }
        }
      })
  }

  // Bank Details By fuelDealerId
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
          this.cd.detectChanges();
        }else{          
          this.cd.detectChanges();
        }
      })
  }

  // get digitalPOS dropdown
  getFuelTerminal(id: any) {
    let dataTerminal = {
      fuelDealerId: id
    }
    this.post.getFuelTerminal1POST(dataTerminal)
      .subscribe(res => {
        if (res.data.length) {
          this.fuelTerminalDetails = res.data;
          this.cd.detectChanges();
        } else {
          this.cd.detectChanges();
        }
      })
  }

  checkValidation(i: number) {
    if (this.addAccountingArray[i].details == null) {
      this.addAccountingArray[i].details = '';
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
              } else {
                this.addAccountingArray[i].accountingBankDb = 'TRUE';
              }
            }
            if (this.addAccountingArray[i].paidTo != '22') {

              if (this.addAccountingArray[i].paidTo == '21') {
                this.addAccountingArray[i].accountingOilCoCr = 'TRUE';
              } else {
                if (this.addAccountingArray[i].paidTo == '36') {
                } else {
                  this.addAccountingArray[i].accountingBankCr = 'TRUE'
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
      this.cd.detectChanges();
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
              } else {
                this.addAccountingArray[i].accountingBankDb = 'TRUE';
              }
            }
            if (this.addAccountingArray[i].paidTo != '22') {
              if (this.addAccountingArray[i].paidTo == '21') {
                this.addAccountingArray[i].accountingOilCoCr = 'TRUE';
              } else {
                if (this.addAccountingArray[i].paidTo == '36') {
                } else {
                  this.addAccountingArray[i].accountingBankCr = 'TRUE';
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
      this.cd.detectChanges();
    }
  }

  getByBook(id: any, i: number) {
    if (id.target.value == 'Oil Company') {
      this.addAccountingArray[i].transactionType = '';
      this.addAccountingArray[i].isDefault = false;
      this.addAccountingArray[i].isOil = true;
      this.addAccountingArray[i].isBank = false;
      this.addAccountingArray[i].isCash = false;
      this.addAccountingArray[i].isPOS = false;
      this.addAccountingArray[i].isExpense = false;

      this.addAccountingArray[i].paidFrom = '';
      this.addAccountingArray[i].inputFrom = ''
      this.addAccountingArray[i].isDefaultFrom = true;
      this.addAccountingArray[i].isOilAccFrom = false;
      this.addAccountingArray[i].isBankAccFrom = false;
      this.addAccountingArray[i].isInputBoxFrom = false;
      this.addAccountingArray[i].isLoanAccFrom = false;
      this.addAccountingArray[i].isCashAccFrom = false;
      this.addAccountingArray[i].isPOSAccFrom = false;
      this.addAccountingArray[i].isCashBankFrom = false;
      this.addAccountingArray[i].isExpenseAccFrom = false;

      this.addAccountingArray[i].paidTo = '';
      this.addAccountingArray[i].inputTo = ''
      this.addAccountingArray[i].isDefaultTo = true;
      this.addAccountingArray[i].isOilAccTo = false;
      this.addAccountingArray[i].isBankAccTo = false;
      this.addAccountingArray[i].isInputBoxTo = false;
      this.addAccountingArray[i].isLoanAccTo = false;
      this.addAccountingArray[i].isCashAccTo = false;
      this.addAccountingArray[i].isPOSAccTo = false;
      this.addAccountingArray[i].isCashBankTo = false;
      this.addAccountingArray[i].isExpenseAccTo = false;
    } else {
      if (id.target.value == 'Bank') {
        this.addAccountingArray[i].transactionType = '';
        this.addAccountingArray[i].isDefault = false;
        this.addAccountingArray[i].isOil = false;
        this.addAccountingArray[i].isBank = true;
        this.addAccountingArray[i].isCash = false;
        this.addAccountingArray[i].isPOS = false;
        this.addAccountingArray[i].isExpense = false;

        this.addAccountingArray[i].paidFrom = '';
        this.addAccountingArray[i].inputFrom = ''
        this.addAccountingArray[i].isDefaultFrom = true;
        this.addAccountingArray[i].isOilAccFrom = false;
        this.addAccountingArray[i].isBankAccFrom = false;
        this.addAccountingArray[i].isInputBoxFrom = false;
        this.addAccountingArray[i].isLoanAccFrom = false;
        this.addAccountingArray[i].isCashAccFrom = false;
        this.addAccountingArray[i].isPOSAccFrom = false;
        this.addAccountingArray[i].isCashBankFrom = false;
        this.addAccountingArray[i].isExpenseAccFrom = false;

        this.addAccountingArray[i].paidTo = '';
        this.addAccountingArray[i].inputTo = ''
        this.addAccountingArray[i].isDefaultTo = true;
        this.addAccountingArray[i].isOilAccTo = false;
        this.addAccountingArray[i].isBankAccTo = false;
        this.addAccountingArray[i].isInputBoxTo = false;
        this.addAccountingArray[i].isLoanAccTo = false;
        this.addAccountingArray[i].isCashAccTo = false;
        this.addAccountingArray[i].isPOSAccTo = false;
        this.addAccountingArray[i].isCashBankTo = false;
        this.addAccountingArray[i].isExpenseAccTo = false;
      } else {
        if (id.target.value == 'Cash') {
          this.addAccountingArray[i].transactionType = '';
          this.addAccountingArray[i].isDefault = false;
          this.addAccountingArray[i].isOil = false;
          this.addAccountingArray[i].isBank = false;
          this.addAccountingArray[i].isCash = true;
          this.addAccountingArray[i].isPOS = false;
          this.addAccountingArray[i].isExpense = false;

          this.addAccountingArray[i].paidFrom = '';
          this.addAccountingArray[i].inputFrom = ''
          this.addAccountingArray[i].isDefaultFrom = true;
          this.addAccountingArray[i].isOilAccFrom = false;
          this.addAccountingArray[i].isBankAccFrom = false;
          this.addAccountingArray[i].isInputBoxFrom = false;
          this.addAccountingArray[i].isLoanAccFrom = false;
          this.addAccountingArray[i].isCashAccFrom = false;
          this.addAccountingArray[i].isPOSAccFrom = false;
          this.addAccountingArray[i].isCashBankFrom = false;
          this.addAccountingArray[i].isExpenseAccFrom = false;

          this.addAccountingArray[i].paidTo = '';
          this.addAccountingArray[i].inputTo = '';
          this.addAccountingArray[i].isDefaultTo = true;
          this.addAccountingArray[i].isOilAccTo = false;
          this.addAccountingArray[i].isBankAccTo = false;
          this.addAccountingArray[i].isInputBoxTo = false;
          this.addAccountingArray[i].isLoanAccTo = false;
          this.addAccountingArray[i].isCashAccTo = false;
          this.addAccountingArray[i].isPOSAccTo = false;
          this.addAccountingArray[i].isCashBankTo = false;
          this.addAccountingArray[i].isExpenseAccTo = false;
        } else {
          if (id.target.value == 'POS') {
            this.addAccountingArray[i].transactionType = '';
            this.addAccountingArray[i].isDefault = false;
            this.addAccountingArray[i].isOil = false;
            this.addAccountingArray[i].isBank = false;
            this.addAccountingArray[i].isCash = false;
            this.addAccountingArray[i].isPOS = true;
            this.addAccountingArray[i].isExpense = false;

            this.addAccountingArray[i].paidFrom = '';
            this.addAccountingArray[i].inputFrom = ''
            this.addAccountingArray[i].isDefaultFrom = true;
            this.addAccountingArray[i].isOilAccFrom = false;
            this.addAccountingArray[i].isBankAccFrom = false;
            this.addAccountingArray[i].isInputBoxFrom = false;
            this.addAccountingArray[i].isLoanAccFrom = false;
            this.addAccountingArray[i].isCashAccFrom = false;
            this.addAccountingArray[i].isPOSAccFrom = false;
            this.addAccountingArray[i].isCashBankFrom = false;
            this.addAccountingArray[i].isExpenseAccFrom = false;

            this.addAccountingArray[i].paidTo = '';
            this.addAccountingArray[i].inputTo = '';
            this.addAccountingArray[i].isDefaultTo = true;
            this.addAccountingArray[i].isOilAccTo = false;
            this.addAccountingArray[i].isBankAccTo = false;
            this.addAccountingArray[i].isInputBoxTo = false;
            this.addAccountingArray[i].isLoanAccTo = false;
            this.addAccountingArray[i].isCashAccTo = false;
            this.addAccountingArray[i].isPOSAccTo = false;
            this.addAccountingArray[i].isCashBankTo = false;
            this.addAccountingArray[i].isExpenseAccTo = false;
          } else {
            if (id.target.value == 'Expense') {
              this.addAccountingArray[i].transactionType = '';
              this.addAccountingArray[i].isDefault = false;
              this.addAccountingArray[i].isOil = false;
              this.addAccountingArray[i].isBank = false;
              this.addAccountingArray[i].isCash = false;
              this.addAccountingArray[i].isPOS = false;
              this.addAccountingArray[i].isExpense = true;
            } else {
              this.addAccountingArray[i].transactionType = '';
              this.addAccountingArray[i].isDefault = true;
              this.addAccountingArray[i].isOil = false;
              this.addAccountingArray[i].isBank = false;
              this.addAccountingArray[i].isCash = false;
              this.addAccountingArray[i].isPOS = false;
              this.addAccountingArray[i].isExpense = false;

              this.addAccountingArray[i].paidFrom = '';
              this.addAccountingArray[i].inputFrom = ''
              this.addAccountingArray[i].isDefaultFrom = true;
              this.addAccountingArray[i].isOilAccFrom = false;
              this.addAccountingArray[i].isBankAccFrom = false;
              this.addAccountingArray[i].isInputBoxFrom = false;
              this.addAccountingArray[i].isLoanAccFrom = false;
              this.addAccountingArray[i].isCashAccFrom = false;
              this.addAccountingArray[i].isPOSAccFrom = false;
              this.addAccountingArray[i].isCashBankFrom = false;
              this.addAccountingArray[i].isExpenseAccFrom = false;

              this.addAccountingArray[i].paidTo = '';
              this.addAccountingArray[i].inputTo = '';
              this.addAccountingArray[i].isDefaultTo = true;
              this.addAccountingArray[i].isOilAccTo = false;
              this.addAccountingArray[i].isBankAccTo = false;
              this.addAccountingArray[i].isInputBoxTo = false;
              this.addAccountingArray[i].isLoanAccTo = false;
              this.addAccountingArray[i].isCashAccTo = false;
              this.addAccountingArray[i].isPOSAccTo = false;
              this.addAccountingArray[i].isCashBankTo = false;
              this.addAccountingArray[i].isExpenseAccTo = false;
            }

          }

        }

      }

    }

    this.checkValidation(i)
  }

  getByTransactionType(id: any, i: number) {
    if (this.addAccountingArray[i].book == 'Oil Company') {
      if (id.target.value == 'Paid from Bank A/c') {
        this.addAccountingArray[i].paidFrom = '';
        this.addAccountingArray[i].inputFrom = ''
        this.addAccountingArray[i].isDefaultFrom = false;
        this.addAccountingArray[i].isOilAccFrom = false;
        this.addAccountingArray[i].isBankAccFrom = true;
        this.addAccountingArray[i].isInputBoxFrom = false;
        this.addAccountingArray[i].isLoanAccFrom = false;
        this.addAccountingArray[i].isCashAccFrom = false;
        this.addAccountingArray[i].isPOSAccFrom = false;
        this.addAccountingArray[i].isCashBankFrom = false;
        this.addAccountingArray[i].isExpenseAccFrom = false;

        this.addAccountingArray[i].paidTo = '21';
        this.addAccountingArray[i].inputTo = '';
        this.addAccountingArray[i].isDefaultTo = false;
        this.addAccountingArray[i].isOilAccTo = true;
        this.addAccountingArray[i].isBankAccTo = false;
        this.addAccountingArray[i].isInputBoxTo = false;
        this.addAccountingArray[i].isLoanAccTo = false;
        this.addAccountingArray[i].isCashAccTo = false;
        this.addAccountingArray[i].isPOSAccTo = false;
        this.addAccountingArray[i].isCashBankTo = false;
        this.addAccountingArray[i].isExpenseAccTo = false;

        this.addAccountingArray[i].accountingBankCr = 'FALSE';
        this.addAccountingArray[i].accountingBankDb = 'TRUE';
        this.addAccountingArray[i].accountingCashCr = 'FALSE';
        this.addAccountingArray[i].accountingCashDb = 'FALSE';
        this.addAccountingArray[i].accountingOilCoCr = 'TRUE';
        this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
        this.addAccountingArray[i].accountingPOSDb = 'FALSE';
        this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
        this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
        this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';

      } else {
        if (id.target.value == 'Charges') {
          this.addAccountingArray[i].paidFrom = '21';
          this.addAccountingArray[i].inputFrom = ''
          this.addAccountingArray[i].isDefaultFrom = false;
          this.addAccountingArray[i].isOilAccFrom = true;
          this.addAccountingArray[i].isBankAccFrom = false;
          this.addAccountingArray[i].isInputBoxFrom = false;
          this.addAccountingArray[i].isLoanAccFrom = false;
          this.addAccountingArray[i].isCashAccFrom = false;
          this.addAccountingArray[i].isPOSAccFrom = false;
          this.addAccountingArray[i].isCashBankFrom = false;
          this.addAccountingArray[i].isExpenseAccFrom = false;

          this.addAccountingArray[i].paidTo = '36';
          this.addAccountingArray[i].inputTo = '';
          this.addAccountingArray[i].isDefaultTo = false;
          this.addAccountingArray[i].isOilAccTo = false;
          this.addAccountingArray[i].isBankAccTo = false;
          this.addAccountingArray[i].isInputBoxTo = false;
          this.addAccountingArray[i].isLoanAccTo = false;
          this.addAccountingArray[i].isCashAccTo = false;
          this.addAccountingArray[i].isPOSAccTo = false;
          this.addAccountingArray[i].isCashBankTo = false;
          this.addAccountingArray[i].isExpenseAccTo = true;

          this.addAccountingArray[i].accountingBankCr = 'FALSE';
          this.addAccountingArray[i].accountingBankDb = 'FALSE';
          this.addAccountingArray[i].accountingCashCr = 'FALSE';
          this.addAccountingArray[i].accountingCashDb = 'FALSE';
          this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
          this.addAccountingArray[i].accountingOilCoDb = 'TRUE';
          this.addAccountingArray[i].accountingPOSDb = 'FALSE';
          this.addAccountingArray[i].accountingExpenseCr = 'TRUE';
          this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
          this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
        } else {
          if (id.target.value == 'Point Contribution') {
            this.addAccountingArray[i].paidFrom = '21';
            this.addAccountingArray[i].inputFrom = ''
            this.addAccountingArray[i].isDefaultFrom = false;
            this.addAccountingArray[i].isOilAccFrom = true;
            this.addAccountingArray[i].isBankAccFrom = false;
            this.addAccountingArray[i].isInputBoxFrom = false;
            this.addAccountingArray[i].isLoanAccFrom = false;
            this.addAccountingArray[i].isCashAccFrom = false;
            this.addAccountingArray[i].isPOSAccFrom = false;
            this.addAccountingArray[i].isCashBankFrom = false;
            this.addAccountingArray[i].isExpenseAccFrom = false;

            this.addAccountingArray[i].paidTo = '36';
            this.addAccountingArray[i].inputTo = '';
            this.addAccountingArray[i].isDefaultTo = false;
            this.addAccountingArray[i].isOilAccTo = false;
            this.addAccountingArray[i].isBankAccTo = false;
            this.addAccountingArray[i].isInputBoxTo = false;
            this.addAccountingArray[i].isLoanAccTo = false;
            this.addAccountingArray[i].isCashAccTo = false;
            this.addAccountingArray[i].isPOSAccTo = false;
            this.addAccountingArray[i].isCashBankTo = false;
            this.addAccountingArray[i].isExpenseAccTo = true;

            this.addAccountingArray[i].accountingBankCr = 'FALSE';
            this.addAccountingArray[i].accountingBankDb = 'FALSE';
            this.addAccountingArray[i].accountingCashCr = 'FALSE';
            this.addAccountingArray[i].accountingCashDb = 'FALSE';
            this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
            this.addAccountingArray[i].accountingOilCoDb = 'TRUE';
            this.addAccountingArray[i].accountingPOSDb = 'FALSE';
            this.addAccountingArray[i].accountingExpenseCr = 'TRUE';
            this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
            this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
          } else {
            if (id.target.value == 'Received payment') {
              this.addAccountingArray[i].paidFrom = '22';
              this.addAccountingArray[i].inputFrom = ''
              this.addAccountingArray[i].isDefaultFrom = false;
              this.addAccountingArray[i].isOilAccFrom = false;
              this.addAccountingArray[i].isBankAccFrom = false;
              this.addAccountingArray[i].isInputBoxFrom = true;
              this.addAccountingArray[i].isLoanAccFrom = false;
              this.addAccountingArray[i].isCashAccFrom = false;
              this.addAccountingArray[i].isPOSAccFrom = false;
              this.addAccountingArray[i].isCashBankFrom = false;
              this.addAccountingArray[i].isExpenseAccFrom = false;

              this.addAccountingArray[i].paidTo = '21';
              this.addAccountingArray[i].inputTo = '';
              this.addAccountingArray[i].isDefaultTo = false;
              this.addAccountingArray[i].isOilAccTo = true;
              this.addAccountingArray[i].isBankAccTo = false;
              this.addAccountingArray[i].isInputBoxTo = false;
              this.addAccountingArray[i].isLoanAccTo = false;
              this.addAccountingArray[i].isCashAccTo = false;
              this.addAccountingArray[i].isPOSAccTo = false;
              this.addAccountingArray[i].isCashBankTo = false;
              this.addAccountingArray[i].isExpenseAccTo = false;

              this.addAccountingArray[i].accountingBankCr = 'FALSE';
              this.addAccountingArray[i].accountingBankDb = 'FALSE';
              this.addAccountingArray[i].accountingCashCr = 'FALSE';
              this.addAccountingArray[i].accountingCashDb = 'FALSE';
              this.addAccountingArray[i].accountingOilCoCr = 'TRUE';
              this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
              this.addAccountingArray[i].accountingPOSDb = 'FALSE';
              this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
              this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
              this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
            } else {
              if (id.target.value == 'Gave payment') {
                this.addAccountingArray[i].paidFrom = '21';
                this.addAccountingArray[i].inputFrom = ''
                this.addAccountingArray[i].isDefaultFrom = false;
                this.addAccountingArray[i].isOilAccFrom = true;
                this.addAccountingArray[i].isBankAccFrom = false;
                this.addAccountingArray[i].isInputBoxFrom = false;
                this.addAccountingArray[i].isLoanAccFrom = false;
                this.addAccountingArray[i].isCashAccFrom = false;
                this.addAccountingArray[i].isPOSAccFrom = false;
                this.addAccountingArray[i].isCashBankFrom = false;
                this.addAccountingArray[i].isExpenseAccFrom = false;

                this.addAccountingArray[i].paidTo = '22';
                this.addAccountingArray[i].inputTo = '';
                this.addAccountingArray[i].isDefaultTo = false;
                this.addAccountingArray[i].isOilAccTo = false;
                this.addAccountingArray[i].isBankAccTo = false;
                this.addAccountingArray[i].isInputBoxTo = true;
                this.addAccountingArray[i].isLoanAccTo = false;
                this.addAccountingArray[i].isCashAccTo = false;
                this.addAccountingArray[i].isPOSAccTo = false;
                this.addAccountingArray[i].isCashBankTo = false;
                this.addAccountingArray[i].isExpenseAccTo = false;

                this.addAccountingArray[i].accountingBankCr = 'FALSE';
                this.addAccountingArray[i].accountingBankDb = 'FALSE';
                this.addAccountingArray[i].accountingCashCr = 'FALSE';
                this.addAccountingArray[i].accountingCashDb = 'FALSE';
                this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                this.addAccountingArray[i].accountingOilCoDb = 'TRUE';
                this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
                this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
              } else {
                this.addAccountingArray[i].paidFrom = '';
                this.addAccountingArray[i].inputFrom = ''
                this.addAccountingArray[i].isDefaultFrom = true;
                this.addAccountingArray[i].isOilAccFrom = false;
                this.addAccountingArray[i].isBankAccFrom = false;
                this.addAccountingArray[i].isInputBoxFrom = false;
                this.addAccountingArray[i].isLoanAccFrom = false;
                this.addAccountingArray[i].isCashAccFrom = false;
                this.addAccountingArray[i].isPOSAccFrom = false;
                this.addAccountingArray[i].isCashBankFrom = false;
                this.addAccountingArray[i].isExpenseAccFrom = false;

                this.addAccountingArray[i].paidTo = '';
                this.addAccountingArray[i].inputTo = '';
                this.addAccountingArray[i].isDefaultTo = true;
                this.addAccountingArray[i].isOilAccTo = false;
                this.addAccountingArray[i].isBankAccTo = false;
                this.addAccountingArray[i].isInputBoxTo = false;
                this.addAccountingArray[i].isLoanAccTo = false;
                this.addAccountingArray[i].isCashAccTo = false;
                this.addAccountingArray[i].isPOSAccTo = false;
                this.addAccountingArray[i].isCashBankTo = false;
                this.addAccountingArray[i].isExpenseAccTo = false;

                this.addAccountingArray[i].accountingBankCr = 'FALSE';
                this.addAccountingArray[i].accountingBankDb = 'FALSE';
                this.addAccountingArray[i].accountingCashCr = 'FALSE';
                this.addAccountingArray[i].accountingCashDb = 'FALSE';
                this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
                this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
              }
            }
          }
        }
      }
    } else {
      if (this.addAccountingArray[i].book == 'Bank') {
        if (id.target.value == 'A/c Transfer') {
          this.addAccountingArray[i].paidFrom = '';
          this.addAccountingArray[i].inputFrom = ''
          this.addAccountingArray[i].isDefaultFrom = false;
          this.addAccountingArray[i].isOilAccFrom = false;
          this.addAccountingArray[i].isBankAccFrom = true;
          this.addAccountingArray[i].isInputBoxFrom = false;
          this.addAccountingArray[i].isLoanAccFrom = false;
          this.addAccountingArray[i].isCashAccFrom = false;
          this.addAccountingArray[i].isPOSAccFrom = false;
          this.addAccountingArray[i].isCashBankFrom = false;
          this.addAccountingArray[i].isExpenseAccFrom = false;

          this.addAccountingArray[i].paidTo = '';
          this.addAccountingArray[i].inputTo = '';
          this.addAccountingArray[i].isDefaultTo = false;
          this.addAccountingArray[i].isOilAccTo = false;
          this.addAccountingArray[i].isBankAccTo = true;
          this.addAccountingArray[i].isInputBoxTo = false;
          this.addAccountingArray[i].isLoanAccTo = false;
          this.addAccountingArray[i].isCashAccTo = false;
          this.addAccountingArray[i].isPOSAccTo = false;
          this.addAccountingArray[i].isCashBankTo = false;
          this.addAccountingArray[i].isExpenseAccTo = false;

          this.addAccountingArray[i].accountingBankCr = 'TRUE';
          this.addAccountingArray[i].accountingBankDb = 'TRUE';
          this.addAccountingArray[i].accountingCashCr = 'FALSE';
          this.addAccountingArray[i].accountingCashDb = 'FALSE';
          this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
          this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
          this.addAccountingArray[i].accountingPOSDb = 'FALSE';
          this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
          this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
          this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
        } else {
          if (id.target.value == 'Received payment') {
            this.addAccountingArray[i].paidFrom = '22';
            this.addAccountingArray[i].inputFrom = ''
            this.addAccountingArray[i].isDefaultFrom = false;
            this.addAccountingArray[i].isOilAccFrom = false;
            this.addAccountingArray[i].isBankAccFrom = false;
            this.addAccountingArray[i].isInputBoxFrom = true;
            this.addAccountingArray[i].isLoanAccFrom = false;
            this.addAccountingArray[i].isCashAccFrom = false;
            this.addAccountingArray[i].isPOSAccFrom = false;
            this.addAccountingArray[i].isCashBankFrom = false;
            this.addAccountingArray[i].isExpenseAccFrom = false;

            this.addAccountingArray[i].paidTo = '';
            this.addAccountingArray[i].inputTo = '';
            this.addAccountingArray[i].isDefaultTo = false;
            this.addAccountingArray[i].isOilAccTo = false;
            this.addAccountingArray[i].isBankAccTo = true;
            this.addAccountingArray[i].isInputBoxTo = false;
            this.addAccountingArray[i].isLoanAccTo = false;
            this.addAccountingArray[i].isCashAccTo = false;
            this.addAccountingArray[i].isPOSAccTo = false;
            this.addAccountingArray[i].isCashBankTo = false;
            this.addAccountingArray[i].isExpenseAccTo = false;

            this.addAccountingArray[i].accountingBankCr = 'TRUE';
            this.addAccountingArray[i].accountingBankDb = 'FALSE';
            this.addAccountingArray[i].accountingCashCr = 'FALSE';
            this.addAccountingArray[i].accountingCashDb = 'FALSE';
            this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
            this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
            this.addAccountingArray[i].accountingPOSDb = 'FALSE';
            this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
            this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
            this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
          } else {
            if (id.target.value == 'Gave payment') {
              this.addAccountingArray[i].paidFrom = '';
              this.addAccountingArray[i].inputFrom = ''
              this.addAccountingArray[i].isDefaultFrom = false;
              this.addAccountingArray[i].isOilAccFrom = false;
              this.addAccountingArray[i].isBankAccFrom = true;
              this.addAccountingArray[i].isInputBoxFrom = false;
              this.addAccountingArray[i].isLoanAccFrom = false;
              this.addAccountingArray[i].isCashAccFrom = false;
              this.addAccountingArray[i].isPOSAccFrom = false;
              this.addAccountingArray[i].isCashBankFrom = false;
              this.addAccountingArray[i].isExpenseAccFrom = false;

              this.addAccountingArray[i].paidTo = '22';
              this.addAccountingArray[i].inputTo = '';
              this.addAccountingArray[i].isDefaultTo = false;
              this.addAccountingArray[i].isOilAccTo = false;
              this.addAccountingArray[i].isBankAccTo = false;
              this.addAccountingArray[i].isInputBoxTo = true;
              this.addAccountingArray[i].isLoanAccTo = false;
              this.addAccountingArray[i].isCashAccTo = false;
              this.addAccountingArray[i].isPOSAccTo = false;
              this.addAccountingArray[i].isCashBankTo = false;
              this.addAccountingArray[i].isExpenseAccTo = false;

              this.addAccountingArray[i].accountingBankCr = 'FALSE';
              this.addAccountingArray[i].accountingBankDb = 'TRUE';
              this.addAccountingArray[i].accountingCashCr = 'FALSE';
              this.addAccountingArray[i].accountingCashDb = 'FALSE';
              this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
              this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
              this.addAccountingArray[i].accountingPOSDb = 'FALSE';
              this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
              this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
              this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
            } else {
              if (id.target.value == 'Charges') {
                this.addAccountingArray[i].paidFrom = '';
                this.addAccountingArray[i].inputFrom = ''
                this.addAccountingArray[i].isDefaultFrom = false;
                this.addAccountingArray[i].isOilAccFrom = false;
                this.addAccountingArray[i].isBankAccFrom = true;
                this.addAccountingArray[i].isInputBoxFrom = false;
                this.addAccountingArray[i].isLoanAccFrom = false;
                this.addAccountingArray[i].isCashAccFrom = false;
                this.addAccountingArray[i].isPOSAccFrom = false;
                this.addAccountingArray[i].isCashBankFrom = false;
                this.addAccountingArray[i].isExpenseAccFrom = false;

                this.addAccountingArray[i].paidTo = '36';
                this.addAccountingArray[i].inputTo = '';
                this.addAccountingArray[i].isDefaultTo = false;
                this.addAccountingArray[i].isOilAccTo = false;
                this.addAccountingArray[i].isBankAccTo = false;
                this.addAccountingArray[i].isInputBoxTo = false;
                this.addAccountingArray[i].isLoanAccTo = false;
                this.addAccountingArray[i].isCashAccTo = false;
                this.addAccountingArray[i].isPOSAccTo = false;
                this.addAccountingArray[i].isCashBankTo = false;
                this.addAccountingArray[i].isExpenseAccTo = true;

                this.addAccountingArray[i].accountingBankCr = 'FALSE';
                this.addAccountingArray[i].accountingBankDb = 'TRUE';
                this.addAccountingArray[i].accountingCashCr = 'FALSE';
                this.addAccountingArray[i].accountingCashDb = 'FALSE';
                this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                this.addAccountingArray[i].accountingExpenseCr = 'TRUE';
                this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
              } else {
                if (id.target.value == 'Loan – Interest') {
                  this.addAccountingArray[i].paidFrom = '';
                  this.addAccountingArray[i].inputFrom = ''
                  this.addAccountingArray[i].isDefaultFrom = false;
                  this.addAccountingArray[i].isOilAccFrom = false;
                  this.addAccountingArray[i].isBankAccFrom = false;
                  this.addAccountingArray[i].isInputBoxFrom = false;
                  this.addAccountingArray[i].isLoanAccFrom = true;
                  this.addAccountingArray[i].isCashAccFrom = false;
                  this.addAccountingArray[i].isPOSAccFrom = false;
                  this.addAccountingArray[i].isCashBankFrom = false;
                  this.addAccountingArray[i].isExpenseAccFrom = false;

                  this.addAccountingArray[i].paidTo = '36';
                  this.addAccountingArray[i].inputTo = '';
                  this.addAccountingArray[i].isDefaultTo = false;
                  this.addAccountingArray[i].isOilAccTo = false;
                  this.addAccountingArray[i].isBankAccTo = false;
                  this.addAccountingArray[i].isInputBoxTo = false;
                  this.addAccountingArray[i].isLoanAccTo = false;
                  this.addAccountingArray[i].isCashAccTo = false;
                  this.addAccountingArray[i].isPOSAccTo = false;
                  this.addAccountingArray[i].isCashBankTo = false;
                  this.addAccountingArray[i].isExpenseAccTo = true;

                  this.addAccountingArray[i].accountingBankCr = 'FALSE';
                  this.addAccountingArray[i].accountingBankDb = 'FALSE';
                  this.addAccountingArray[i].accountingCashCr = 'FALSE';
                  this.addAccountingArray[i].accountingCashDb = 'FALSE';
                  this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                  this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                  this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                  this.addAccountingArray[i].accountingExpenseCr = 'TRUE';
                  this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                  this.addAccountingArray[i].accountingLoanAccDb = 'TRUE';
                } else {
                  if (id.target.value == 'Loan – Repayment') {
                    this.addAccountingArray[i].paidFrom = '';
                    this.addAccountingArray[i].inputFrom = ''
                    this.addAccountingArray[i].isDefaultFrom = false;
                    this.addAccountingArray[i].isOilAccFrom = false;
                    this.addAccountingArray[i].isBankAccFrom = false;
                    this.addAccountingArray[i].isInputBoxFrom = false;
                    this.addAccountingArray[i].isLoanAccFrom = false;
                    this.addAccountingArray[i].isCashAccFrom = false;
                    this.addAccountingArray[i].isPOSAccFrom = false;
                    this.addAccountingArray[i].isCashBankFrom = true;
                    this.addAccountingArray[i].isExpenseAccFrom = false;

                    this.addAccountingArray[i].paidTo = '';
                    this.addAccountingArray[i].inputTo = '';
                    this.addAccountingArray[i].isDefaultTo = false;
                    this.addAccountingArray[i].isOilAccTo = false;
                    this.addAccountingArray[i].isBankAccTo = false;
                    this.addAccountingArray[i].isInputBoxTo = false;
                    this.addAccountingArray[i].isLoanAccTo = true;
                    this.addAccountingArray[i].isCashAccTo = false;
                    this.addAccountingArray[i].isPOSAccTo = false;
                    this.addAccountingArray[i].isCashBankTo = false;
                    this.addAccountingArray[i].isExpenseAccTo = false;

                    this.addAccountingArray[i].accountingBankCr = 'FALSE';
                    this.addAccountingArray[i].accountingBankDb = 'FALSE';
                    this.addAccountingArray[i].accountingCashCr = 'FALSE';
                    this.addAccountingArray[i].accountingCashDb = 'FALSE';
                    this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                    this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                    this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                    this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
                    this.addAccountingArray[i].accountingLoanAccCr = 'TRUE';
                    this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
                  } else {
                    if (id.target.value == 'Loan A/c To Bank A/c') {
                      this.addAccountingArray[i].paidFrom = '';
                      this.addAccountingArray[i].inputFrom = ''
                      this.addAccountingArray[i].isDefaultFrom = false;
                      this.addAccountingArray[i].isOilAccFrom = false;
                      this.addAccountingArray[i].isBankAccFrom = false;
                      this.addAccountingArray[i].isInputBoxFrom = false;
                      this.addAccountingArray[i].isLoanAccFrom = true;
                      this.addAccountingArray[i].isCashAccFrom = false;
                      this.addAccountingArray[i].isPOSAccFrom = false;
                      this.addAccountingArray[i].isCashBankFrom = false;
                      this.addAccountingArray[i].isExpenseAccFrom = false;

                      this.addAccountingArray[i].paidTo = '';
                      this.addAccountingArray[i].inputTo = '';
                      this.addAccountingArray[i].isDefaultTo = false;
                      this.addAccountingArray[i].isOilAccTo = false;
                      this.addAccountingArray[i].isBankAccTo = true;
                      this.addAccountingArray[i].isInputBoxTo = false;
                      this.addAccountingArray[i].isLoanAccTo = false;
                      this.addAccountingArray[i].isCashAccTo = false;
                      this.addAccountingArray[i].isPOSAccTo = false;
                      this.addAccountingArray[i].isCashBankTo = false;
                      this.addAccountingArray[i].isExpenseAccTo = false;

                      this.addAccountingArray[i].accountingBankCr = 'TRUE';
                      this.addAccountingArray[i].accountingBankDb = 'FALSE';
                      this.addAccountingArray[i].accountingCashCr = 'FALSE';
                      this.addAccountingArray[i].accountingCashDb = 'FALSE';
                      this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                      this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                      this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                      this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
                      this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                      this.addAccountingArray[i].accountingLoanAccDb = 'TRUE';
                    } else {
                      if (id.target.value == 'Loan A/c To Oil Co A/c') {
                        this.addAccountingArray[i].paidFrom = '';
                        this.addAccountingArray[i].inputFrom = ''
                        this.addAccountingArray[i].isDefaultFrom = false;
                        this.addAccountingArray[i].isOilAccFrom = false;
                        this.addAccountingArray[i].isBankAccFrom = false;
                        this.addAccountingArray[i].isInputBoxFrom = false;
                        this.addAccountingArray[i].isLoanAccFrom = true;
                        this.addAccountingArray[i].isCashAccFrom = false;
                        this.addAccountingArray[i].isPOSAccFrom = false;
                        this.addAccountingArray[i].isCashBankFrom = false;
                        this.addAccountingArray[i].isExpenseAccFrom = false;

                        this.addAccountingArray[i].paidTo = '21';
                        this.addAccountingArray[i].inputTo = '';
                        this.addAccountingArray[i].isDefaultTo = false;
                        this.addAccountingArray[i].isOilAccTo = true;
                        this.addAccountingArray[i].isBankAccTo = false;
                        this.addAccountingArray[i].isInputBoxTo = false;
                        this.addAccountingArray[i].isLoanAccTo = false;
                        this.addAccountingArray[i].isCashAccTo = false;
                        this.addAccountingArray[i].isPOSAccTo = false;
                        this.addAccountingArray[i].isCashBankTo = false;
                        this.addAccountingArray[i].isExpenseAccTo = false;

                        this.addAccountingArray[i].accountingBankCr = 'FALSE';
                        this.addAccountingArray[i].accountingBankDb = 'FALSE';
                        this.addAccountingArray[i].accountingCashCr = 'FALSE';
                        this.addAccountingArray[i].accountingCashDb = 'FALSE';
                        this.addAccountingArray[i].accountingOilCoCr = 'TRUE';
                        this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                        this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                        this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
                        this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                        this.addAccountingArray[i].accountingLoanAccDb = 'TRUE';
                      } else {
                        this.addAccountingArray[i].paidFrom = '';
                        this.addAccountingArray[i].inputFrom = ''
                        this.addAccountingArray[i].isDefaultFrom = true;
                        this.addAccountingArray[i].isOilAccFrom = false;
                        this.addAccountingArray[i].isBankAccFrom = false;
                        this.addAccountingArray[i].isInputBoxFrom = false;
                        this.addAccountingArray[i].isLoanAccFrom = false;
                        this.addAccountingArray[i].isCashAccFrom = false;
                        this.addAccountingArray[i].isPOSAccFrom = false;
                        this.addAccountingArray[i].isCashBankFrom = false;
                        this.addAccountingArray[i].isExpenseAccFrom = false;

                        this.addAccountingArray[i].paidTo = '';
                        this.addAccountingArray[i].inputTo = '';
                        this.addAccountingArray[i].isDefaultTo = true;
                        this.addAccountingArray[i].isOilAccTo = false;
                        this.addAccountingArray[i].isBankAccTo = false;
                        this.addAccountingArray[i].isInputBoxTo = false;
                        this.addAccountingArray[i].isLoanAccTo = false;
                        this.addAccountingArray[i].isCashAccTo = false;
                        this.addAccountingArray[i].isPOSAccTo = false;
                        this.addAccountingArray[i].isCashBankTo = false;
                        this.addAccountingArray[i].isExpenseAccTo = false;

                        this.addAccountingArray[i].accountingBankCr = 'FALSE';
                        this.addAccountingArray[i].accountingBankDb = 'FALSE';
                        this.addAccountingArray[i].accountingCashCr = 'FALSE';
                        this.addAccountingArray[i].accountingCashDb = 'FALSE';
                        this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                        this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                        this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                        this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
                        this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                        this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        if (this.addAccountingArray[i].book == 'Cash') {
          if (id.target.value == 'Cash Deposit') {
            this.addAccountingArray[i].paidFrom = '20';
            this.addAccountingArray[i].inputFrom = ''
            this.addAccountingArray[i].isDefaultFrom = false;
            this.addAccountingArray[i].isOilAccFrom = false;
            this.addAccountingArray[i].isBankAccFrom = false;
            this.addAccountingArray[i].isInputBoxFrom = false;
            this.addAccountingArray[i].isLoanAccFrom = false;
            this.addAccountingArray[i].isCashAccFrom = true;
            this.addAccountingArray[i].isPOSAccFrom = false;
            this.addAccountingArray[i].isCashBankFrom = false;
            this.addAccountingArray[i].isExpenseAccFrom = false;

            this.addAccountingArray[i].paidTo = '';
            this.addAccountingArray[i].inputTo = '';
            this.addAccountingArray[i].isDefaultTo = false;
            this.addAccountingArray[i].isOilAccTo = false;
            this.addAccountingArray[i].isBankAccTo = true;
            this.addAccountingArray[i].isInputBoxTo = false;
            this.addAccountingArray[i].isLoanAccTo = false;
            this.addAccountingArray[i].isCashAccTo = false;
            this.addAccountingArray[i].isPOSAccTo = false;
            this.addAccountingArray[i].isCashBankTo = false;
            this.addAccountingArray[i].isExpenseAccTo = false;

            this.addAccountingArray[i].accountingBankCr = 'TRUE';
            this.addAccountingArray[i].accountingBankDb = 'FALSE';
            this.addAccountingArray[i].accountingCashCr = 'FALSE';
            this.addAccountingArray[i].accountingCashDb = 'TRUE';
            this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
            this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
            this.addAccountingArray[i].accountingPOSDb = 'FALSE';
            this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
            this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
            this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
          } else {
            if (id.target.value == 'Cash Withdrawal') {
              this.addAccountingArray[i].paidFrom = '';
              this.addAccountingArray[i].inputFrom = ''
              this.addAccountingArray[i].isDefaultFrom = false;
              this.addAccountingArray[i].isOilAccFrom = false;
              this.addAccountingArray[i].isBankAccFrom = true;
              this.addAccountingArray[i].isInputBoxFrom = false;
              this.addAccountingArray[i].isLoanAccFrom = false;
              this.addAccountingArray[i].isCashAccFrom = false;
              this.addAccountingArray[i].isPOSAccFrom = false;
              this.addAccountingArray[i].isCashBankFrom = false;
              this.addAccountingArray[i].isExpenseAccFrom = false;

              this.addAccountingArray[i].paidTo = '20';
              this.addAccountingArray[i].inputTo = '';
              this.addAccountingArray[i].isDefaultTo = false;
              this.addAccountingArray[i].isOilAccTo = false;
              this.addAccountingArray[i].isBankAccTo = false;
              this.addAccountingArray[i].isInputBoxTo = false;
              this.addAccountingArray[i].isLoanAccTo = false;
              this.addAccountingArray[i].isCashAccTo = true;
              this.addAccountingArray[i].isPOSAccTo = false;
              this.addAccountingArray[i].isCashBankTo = false;
              this.addAccountingArray[i].isExpenseAccTo = false;

              this.addAccountingArray[i].accountingBankCr = 'FALSE';
              this.addAccountingArray[i].accountingBankDb = 'TRUE';
              this.addAccountingArray[i].accountingCashCr = 'TRUE';
              this.addAccountingArray[i].accountingCashDb = 'FALSE';
              this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
              this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
              this.addAccountingArray[i].accountingPOSDb = 'FALSE';
              this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
              this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
              this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
            } else {
              if (id.target.value == 'Received payment') {
                this.addAccountingArray[i].paidFrom = '22';
                this.addAccountingArray[i].inputFrom = ''
                this.addAccountingArray[i].isDefaultFrom = false;
                this.addAccountingArray[i].isOilAccFrom = false;
                this.addAccountingArray[i].isBankAccFrom = false;
                this.addAccountingArray[i].isInputBoxFrom = true;
                this.addAccountingArray[i].isLoanAccFrom = false;
                this.addAccountingArray[i].isCashAccFrom = false;
                this.addAccountingArray[i].isPOSAccFrom = false;
                this.addAccountingArray[i].isCashBankFrom = false;
                this.addAccountingArray[i].isExpenseAccFrom = false;

                this.addAccountingArray[i].paidTo = '20';
                this.addAccountingArray[i].inputTo = '';
                this.addAccountingArray[i].isDefaultTo = false;
                this.addAccountingArray[i].isOilAccTo = false;
                this.addAccountingArray[i].isBankAccTo = false;
                this.addAccountingArray[i].isInputBoxTo = false;
                this.addAccountingArray[i].isLoanAccTo = false;
                this.addAccountingArray[i].isCashAccTo = true;
                this.addAccountingArray[i].isPOSAccTo = false;
                this.addAccountingArray[i].isCashBankTo = false;
                this.addAccountingArray[i].isExpenseAccTo = false;

                this.addAccountingArray[i].accountingBankCr = 'FALSE';
                this.addAccountingArray[i].accountingBankDb = 'FALSE';
                this.addAccountingArray[i].accountingCashCr = 'TRUE';
                this.addAccountingArray[i].accountingCashDb = 'FALSE';
                this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
                this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
              } else {
                if (id.target.value == 'Gave payment') {
                  this.addAccountingArray[i].paidFrom = '20';
                  this.addAccountingArray[i].inputFrom = ''
                  this.addAccountingArray[i].isDefaultFrom = false;
                  this.addAccountingArray[i].isOilAccFrom = false;
                  this.addAccountingArray[i].isBankAccFrom = false;
                  this.addAccountingArray[i].isInputBoxFrom = false;
                  this.addAccountingArray[i].isLoanAccFrom = false;
                  this.addAccountingArray[i].isCashAccFrom = true;
                  this.addAccountingArray[i].isPOSAccFrom = false;
                  this.addAccountingArray[i].isCashBankFrom = false;
                  this.addAccountingArray[i].isExpenseAccFrom = false;

                  this.addAccountingArray[i].paidTo = '22';
                  this.addAccountingArray[i].inputTo = '';
                  this.addAccountingArray[i].isDefaultTo = false;
                  this.addAccountingArray[i].isOilAccTo = false;
                  this.addAccountingArray[i].isBankAccTo = false;
                  this.addAccountingArray[i].isInputBoxTo = true;
                  this.addAccountingArray[i].isLoanAccTo = false;
                  this.addAccountingArray[i].isCashAccTo = false;
                  this.addAccountingArray[i].isPOSAccTo = false;
                  this.addAccountingArray[i].isCashBankTo = false;
                  this.addAccountingArray[i].isExpenseAccTo = false;

                  this.addAccountingArray[i].accountingBankCr = 'FALSE';
                  this.addAccountingArray[i].accountingBankDb = 'FALSE';
                  this.addAccountingArray[i].accountingCashCr = 'FALSE';
                  this.addAccountingArray[i].accountingCashDb = 'TRUE';
                  this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                  this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                  this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                  this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
                  this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                  this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
                } else {
                  this.addAccountingArray[i].paidFrom = '';
                  this.addAccountingArray[i].inputFrom = ''
                  this.addAccountingArray[i].isDefaultFrom = true;
                  this.addAccountingArray[i].isOilAccFrom = false;
                  this.addAccountingArray[i].isBankAccFrom = false;
                  this.addAccountingArray[i].isInputBoxFrom = false;
                  this.addAccountingArray[i].isLoanAccFrom = false;
                  this.addAccountingArray[i].isCashAccFrom = false;
                  this.addAccountingArray[i].isPOSAccFrom = false;
                  this.addAccountingArray[i].isCashBankFrom = false;
                  this.addAccountingArray[i].isExpenseAccFrom = false;

                  this.addAccountingArray[i].paidTo = '';
                  this.addAccountingArray[i].inputTo = '';
                  this.addAccountingArray[i].isDefaultTo = true;
                  this.addAccountingArray[i].isOilAccTo = false;
                  this.addAccountingArray[i].isBankAccTo = false;
                  this.addAccountingArray[i].isInputBoxTo = false;
                  this.addAccountingArray[i].isLoanAccTo = false;
                  this.addAccountingArray[i].isCashAccTo = false;
                  this.addAccountingArray[i].isPOSAccTo = false;
                  this.addAccountingArray[i].isCashBankTo = false;
                  this.addAccountingArray[i].isExpenseAccTo = false;

                  this.addAccountingArray[i].accountingBankCr = 'FALSE';
                  this.addAccountingArray[i].accountingBankDb = 'FALSE';
                  this.addAccountingArray[i].accountingCashCr = 'FALSE';
                  this.addAccountingArray[i].accountingCashDb = 'FALSE';
                  this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                  this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                  this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                  this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
                  this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                  this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
                }
              }
            }
          }
        } else {
          if (this.addAccountingArray[i].book == 'POS') {
            if (id.target.value == 'Gross Settlement') {
              this.addAccountingArray[i].paidFrom = '22';
              this.addAccountingArray[i].inputFrom = ''
              this.addAccountingArray[i].isDefaultFrom = false;
              this.addAccountingArray[i].isOilAccFrom = false;
              this.addAccountingArray[i].isBankAccFrom = false;
              this.addAccountingArray[i].isInputBoxFrom = false;
              this.addAccountingArray[i].isLoanAccFrom = false;
              this.addAccountingArray[i].isCashAccFrom = false;
              this.addAccountingArray[i].isPOSAccFrom = true;
              this.addAccountingArray[i].isCashBankFrom = false;
              this.addAccountingArray[i].isExpenseAccFrom = false;


              this.addAccountingArray[i].paidTo = '';
              this.addAccountingArray[i].inputTo = '';
              this.addAccountingArray[i].isDefaultTo = false;
              this.addAccountingArray[i].isOilAccTo = false;
              this.addAccountingArray[i].isBankAccTo = false;
              this.addAccountingArray[i].isInputBoxTo = false;
              this.addAccountingArray[i].isLoanAccTo = false;
              this.addAccountingArray[i].isCashAccTo = false;
              this.addAccountingArray[i].isPOSAccTo = true;
              this.addAccountingArray[i].isCashBankTo = false;
              this.addAccountingArray[i].isExpenseAccTo = false;

              this.addAccountingArray[i].accountingBankCr = 'FALSE';
              this.addAccountingArray[i].accountingBankDb = 'FALSE';
              this.addAccountingArray[i].accountingCashCr = 'FALSE';
              this.addAccountingArray[i].accountingCashDb = 'FALSE';
              this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
              this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
              this.addAccountingArray[i].accountingPOSDb = 'TRUE';
              this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
              this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
              this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
            } else {
              if (id.target.value == 'Net Settlement') {
                this.addAccountingArray[i].paidFrom = '22';
                this.addAccountingArray[i].inputFrom = ''
                this.addAccountingArray[i].isDefaultFrom = false;
                this.addAccountingArray[i].isOilAccFrom = false;
                this.addAccountingArray[i].isBankAccFrom = false;
                this.addAccountingArray[i].isInputBoxFrom = false;
                this.addAccountingArray[i].isLoanAccFrom = false;
                this.addAccountingArray[i].isCashAccFrom = false;
                this.addAccountingArray[i].isPOSAccFrom = true;
                this.addAccountingArray[i].isCashBankFrom = false;
                this.addAccountingArray[i].isExpenseAccFrom = false;


                this.addAccountingArray[i].paidTo = '';
                this.addAccountingArray[i].inputTo = '';
                this.addAccountingArray[i].isDefaultTo = false;
                this.addAccountingArray[i].isOilAccTo = false;
                this.addAccountingArray[i].isBankAccTo = false;
                this.addAccountingArray[i].isInputBoxTo = false;
                this.addAccountingArray[i].isLoanAccTo = false;
                this.addAccountingArray[i].isCashAccTo = false;
                this.addAccountingArray[i].isPOSAccTo = true;
                this.addAccountingArray[i].isCashBankTo = false;
                this.addAccountingArray[i].isExpenseAccTo = false;

                this.addAccountingArray[i].accountingBankCr = 'FALSE';
                this.addAccountingArray[i].accountingBankDb = 'FALSE';
                this.addAccountingArray[i].accountingCashCr = 'FALSE';
                this.addAccountingArray[i].accountingCashDb = 'FALSE';
                this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                this.addAccountingArray[i].accountingPOSDb = 'TRUE';
                this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
                this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
              } else {
                if (id.target.value == 'Charges') {
                  this.addAccountingArray[i].paidFrom = '22';
                  this.addAccountingArray[i].inputFrom = ''
                  this.addAccountingArray[i].isDefaultFrom = false;
                  this.addAccountingArray[i].isOilAccFrom = false;
                  this.addAccountingArray[i].isBankAccFrom = false;
                  this.addAccountingArray[i].isInputBoxFrom = false;
                  this.addAccountingArray[i].isLoanAccFrom = false;
                  this.addAccountingArray[i].isCashAccFrom = false;
                  this.addAccountingArray[i].isPOSAccFrom = true;
                  this.addAccountingArray[i].isCashBankFrom = false;
                  this.addAccountingArray[i].isExpenseAccFrom = false;

                  this.addAccountingArray[i].paidTo = '36';
                  this.addAccountingArray[i].inputTo = '';
                  this.addAccountingArray[i].isDefaultTo = false;
                  this.addAccountingArray[i].isOilAccTo = false;
                  this.addAccountingArray[i].isBankAccTo = false;
                  this.addAccountingArray[i].isInputBoxTo = false;
                  this.addAccountingArray[i].isLoanAccTo = false;
                  this.addAccountingArray[i].isCashAccTo = false;
                  this.addAccountingArray[i].isPOSAccTo = false;
                  this.addAccountingArray[i].isCashBankTo = false;
                  this.addAccountingArray[i].isExpenseAccTo = true;

                  this.addAccountingArray[i].accountingBankCr = 'FALSE';
                  this.addAccountingArray[i].accountingBankDb = 'FALSE';
                  this.addAccountingArray[i].accountingCashCr = 'FALSE';
                  this.addAccountingArray[i].accountingCashDb = 'FALSE';
                  this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                  this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                  this.addAccountingArray[i].accountingPOSDb = 'TRUE';
                  this.addAccountingArray[i].accountingExpenseCr = 'TRUE';
                  this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                  this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
                } else {

                  this.addAccountingArray[i].paidFrom = '';
                  this.addAccountingArray[i].inputFrom = ''
                  this.addAccountingArray[i].isDefaultFrom = true;
                  this.addAccountingArray[i].isOilAccFrom = false;
                  this.addAccountingArray[i].isBankAccFrom = false;
                  this.addAccountingArray[i].isInputBoxFrom = false;
                  this.addAccountingArray[i].isLoanAccFrom = false;
                  this.addAccountingArray[i].isCashAccFrom = false;
                  this.addAccountingArray[i].isPOSAccFrom = false;
                  this.addAccountingArray[i].isCashBankFrom = false;
                  this.addAccountingArray[i].isExpenseAccFrom = false;

                  this.addAccountingArray[i].paidTo = '';
                  this.addAccountingArray[i].inputTo = '';
                  this.addAccountingArray[i].isDefaultTo = true;
                  this.addAccountingArray[i].isOilAccTo = false;
                  this.addAccountingArray[i].isBankAccTo = false;
                  this.addAccountingArray[i].isInputBoxTo = false;
                  this.addAccountingArray[i].isLoanAccTo = false;
                  this.addAccountingArray[i].isCashAccTo = false;
                  this.addAccountingArray[i].isPOSAccTo = false;
                  this.addAccountingArray[i].isCashBankTo = false;
                  this.addAccountingArray[i].isExpenseAccTo = false;

                  this.addAccountingArray[i].accountingBankCr = 'FALSE';
                  this.addAccountingArray[i].accountingBankDb = 'FALSE';
                  this.addAccountingArray[i].accountingCashCr = 'FALSE';
                  this.addAccountingArray[i].accountingCashDb = 'FALSE';
                  this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                  this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                  this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                  this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
                  this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                  this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
                }
              }
            }
          } else {
            if (this.addAccountingArray[i].book == 'Expense') {
              if (id.target.value) {
                this.addAccountingArray[i].paidFrom = '';
                this.addAccountingArray[i].inputFrom = ''
                this.addAccountingArray[i].isDefaultFrom = false;
                this.addAccountingArray[i].isOilAccFrom = false;
                this.addAccountingArray[i].isBankAccFrom = false;
                this.addAccountingArray[i].isInputBoxFrom = false;
                this.addAccountingArray[i].isLoanAccFrom = false;
                this.addAccountingArray[i].isCashAccFrom = false;
                this.addAccountingArray[i].isPOSAccFrom = false;
                this.addAccountingArray[i].isCashBankFrom = true;
                this.addAccountingArray[i].isExpenseAccFrom = false;

                this.addAccountingArray[i].paidTo = '36';
                this.addAccountingArray[i].inputTo = '';
                this.addAccountingArray[i].isDefaultTo = false;
                this.addAccountingArray[i].isOilAccTo = false;
                this.addAccountingArray[i].isBankAccTo = false;
                this.addAccountingArray[i].isInputBoxTo = false;
                this.addAccountingArray[i].isLoanAccTo = false;
                this.addAccountingArray[i].isCashAccTo = false;
                this.addAccountingArray[i].isPOSAccTo = false;
                this.addAccountingArray[i].isCashBankTo = false;
                this.addAccountingArray[i].isExpenseAccTo = true;

                this.addAccountingArray[i].accountingBankCr = 'FALSE';
                this.addAccountingArray[i].accountingBankDb = 'FALSE';
                this.addAccountingArray[i].accountingCashCr = 'FALSE';
                this.addAccountingArray[i].accountingCashDb = 'FALSE';
                this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                this.addAccountingArray[i].accountingExpenseCr = 'TRUE';
                this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
              } else {
                this.addAccountingArray[i].paidFrom = '';
                this.addAccountingArray[i].inputFrom = ''
                this.addAccountingArray[i].isDefaultFrom = true;
                this.addAccountingArray[i].isOilAccFrom = false;
                this.addAccountingArray[i].isBankAccFrom = false;
                this.addAccountingArray[i].isInputBoxFrom = false;
                this.addAccountingArray[i].isLoanAccFrom = false;
                this.addAccountingArray[i].isCashAccFrom = false;
                this.addAccountingArray[i].isPOSAccFrom = false;
                this.addAccountingArray[i].isCashBankFrom = false;
                this.addAccountingArray[i].isExpenseAccFrom = false;

                this.addAccountingArray[i].paidTo = '';
                this.addAccountingArray[i].inputTo = '';
                this.addAccountingArray[i].isDefaultTo = true;
                this.addAccountingArray[i].isOilAccTo = false;
                this.addAccountingArray[i].isBankAccTo = false;
                this.addAccountingArray[i].isInputBoxTo = false;
                this.addAccountingArray[i].isLoanAccTo = false;
                this.addAccountingArray[i].isCashAccTo = false;
                this.addAccountingArray[i].isPOSAccTo = false;
                this.addAccountingArray[i].isCashBankTo = false;
                this.addAccountingArray[i].isExpenseAccTo = false;

                this.addAccountingArray[i].accountingBankCr = 'FALSE';
                this.addAccountingArray[i].accountingBankDb = 'FALSE';
                this.addAccountingArray[i].accountingCashCr = 'FALSE';
                this.addAccountingArray[i].accountingCashDb = 'FALSE';
                this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
                this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
                this.addAccountingArray[i].accountingPOSDb = 'FALSE';
                this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
                this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
                this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
              }
            } else {

              this.addAccountingArray[i].paidFrom = '';
              this.addAccountingArray[i].inputFrom = ''
              this.addAccountingArray[i].isDefaultFrom = true;
              this.addAccountingArray[i].isOilAccFrom = false;
              this.addAccountingArray[i].isBankAccFrom = false;
              this.addAccountingArray[i].isInputBoxFrom = false;
              this.addAccountingArray[i].isLoanAccFrom = false;
              this.addAccountingArray[i].isCashAccFrom = false;
              this.addAccountingArray[i].isPOSAccFrom = false;
              this.addAccountingArray[i].isCashBankFrom = false;
              this.addAccountingArray[i].isExpenseAccFrom = false;

              this.addAccountingArray[i].paidTo = '';
              this.addAccountingArray[i].inputTo = '';
              this.addAccountingArray[i].isDefaultTo = true;
              this.addAccountingArray[i].isOilAccTo = false;
              this.addAccountingArray[i].isBankAccTo = false;
              this.addAccountingArray[i].isInputBoxTo = false;
              this.addAccountingArray[i].isLoanAccTo = false;
              this.addAccountingArray[i].isCashAccTo = false;
              this.addAccountingArray[i].isPOSAccTo = false;
              this.addAccountingArray[i].isCashBankTo = false;
              this.addAccountingArray[i].isExpenseAccTo = false;

              this.addAccountingArray[i].accountingBankCr = 'FALSE';
              this.addAccountingArray[i].accountingBankDb = 'FALSE';
              this.addAccountingArray[i].accountingCashCr = 'FALSE';
              this.addAccountingArray[i].accountingCashDb = 'FALSE';
              this.addAccountingArray[i].accountingOilCoCr = 'FALSE';
              this.addAccountingArray[i].accountingOilCoDb = 'FALSE';
              this.addAccountingArray[i].accountingPOSDb = 'FALSE';
              this.addAccountingArray[i].accountingExpenseCr = 'FALSE';
              this.addAccountingArray[i].accountingLoanAccCr = 'FALSE';
              this.addAccountingArray[i].accountingLoanAccDb = 'FALSE';
            }

          }

        }

      }

    }

    this.checkValidation(i)
  }

  getBankAccByPOS(id: any, i: number) {
    this.addAccountingArray[i].paidTo = '';
    this.addAccountingArray[i].inputTo = '';
    this.addAccountingArray[i].posFrom = '';
    this.addAccountingArray[i].inputFrom = '';

    if (id.target.value) {
      const data = {
        posId: id.target.value,
      };
      this.post.getFuelTerminalDetailsByIdPOST(data).subscribe((res) => {
        if (res.status == 'OK') {
          if (res.data[0].attachedAccountId) {
            if (this.addAccountingArray[i].transactionType != 'Charges') {
              this.addAccountingArray[i].paidTo = res.data[0].attachedAccountId;
              this.addAccountingArray[i].inputFrom = res.data[0].terminalName;
            } else {
              this.addAccountingArray[i].paidFrom = res.data[0].attachedAccountId;
              this.addAccountingArray[i].paidTo = '36';
              this.addAccountingArray[i].inputFrom = res.data[0].terminalName;
            }
            this.checkValidation(i)
          } else {
            alert("Selected pos/digital does not have bank account")
            this.addAccountingArray[i].posFrom = ''
            this.addAccountingArray[i].paidTo = ''
            this.addAccountingArray[i].inputTo = '';
            this.addAccountingArray[i].inputFrom = ''
            this.addAccountingArray[i].paidFrom = ''
            this.checkValidation(i)
          }
        } else {
          this.checkValidation(i)
        }
      });
    } else {
      this.checkValidation(i)
    }
  }

  removeArrayRow(i: number) {
    this.addAccountingArray.splice(i, 1);
    this.countAddArray = this.countAddArray - 1;
    this.checkValidation(Number(i - 1))
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

  addFormRequestBanking() {
    this.countAddArray = this.countAddArray + 1;
    this.addAccountingArrayData = new addAccountingArray();
    this.addAccountingArray.push(this.addAccountingArrayData);
    this.cd.detectChanges();
  }

  onDateSelection(i: any) {
    this.checkValidation(i)
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
          this.clearAll()
        } else {
          this.spinner.hide()
        }
      })
  }

  clearAll() {
    this.addAccountingArray = [];
    this.isSubmit = false;
    this.countAddArray = 1;
    this.addFormRequestBanking();
  }

  //getAccounting
  getAccounting(fuelDealerId: any) {
    this.accountingData = []
    let data = {
      accountingFuelDealerId: fuelDealerId,
    }
    this.post.getAccountingOneDayPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.isShow = true;
          this.accountingData = res.data;
          this.cd.detectChanges();
        } else {
          this.isShow = false;
          this.cd.detectChanges();
        }
      })
  }

  // deleteAccounting
  deleteAccounting(accountingId: any) {
    let data = {
      accountingId: accountingId
    }
    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteAccountingDataPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("details deleted successfully..!")
            this.getAccounting(this.fuelDealerId);
          } else {
          }
        })
    }
    else {
    }
  }


}