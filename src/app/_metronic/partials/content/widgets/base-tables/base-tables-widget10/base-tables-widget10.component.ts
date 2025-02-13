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
  selector: 'app-base-tables-widget10',
  templateUrl: './base-tables-widget10.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class BaseTablesWidget10Component implements OnInit {
  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  acceesGroup: number;
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

  statementListForm = new FormGroup({
    selectCorporateMapId: new FormControl("", Validators.required),
    selectCorporate: new FormControl("", Validators.required),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    type: new FormControl(""),
    selectPersonId: new FormControl("", Validators.required),
    setInvoiceType: new FormControl("all"),
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
  endDate: any;
  allDiscountedData: any;
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
  custMapId1: string;
  startDate1: string;
  endDate1: string;
  FCInvoiceListDetailsNew: any = [];
  statementListDetails: any = [];
  fuelInvoiceId: any;
  modalRefpass: any;
  password: any;
  userId: any;
  modalRefCancel: any;
  searchData: any;

  constructor(
    private post: BaseTablesService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private router: Router,) {
  }

  ngOnInit(): void {
    this.FCInvoiceListDetails = JSON.parse(localStorage.getItem('FCInvoiceListDetails') || '{}');
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.accessGroup = element.accessGroupId;
    this.userId = element.userId;
    if (this.accessGroup == 12 || this.accessGroup == 19) {
      this.dealerView = true;
      this.ownerName = element.firstName + ' ' + element.lastName
    }
    this.dealerMobile = element.phone1;
    this.loginVPId = element.veelsPlusCorporateID;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.managerName = element.firstName + ' ' + element.lastName
    this.acceesGroup = element.accessGroupId;
    this.companyName = dealerData.companyName
    this.oilCompanyName = dealerData.brandName
    this.state = dealerData.state
    this.pin = dealerData.pin
    this.city = dealerData.city
    this.phone1 = dealerData.hostPhone
    this.headerName1 = dealerData.companyName;
    // this.headerName2 = res.data[0].address1+', '+res.data[0].address2+', '+res.data[0].city;
    this.headerName3 = this.state + '-' + this.pin + '  ' + "GST: " + this.GSTNumber;
    
    if (!this.FCInvoiceListDetails.length) {
      this.getFCInvoiceList()
    } else {
      this.getFCInvoiceList1()
    }
    this.getFuelCreditRequestCorporateByfuelDealerId(this.fuelDealerId)
    this.cd.detectChanges()
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

  getFCInvoiceList() {
    this.spinner.show()
    this.FCInvoiceListDetails = [];
    this.pageLength = [];

    this.endDate = this.statementListForm.value.endDate;

    if (!this.statementListForm.value.selectCorporateMapId) {
      this.custMapId1 = "";
    } else {
      this.custMapId1 = this.statementListForm.value.selectCorporateMapId;
    }
    if (!this.statementListForm.value.startDate) {
      this.startDate1 = "";
    } else {
      this.startDate1 = moment(this.statementListForm.value.startDate, [
        "DD-MM-YYYY",
      ]).format("YYYY-MM-DD");
    }

    if (!this.statementListForm.value.endDate) {
      this.endDate1 = "";
    } else {
      this.endDate1 = moment(this.statementListForm.value.endDate, [
        "DD-MM-YYYY",
      ]).format("YYYY-MM-DD");
    }

    const data = {
      VBCorporateId: this.loginVPId,
      custMapId: this.custMapId1,
      startDate: this.startDate1,
      endDate: this.endDate1,
      invoiceOf: this.statementListForm.value.setInvoiceType
    };

    this.post.getAllSavedInvoiceListPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        this.FCInvoiceListDetails = res.data;
        this.FCInvoiceListDetailsNew = res.data;
        this.pageLength = res.data;
        localStorage.setItem('FCInvoiceListDetails', JSON.stringify(this.FCInvoiceListDetails));
        this.spinner.hide()
        this.cd.detectChanges()
      } else {
        localStorage.setItem('FCInvoiceListDetails', JSON.stringify([]));
        this.spinner.hide()
        this.cd.detectChanges()
      }
    });
  }

  getFCInvoiceList1() {
    this.FCInvoiceListDetails = [];
    this.pageLength = [];

    this.endDate = this.statementListForm.value.endDate;

    if (!this.statementListForm.value.selectCorporateMapId) {
      this.custMapId1 = "";
    } else {
      this.custMapId1 = this.statementListForm.value.selectCorporateMapId;
    }
    if (!this.statementListForm.value.startDate) {
      this.startDate1 = "";
    } else {
      this.startDate1 = moment(this.statementListForm.value.startDate, [
        "DD-MM-YYYY",
      ]).format("YYYY-MM-DD");
    }

    if (!this.statementListForm.value.endDate) {
      this.endDate1 = "";
    } else {
      this.endDate1 = moment(this.statementListForm.value.endDate, [
        "DD-MM-YYYY",
      ]).format("YYYY-MM-DD");
    }

    const data = {
      VBCorporateId: this.loginVPId,
      custMapId: this.custMapId1,
      startDate: this.startDate1,
      endDate: this.endDate1,
      invoiceOf: this.statementListForm.value.setInvoiceType
    };

    this.post.getAllSavedInvoiceListPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        this.FCInvoiceListDetails = res.data;
        this.FCInvoiceListDetailsNew = res.data;
        this.pageLength = res.data;
        localStorage.setItem('FCInvoiceListDetails', JSON.stringify(this.FCInvoiceListDetails));
        this.spinner.hide()
        this.cd.detectChanges()
      } else {
        localStorage.setItem('FCInvoiceListDetails', JSON.stringify([]));
        this.spinner.hide()
        this.cd.detectChanges()
      }
    });
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getFCInvoiceList();
  }

  clearStatementListForm1() {
    this.statementListForm.reset();
    this.getFCInvoiceList();
  }

  excelDownload() {
    this.statementListDetails.length = 0
    this.FCInvoiceListDetails.map((res: { invoiceOf: string; totalAmount: any; fuelInvoicePreviousStatement: any; fuelInvoicTotalPaymentAmount: any; invoiceCode: string; invoiceDate: moment.MomentInput; invoiceNo: any; toName: any; periodStartDate: moment.MomentInput; periodEndDate: moment.MomentInput; }) => {
      let type = ""
      let openingOutstanding = 0
      let paymentAmt = 0
      let payableAmt = 0

      if (res.invoiceOf == 'CREDIT LUBETAX') {
        type = "ALL"
      } else {
        type = res.invoiceOf
      }
      if (res.invoiceOf == 'LUBE TAX') {
        openingOutstanding = 0
        paymentAmt = 0
        payableAmt = Number(res.totalAmount)
      } else {
        openingOutstanding = Number(res.fuelInvoicePreviousStatement)
        paymentAmt = Number(res.fuelInvoicTotalPaymentAmount)
        payableAmt = Number(res.fuelInvoicePreviousStatement)
          + Number(res.totalAmount) - Number(res.fuelInvoicTotalPaymentAmount)
      }

      let json = {
        InvoiceNo: "VPFCINV" + res.invoiceCode,
        GeneratedDate: moment(res.invoiceDate).format("DD-MM-YYYY"),
        ManualNo: res.invoiceNo,
        BuildToName: res.toName,
        DateRange: "From: " + moment(res.periodStartDate).format("DD-MM-YYYY")
          + " To: " + moment(res.periodEndDate).format("DD-MM-YYYY"),
        Type: type,
        OpeningOutstanding: Number(openingOutstanding).toFixed(2),
        PurchaseAmount: Number(res.totalAmount).toFixed(2),
        PaymentAmount: Number(paymentAmt).toFixed(2),
        PayableAmount: '₹ ' + Number(payableAmt).toFixed(2),
      };
      this.statementListDetails.push(json);
    });
    this.excelService.exportAsExcelFile(this.statementListDetails, "StatementList");
  }

  exportToPDF() {
    var cols = [["Invoice No", "Generated Date", "Manual No", "Build To Name", "Date Range",
      "Type", "Opening Outstanding", "Purchase Amount", "Payment Amount", "Payable Amount"]];
    var rows = [];
    for (var key in this.FCInvoiceListDetails) {
      let type = ""
      let openingOutstanding = 0
      let paymentAmt = 0
      let payableAmt = 0

      if (this.FCInvoiceListDetails[key].invoiceOf == 'CREDIT LUBETAX') {
        type = "ALL"
      } else {
        type = this.FCInvoiceListDetails[key].invoiceOf
      }
      if (this.FCInvoiceListDetails[key].invoiceOf == 'LUBE TAX') {
        openingOutstanding = 0
        paymentAmt = 0
        payableAmt = Number(this.FCInvoiceListDetails[key].totalAmount)
      } else {
        openingOutstanding = Number(this.FCInvoiceListDetails[key].fuelInvoicePreviousStatement)
        paymentAmt = Number(this.FCInvoiceListDetails[key].fuelInvoicTotalPaymentAmount)
        payableAmt = Number(this.FCInvoiceListDetails[key].fuelInvoicePreviousStatement)
          + Number(this.FCInvoiceListDetails[key].totalAmount)
          - Number(this.FCInvoiceListDetails[key].fuelInvoicTotalPaymentAmount)
      }
      var temp = [
        "VPFCINV" + this.FCInvoiceListDetails[key].invoiceCode,
        moment(this.FCInvoiceListDetails[key].invoiceDate).format("DD-MM-YYYY"),
        this.FCInvoiceListDetails[key].invoiceNo,
        this.FCInvoiceListDetails[key].toName,
        "From:" + moment(this.FCInvoiceListDetails[key].periodStartDate).format("DD-MM-YYYY")
        + " To:" + moment(this.FCInvoiceListDetails[key].periodEndDate).format("DD-MM-YYYY"),
        type,
        Number(openingOutstanding).toFixed(2),
        Number(this.FCInvoiceListDetails[key].totalAmount).toFixed(2),
        Number(paymentAmt).toFixed(2),
        Number(payableAmt).toFixed(2),
      ];
      rows.push(temp);
    }

    var doc = new jsPDF('l', 'pt');
    doc.setFontSize(20);
    doc.text("Statement List", 350, 35);
    doc.setFontSize(10);

    autoTable(doc, {
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 60 },
        2: { cellWidth: 70 },
        3: { cellWidth: 130 },
        4: { cellWidth: 90 },
        5: { cellWidth: 60 },
        6: { cellWidth: 70 },
        7: { cellWidth: 70 },
        8: { cellWidth: 70 },
        9: { cellWidth: 70 },
      },

      margin: { top: 50 },
      head: cols,
      body: rows,
      theme: 'grid',
      rowPageBreak: 'avoid',
      didDrawCell: (data) => { },
    });

    doc.save("StatementListDetails.pdf");
  }

  printPdf() {
    if (this.statementListForm.value.selectCorporateMapId) {
      this.post.setRouteForSavedInvoice(this.FCInvoiceListDetails, this.statementListForm.value.startDate, this.statementListForm.value.endDate, "TRUE")
      this.router.navigate(['/credit/listBank/1']);
    } else {
      this.post.setRouteForSavedInvoice(this.FCInvoiceListDetails, this.statementListForm.value.startDate, this.statementListForm.value.endDate, "FALSE")
      this.router.navigate(['/credit/listBank/1']);
    }

  }

  askForPass(PasswordTemplate: any, fuelInvoiceId: any) {
    this.fuelInvoiceId = fuelInvoiceId;
    this.modalRefpass = this.modalService.open(PasswordTemplate);
    this.modalRefpass.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  comparePasswordForDelete(cancelReq: any) {
    // var cancelReq
    const data = {
      password: this.password,
      userId: this.userId,
    };
    this.post.comparePasswordPOST(data).subscribe((result) => {
      if (result.status == "OK") {
        alert(result.msg);
        this.closeResult;
        this.modalRefpass.close("close");
        this.password = "";
        this.cancelRequest(cancelReq, this.fuelInvoiceId);
      } else {
        alert(result.msg);
        this.password = "";
      }
    });
  }

  cancelRequest(cancelReq: any, fuelInvoiceId: any) {
    this.fuelInvoiceId = fuelInvoiceId;

    this.modalRefCancel = this.modalService.open(cancelReq);
    this.modalRefCancel.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  deleteInvoiceByInvoiceId() {
    const data = {
      fuelInvoiceId: this.fuelInvoiceId,
    };
    this.post.deleteInvoiceDataByInvoiceIdPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        this.modalRefCancel.close("close");
        alert("Saved invoice deleted successfully.");
        this.getFCInvoiceList();
      } else {
      }
    });
  }

  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query     
    this.FCInvoiceListDetails = this.FCInvoiceListDetailsNew.filter((item: { invoiceCode: any; }) =>
      item.invoiceCode.toLowerCase().includes(query)
    );
  }
}
