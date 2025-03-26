import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { BaseTablesService } from '../base-tables.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

@Injectable()
export class CustomAdapter extends NgbDateAdapter<any> {

  readonly DELIMITER = '-';

  fromModel(value: any | null): NgbDateStruct | null {
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

  toModel(date: NgbDateStruct | null): any | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: any): NgbDateStruct | null {
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

  format(date: NgbDateStruct | null): any {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-base-tables-widget9',
  templateUrl: './base-tables-widget9.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class BaseTablesWidget9Component implements OnInit {
  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  acceesGroup: any;
  dealerView: boolean;
  ownerName: string;
  dealerMobile: any;
  dealerLoginVPId: any;
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: string;
  companyName: any;
  oilCompanyName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  headerName1: any;
  headerName3: string;
  GSTNumber: string;

  selectCorporate = new FormGroup({
    selectCorporateId: new FormControl("", [Validators.required]),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  });

  searchDiscountForm = new FormGroup({
    selectCorporateMapId: new FormControl("", Validators.required),
    selectCorporate: new FormControl("", Validators.required),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    dueDate: new FormControl(""),
    type: new FormControl(""),
    selectPersonId: new FormControl("", Validators.required),
    setInvoiceType: new FormControl("all"),
    crDaysLimit: new FormControl("", Validators.required),
    startDateCrDays: new FormControl(""),
    endDateCrDays: new FormControl(""),
    setInvoiceTypeCrDays: new FormControl("all"),
  });

  unitForm = new FormGroup({
    mobile: new FormControl("", Validators.required),
  });

  fuelDealerCorpMapId: string;
  customerName: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  fuelCorporateId: any;
  custLetestOutstanding: any = [];
  custPrevOutstanding: number;
  allCorporateList: any = [];
  personList: any = [];
  fuelCreditId: any = [];
  totalAmount: number;
  totalQuantity: number;
  allCreditSaleData: any = [];
  isNoRequest: boolean = false;
  allPaymentData: any = [];
  combineCreditAndPaymentDetails: any = [];
  endDate: string;
  allDiscountedData: any = [];
  pageLength1: any;
  countunpaidDiscount: any;
  withoutDiscountData: any;
  custMapId: any;
  name: any;
  toAddress: any;
  toGSTNo: any;
  toState: any;
  invoiceFor: any;
  forCorporateId: any;
  modalRef: any;
  closeResult: string;
  managerList: any;
  managerMobile: any;
  invoiceNo: any;
  hsnCode: any;
  accountTransacLogId: any = [];
  totalPurchaseAmount: number;
  isNoRequestPayment: boolean = false;
  allTrData: any;
  showPaymetCreditTable: boolean = false;
  outstandingAmount: number;
  lastOpOutstanding: number;
  invoiceOf: string;
  fromGSTNo: any;
  fromState: any;
  fromAddress: any;
  fromName: any;
  loginVPId: any;
  active: number;
  FCInvoiceListDetails: any = [];
  pageLength: any = [];
  statementListForm: any;
  custMapId1: string;
  startDate1: string;
  endDate1: string;
  FCInvoiceListDetailsNew: any = [];

  constructor(
    private post: BaseTablesService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private router: Router,) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    var managerData = JSON.parse(localStorage.getItem('managerData') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.accessGroup = element.accessGroupId;
    if (this.accessGroup == 12 || this.accessGroup == 19) {
      this.dealerView = true;
      this.ownerName = element.firstName + ' ' + element.lastName
    }
    this.loginVPId = element.veelsPlusCorporateID;
    this.dealerMobile = element.phone1;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.managerName = element.firstName + ' ' + element.lastName
    this.acceesGroup = element.accessGroupId;
    this.fromName = dealerData.companyName
    this.oilCompanyName = dealerData.brandName
    this.fromState = dealerData.state
    this.pin = dealerData.pin
    this.city = dealerData.city
    this.phone1 = dealerData.hostPhone
    this.fromGSTNo = dealerData.GSTNumber
    this.fromAddress = dealerData.address1
    if(this.accessGroup == '14'){
      this.fromName = managerData.companyName
      this.fromState = managerData.state
      this.fromAddress = managerData.address1
      this.fromGSTNo = managerData.GSTNumber
    }
    this.headerName1 = this.companyName;
    // this.headerName2 = res.data[0].address1+', '+res.data[0].address2+', '+res.data[0].city;
    this.headerName3 = this.state + '-' + this.pin + '  ' + "GST: " + this.GSTNumber;
    this.getManagersByfuelDealerId(this.fuelDealerId)
    this.getFuelCreditRequestCorporateByfuelDealerId(this.fuelDealerId)
    this.cd.detectChanges()
  }

  getDetailsByCorpForStatementforDiscount(id: any) {
    this.fuelCorporateId = id.target.value;
  }

  getCustomerPreviousOutstanding() {
    this.custLetestOutstanding = [];
    this.custPrevOutstanding = 0;
    const data = {
      customerMapId: this.searchDiscountForm.value.selectCorporateMapId,
    };
    this.post.getPreviousOutstandingByCustomerPOST(data)
      .subscribe((res) => {
        if (res.status == "OK") {
          this.custLetestOutstanding = res.data;
          this.custPrevOutstanding = res.data[0].previousOutstand;
        } else {
        }
      });
  }

  getFuelCreditRequestCorporateByfuelDealerId(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getFuelCreditRequestCorporateByfuelDealerIdPOST(data)
      .subscribe((res) => {
        if (res) {
          this.allCorporateList = res.data;
        } else {
        }
      });
    this.post.getFuelCreditRequestPersonListByfuelDealerIdPOST(data)
      .subscribe((res) => {
        if (res) {
          this.personList = res.data;
        } else {
        }
      });
  }

  showAlldiscountedCR() {
    if (this.searchDiscountForm.value.selectCorporateMapId) {
      if (this.searchDiscountForm.value.startDate) {
        if (this.searchDiscountForm.value.endDate) {
          this.spinner.show();

          this.fuelCreditId = [];
          this.totalQuantity = 0;
          this.totalAmount = 0;
          this.allCreditSaleData = [];
          this.allPaymentData = [];
          this.combineCreditAndPaymentDetails = [];
          this.endDate = this.searchDiscountForm.value.endDate;
          this.post.inilizeForInvoice();
          const data = {
            CorporateMapId: this.searchDiscountForm.value.selectCorporateMapId,
            startDate: moment(this.searchDiscountForm.value.startDate, [
              "DD-MM-YYYY",
            ]).format("YYYY-MM-DD"),
            endDate: moment(this.searchDiscountForm.value.endDate, [
              "DD-MM-YYYY",
            ]).format("YYYY-MM-DD"),
            getInvoiceType: this.searchDiscountForm.value.setInvoiceType,
          };
          this.post.allDiscountedAmountForManualPOST(data)
            .subscribe((res) => {
              if (res.status == "OK") {
                this.allDiscountedData = res.data;
                this.allCreditSaleData = res.data;
                this.pageLength1 = res.data;
                this.countunpaidDiscount = res.unpaidDiscount;
                this.withoutDiscountData = res.data1;
                this.getdataBycustomerMapId(
                  this.searchDiscountForm.value.selectCorporateMapId
                );
                if (res.data.length) {
                  this.isNoRequest = true;
                  res.data.map((fuelCreditId1: { fuelCreditId: any; actualCreditQuantity: any; creditAmount: any; }) => {
                    this.fuelCreditId.push(fuelCreditId1.fuelCreditId);
                    this.totalQuantity = Number(this.totalQuantity) + Number(fuelCreditId1.actualCreditQuantity);
                    this.totalAmount = Number(this.totalAmount) + Number(fuelCreditId1.creditAmount);

                    this.spinner.hide();
                    this.cd.detectChanges()
                  });
                } else {
                  this.isNoRequest = false;
                  this.spinner.hide();
                  this.cd.detectChanges()
                }
                this.getTransactionDetails();
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.getTransactionDetails();
                this.spinner.hide();
                this.cd.detectChanges()
              }
            });
        } else {
          alert("Please Select EndDate");
        }
      } else {
        alert("Please Select StartDate");
      }
    } else {
      alert("Please Select Corporate");
    }
  }

  getdataBycustomerMapId(fuelDealerCustomerMapId: any) {
    this.custMapId = fuelDealerCustomerMapId;
    let data = {
      fuelDealerCustomerMapId: fuelDealerCustomerMapId,
    };

    this.post.getdataBycustomerMapIdPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        if (res.data[0].mappingPreviousStatus == "TRUE") {
          this.name = res.data[0].mappingCompanyName;
          this.toAddress = res.data[0].city;
          this.toGSTNo = res.data[0].mappingGST;
          this.toState = res.data[0].state;
          this.invoiceFor = res.data[0].mappingCompanyName;
          this.forCorporateId = res.data[0].corporateId;
          this.cd.detectChanges()
        } else {
          this.name = res.data[0].companyName;
          this.toAddress = res.data[0].city;
          this.toGSTNo = res.data[0].GSTNumber;
          this.toState = res.data[0].state;
          this.invoiceFor = res.data[0].companyName;
          this.forCorporateId = res.data[0].corporateId;
          this.cd.detectChanges()
        }
      }
    });
  }

  openSelectMobile(selectMobile: any) {
    this.modalRef = this.modalService.open(selectMobile, { size: "sm" });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

  getManagersByfuelDealerId(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getManagerDetailsByDealerIdPOST(data).subscribe((res) => {
      if (res.data.length) {
        this.managerList = res.data;
      } else {
      }
    });
  }

  submitMobile() {
    let data = {
      mobile: this.unitForm.value.mobile,
      fuelDealerId: this.fuelDealerId,
    };
    this.post.addManagerMobileToDOCPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        alert("Mobile added successfully..");
        this.getManagerMobileByfuelDealerId(this.fuelDealerId);
        this.modalRef.close("close");
      } else {
      }
    });
  }

  getManagerMobileByfuelDealerId(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getSelectedMobileNumberByDealerIdPOST(data)
      .subscribe((res) => {
        if (res.data.length) {
          this.managerMobile = res.data[0].mobile;
        } else {
        }
      });
  }

  getTransactionDetails() {
    this.accountTransacLogId = [];
    this.totalPurchaseAmount = 0;
    this.post.inilizeForInvoicePayment();

    const data = {
      fuelDealerCustomerMapId:
        this.searchDiscountForm.value.selectCorporateMapId,
      startDate: moment(this.searchDiscountForm.value.startDate, [
        "DD-MM-YYYY",
      ]).format("YYYY-MM-DD"),
      endDate: moment(this.searchDiscountForm.value.endDate, [
        "DD-MM-YYYY",
      ]).format("YYYY-MM-DD"),
    };
    this.post.getAccountTransactionLogBYfuelDealerCustomMapIdByDateRangeForManualPOST(data)
      .subscribe((res) => {
        if (res.status === "OK") {
          this.allPaymentData = res.data;
          this.allTrData = res.data;

          if (res.data.length) {
            this.isNoRequestPayment = true;

            res.data.map((accountTransacLogId1: { accountTransacLogId: any; grandTotalAmount: any; }) => {
              this.accountTransacLogId.push(
                accountTransacLogId1.accountTransacLogId
              );
              this.totalPurchaseAmount = Number(this.totalPurchaseAmount) + Number(accountTransacLogId1.grandTotalAmount);

              this.spinner.hide();
              this.cd.detectChanges()
            });
          }
        }
        this.getOutstandingForSavedInvoice()
        // Combine Both Payment And Credit Array
        if (this.searchDiscountForm.value.setInvoiceType != "typeLubeTax") {
          this.showPaymetCreditTable = true;
          if (this.allPaymentData.length || this.allCreditSaleData.length) {

            if (this.allCreditSaleData.length) {
              this.allCreditSaleData.map((creditArray: { estimatedRefuelDate: string; manualCrNumber: string; purpose: string; productName: string; creditAmount: any; productCategory: string; actualCreditQuantity: string; lubeUnit: string; reqQuantity: number; productRate: string; }) => {
                const dataJson = {
                  date: "",
                  description: "",
                  purpose: "",
                  productName: "",
                  creditAmount: 0,
                  productCategory: "",
                  actualCreditQuantity: "",
                  lubeUnit: "",
                  reqQuantity: 0,
                  productRate: "",
                  purchase: "",
                };
                dataJson.date = creditArray.estimatedRefuelDate;
                dataJson.description = creditArray.manualCrNumber;
                dataJson.purpose = creditArray.purpose;
                dataJson.productName = creditArray.productName;
                dataJson.creditAmount = creditArray.creditAmount;
                dataJson.productCategory = creditArray.productCategory;
                dataJson.actualCreditQuantity = creditArray.actualCreditQuantity;
                dataJson.lubeUnit = creditArray.lubeUnit;
                dataJson.reqQuantity = creditArray.reqQuantity;
                dataJson.productRate = creditArray.productRate;
                dataJson.purchase = creditArray.creditAmount;

                this.combineCreditAndPaymentDetails.push(dataJson);
              });
              this.cd.detectChanges()
            }
            if (this.allPaymentData.length) {
              //purchase
              this.allPaymentData.map((paymentArray: { chequeDate: moment.MomentInput; paymentMethod: string; chequeNO: string; transactionPurpose: string; grandTotalAmount: any; PaymentFuelInvoiceId: string; paymentInvoiceStatus: string; advancePayment: number; }) => {
                const dataJson2 = {
                  date: "",
                  description: "",
                  chequeDate: "",
                  paymentMethod: "",
                  chequeNO: "",
                  grandTotalAmount: 0,
                  transactionPurpose: "",
                  purpose: "",
                  advancePayment: 0,
                  PaymentFuelInvoiceId: "",
                  paymentInvoiceStatus: "",
                  payment: "",
                };

                dataJson2.date = moment(paymentArray.chequeDate, [
                  "YYYY-MM-DD HH:mm:ss",
                ]).format("YYYY-MM-DD");
                dataJson2.description =
                  paymentArray.paymentMethod + " | " + paymentArray.chequeNO;

                dataJson2.purpose = paymentArray.transactionPurpose;
                dataJson2.payment = paymentArray.grandTotalAmount;
                dataJson2.PaymentFuelInvoiceId = paymentArray.PaymentFuelInvoiceId;
                dataJson2.paymentInvoiceStatus = paymentArray.paymentInvoiceStatus;
                dataJson2.paymentMethod = paymentArray.paymentMethod;
                dataJson2.chequeNO = paymentArray.chequeNO;
                dataJson2.grandTotalAmount = paymentArray.grandTotalAmount;
                dataJson2.advancePayment = paymentArray.advancePayment;

                this.combineCreditAndPaymentDetails.push(dataJson2);
                this.combineCreditAndPaymentDetails.sort((a: { date: number; }, b: { date: number; }) =>
                  a.date < b.date ? -1 : 1
                );
              });
              this.cd.detectChanges()
            } else {
            }
          } else {
          }
        } else {
          this.showPaymetCreditTable = false;
          this.cd.detectChanges()
        }
      });
  }

  getOutstandingForSavedInvoice() {
    this.outstandingAmount = 0;
    const data = {
      CorporateMapId: this.searchDiscountForm.value.selectCorporateMapId,
      startDate: moment(this.searchDiscountForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      endDate: moment(this.searchDiscountForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
    };

    this.post.getOutstandingForSavedInvoiceByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.outstandingAmount = res.data[0].openningOS
          this.lastOpOutstanding = this.outstandingAmount
        }
      });
  }

  statementCreate() {
    if (this.searchDiscountForm.value.setInvoiceType != "typeLubeTax") {
      if (this.searchDiscountForm.value.setInvoiceType == "all") {
        this.invoiceOf = "CREDIT LUBETAX"
      } else {
        this.invoiceOf = "CREDIT"
      }
    } else {
      this.invoiceOf = "LUBE TAX"
    }
    this.spinner.show()
    let data = {
      fromGSTNo: this.fromGSTNo,  //for manager
      invoiceNo: this.invoiceNo,
      hsnCode: this.hsnCode,
      invoiceDate: new Date(),
      fromState: this.fromState,  //
      fromName: this.fromName,   //
      fromAddress: this.fromAddress,   //
      toName: this.name,
      toAddress: this.toAddress,
      toGSTNo: this.toGSTNo,
      toState: this.toState,
      totalAmount: this.totalAmount,
      fuelInvoiceCreatedBy: this.loginVPId,
      fuelInvoiceCreatedAt: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      forCorporateId: this.forCorporateId,
      totalQuantity: this.totalQuantity,
      discount: "0",
      invoiceFor: "CORPORATE",
      finalTotalAmt: this.totalAmount,
      custMapId: this.custMapId,
      periodStartDate: moment(this.searchDiscountForm.value.startDate, [
        "DD-MM-YYYY",
      ]).format("YYYY-MM-DD"),
      periodEndDate: moment(this.searchDiscountForm.value.endDate, [
        "DD-MM-YYYY",
      ]).format("YYYY-MM-DD"),
      fuelCreditId: this.fuelCreditId,
      accountTransacLogId: this.accountTransacLogId,
      fuelInvoicTotalPaymentAmount: this.totalPurchaseAmount,
      fuelInvoicePreviousStatement: this.lastOpOutstanding,
      fuelDealerId: this.fuelDealerId,
      invoiceOf: this.invoiceOf,
      period: "",
      dueDate: moment(this.searchDiscountForm.value.dueDate, ["DD-MM-YYYY",]).format("YYYY-MM-DD"),
    };

   
    this.post.addfuelInvoiceFuelAndPaymentPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        alert(res.msg);
        this.combineCreditAndPaymentDetails = []
        this.allDiscountedData = []
        this.active = 2;
        this.searchDiscountForm.reset();
        this.isNoRequest = false;
        this.invoiceNo = "";
        this.hsnCode = "";
        window.location.reload()
        this.spinner.hide()
        
        this.cd.detectChanges()

        // this.getFCInvoiceList();
      }
    });
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getTransactionDetails();
    this.cd.detectChanges()
  }

}
