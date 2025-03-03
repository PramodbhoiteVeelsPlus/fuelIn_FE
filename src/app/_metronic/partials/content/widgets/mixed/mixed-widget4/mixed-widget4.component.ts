import { ChangeDetectorRef, Component, Injectable, Input } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../../stats/stats.services';
import { MixedService } from '../mixed.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import numWords from 'num-words';

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
    paymentAmount: new FormControl(),
    paymentTransactionNo: new FormControl(''),
    paymentMethod: new FormControl('', Validators.required),
    accountDetailsId: new FormControl('', Validators.required),
    pos: new FormControl('', Validators.required),
  });
  customerName1: any;
  isSelected1: boolean = false;
  isCalculate: boolean = false;
  customerName: string;
  calOutstanding: any;
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
  rupeesWrd: any;
  paisaWrd: any;
  amountInWords: string;
  fueldealerMailSend: any;
  fueldealerSmsSend: any;
  overAllPaidAmount: any;
  managerName: string;

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
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    // this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.accessGroup = element.accessGroupId;
    this.managerName = element.firstName + ' ' + element.lastName
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.fueldealerSmsSend = dealerData.fueldealerSmsSend
    this.fueldealerMailSend = dealerData.fueldealerMailSend
    if (element.accessGroupId == 12 || element.accessGroupId == 14 || element.accessGroupId == 19 || element.accessGroupId == 21) {
      this.dealerAccess = true
      if (element.accessGroupId == 14 || element.accessGroupId == 21) {
        this.getAccessByPersonId(element.personId)
      }
    }
    this.addPaymentForm.controls["paymentDate"].setValue(moment(new Date()).format('DD-MM-YYYY'));
    this.getCorporateMappedListByDealerId(this.fuelDealerId)
    this.getFuelTerminal(this.fuelDealerId)
    this.getBankDetailsByDealerId(this.fuelDealerId)
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
          this.getFlagStatusByCorpId(this.corporateIdSQL)
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
          this.getOutstandingBuCustMapId(res.data[0].fuelDealerCustomerMapId)
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
          this.cd.detectChanges()
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

  onSearchChange(id: any): void {
    if (id.target.value) {
      // this.transform(searchValue);
      var osForWrd = ''
      osForWrd = (id.target.value)
      var osForWrd1 = osForWrd.split(".")
      this.rupeesWrd = osForWrd1[0]
      this.paisaWrd = osForWrd1[1]
      if (this.rupeesWrd != 0 && this.paisaWrd != 0) {
        this.amountInWords = numWords((this.rupeesWrd)) + " rupees and " + numWords((this.paisaWrd)) + " paisa only";
      } else if (this.rupeesWrd != 0) {
        this.amountInWords = numWords((this.rupeesWrd)) + " rupees";
      } else if (this.paisaWrd != 0) {
        this.amountInWords = numWords((this.paisaWrd)) + " paisa only";
      } else {
        this.amountInWords = "";
      }
      this.checkSubmit()
      this.isCalculate = true;
      this.outstandingAmt = (Number(this.calOutstanding) - (id.target.value))
      console.log("amt", (id.target.value));
    } else {
      console.log("amt2", (id.target.value));
      this.isCalculate = false;
      this.isSubmit = false;
    }
  }


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
                        fueldealerSmsSend: this.fueldealerSmsSend,
                        fueldealerMailSend: this.fueldealerMailSend,
                        avgPayment: this.paidAvg,
                        accountId: this.addPaymentForm.value.accountDetailsId,
                        pendingDays: this.pendingDays,
                        posEntry: this.posEntry,
                        entryFROM: "PORTAL"
                      }
                      this.post.addAccTransactionLogPayDetailPOST(data)
                        .subscribe(res => {
                          if (res.status == "OK") {
                            alert("Payment to Update PAYMENT Details!")
                            this.updatePaymentInFuelDealerCustomerMap(this.fuelDealerCorpMapIdNew)
                            let dateCoin = moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss')
                            this.addCoindetails(res.data.insertId, dateCoin)
                            this.resetPaymentForm();
                            this.clearAll()
                            this.isSelected1 = false;
                            this.spinner.hide();
                            this.cd.detectChanges()
                          } else {
                            alert("ERROR to Update PAYMENT Details!")
                            this.spinner.hide();
                            this.cd.detectChanges()
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
                        fueldealerSmsSend: this.fueldealerSmsSend,
                        fueldealerMailSend: this.fueldealerMailSend,
                        avgPayment: this.paidAvg,
                        accountId: this.addPaymentForm.value.accountDetailsId,
                        pendingDays: this.pendingDays,
                        posEntry: this.posEntry,
                        entryFROM: "PORTAL"
                      }
                      this.post.addAccTransactionLogPayDetailPOST(data)
                        .subscribe(res => {
                          if (res.status == "OK") {
                            this.updatePaymentInFuelDealerCustomerMap(this.fuelDealerCorpMapIdNew)
                            let dateCoin = moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss')
                            this.addCoindetails(res.data.insertId, dateCoin)
                            this.resetPaymentForm();
                            this.clearAll()
                            this.isSelected1 = false;
                            this.spinner.hide();
                            this.cd.detectChanges()
                          } else {
                            alert("ERROR to Update PAYMENT Details!")
                            this.spinner.hide();
                            this.cd.detectChanges()
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
                      fueldealerSmsSend: this.fueldealerSmsSend,
                      fueldealerMailSend: this.fueldealerMailSend,
                      avgPayment: this.paidAvg,
                      accountId: this.addPaymentForm.value.accountDetailsId,
                      pendingDays: this.pendingDays,
                      posEntry: this.posEntry,
                      entryFROM: "PORTAL"
                    }
                    this.post.addAccTransactionLogPayDetailPOST(data)
                      .subscribe(res => {
                        if (res) {
                          this.updatePaymentInFuelDealerCustomerMap(this.fuelDealerCorpMapIdNew)
                          let dateCoin = moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss')
                          this.addCoindetails(res.data.insertId, dateCoin)
                          this.resetPaymentForm();
                          this.clearAll()
                          this.isSelected1 = false;
                          this.spinner.hide();
                          this.cd.detectChanges()
                        } else {
                          alert("ERROR to Update PAYMENT Details!")
                          this.spinner.hide();
                          this.cd.detectChanges()
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
                          managerName: this.managerName,
                          isMappingEmail: this.isMappingEmail,
                          isMappingSMS: this.isMappingSMS,
                          fueldealerSmsSend: this.fueldealerSmsSend,
                          fueldealerMailSend: this.fueldealerMailSend,
                          avgPayment: this.paidAvg,
                          accountId: this.addPaymentForm.value.accountDetailsId,
                          pendingDays: this.pendingDays,
                          posEntry: this.posEntry,
                          entryFROM: "PORTAL"
                        }
                        this.post.addAccTransactionLogPayDetailPOST(data)
                          .subscribe(res => {
                            if (res) {
                              this.updatePaymentInFuelDealerCustomerMap(this.fuelDealerCorpMapIdNew)
                              let dateCoin = moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss')
                              this.addCoindetails(res.data.insertId, dateCoin)
                              this.resetPaymentForm();
                              this.clearAll()
                              this.isSelected1 = false;
                              this.spinner.hide();
                              this.cd.detectChanges()
                            } else {
                              alert("ERROR to Update PAYMENT Details!")
                              this.spinner.hide();
                              this.cd.detectChanges()
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
                          managerName: this.managerName,
                          isMappingEmail: this.isMappingEmail,
                          isMappingSMS: this.isMappingSMS,
                          fueldealerSmsSend: this.fueldealerSmsSend,
                          fueldealerMailSend: this.fueldealerMailSend,
                          avgPayment: this.paidAvg,
                          accountId: this.addPaymentForm.value.accountDetailsId,
                          pendingDays: this.pendingDays,
                          posEntry: this.posEntry,
                          entryFROM: "PORTAL"
                        }
                        this.post.addAccTransactionLogPayDetailPOST(data)
                          .subscribe(res => {
                            if (res) {
                              this.updatePaymentInFuelDealerCustomerMap(this.fuelDealerCorpMapIdNew)
                              let dateCoin = moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss')
                              this.addCoindetails(res.data.insertId, dateCoin)
                              this.resetPaymentForm();
                              this.clearAll()
                              this.isSelected1 = false;
                              this.spinner.hide();
                              this.cd.detectChanges()
                            } else {
                              alert("ERROR to Update PAYMENT Details!")
                              this.spinner.hide();
                              this.cd.detectChanges()
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
                        managerName: this.managerName,
                        isMappingEmail: this.isMappingEmail,
                        isMappingSMS: this.isMappingSMS,
                        fueldealerSmsSend: this.fueldealerSmsSend,
                        fueldealerMailSend: this.fueldealerMailSend,
                        avgPayment: this.paidAvg,
                        accountId: this.addPaymentForm.value.accountDetailsId,
                        pendingDays: this.pendingDays,
                        posEntry: this.posEntry,
                        entryFROM: "PORTAL"
                      }
                      this.post.addAccTransactionLogPayDetailPOST(data)
                        .subscribe(res => {
                          if (res) {
                            this.updatePaymentInFuelDealerCustomerMap(this.fuelDealerCorpMapIdNew)
                            let dateCoin = moment(this.addPaymentForm.value.paymentDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + ' ' + moment(new Date()).format('HH:mm:ss')
                            this.addCoindetails(res.data.insertId, dateCoin)
                            this.resetPaymentForm();
                            this.clearAll()
                            this.isSelected1 = false;
                            this.spinner.hide();
                            this.cd.detectChanges()
                          } else {
                            alert("ERROR to Update PAYMENT Details!")
                            this.spinner.hide();
                            this.cd.detectChanges()
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

  getOutstandingBuCustMapId(fuelDealerCustomerMapId: any) {

    let data = {
      custMapId: fuelDealerCustomerMapId
    }
    this.post1.getOutstandingByCustMapIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.calOutstanding = Number(res.data[0].netOS)
          if (this.outstandingAmt) {
            this.isCalculate = true;
            this.outstandingAmt = (Number(this.calOutstanding) - Number(this.addPaymentForm.value.paymentAmount))
          }
          this.cd.detectChanges()
        }

      })
  }

  getDetailsByMapId1(fuelDealerCustomMapId: any) {
    let data = {
      fuelDealerCustomMapId: fuelDealerCustomMapId
    }
    this.post.getDetailsByMapIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.overAllPaidAmount = res.data[0].totalInvPaidAmt;
            this.totalInvoiceAfterPayment = res.data[0].totalInvCreditAmt;
            // this.updatePaymentInFuelDealerCustomerMapAfterRemove(fuelDealerCustomMapId);
          }
          else {

          }
        }
      })
  }

  updatePaymentInFuelDealerCustomerMap(fuelDealerCustomMapId: any) {
    this.spinner.show()

    let data = {
      fuelDealerCustomerMapId: fuelDealerCustomMapId,
      totalPaidAmount: Number(this.addPaymentForm.value.paymentAmount) + Number(this.overAllPaidAmount),
      invoiceOutstand: Number(this.totalInvoiceAfterPayment) - (Number(this.addPaymentForm.value.paymentAmount)),
    }
    this.post.updateTotalInvPaidAmtPOST(data)
      .subscribe((res) => {
        if (res.status == 'OK') {
          this.updatelastDateCR(fuelDealerCustomMapId)
          this.spinner.hide();
        } else {
          alert("ERROR to Update PAYMENT Details!")
          this.spinner.hide();

          // this.getDetailsByMapId(this.fuelDealerCorpMapIdNew);
        }
      });

  }

  updatelastDateCR(fuelDealerCustomMapId: any) {
    this.spinner.show()

    let data1 = {
      mapId: fuelDealerCustomMapId
    }
    this.post.updateLastCRDateMapIdWisePOST(data1)
      .subscribe((res) => {
        if (res.status == 'OK') {
          // console.log("Date updated successfully..")
          alert("PAYMENT Details Updated Successfully!")
          this.spinner.hide();
          this.addPaymentForm.controls["paymentMethod"].setValue("");
          this.addPaymentForm.controls["paymentAmount"].setValue("");
          this.addPaymentForm.controls["paymentTransactionNo"].setValue("");
          this.addPaymentForm.controls["selectedCorp"].setValue("");
          this.addPaymentForm.controls["accountDetailsId"].setValue("");
          this.isCash = false;
          this.isSelected1 = false;
          this.isSelected = false;
          this.isPos = false
          this.posEntry = 'FALSE'
          this.isCash = false;
          this.resetPaymentForm();
        } else {
          // console.log("Error to update Date..")
          alert("ERROR to Update PAYMENT Details!")
          this.spinner.hide();
        }
      });
  }

  resetPaymentForm() {
    this.addPaymentForm.controls["selectedCorp"].setValue("");
    this.addPaymentForm.controls["paymentAmount"].setValue("");
    this.addPaymentForm.controls["paymentTransactionNo"].setValue("");
    this.addPaymentForm.controls["paymentMethod"].setValue("");
    this.addPaymentForm.controls["accountDetailsId"].setValue("");
    this.addPaymentForm.controls["pos"].setValue("");
    this.isSelected1 = false;

  }

  addCoindetails(transactionLogId: any, dateCoin: string) {
    let data = {
      corporateId: this.corporateIdSQL,
      translogId: transactionLogId,
      accountTransAmount: (this.addPaymentForm.value.paymentAmount) / 10,
      customerId: this.customerIdSQL,
      dateCoin: dateCoin
    }
    this.post.addCoinDetailsPOST(data)
      .subscribe(res => {

      })

  }
  
}
