import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-base-tables-widget11',
  templateUrl: './base-tables-widget11.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class BaseTablesWidget11Component implements OnInit {
  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  showStatement1: boolean = false;
  showStatement2: boolean = false;
  showStatement3: boolean = false;
  showStatement4: boolean = false;
  showStatement5: boolean = false;
  showStatement6: boolean = false;
  showStatement7: boolean = false;
  companyName: any;
  oilCompanyName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  creditPaymentCombineArrayDetails: any = [];
  creditArrayList: any = [];
  paymentArrayList: any = [];
  invoiceId: any;
  fuelDealerCustomerMapId: any;
  previousPendingOutstanding: number;
  outstandingAmount: any;
  periodStartDate: any;
  lastOpOutstanding: number;
  statementId: any;
  fuelTotalAmount: any = [];
  PaymentTotalAmount: any = [];
  fuelProductTotalAmount: any = [];
  creditAmountNew: any;
  totalTransactionAmountNew: any;
  savedPreviousOutstanding: number;
  savedTotalPurchase: number;
  savedTotalPayment: number;
  fuelInvoiceList: any = [];
  forCorporateId: any;
  invoiceDate: any;
  invoiceOf: any;
  fuelDealerIdForLubeTotal: any;
  periodEndDate: any;
  dueDate: string;
  GSTNumber: any;
  custMapId: any;
  invoiceCode: any;
  manualInvoiceNumber: any;
  hsnCode: any;
  totalOut: number;
  finalNetOutstandingForSavedInv: any;
  totalCreditOutstanding: number;
  totalLubePurchase: number;
  finalNETOutstanding: number;
  managerMobile: any;
  mobileStatus: boolean = false;
  allCustomerDetails: any;
  billedToAddressLine1: any;
  billedToCityArea: any;
  billedToCity: any;
  toState: any;
  billedToConneenorPincode: any;
  billedToGstNo: any;
  billedToName: any;
  billedToMobile: any;
  discountcalNew: any = 0;
  bankAccList: any = [];
  address1: any;
  address2: any;

  constructor(
    private post: BaseTablesService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private router: Router,
    private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.accessGroup = element.accessGroupId;
    this.companyName = dealerData.companyName
    this.oilCompanyName = dealerData.brandName
    this.state = dealerData.state
    this.pin = dealerData.pin
    this.city = dealerData.city
    this.phone1 = dealerData.hostPhone
    this.address1 = dealerData.address1
    this.address2 = dealerData.address2
    // this.getFCInvoiceList()
    const id = this.route.snapshot.paramMap.get('id');
    const id1 = this.route.snapshot.paramMap.get('id1');
    this.invoiceId = id;
    this.statementId = id1;
    if (id1 == '1') {
      this.showStatement1 = true;
      this.getCreditAndPaymentAllDataByFuelInvoiceId()
    } else if (id1 == '2') {
      this.showStatement2 = true;
    } else if (id1 == '3') {
      this.showStatement3 = true;
    } else if (id1 == '4') {
      this.showStatement4 = true;
      this.getCreditAndPaymentAllDataByFuelInvoiceId();
      this.getTotalTransactionCreditPaymentForFuelInvoice();
    } else if (id1 == '5') {
      this.showStatement5 = true;
      this.getCreditAndPaymentAllDataByFuelInvoiceId();
      this.getTotalTransactionCreditPaymentForFuelInvoice();
    } else if (id1 == '6') {
      this.showStatement6 = true;
      this.getAllCreditDetailsByFuelInvoiceId()
      this.getTotalTransactionCreditPaymentForFuelInvoice()
    } else {
      this.showStatement7 = true;
    }
    this.getBankDetailsByDealerId(this.fuelDealerId)
    this.getManagerMobileByfuelDealerId(this.fuelDealerId)
    this.getFuelInvoiceDataByInvoiceId();
    this.cd.detectChanges()
  }


  getManagerMobileByfuelDealerId(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getSelectedMobileNumberByDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.managerMobile = res.data[0].mobile;
          this.mobileStatus = true;
        } else {
          this.mobileStatus = false;
        }
      }
      );
  }

  getCustomerDataByCorporateIdForSavedInvoice() {

    const data = {
      fuelDealerCustomerMapId: this.custMapId,
    };
    this.post.getdataBycustomerMapIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.allCustomerDetails = res.data;
          this.billedToAddressLine1 = res.data[0].address1;
          this.billedToCityArea = res.data[0].address2;
          this.billedToCity = res.data[0].city;
          this.toState = res.data[0].state
          this.billedToConneenorPincode = res.data[0].pin;
          if (res.data[0].mappingPreviousStatus == 'TRUE') {
            this.billedToName = res.data[0].mappingCompanyName;
            this.billedToGstNo = res.data[0].mappingGST;
            this.billedToMobile = res.data[0].hostPhone;
          } else {
            this.billedToName = res.data[0].companyName;
            this.billedToGstNo = res.data[0].GSTNumber;
            this.billedToMobile = res.data[0].hostPhone;
          }
        }
      }
      );
  }

  getCreditAndPaymentAllDataByFuelInvoiceId() {
    this.creditPaymentCombineArrayDetails = []
    this.creditArrayList = []
    this.paymentArrayList = []

    let data = {
      id: this.invoiceId,
    }
    this.post.getCreditPaymentForFuelInvoicePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.creditArrayList = res.creditArray;
          this.paymentArrayList = res.paymentArray;
          if (res.creditArray.length) {
            this.fuelDealerCustomerMapId = res.creditArray[0].fuelDealerCustomerMapId
          } else {
            if (res.paymentArray.length) {
              this.fuelDealerCustomerMapId = res.paymentArray[0].fuelDealerCustomerMapId
            }
          }

          res.creditArray.map((creditArray: { fuelCreditId: string; fuelDealerCustomerMapId: string; reqQuantity: string; reqCreditAmount: string; estimatedRefuelDate: string; creditAmount: string; transDateTime: string; transactionTime: string; payStatus: string; payByMethod: string; paymentTransactionNo: string; paymentDate: string; fuelDealerId: string; fuelProdId: string; productRate: string; vehicleId: string; refuelForDriver: string; transactionStatus: string; fuelDealerStaffId: string; recoveryStatus: string; fleetNoFleetStatus: string; actualCreditQuantity: string; fuelInvoiceId: string; fuelCorporateId: string; creditSource: string; panNumber: string; createdAt: string; vehicleNumber: string; invoiceStatus: string; manualCrNumber: string; pendingAmount: string; discountPrice: string; discountAmount: string; discountStatus: string; purpose: string; advName: string; advMobile: string; byManager: string; fuelcreditVehicle: string; fuelcreditIGST: string; fuelcreditSGST: string; fuelcreditCGST: string; fuelcreditBeforeTax: string; fuelcreditLubeId: string; fuelcreditHsnSacNumber: string; fuelcreditTaxDetails: string; fuelcreditGST: string; fuelcreditGSTAmount: string; fuelcreditReqFrom: string; quantityInPieces: string; productName: string; }) => {
            const dataJson = {
              date: '',
              fuelCreditId: '',
              fuelDealerCustomerMapId: '',
              reqQuantity: '',
              reqCreditAmount: '',
              estimatedRefuelDate: '',
              transDateTime: '',
              transactionTime: '',
              creditAmount: '',
              payStatus: '',
              payByMethod: '',
              paymentTransactionNo: '',
              paymentDate: '',
              fuelDealerId: '',
              fuelProdId: '',
              productRate: '',
              vehicleId: '',
              refuelForDriver: '',
              transactionStatus: '',
              fuelDealerStaffId: '',
              recoveryStatus: '',
              fleetNoFleetStatus: '',
              actualCreditQuantity: '',
              fuelInvoiceId: '',
              fuelCorporateId: '',
              creditSource: '',
              panNumber: '',
              createdAt: '',
              vehicleNumber: '',
              invoiceStatus: '',
              manualCrNumber: '',
              pendingAmount: '',
              discountPrice: '',
              discountAmount: '',
              discountStatus: '',
              purpose: '',
              advName: '',
              advMobile: '',
              byManager: '',
              fuelcreditVehicle: '',
              fuelcreditIGST: '',
              fuelcreditSGST: '',
              fuelcreditCGST: '',
              fuelcreditBeforeTax: '',
              fuelcreditLubeId: '',
              fuelcreditHsnSacNumber: '',
              fuelcreditTaxDetails: '',
              fuelcreditGST: '',
              fuelcreditGSTAmount: '',
              fuelcreditReqFrom: '',
              quantityInPieces: '',
              purchase: '',
              description: '',
              product: '',
            };

            dataJson.fuelCreditId = creditArray.fuelCreditId;
            dataJson.fuelDealerCustomerMapId = creditArray.fuelDealerCustomerMapId;
            dataJson.reqQuantity = creditArray.reqQuantity;
            dataJson.reqCreditAmount = creditArray.reqCreditAmount;
            dataJson.estimatedRefuelDate = creditArray.estimatedRefuelDate;
            dataJson.date = creditArray.estimatedRefuelDate;
            dataJson.purchase = creditArray.creditAmount;
            dataJson.transDateTime = creditArray.transDateTime;
            dataJson.transactionTime = creditArray.transactionTime;
            dataJson.creditAmount = creditArray.creditAmount;
            dataJson.payStatus = creditArray.payStatus;
            dataJson.payByMethod = creditArray.payByMethod;
            dataJson.paymentTransactionNo = creditArray.paymentTransactionNo;
            dataJson.paymentDate = creditArray.paymentDate;
            dataJson.fuelDealerId = creditArray.fuelDealerId;
            dataJson.fuelProdId = creditArray.fuelProdId;
            dataJson.productRate = creditArray.productRate;
            dataJson.vehicleId = creditArray.vehicleId;
            dataJson.refuelForDriver = creditArray.refuelForDriver;
            dataJson.transactionStatus = creditArray.transactionStatus;
            dataJson.fuelDealerStaffId = creditArray.fuelDealerStaffId;
            dataJson.recoveryStatus = creditArray.recoveryStatus;
            dataJson.fleetNoFleetStatus = creditArray.fleetNoFleetStatus;
            dataJson.actualCreditQuantity = creditArray.actualCreditQuantity;
            dataJson.fuelInvoiceId = creditArray.fuelInvoiceId;
            dataJson.fuelCorporateId = creditArray.fuelCorporateId;
            dataJson.creditSource = creditArray.creditSource;
            dataJson.panNumber = creditArray.panNumber;
            dataJson.createdAt = creditArray.createdAt;
            dataJson.vehicleNumber = creditArray.vehicleNumber;
            dataJson.invoiceStatus = creditArray.invoiceStatus;
            dataJson.manualCrNumber = creditArray.manualCrNumber;
            dataJson.pendingAmount = creditArray.pendingAmount;
            dataJson.discountPrice = creditArray.discountPrice;
            dataJson.discountAmount = creditArray.discountAmount;
            dataJson.discountStatus = creditArray.discountStatus;
            dataJson.purpose = creditArray.purpose;
            dataJson.advName = creditArray.advName;
            dataJson.advMobile = creditArray.advMobile;
            dataJson.byManager = creditArray.byManager;
            dataJson.fuelcreditVehicle = creditArray.fuelcreditVehicle;
            dataJson.fuelcreditIGST = creditArray.fuelcreditIGST;
            dataJson.fuelcreditSGST = creditArray.fuelcreditSGST;
            dataJson.fuelcreditCGST = creditArray.fuelcreditCGST;
            dataJson.fuelcreditBeforeTax = creditArray.fuelcreditBeforeTax;
            dataJson.fuelcreditLubeId = creditArray.fuelcreditLubeId;
            dataJson.fuelcreditHsnSacNumber = creditArray.fuelcreditHsnSacNumber;
            dataJson.fuelcreditTaxDetails = creditArray.fuelcreditTaxDetails;
            dataJson.fuelcreditGST = creditArray.fuelcreditGST;
            dataJson.fuelcreditGSTAmount = creditArray.fuelcreditGSTAmount;
            dataJson.fuelcreditReqFrom = creditArray.fuelcreditReqFrom;
            dataJson.quantityInPieces = creditArray.quantityInPieces;
            dataJson.description = creditArray.manualCrNumber;
            dataJson.product = creditArray.productName;

            this.creditPaymentCombineArrayDetails.push(dataJson);
          })

          if (this.paymentArrayList.length) {
            res.paymentArray.map((paymentArray: { chequeDate: moment.MomentInput; paymentMethod: string; chequeNO: string; transactionPurpose: string; grandTotalAmount: any; PaymentFuelInvoiceId: string; paymentInvoiceStatus: string; advancePayment: number; }) => {
              const dataJson2 = {
                date: '',
                description: '',
                chequeDate: '',
                paymentMethod: '',
                chequeNO: '',
                grandTotalAmount: 0,
                transactionPurpose: '',
                purpose: '',
                advancePayment: 0,
                PaymentFuelInvoiceId: '',
                paymentInvoiceStatus: '',
                payment: '',
              };

              dataJson2.date = moment(paymentArray.chequeDate, ["YYYY-MM-DD HH:mm:ss"]).format("YYYY-MM-DD");
              dataJson2.description = paymentArray.paymentMethod + " | " + paymentArray.chequeNO;
              dataJson2.purpose = paymentArray.transactionPurpose;
              dataJson2.payment = paymentArray.grandTotalAmount;
              dataJson2.PaymentFuelInvoiceId = paymentArray.PaymentFuelInvoiceId;
              dataJson2.paymentInvoiceStatus = paymentArray.paymentInvoiceStatus;
              dataJson2.paymentMethod = paymentArray.paymentMethod;
              dataJson2.chequeNO = paymentArray.chequeNO;
              dataJson2.grandTotalAmount = paymentArray.grandTotalAmount;
              dataJson2.advancePayment = paymentArray.advancePayment;
              this.creditPaymentCombineArrayDetails.push(dataJson2);
              this.creditPaymentCombineArrayDetails.sort((a: { date: number; }, b: { date: number; }) => (a.date < b.date ? -1 : 1))
            })
            this.cd.detectChanges()
          } else {
          }
          this.totalPendingoutstanding();
          this.getOutStandingNewFlowForSavedInvoice()
          this.cd.detectChanges()

        } else {
        }
      });
  }

  totalPendingoutstanding() {
    const data = {
      fuelDealerCustomerMapId: this.fuelDealerCustomerMapId,
    };
    this.post.getFuelCorpIdByMapIdPOST(data).subscribe((res) => {
      if (res) {
        this.previousPendingOutstanding = Number(res.data[0].previousOutstand);
        this.cd.detectChanges()
      }
    });
  }

  getOutStandingNewFlowForSavedInvoice() {
    this.outstandingAmount = 0;
    const data = {
      fuelDealerCustomerMapId: this.fuelDealerCustomerMapId,
      startDate: this.periodStartDate,
    };

    this.post.calOutstandingAmountForSavedInvoicePOST(data)
      .subscribe(res => {
        if (res.status === 'OK') {
          this.outstandingAmount = (Number(res.partialData[0].totalCRAmt) + Number(this.previousPendingOutstanding) - Number(res.discountData[0].totalDiscountAmt)).toFixed(2);
          this.lastOpOutstanding = Number(this.outstandingAmount) - Number(res.outstandData[0].totalPaymentAmt);
          if (this.statementId = '5') {
            // this.transform(Math.round(((Number(this.creditAmountNew) - Number(this.discountcalNew)) + Number(this.lastOpOutstanding) - Number(this.totalTransactionAmountNew))));
          }
        }
        this.cd.detectChanges()
      });
  }

  getTotalTransactionCreditPaymentForFuelInvoice() {
    this.fuelTotalAmount = []
    this.PaymentTotalAmount = []
    this.fuelProductTotalAmount = []
    const data = {
      id: this.invoiceId
    };
    this.post.getTotalTransactionCreditPaymentForFuelInvoicePOST(data)
      .subscribe(res => {
        if (res) {
          this.fuelProductTotalAmount = res.creditArraySumProduct;
          this.fuelTotalAmount = res.creditArraySum;
          this.PaymentTotalAmount = res.paymentArraySum;
          this.creditAmountNew = res.creditArraySum[0].productTotalAmount
          this.totalTransactionAmountNew = res.paymentArraySum[0].totalPurchaseAmount

          if (this.statementId == '6') {
          }
        } else {
        }
      });
  }

  getAllCreditDetailsByFuelInvoiceId() {
    this.creditPaymentCombineArrayDetails = []
    this.creditArrayList = []
    this.paymentArrayList = []

    let data = {
      id: this.invoiceId,
    }
    this.post.getCreditPaymentForFuelInvoicePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.creditArrayList = res.creditArray;
          this.paymentArrayList = res.paymentArray;
          if (res.creditArray.length) {
            this.fuelDealerCustomerMapId = res.creditArray[0].fuelDealerCustomerMapId
          } else {
            if (res.paymentArray.length) {
              this.fuelDealerCustomerMapId = res.paymentArray[0].fuelDealerCustomerMapId
            }
          }
          res.creditArray.map((creditArray: { fuelCreditId: string; fuelDealerCustomerMapId: string; reqQuantity: string; reqCreditAmount: string; estimatedRefuelDate: string; creditAmount: string; transDateTime: string; transactionTime: string; payStatus: string; payByMethod: string; paymentTransactionNo: string; paymentDate: string; fuelDealerId: string; fuelProdId: string; productRate: string; vehicleId: string; refuelForDriver: string; transactionStatus: string; fuelDealerStaffId: string; recoveryStatus: string; fleetNoFleetStatus: string; actualCreditQuantity: string; fuelInvoiceId: string; fuelCorporateId: string; creditSource: string; panNumber: string; createdAt: string; vehicleNumber: string; invoiceStatus: string; manualCrNumber: string; pendingAmount: string; discountPrice: string; discountAmount: string; discountStatus: string; purpose: string; advName: string; advMobile: string; byManager: string; fuelcreditVehicle: string; fuelcreditIGST: string; fuelcreditSGST: string; fuelcreditCGST: string; fuelcreditBeforeTax: string; fuelcreditLubeId: string; fuelcreditHsnSacNumber: string; fuelcreditTaxDetails: string; fuelcreditGST: string; fuelcreditGSTAmount: string; fuelcreditReqFrom: string; quantityInPieces: string; productName: string; }) => {
            const dataJson = {
              date: '',

              fuelCreditId: '',
              fuelDealerCustomerMapId: '',
              reqQuantity: '',
              reqCreditAmount: '',
              estimatedRefuelDate: '',
              transDateTime: '',
              transactionTime: '',
              creditAmount: '',
              payStatus: '',
              payByMethod: '',
              paymentTransactionNo: '',
              paymentDate: '',
              fuelDealerId: '',
              fuelProdId: '',
              productRate: '',
              vehicleId: '',
              refuelForDriver: '',
              transactionStatus: '',
              fuelDealerStaffId: '',
              recoveryStatus: '',
              fleetNoFleetStatus: '',
              actualCreditQuantity: '',
              fuelInvoiceId: '',
              fuelCorporateId: '',
              creditSource: '',
              panNumber: '',
              createdAt: '',
              vehicleNumber: '',
              invoiceStatus: '',
              manualCrNumber: '',
              pendingAmount: '',
              discountPrice: '',
              discountAmount: '',
              discountStatus: '',
              purpose: '',
              advName: '',
              advMobile: '',
              byManager: '',
              fuelcreditVehicle: '',
              fuelcreditIGST: '',
              fuelcreditSGST: '',
              fuelcreditCGST: '',
              fuelcreditBeforeTax: '',
              fuelcreditLubeId: '',
              fuelcreditHsnSacNumber: '',
              fuelcreditTaxDetails: '',
              fuelcreditGST: '',
              fuelcreditGSTAmount: '',
              fuelcreditReqFrom: '',
              quantityInPieces: '',
              purchase: '',
              description: '',
              product: '',
            };

            dataJson.fuelCreditId = creditArray.fuelCreditId;
            dataJson.fuelDealerCustomerMapId = creditArray.fuelDealerCustomerMapId;
            dataJson.reqQuantity = creditArray.reqQuantity;
            dataJson.reqCreditAmount = creditArray.reqCreditAmount;
            dataJson.estimatedRefuelDate = creditArray.estimatedRefuelDate;
            dataJson.date = creditArray.estimatedRefuelDate;
            dataJson.purchase = creditArray.creditAmount;
            dataJson.transDateTime = creditArray.transDateTime;
            dataJson.transactionTime = creditArray.transactionTime;
            dataJson.creditAmount = creditArray.creditAmount;
            dataJson.payStatus = creditArray.payStatus;
            dataJson.payByMethod = creditArray.payByMethod;
            dataJson.paymentTransactionNo = creditArray.paymentTransactionNo;
            dataJson.paymentDate = creditArray.paymentDate;
            dataJson.fuelDealerId = creditArray.fuelDealerId;
            dataJson.fuelProdId = creditArray.fuelProdId;
            dataJson.productRate = creditArray.productRate;
            dataJson.vehicleId = creditArray.vehicleId;
            dataJson.refuelForDriver = creditArray.refuelForDriver;
            dataJson.transactionStatus = creditArray.transactionStatus;
            dataJson.fuelDealerStaffId = creditArray.fuelDealerStaffId;
            dataJson.recoveryStatus = creditArray.recoveryStatus;
            dataJson.fleetNoFleetStatus = creditArray.fleetNoFleetStatus;
            dataJson.actualCreditQuantity = creditArray.actualCreditQuantity;
            dataJson.fuelInvoiceId = creditArray.fuelInvoiceId;
            dataJson.fuelCorporateId = creditArray.fuelCorporateId;
            dataJson.creditSource = creditArray.creditSource;
            dataJson.panNumber = creditArray.panNumber;
            dataJson.createdAt = creditArray.createdAt;
            dataJson.vehicleNumber = creditArray.vehicleNumber;
            dataJson.invoiceStatus = creditArray.invoiceStatus;
            dataJson.manualCrNumber = creditArray.manualCrNumber;
            dataJson.pendingAmount = creditArray.pendingAmount;
            dataJson.discountPrice = creditArray.discountPrice;
            dataJson.discountAmount = creditArray.discountAmount;
            dataJson.discountStatus = creditArray.discountStatus;
            dataJson.purpose = creditArray.purpose;
            dataJson.advName = creditArray.advName;
            dataJson.advMobile = creditArray.advMobile;
            dataJson.byManager = creditArray.byManager;
            dataJson.fuelcreditVehicle = creditArray.fuelcreditVehicle;
            dataJson.fuelcreditIGST = creditArray.fuelcreditIGST;
            dataJson.fuelcreditSGST = creditArray.fuelcreditSGST;
            dataJson.fuelcreditCGST = creditArray.fuelcreditCGST;
            dataJson.fuelcreditBeforeTax = creditArray.fuelcreditBeforeTax;
            dataJson.fuelcreditLubeId = creditArray.fuelcreditLubeId;
            dataJson.fuelcreditHsnSacNumber = creditArray.fuelcreditHsnSacNumber;
            dataJson.fuelcreditTaxDetails = creditArray.fuelcreditTaxDetails;
            dataJson.fuelcreditGST = creditArray.fuelcreditGST;
            dataJson.fuelcreditGSTAmount = creditArray.fuelcreditGSTAmount;
            dataJson.fuelcreditReqFrom = creditArray.fuelcreditReqFrom;
            dataJson.quantityInPieces = creditArray.quantityInPieces;
            dataJson.description = creditArray.manualCrNumber;
            dataJson.product = creditArray.productName;

            this.creditPaymentCombineArrayDetails.push(dataJson);
          })
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()
        }
        this.totalPendingoutstanding();
        this.cd.detectChanges()
      });
  }

  getFuelInvoiceDataByInvoiceId() {
    this.savedPreviousOutstanding = 0;
    this.savedTotalPurchase = 0;
    this.savedTotalPayment = 0;

    const data = {
      fuelInvoiceId: this.invoiceId
    };

    this.post.getFuelInvoiceDataByInvoiceIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.fuelInvoiceList = res.data;
          this.forCorporateId = res.data[0].forCorporateId;
          this.invoiceDate = res.data[0].invoiceDate;
          this.invoiceOf = res.data[0].invoiceOf;
          this.fuelDealerIdForLubeTotal = res.data[0].fuelDealerId;
          this.periodStartDate = res.data[0].periodStartDate;
          this.periodEndDate = res.data[0].periodEndDate;
          if (res.data[0].dueDate) {
            this.dueDate = moment(res.data[0].dueDate).format("D MMM y");
          }
          this.GSTNumber = res.data[0].fromGSTNo;
          this.custMapId = res.data[0].custMapId;
          this.invoiceCode = res.data[0].invoiceCode;
          this.manualInvoiceNumber = res.data[0].invoiceNo
          if (res.data[0].hsnCode && res.data[0].hsnCode != "undefined") {
            this.hsnCode = res.data[0].hsnCode
          }

          this.savedPreviousOutstanding = res.data[0].fuelInvoicePreviousStatement;
          this.savedTotalPurchase = res.data[0].totalAmount;
          this.savedTotalPayment = res.data[0].fuelInvoicTotalPaymentAmount;
          this.totalOut = this.savedTotalPurchase - this.savedTotalPayment
          this.finalNetOutstandingForSavedInv = this.totalOut + this.savedPreviousOutstanding;

          if (this.invoiceOf == "LUBE TAX") {
            // this.transform(Math.round(((Number(this.savedTotalPurchase)))));
          } else {
            // this.transform(Math.round(((Number(this.savedTotalPurchase) - Number(this.savedTotalPayment)) + Number(this.savedPreviousOutstanding))));
          }
          this.totalCreditOutstanding = ((Number(this.savedTotalPurchase) - Number(this.savedTotalPayment)) + Number(this.savedPreviousOutstanding))
          // console.log("TotalCreditOutstanding",this.totalCreditOutstanding)

          this.getLubricantTotal(this.totalCreditOutstanding);
          this.getCustomerDataByCorporateIdForSavedInvoice()
        } else {
        }
      });
  }

  //getLubricantTotal()
  getLubricantTotal(totalCreditOutstanding: number) {
    this.totalLubePurchase = 0;
    this.finalNETOutstanding = 0;
    let data = {
      fuelDealerCustomerMapId: this.custMapId,
      startDate: this.periodStartDate,
      endDate: this.periodEndDate,
    }
    this.post.getLubricantTotalPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.totalLubePurchase = res.data[0].totalLubricant;
          if (this.invoiceOf != "CREDIT LUBETAX") {
            this.finalNETOutstanding = totalCreditOutstanding + this.totalLubePurchase
          } else {
            this.finalNETOutstanding = totalCreditOutstanding
          }
        } else {
          alert("Error to get Data..")
        }
      })
  }

  getBankDetailsByDealerId(fuelDealerId: any) {
    // console.log("CALL API ===========")
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
}
