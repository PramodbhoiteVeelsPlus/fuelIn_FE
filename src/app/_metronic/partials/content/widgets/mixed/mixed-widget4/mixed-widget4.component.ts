import { ChangeDetectorRef, Component, Injectable, Input } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../../stats/stats.services';
import { MixedService } from '../mixed.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  selector: 'app-mixed-widget4',
  templateUrl: './mixed-widget4.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class MixedWidget4Component {
  fuelDealerId: any;
  dealerCorporateId: any;
  acceesGroup: any;
  dealerAccess: boolean = false;
  isCreditPayment: boolean = false;
  accessGroup: any;

  addPaymentForm = new FormGroup({
    selectedCorp: new FormControl(''),
    paymentDate: new FormControl('', Validators.required),
    paymentAmount: new FormControl(''),
    paymentTransactionNo: new FormControl(''),
    paymentMethod: new FormControl('', Validators.required),
    accountDetailsId: new FormControl('', Validators.required),
    pos: new FormControl('', Validators.required),
  });
  customerName1: any;
  isSelected1: boolean = false;
  isCalculate: boolean = false;
  customerName: string;
  calOutstanding: number;
  fuelDealerCorpMapIdNew: string;
  crPaymentDetails: any = [];
  customerIdSQL: any;
  corporateIdSQL: any;
  dealerName: any;
  personName: string;
  dealerLocation: string;
  personPhone1: any;
  lastCRDate: any;
  islastCRDate: boolean = false;
  isMappingEmail: any;
  isMappingSMS: any;
  corporateList: any = [];
  modalRef: any;
  closeResult: string;
  viewCorpFlag: any = [];
  isFlag: boolean = false;
  isCash: boolean = false;
  isPos: boolean = false;
  posEntry: string;
  fuelTerminalDetails: any = [];
  bankAccList: any = [];
  isSubmit: boolean = false;
  outstandingAmt: number;
  amountInWord: string;
  isDisabled: boolean
  a = [
    '',
    'One ',
    'Two ',
    'Three ',
    'Four ',
    'Five ',
    'Six ',
    'Seven ',
    'Eight ',
    'Nine ',
    'Ten ',
    'Eleven ',
    'Twelve ',
    'Thirteen ',
    'Fourteen ',
    'Fifteen ',
    'Sixteen ',
    'Seventeen ',
    'Eighteen ',
    'Nineteen '];
  b = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety'];
  pendingDays: number;
  netOutstanding: any;
  paidAvg: number;
  totalInvoiceAfterPayment: any;
  managerVPPersonId: any;
  managerPersonId: any;
  isSelected: boolean;

  constructor(
    private post: MixedService,
    private post1: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    // this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.accessGroup = element.accessGroupId;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    if (element.accessGroupId == 12 || element.accessGroupId == 14 || element.accessGroupId == 19 || element.accessGroupId == 21) {
      this.dealerAccess = true
      if (element.accessGroupId == 14 || element.accessGroupId == 21) {
        this.getAccessByPersonId(element.personId)
      }
    }
    this.getCorporateMappedListByDealerId(this.fuelDealerId)
    this.getFuelTerminal(this.fuelDealerId)
    this.getBankDetailsByDealerId(this.fuelDealerId)
    this.getFlagStatusByCorpId(this.dealerCorporateId)
    this.cd.detectChanges()
  }

  getAccessByPersonId(personId: any) {
    let data = {
      personId: personId,
    };
    this.post.getAccessByPersonIdPOST(data).subscribe((res) => {
      if (res.data[0].creditPayment == 'TRUE') {
        this.isCreditPayment = true;
      } else {
        this.isCreditPayment = false;
      }
    });
  }

  getDetailsByfuelDealerCustomerMapIdId(id: any) {
    this.customerName1 = id.target.value;
    if (this.customerName1) {
      this.getCorporateInfoByfuelDealerCustomerMapId(this.customerName1);
      this.cd.detectChanges()
    } else {
      this.isSelected1 = false;
      this.isCalculate = false;
      this.customerName = '';
      this.calOutstanding = 0;
      this.fuelDealerCorpMapIdNew = ''
      this.cd.detectChanges()
    }
  }

  getCorporateInfoByfuelDealerCustomerMapId(customerName: any) {
    this.crPaymentDetails.length = 0;
    let data = {
      fuelDealerId: this.fuelDealerId,
      customerName: customerName
    }
    this.post1.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.isSelected1 = true;
          this.customerName = res.data[0].companyName;
          this.customerIdSQL = res.data[0].customerId
          this.corporateIdSQL = res.data[0].corporateId
          // this.getFlagStatusByCorpId(this.corporateIdSQL)
          if (res.data[0].mappingPreviousStatus == "FALSE") {
            this.dealerName = res.data[0].companyName;
            this.personName = res.data[0].firstName + ' ' + res.data[0].lastName;
          }
          else {
            this.dealerName = res.data[0].mappingCompanyName;
            this.personName = res.data[0].mappingCustomerName;
          }

          if (res.data[0].city == '' || res.data[0].city == 'undefined' || res.data[0].cityArea == null) {
            this.dealerLocation = ''
          } else {
            this.dealerLocation = res.data[0].cityArea + ',' + res.data[0].city;
          }

          // this.fuelDealerSQLId = res.data[0].fuelDealerId;

          this.personPhone1 = res.data[0].phone1;
          this.fuelDealerCorpMapIdNew = res.data[0].fuelDealerCustomerMapId;
          // this.calOutstandingAmountforAll(res.data[0].fuelDealerCustomerMapId)
          // this.getOutstandingBuCustMapId(res.data[0].fuelDealerCustomerMapId)
          this.lastCRDate = res.data[0].lastCRDate;
          if (res.data[0].lastCRDate) {
            this.islastCRDate = true
          }
          this.isMappingEmail = res.data[0].isMappingEmail;
          this.isMappingSMS = res.data[0].isMappingSMS;
          // this.getDetailsByMapId(this.fuelDealerCorpMapIdNew);
          // this.getAllOutStanding(this.fuelDealerCorpMapIdNew)
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()
        }
      });

  }

  getCorporateMappedListByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post1.getCorporatesAllMappedRequestByDealerPOST(data)
      .subscribe(res => {
        if (res) {
          this.corporateList = res.data;
        } else {
        }
      }
      );
  }

  getFlagStatusByCorpId(dealerCorporateId: any) {
    let data = {
      corporateIdForFlag: dealerCorporateId
    }
    this.post1.getFlagStatusByCorpIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.viewCorpFlag = res.data;
          this.isFlag = true;
        } else {
          this.isFlag = false;
        }
      });
  }

  viewFlag(viewFlagModel: any) {
    this.modalRef = this.modalService.open(viewFlagModel, { size: 'lg' });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

  getBankAcc1(id: any) {
    if (id.target.value == 'CASH') {
      this.isCash = true;
      this.isPos = false
      this.posEntry = 'FALSE'
      this.addPaymentForm.controls['pos'].setValue('')
      this.addPaymentForm.controls['accountDetailsId'].setValue('20')
    } else {
      if (id.target.value == 'NET BANKING' || id.target.value == 'IMPS/NEFT/RTGS' || id.target.value == 'CHEQUE') {
        this.isCash = false;
        this.isPos = false
        this.posEntry = 'FALSE'
        this.addPaymentForm.controls['pos'].setValue('')
        this.addPaymentForm.controls['accountDetailsId'].setValue('')
      } else {
        this.isPos = true
        this.addPaymentForm.controls['pos'].setValue('')
        this.addPaymentForm.controls['accountDetailsId'].setValue('')
        this.posEntry = 'TRUE'
        this.isCash = false;
      }
    }
  }

  getFuelTerminal(fuelDealerId: any) {
    let dataTerminal = {
      fuelDealerId: fuelDealerId
    }
    this.post.getFuelTerminal1POST(dataTerminal)
      .subscribe(res => {
        if (res.data.length) {
          this.fuelTerminalDetails = res.data;
        } else {

        }
      })
  }

  getBankAcc1POS(id: any) {
    let dataTerminal = {
      terminalId: id.target.value
    }
    this.post.getTerminaldetailsByTerminalIdPOST(dataTerminal)
      .subscribe(res => {
        if (res.data.length) {
          if (res.data[0].attachedAccountId == 21) {
            this.addPaymentForm.controls['accountDetailsId'].setValue('21')
          } else {
            this.addPaymentForm.controls['accountDetailsId'].setValue(res.data[0].attachedAccountId)
          }
          this.addPaymentForm.controls['paymentMethod'].setValue(res.data[0].terminalName)
        } else {

        }
      })
  }

  getBankDetailsByDealerId(fuelDealerId: any) {
    this.bankAccList.length = 0;
    let data = {
      dealerId: fuelDealerId
    }
    this.post.getBankDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.bankAccList = res.data1;
        }
      })
  }

  checkSubmit() {
    if (this.fuelDealerCorpMapIdNew) {
      if (this.addPaymentForm.value.paymentMethod) {
        if (this.addPaymentForm.value.paymentAmount) {
          if (this.addPaymentForm.value.accountDetailsId) {
            if (this.addPaymentForm.value.paymentDate) {
              if (this.addPaymentForm.value.paymentAmount) {
                this.isSubmit = true;
              } else {
                this.isSubmit = false;
              }
            } else {
              this.isSubmit = false;
            }
          } else {
            this.isSubmit = false;
          }
        } else {
          this.isSubmit = false;
        }
      } else {
        this.isSubmit = false;
      }
    } else {
      this.isSubmit = false;
    }
  }

  onSearchChange(searchValue: any): void {
    if (searchValue) {
      // this.transform(searchValue);
      this.checkSubmit()
      this.isCalculate = true;
      this.outstandingAmt = (Number(this.calOutstanding) - (searchValue))
      // console.log(Number(this.calOutstanding) - (searchValue));
    } else {
      this.isCalculate = false;
      this.isSubmit = false;
    }

  }

  // transform(value: any): any {
  //   // console.log('InWord-1', value);
  //   if (value) {
  //     const number = parseFloat(value).toFixed(2).split('.');
  //     const num = parseInt(number[0]);
  //     // console.log('InWord-2', num);
  //     const digit = parseInt(number[1]);
  //     if (num) {
  //       if ((num.toString()).length > 9) { return ''; }
  //       const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  //       const d = ('00' + digit).substr(-2).match(/^(\d{2})$/);
  //       // console.log('InWord-3', n);
  //       // console.log('InWord-4', d);
  //       if (!n) { return ''; }
  //       let str = '';
  //       // console.log('InWord-5', str);
  //       str += (Number(n[1]) !== 0) ? (this.a[Number(n[1])] || this.b[n[1][0]] + ' ' + this.a[n[1][1]]) + 'Crore ' : '';
  //       str += (Number(n[2]) !== 0) ? (this.a[Number(n[2])] || this.b[n[2][0]] + ' ' + this.a[n[2][1]]) + 'Lakh ' : '';
  //       str += (Number(n[3]) !== 0) ? (this.a[Number(n[3])] || this.b[n[3][0]] + ' ' + this.a[n[3][1]]) + 'Thousand ' : '';
  //       str += (Number(n[4]) !== 0) ? (this.a[Number(n[4])] || this.b[n[4][0]] + ' ' + this.a[n[4][1]]) + 'Hundred ' : '';
  //       str += (Number(n[5]) !== 0) ? (this.a[Number(n[5])] || this.b[n[5][0]] + ' ' + this.a[n[5][1]]) + 'Rupees ' : '';
  //       str += (Number(d[1]) !== 0) ? ((str !== '') ? 'and ' : '') + (this.a[Number(d[1])] || this.b[d[1][0]] + ' ' + this.a[d[1][1]]) + 'Paise Only' : 'Only';
  //       // console.log('IN Word :', str);
  //       this.amountInWord = str;
  //       // this.amountInWord1 = str;
  //       return str;
  //     } else {
  //       return '';
  //     }
  //   } else {
  //     return '';
  //   }
  // }


  AddPaymentDetailsByfuelDealerCustomerMapId() {
    this.isSubmit = false;
    this.isCalculate = false;
    this.outstandingAmt = 0
    this.spinner.show()
    if (this.islastCRDate = true) {
      var g1 = new Date((moment(new Date()).format('YYYY-MM-DD')));
      var g2 = new Date(this.lastCRDate);
      if (g1.getTime() >= g2.getTime()) {
        const oneDay = 24 * 60 * 60 * 1000
        const diffDays = Math.round(Math.abs((g1.getTime() - g2.getTime()) / oneDay))
        this.pendingDays = diffDays
      }
    }

    if (this.accessGroup == 12 || this.accessGroup == 19) {
      if (this.fuelDealerCorpMapIdNew) {
        if (this.addPaymentForm.value.paymentMethod) {
          if (this.addPaymentForm.value.paymentAmount) {
            if (this.addPaymentForm.value.accountDetailsId) {
              if (Number(this.addPaymentForm.value.paymentAmount) > 0) {
                if (this.addPaymentForm.value.paymentDate) {
                  if (Number(this.netOutstanding) >= 0) {
                    if ((Number(this.netOutstanding)) < (Number(this.addPaymentForm.value.paymentAmount))) {
                      this.paidAvg = 101
                    }
                    else {
                      this.paidAvg = Math.round((Number(this.addPaymentForm.value.paymentAmount) * 100) / this.netOutstanding)
                    }
                  }
                  else {
                    this.paidAvg = 102
                  }
                  if (this.addPaymentForm.value.paymentAmount > this.totalInvoiceAfterPayment) {
                    if (this.totalInvoiceAfterPayment != 0) {
                      let data = {
                        fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                        fuelInvoiceId: "",
                        chequeNO: this.addPaymentForm.value.paymentTransactionNo,
                        chequeDate: moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss'),
                        corporateId: this.dealerCorporateId,
                        grandTotalAmount: this.addPaymentForm.value.paymentAmount,
                        transactionPurpose: "FuelInvoice",
                        loadInvoiceId: "",
                        paymentFromCorporateId: "",
                        paymentMethod: this.addPaymentForm.value.paymentMethod,
                        advancePayment: 0,
                        totalAmount: this.addPaymentForm.value.paymentAmount,
                        isMappingEmail: this.isMappingEmail,
                        isMappingSMS: this.isMappingSMS,
                        // fueldealerSmsSend: this.fueldealerSmsSend,
                        // fueldealerMailSend: this.fueldealerMailSend,
                        avgPayment: this.paidAvg,
                        accountId: this.addPaymentForm.value.accountDetailsId,
                        pendingDays: this.pendingDays,
                        posEntry: this.posEntry,
                        entryFROM: "PORTAL"
                      }
                      this.post.addAccTransactionLogPayDetailPOST(data)
                        .subscribe(res => {
                          if (res) {
                            // this.updatePaymentInFuelDealerCustomerMap(this.fuelDealerCorpMapIdNew)
                            let dateCoin = moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss')
                            // this.addCoindetails(res.data.insertId, dateCoin)
                          } else {
                            alert("ERROR to Update PAYMENT Details!")
                            this.spinner.hide();
                          }
                        })
                    }
                    else {

                      let data = {
                        fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                        fuelInvoiceId: "",
                        chequeNO: this.addPaymentForm.value.paymentTransactionNo,
                        chequeDate: moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss'),
                        corporateId: this.dealerCorporateId,
                        grandTotalAmount: this.addPaymentForm.value.paymentAmount,
                        transactionPurpose: "FuelInvoice",
                        loadInvoiceId: "",
                        paymentFromCorporateId: "",
                        paymentMethod: this.addPaymentForm.value.paymentMethod,
                        advancePayment: 0,
                        totalAmount: this.addPaymentForm.value.paymentAmount,
                        isMappingEmail: this.isMappingEmail,
                        isMappingSMS: this.isMappingSMS,
                        // fueldealerSmsSend: this.fueldealerSmsSend,
                        // fueldealerMailSend: this.fueldealerMailSend,
                        avgPayment: this.paidAvg,
                        accountId: this.addPaymentForm.value.accountDetailsId,
                        pendingDays: this.pendingDays,
                        posEntry: this.posEntry,
                        entryFROM: "PORTAL"
                      }
                      this.post.addAccTransactionLogPayDetailPOST(data)
                        .subscribe(res => {
                          if (res) {
                            // this.updatePaymentInFuelDealerCustomerMap(this.fuelDealerCorpMapIdNew)
                            let dateCoin = moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss')
                            // this.addCoindetails(res.data.insertId, dateCoin)
                          } else {
                            alert("ERROR to Update PAYMENT Details!")
                            this.spinner.hide();
                          }
                        })
                    }
                  }
                  else {

                    let data = {
                      fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                      fuelInvoiceId: "",
                      chequeNO: this.addPaymentForm.value.paymentTransactionNo,
                      chequeDate: moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss'),
                      corporateId: this.dealerCorporateId,
                      grandTotalAmount: this.addPaymentForm.value.paymentAmount,
                      transactionPurpose: "FuelInvoice",
                      loadInvoiceId: "",
                      paymentFromCorporateId: "",
                      paymentMethod: this.addPaymentForm.value.paymentMethod,
                      advancePayment: 0,
                      totalAmount: this.addPaymentForm.value.paymentAmount,
                      isMappingEmail: this.isMappingEmail,
                      isMappingSMS: this.isMappingSMS,
                      // fueldealerSmsSend: this.fueldealerSmsSend,
                      // fueldealerMailSend: this.fueldealerMailSend,
                      avgPayment: this.paidAvg,
                      accountId: this.addPaymentForm.value.accountDetailsId,
                      pendingDays: this.pendingDays,
                      posEntry: this.posEntry,
                      entryFROM: "PORTAL"
                    }
                    this.post.addAccTransactionLogPayDetailPOST(data)
                      .subscribe(res => {
                        if (res) {
                          // this.updatePaymentInFuelDealerCustomerMap(this.fuelDealerCorpMapIdNew)
                          let dateCoin = moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss')
                          // this.addCoindetails(res.data.insertId, dateCoin)
                        } else {
                          alert("ERROR to Update PAYMENT Details!")
                          this.spinner.hide();
                        }
                      })



                  }

                }
                else {
                  alert("Please Select Date!")
                  this.spinner.hide();
                }
              }
              else {
                alert("Please Enter Valid Amount!")
                this.spinner.hide();
              }
            }
            else {
              alert("Please Select Account!")
              this.spinner.hide();
            }
          }
          else {
            alert("Please Enter Amount!")
            this.spinner.hide();
          }
        } else {
          alert("Please Select Payment Method!")
          this.spinner.hide();
        }
      } else {
        alert("Please select customer!")
        this.spinner.hide();
      }

    } else {
      if (this.accessGroup == 14 || this.accessGroup == 21) {

        if (this.fuelDealerCorpMapIdNew) {

          if (this.addPaymentForm.value.paymentMethod) {
            if (this.addPaymentForm.value.paymentAmount) {
              if (this.addPaymentForm.value.accountDetailsId) {
                if (Number(this.addPaymentForm.value.paymentAmount) > 0) {
                  if (this.addPaymentForm.value.paymentDate) {


                    if (Number(this.netOutstanding) >= 0) {

                      if ((Number(this.netOutstanding)) < (Number(this.addPaymentForm.value.paymentAmount))) {
                        this.paidAvg = 101

                      }
                      else {
                        this.paidAvg = Math.round((Number(this.addPaymentForm.value.paymentAmount) * 100) / this.netOutstanding)
                      }

                    }

                    else {
                      this.paidAvg = 102
                    }

                    if (this.addPaymentForm.value.paymentAmount > this.totalInvoiceAfterPayment) {


                      if (this.totalInvoiceAfterPayment != 0) {

                        let data = {
                          fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                          fuelInvoiceId: "",
                          chequeNO: this.addPaymentForm.value.paymentTransactionNo,
                          chequeDate: moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss'),
                          corporateId: this.dealerCorporateId,
                          grandTotalAmount: this.addPaymentForm.value.paymentAmount,
                          transactionPurpose: "FuelInvoice",
                          loadInvoiceId: "",
                          paymentFromCorporateId: "",
                          paymentMethod: this.addPaymentForm.value.paymentMethod,
                          advancePayment: 0,
                          totalAmount: this.addPaymentForm.value.paymentAmount,
                          managerVPPersonId: this.managerVPPersonId,
                          managerPersonId: this.managerPersonId,
                          // managerName: this.managerName,
                          isMappingEmail: this.isMappingEmail,
                          isMappingSMS: this.isMappingSMS,
                          // fueldealerSmsSend: this.fueldealerSmsSend,
                          // fueldealerMailSend: this.fueldealerMailSend,
                          avgPayment: this.paidAvg,
                          accountId: this.addPaymentForm.value.accountDetailsId,
                          pendingDays: this.pendingDays,
                          posEntry: this.posEntry,
                          entryFROM: "PORTAL"
                        }
                        this.post.addAccTransactionLogPayDetailPOST(data)
                          .subscribe(res => {
                            if (res) {
                              // this.updatePaymentInFuelDealerCustomerMap(this.fuelDealerCorpMapIdNew)
                              let dateCoin = moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss')
                              // this.addCoindetails(res.data.insertId, dateCoin)
                            } else {
                              alert("ERROR to Update PAYMENT Details!")
                              this.spinner.hide();
                            }
                          })
                      }
                      else {

                        let data = {
                          fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                          fuelInvoiceId: "",
                          chequeNO: this.addPaymentForm.value.paymentTransactionNo,
                          chequeDate: moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss'),
                          corporateId: this.dealerCorporateId,
                          grandTotalAmount: this.addPaymentForm.value.paymentAmount,
                          transactionPurpose: "FuelInvoice",
                          loadInvoiceId: "",
                          paymentFromCorporateId: "",
                          paymentMethod: this.addPaymentForm.value.paymentMethod,
                          advancePayment: 0,
                          totalAmount: this.addPaymentForm.value.paymentAmount,
                          managerVPPersonId: this.managerVPPersonId,
                          managerPersonId: this.managerPersonId,
                          // managerName: this.managerName,
                          isMappingEmail: this.isMappingEmail,
                          isMappingSMS: this.isMappingSMS,
                          // fueldealerSmsSend: this.fueldealerSmsSend,
                          // fueldealerMailSend: this.fueldealerMailSend,
                          avgPayment: this.paidAvg,
                          accountId: this.addPaymentForm.value.accountDetailsId,
                          pendingDays: this.pendingDays,
                          posEntry: this.posEntry,
                          entryFROM: "PORTAL"
                        }
                        this.post.addAccTransactionLogPayDetailPOST(data)
                          .subscribe(res => {
                            if (res) {
                              // this.updatePaymentInFuelDealerCustomerMap(this.fuelDealerCorpMapIdNew)
                              let dateCoin = moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss')
                              // this.addCoindetails(res.data.insertId, dateCoin)
                            } else {
                              alert("ERROR to Update PAYMENT Details!")
                              this.spinner.hide();
                            }
                          })
                      }
                    }
                    else {

                      let data = {
                        fuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                        fuelInvoiceId: "",
                        chequeNO: this.addPaymentForm.value.paymentTransactionNo,
                        chequeDate: moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss'),
                        corporateId: this.dealerCorporateId,
                        grandTotalAmount: this.addPaymentForm.value.paymentAmount,
                        transactionPurpose: "FuelInvoice",
                        loadInvoiceId: "",
                        paymentFromCorporateId: "",
                        paymentMethod: this.addPaymentForm.value.paymentMethod,
                        advancePayment: 0,
                        totalAmount: this.addPaymentForm.value.paymentAmount,
                        managerVPPersonId: this.managerVPPersonId,
                        managerPersonId: this.managerPersonId,
                        // managerName: this.managerName,
                        isMappingEmail: this.isMappingEmail,
                        isMappingSMS: this.isMappingSMS,
                        // fueldealerSmsSend: this.fueldealerSmsSend,
                        // fueldealerMailSend: this.fueldealerMailSend,
                        avgPayment: this.paidAvg,
                        accountId: this.addPaymentForm.value.accountDetailsId,
                        pendingDays: this.pendingDays,
                        posEntry: this.posEntry,
                        entryFROM: "PORTAL"
                      }
                      this.post.addAccTransactionLogPayDetailPOST(data)
                        .subscribe(res => {
                          if (res) {
                            // this.updatePaymentInFuelDealerCustomerMap(this.fuelDealerCorpMapIdNew)
                            let dateCoin = moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss')
                            // this.addCoindetails(res.data.insertId, dateCoin)
                          } else {
                            alert("ERROR to Update PAYMENT Details!")
                            this.spinner.hide();
                          }
                        })

                    }

                  }
                  else {
                    alert("Please Select Date!")
                    this.spinner.hide();
                  }
                }
                else {
                  alert("Please Enter Valid Amount!")
                  this.spinner.hide();
                }
              } else {
                alert("Please Select Account!")
                this.spinner.hide();
              }
            }
            else {
              alert("Please Enter Amount!")
              this.spinner.hide();
            }
          } else {
            alert("Please Select Payment Method!")
            this.spinner.hide();
          }
        } else {
          alert("Please select customer!")
          this.spinner.hide();
        }
      } else {

      }
    }

  }

  clearAll() {
    this.addPaymentForm.reset();
    this.addPaymentForm.controls["paymentMethod"].setValue("");
    this.isSelected = false;
    this.isSelected1 = false;
    this.isPos = false;
    this.isCalculate = false;
    this.outstandingAmt = 0
    this.addPaymentForm.controls["accountDetailsId"].setValue("");
  }
}
