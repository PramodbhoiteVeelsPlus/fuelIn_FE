import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbActiveModal, NgbDatepickerConfig, ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedsService } from '../feeds.services';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { addAccountingArray } from './addAccountingArray.model';
import { FormControl, FormGroup } from '@angular/forms';


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
  selector: 'app-feeds-widget1',
  templateUrl: './feeds-widget1.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FeedsWidget1Component implements OnInit {
  dealerLoginVPId: any;
  accessGroupId: any;
  userId: any;
  personId: any;
  userName: string;
  loginSQLCorporateId: any;
  petrolPumpName: any;
  fuelDealerId: any;
  oilBrandName: any;
  bankAllAccList: any = [];
  bankSavingAccList: any = [];
  bankLoanAccList: any = [];
  allAccList: any = [];
  bankAccList: any = [];
  openingDate: any;
  openingAmt: any = 0;
  isOpeningUpdate: boolean = false;
  modalUpdate: any;
  closeResult: string;
  openingBlcId: any;
  openingAddDate: string;
  openingAddAmt: any = 0;
  isSubmit: boolean = false;
  addAccountingArray: any = [];
  addAccountingArrayData = new addAccountingArray();
  countAddArray: any = 1;
  reportData: any = [];

  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),

  });


  constructor(
    public activeModal: NgbActiveModal,
    private cd: ChangeDetectorRef,
    private post: FeedsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private modalService: NgbModal,
  ) {
    const currentDate = new Date();
    const year = moment(new Date()).subtract(1, 'year').format("YYYY");
    config.minDate = { year: 2020, month: 4, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    // config.outsideDays = 'hidden';
  }

  ngOnInit(): void { 
    var element = JSON.parse(localStorage.getItem('element')|| '');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dealerLoginVPId = element.veelsPlusCorporateID;  
    this.accessGroupId = element.accessGroupId;  
    this.userId = element.userId
    this.personId = element.personId
    this.userName = element.firstName + ' '+ element.lastName 
    this.addFormRequestBanking();
    this.getBankDetailsByDealerId(this.fuelDealerId);
    this.getOpeningBalance(this.fuelDealerId);
    this.getReportData(this.fuelDealerId);   
  }

  // Bank Details By fuelDealerId
  getBankDetailsByDealerId(fuelDealerId: any) { 
    let data = {
      dealerId:fuelDealerId,
    }
    this.post.getBankDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {   
            this.bankAllAccList = res.data;
            this.bankSavingAccList = res.data1;
            this.bankLoanAccList = res.data2;  
            this.allAccList = res.data3; 
            this.bankAccList = res.data1;
            this.cd.detectChanges();
        }else{
          this.cd.detectChanges();
        }
      })
    } 
  
  //openingBlcModal(openModal)
  openingBlcModal(openModal: any) {
    if (this.openingDate) {
      this.openingAddDate = moment(this.openingDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY")
    }
    if (this.openingAmt) {
      this.openingAddAmt = this.openingAmt;
    }
    this.modalUpdate = this.modalService.open(openModal)
    this.modalUpdate.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  clear() {
    if (this.isOpeningUpdate) {
      this.getOpeningBalance(this.fuelDealerId);
    } else {
      this.openingAddDate = '';
      this.openingAddAmt = 0;
    }
    this.modalUpdate.close('close');
  }

  submitOpeningBalance() {
    if (this.openingAddDate) {
      if (this.openingAddAmt) {
        this.spinner.show();
        let data = {
          overallReportDataCreatedBy: this.userName,
          overallReportDataFuelDealerId: this.fuelDealerId,
          overallReportDataDate: moment(this.openingAddDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          overallReportDataAmount: this.openingAddAmt,
          overallReportDataEntryFrom: "PORTAL",
        }
        this.post.addOpeningBalancePOST(data).subscribe((res: { status: string; }) => {
          if (res.status == 'OK') {
            alert("Opening Balance Details Submitted successfully..!")
            this.getOpeningBalance(this.fuelDealerId);
            this.modalUpdate.close('close');
            this.spinner.hide();
          } else {
            alert("Error to Submit..!")
            this.spinner.hide();
          }
        })
      } else {
        alert("Please Enter Amount..!")
      }
    } else {
      alert("Please Select Date..!")
    }
  }

  updateOpeningBalance() {
    if (this.openingBlcId) {
      if (this.openingAddDate) {
        if (this.openingAddAmt) {
          this.spinner.show();
          let data = {
            overallReportDataId: this.openingBlcId,
            overallReportDataDate: moment(this.openingAddDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            overallReportDataAmount: this.openingAddAmt,
          }
          this.post.updateOpeningBalancePOST(data).subscribe((res: { status: string; }) => {
            if (res.status == 'OK') {
              alert("Opening Balance Details Updated successfully..!")
              this.getOpeningBalance(this.fuelDealerId);
              this.modalUpdate.close('close');
              this.spinner.hide();
            } else {
              alert("Error to Update..!")
              this.spinner.hide();
            }
          })
        } else {
          alert("Please Enter Amount..!")
        }
      } else {
        alert("Please Select Date..!")
      }
    }
    else {
      alert("Error to Update..!")
    }
  }

  getOpeningBalance(fuelDealerId: any) {
    this.openingDate = '';
    this.openingAmt = 0;
    this.spinner.show()
    let data = {
      overallReportDataFuelDealerId: fuelDealerId,
    }
    this.post.getOpeningBalancePOST(data).subscribe(res => {
      if (res.status == 'OK' && res.data.length) {
        this.isOpeningUpdate = true;
        this.openingBlcId = res.data[0].overallReportDataId;
        this.openingAmt = res.data[0].overallReportDataAmount;
        this.openingDate = res.data[0].overallReportDataDate;
        this.cd.detectChanges();
        this.spinner.hide();
      } else {
        this.isOpeningUpdate = false;
        this.openingDate = '';
        this.openingAmt = 0;
        this.spinner.hide();
        this.cd.detectChanges();
      }
    })
  }

  deleteOpeningBalance() {
    if (this.openingBlcId) {
      this.spinner.show();
      let data = {
        overallReportDataId: this.openingBlcId,
      }
      this.post.deleteOpeningBalanceREPORTDataPOST(data).subscribe((res: { status: string; }) => {
        if (res.status == 'OK') {
          alert("Opening Balance Deleted successfully..!")
          this.getOpeningBalance(this.fuelDealerId);
          this.spinner.hide();
        } else {
          alert("Error to Delete..!")
          this.spinner.hide();
        }
      })
    }
    else {
      alert("Error to Delete..!")
    }
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

  getByBook(id: any, i: any) {

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

  getByTransactionType(id: any, i: any) {
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

  submitArray() {
    this.spinner.show()
    let data = {
      overallReportDataArray: this.addAccountingArray,
      overallReportDataFuelDealerId: this.fuelDealerId,
      overallReportDataCreatedBy: this.userName,
    }
    this.post.addReportDataPOST(data)
      .subscribe((res: { status: string; }) => {
        if (res.status = "OK") {
          alert("Details Submited Successfully..");
          this.spinner.hide()
          this.getReportData(this.fuelDealerId);
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

  getReportData(fuelDealerId: any) {
    this.reportData = [];
    this.spinner.show()
    let data = {
      overallReportDataFuelDealerId: fuelDealerId,
    }
    this.post.getReportDataPOST(data).subscribe(res => {
      if (res.status == 'OK' && res.data.length) {
        this.reportData = res.data;
        this.cd.detectChanges();
        this.spinner.hide();
      } else {
        this.reportData = [];
        this.cd.detectChanges();
        this.spinner.hide();
      }
    })
  }

  deleteReportData(overallReportDataId: any) {
    if (overallReportDataId) {
      this.spinner.show();
      let data = {
        overallReportDataId: overallReportDataId,
      }
      this.post.deleteOpeningBalanceREPORTDataPOST(data).subscribe((res: { status: string; }) => {
        if (res.status == 'OK') {
          alert("Report Data Deleted successfully..!")
          this.getReportData(this.fuelDealerId);
          this.spinner.hide();
        } else {
          alert("Error to Delete..!")
          this.spinner.hide();
        }
      })
    }
    else {
      alert("Error to Delete..!")
    }
  }

  filter() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.spinner.show();
      this.reportData = [];
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        overallReportDataFuelDealerId: this.fuelDealerId,
      }
      this.post.getReportDataPOST(data).subscribe(res => {
        if (res.status == 'OK' && res.data.length) {
          this.reportData = res.data;
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.reportData = [];
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
    } else {
      alert("Please Select Date..!")
    }
  }
}
