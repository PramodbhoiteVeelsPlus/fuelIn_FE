import { ChangeDetectorRef, Component, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbActiveModal, NgbDate, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { TilesService } from '../tiles.services';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { ExcelService } from 'src/app/pages/excel.service';


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
  selector: 'app-tiles-widget5',
  templateUrl: './tiles-widget5.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TilesWidget5Component {

  dealerAccess: boolean = false;
  dealerLoginVPId: any;
  accessGroupId: any;
  userId: any;
  userName: string;
  personId: any;
  dealerCorporateId: any;
  petrolPumpName: any;
  fuelDealerId: any;
  oilCoAccountingBookData: any = [];
  bankAllAccList: any = [];
  bankSavingAccList: any = [];
  bankLoanAccList: any = [];


  @Input() fromDate: Date;
  @Input() toDate: Date;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();
  hoveredDate: NgbDate;
  fromNGDate: NgbDate;
  toNGDate: NgbDate;

  hidden: boolean = true;
  selected: any;
  selectValue: string[];

  // searchBox: any = "";
  // searchTermm: any;
  page: any = 1;
  pageSize: any = 10;

  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    bankAccId: new FormControl("", Validators.required),
    posId: new FormControl("", Validators.required),
    posBankId: new FormControl("", Validators.required),
    posName: new FormControl(""),

  });
  oilCoAccountingSearchBookData: any = [];
  fuelTerminalDetails: any = [];
  bankAccountingBookData: any = [];
  bankAccountingSearchBookData: any = [];
  posAccountingBookData: any = [];
  posAccountingSearchBookData: any = [];
  isOILBook: boolean = true;
  isBankBook: boolean = false;
  isPOSBook: boolean = false;
  creditData: any = [];
  debitData: any = [];
  bankWiseCrDbData: any = [];
  allAccList: any = [];
  isCollapsed: boolean = true;
  isCASHBook: boolean = false;
  cashAccountingBookData: any = [];
  cashAccountingSearchBookData: any = [];
  balanceData: any = [];
  oilCoAcTotalAmount1: any = 0;
  oilCoAcDate1: any;
  totalOilCoACDebit: any = 0;
  totalOilCoCredit: number;
  closingOilCoACBlc: any = 0;
  closingDate: any;
  openingDate: any;
  oilCoStatus: boolean = false;
  cashStatus: boolean = false;
  balanceCashData: any = [];
  cashAcTotalAmount1: any = 0;
  cashAcDate1: any;
  totalCashACDebit: number;
  totalCashACCredit: number;
  closingCashACBlc: number;
  balanceBankData: any = [];
  totalCREDITBankWiseData: any = [];
  totalCRBankWiseData: any = [];
  totalDBBankWiseData: any = [];
  bankWiseDetailsOPEN: any = [];
  totalOpenDBBankWiseData: any = [];
  totalOpenCREDITBankWiseData: any = [];
  totalOpenCRBankWiseData: any = [];
  bankStatusWise: any = [];
  bankwiseBalanceData: any = [];
  bankwiseBalanceData1: any = [];
  bankBlc: number;
  modalUpdate: any;
  closeResult: string;
  bankAccList: any = [];
  bankAcTotalAmount: number;
  bankAcDate: any;
  bankId: any = '';
  bankAcUpdate: boolean = false;
  fuelExpenseId: any;
  totalDBBankACWiseData: any = [];
  totalCRBankACWiseData: any = [];
  totalCREDITBankACWiseData: any = [];
  closingCashBlc: number;
  openingCashBlc: number;
  totalOpeningCashDebit: number;
  totalOpeningCashCredit: number;
  cashAcOpeningBlc: any;
  cashAcOpenDate: any;
  cashAcTotalAmount: number;
  cashAcDate: any;
  cashAcUpdate: boolean = false;
  totalCashDebit: any;
  totalCashCredit: any;
  oilCoAcDate: any;
  oilCoAcTotalAmount: any = 0;
  oilCoAcUpdate: boolean = false;
  oilCoAcOpeningBlc: any;
  oilCoAcOpenDate: any;
  totalOpeningCredit: number;
  totalOpeningDebit: number;
  openingBlc: number;
  closingBlc: number;
  totalDebit: any;
  totalCredit: any;
  showOilCoAc: boolean = false;
  showBankAc: boolean = false;
  showCashAc: boolean = false;
  showDefault: boolean = true;
  fuelExpenseIdOil: any;
  isFilter: boolean = false;
  oilCoAccountingBookData1: any = [];
  oilCompanyDetails: any = [];
  oilCoCRPaymentDetails: any = [];
  cashCRPaymentDetails: any = [];
  cashAccountingDetails: any = [];
  totalOilCOPurchase: any = 0;
  oilCoAccountingDetails: any = [];
  oilBrandName: any;
  bankWiseTotalAmount1: any = 0;
  totalBankWiseDebit: any = 0;
  totalBankWiseCredit: any = 0;
  closingBankWiseBlc: any = 0;
  bankWisePaymentDetails: any = [];
  bankAccountingBookDetails: any = [];
  isBankBlc: boolean = false;
  bankWiseExpenseAmount: any = 0;
  data3totalDebit: any = 0;
  data1totalDebit: any = 0;
  data2totalCredit: any = 0;
  data4totalCredit: any = 0;
  data5totalCredit: any = 0;
  accountingBankCr: string;
  accountingBankDb: string;
  bankAccType: any;
  data7totalCredit: any = 0;
  data7totalCredit1: any = 0;
  data5totalCredit1: any = 0;
  data4totalCredit1: any = 0;
  data3totalDebit1: any = 0;
  data2totalCredit1: any = 0;
  data1totalDebit1: any = 0;
  headerName1: any;
  headerName2: string;
  headerName3: string;
  data8totalPurchase: any = 0;
  data5totalDebit1: any = 0;
  oilCoAccountingBookDataExcelFilter: any = [];
  bankAccountingBookDataFilter: any = [];
  oilCoPaidFromFilter: any;
  oilCoPaidToFilter: string;
  oilCoDebitFilter: any;
  oilCoCreditFilter: any;
  isBankPaidFromFilter: string;
  isBankDebitFilter: any;
  isBankCreditFilter: any;
  posAccountingBookDataFilter: any = [];
  isPOSPaidFromFilter: string;
  isPOSPaidToFromFilter: string;
  isPOSDebitFilter: any;
  isBankPaidToFilter: string;
  cashAccountingBookDataFilter: any = [];
  isCashPaidFromFilter: string;
  isCashPaidToFromFilter: string;
  isCashDebitFilter: number;
  isCashCreditFilter: any;
  oilCoAccountingBookDataExcel: any = [];
  oilCoPaidFromWithoutFilter: string;
  oilCoPaidToWithoutFilter: string;
  oilCoDebitWithoutFilter: any;
  oilCoCreditWithoutFilter: any;
  bankAccountingBookDataExcel: any = [];
  isBankPaidFromWithoutFilter: string;
  isBankPaidToWithoutFilter: string;
  isBankDebitWithoutFilter: any;
  isBankCreditWithoutFilter: any;
  isPOSPaidFromWithoutFilter: string;
  isPOSPaidToFromWithoutFilter: string;
  isPOSDebitWithoutFilter: any;
  posAccountingBookDataExcel: any = [];
  isCashPaidFromWithoutFilter: string;
  cashAccountingBookDataExcel: any = [];
  isCashPaidToFromWithoutFilter: string;
  isCashDebitWithoutFilter: number;
  isCashCreditWithoutFilter: number;
  dataPaytotalCredit: number;
  totalCreditBankWiseData: any = [];
  bankWisePaymentData: any = [];
  totalOpenCrPay: any = [];
  dataPaymentTotalCredit: any = 0;
  dataPaytotal2223: any = 0;
  bankwisePayment2223Data: any = [];
  searchBox:FormControl = new FormControl();
  searchTermm: any = "";
  dataPaytotal2324: any = 0;
  bankwisePayment2324Data: any = [];

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private post: TilesService,
    config: NgbDatepickerConfig,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
  ) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }
  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dealerCorporateId = localStorage.getItem('dealerCorporateId');
    this.filterForm.controls["startDate"].setValue("01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear())
    this.filterForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
    this.selected = ("01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear()) + ' - ' + (moment(new Date()).format("DD-MM-YYYY"))
    this.closingDate = moment(new Date()).format("YYYY-MM-DD");
    this.openingDate = moment(new Date()).format("YYYY-MM-01");
    
    this.accessGroupId = element.accessGroupId;
    if (this.accessGroupId == '12') {
      var dealerData = JSON.parse(localStorage.getItem('dealerData') || '')
      this.headerName1 = dealerData.companyName;
      this.headerName2 = dealerData.address1 + ', ' + dealerData.address2 + ', ' + dealerData.city;
      this.headerName3 = dealerData.state + '-' + dealerData.pin + '  ' + "GST: " + dealerData.GSTNumber;
      this.oilBrandName = dealerData.brandName;
    }
    if (this.accessGroupId == '14') {
      var managerData = JSON.parse(localStorage.getItem('managerData') || '');
      this.headerName1 = managerData.companyName;
      this.headerName2 = managerData.address1 + ', ' + managerData.address2 + ', ' + managerData.city;
      this.headerName3 = managerData.state + '-' + managerData.pin + '  ' + "GST: " + managerData.GSTNumber;
      this.oilBrandName = managerData.brandName;
    }


    this.getFuelTerminal(this.fuelDealerId);
    this.getOILCOMPANYDataInFuelExpense(this.fuelDealerId);
    this.getCashAcBalance1();
    this.getBankAcBalance1();
    this.getBankDetailsByDealerId(this.fuelDealerId);
  }

  // Bank Details By fuelDealerId
  getBankDetailsByDealerId(fuelDealerId: any) {
    let data = {
      dealerId: fuelDealerId,
    }
    this.post.getBankDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.bankAllAccList = res.data;
          this.bankSavingAccList = res.data1;
          this.bankLoanAccList = res.data2;
          this.allAccList = res.data3;
          this.bankAccList = res.data1;
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
        } else {
        }
      })
  }



  //filter
  filter() {
    this.spinner.show();

    this.oilCoAcTotalAmount1 = 0;
    this.totalOilCoACDebit = 0;
    this.totalOilCoCredit = 0;
    this.closingOilCoACBlc = 0;
    this.cashAcTotalAmount1 = 0;
    this.totalCashACDebit = 0;
    this.totalCashACCredit = 0;
    this.closingCashACBlc = 0;
    this.bankWiseDetailsOPEN = []
    this.bankWiseCrDbData = [];
    this.oilCoAccountingBookData1 = []
    this.oilCoAccountingSearchBookData = [];
    this.bankAccountingBookData = []
    this.bankAccountingSearchBookData = [];
    this.posAccountingBookData = []
    this.posAccountingSearchBookData = [];
    this.oilCoAccountingDetails = []
    this.cashAccountingBookData = []
    this.cashAccountingSearchBookData = [];
    if (this.filterForm.value.bankAccId) {
      this.isFilter = true;
      this.isBankBlc = false;
      this.openingDate = moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      this.closingDate = moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      this.getOILCOMPANYDataInFuelExpense(this.fuelDealerId)
      this.getCashAcBalance1();
      this.getBankAcBalance1();
    } else {
      if (this.filterForm.value.posBankId) {
        this.openingDate = moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
        this.closingDate = moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
        this.getOILCOMPANYDataInFuelExpense(this.fuelDealerId)
        this.getCashAcBalance1();
        this.getBankAcBalance1();
        this.bankWiseCrDbData = [];
        this.oilCoAccountingBookData1 = []
        this.oilCoAccountingSearchBookData = [];
        this.bankAccountingBookData = []
        this.bankAccountingSearchBookData = [];
        this.posAccountingBookData = []
        this.posAccountingSearchBookData = [];
        this.oilCoAccountingDetails = []
        let data = {
          accountingFuelDealerId: this.fuelDealerId,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          posBankId: this.filterForm.value.posBankId,
          posName: this.filterForm.value.posName,
        }
        this.post.getNEWAccountingBookPOST(data)
          .subscribe(res => {
            if (res.status == 'OK') {
              this.posAccountingBookData = res.data2;
              this.posAccountingSearchBookData = res.data2;
              this.isFilter = true;
              this.cd.detectChanges();
              this.spinner.hide();
            } else {
              this.isFilter = false;
              this.cd.detectChanges();
              this.spinner.hide();
            }
          })
      } else {
        this.openingDate = moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
        this.closingDate = moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
        this.getOILCOMPANYDataInFuelExpense(this.fuelDealerId)
        this.getCashAcBalance1();
        this.getBankAcBalance1();
        this.bankWiseCrDbData = [];
        this.oilCoAccountingBookData1 = []
        this.oilCoAccountingSearchBookData = [];
        this.bankAccountingBookData = []
        this.bankAccountingSearchBookData = [];
        this.posAccountingBookData = []
        this.posAccountingSearchBookData = [];
        this.oilCoAccountingDetails = []
        this.filterForm.controls["posId"].setValue("")
        this.filterForm.controls["bankAccId"].setValue("")
        let data = {
          accountingFuelDealerId: this.fuelDealerId,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        this.post.getNEWAccountingBookPOST(data)
          .subscribe(res => {
            if (res.status == 'OK') {
              this.bankAccountingBookData = res.data1;
              this.bankAccountingSearchBookData = res.data1;
              this.posAccountingBookData = res.data2;
              this.posAccountingSearchBookData = res.data2;
              this.isFilter = true;
              this.cd.detectChanges();
              this.spinner.hide();
            } else {
              this.isFilter = false;
              this.cd.detectChanges();
              this.spinner.hide();
            }
          })
      }
    }

  }

  //OIL CO RADIO BTN
  filter1() {
    /** spinner starts on init */
    this.spinner.show();

    this.isBankBlc = false;
    this.isOILBook = true;
    this.isCASHBook = false;
    this.isBankBook = false;
    this.isPOSBook = false;
    this.filterForm.controls["bankAccId"].setValue("")
    this.filterForm.controls["posId"].setValue("")
    this.oilCoAccountingBookData = []
    this.oilCoAccountingSearchBookData = [];
    this.bankAccountingBookData = []
    this.bankAccountingSearchBookData = [];
    this.posAccountingBookData = []
    this.posAccountingSearchBookData = [];
    this.oilCoAccountingDetails = []
    let data = {
      accountingFuelDealerId: this.fuelDealerId,
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    }
    this.post.getNEWAccountingBookPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          res.data.map((res1: any) => {
            const dataJson = {
              accountingDate: '',
              accountingBook: '',
              accountingAmout: 0,
              accountingCreatedBy: '',
              accountingDetails: '',
              accountingFromInput: '',
              accountingOilCoCr: '',
              accountingOilCoDb: '',
              accountingToInput: '',
              accountingTransactionType: '',
              paidFromAccountNumber: '',
              paidFromBankName: '',
              paidToAccountNumber: '',
              paidToBankName: '',
              paidFromBankId: '',
              paidToBankId: '',
            };

            dataJson.accountingDate = res1.accountingDate;
            dataJson.accountingBook = res1.accountingBook;
            dataJson.accountingAmout = res1.accountingAmout;
            dataJson.accountingCreatedBy = res1.accountingCreatedBy;
            dataJson.accountingDetails = res1.accountingDetails;
            dataJson.accountingFromInput = res1.accountingFromInput;
            dataJson.accountingOilCoCr = res1.accountingOilCoCr;
            dataJson.accountingOilCoDb = res1.accountingOilCoDb;
            dataJson.accountingToInput = res1.accountingToInput;
            dataJson.accountingTransactionType = res1.accountingTransactionType;
            dataJson.paidFromAccountNumber = res1.paidFromAccountNumber;
            dataJson.paidFromBankName = res1.paidFromBankName;
            dataJson.paidToBankName = res1.paidToBankName;
            dataJson.paidToAccountNumber = res1.paidToAccountNumber;
            dataJson.paidFromBankId = res1.paidFromBankId;
            dataJson.paidToBankId = res1.paidToBankId;

            this.oilCoAccountingDetails.push(dataJson);
          })

          if (this.oilCompanyDetails.length) {
            //purchase
            this.oilCompanyDetails.map((res3: any) => {
              const dataJson2 = {
                accountingDate: '',
                accountingBook: '',
                accountingAmout: 0,
                accountingCreatedBy: '',
                accountingDetails: '',
                accountingFromInput: '',
                accountingOilCoCr: '',
                accountingOilCoDb: '',
                accountingToInput: '',
                accountingTransactionType: '',
                paidFromAccountNumber: '',
                paidFromBankName: '',
                paidToAccountNumber: '',
                paidToBankName: '',
                paidFromBankId: '',
                paidToBankId: '',

              };

              dataJson2.accountingDate = res3.expenseDate;
              dataJson2.accountingBook = "Oil Company";
              dataJson2.accountingAmout = res3.expenseAmount;
              dataJson2.accountingCreatedBy = res3.createdBy;
              dataJson2.accountingDetails = res3.productName + ' ' + res3.vehicleNumber;
              dataJson2.accountingToInput = this.oilBrandName;
              dataJson2.accountingOilCoCr = "FALSE";
              dataJson2.accountingOilCoDb = "TRUE";
              dataJson2.accountingTransactionType = "Product Purchase";
              dataJson2.paidFromAccountNumber = res3.accountNumber;
              dataJson2.paidFromBankId = res3.accountId;
              dataJson2.paidToBankId = "22";

              this.oilCoAccountingDetails.push(dataJson2);
              this.oilCoAccountingDetails.sort((a: any, b: any) => (a.accountingDate < b.accountingDate ? -1 : 1))
            })
            this.oilCompanyWithBlc(this.oilCoAccountingDetails)
            this.cd.detectChanges();
            this.spinner.hide();
          } else {
            this.oilCompanyWithBlc(this.oilCoAccountingDetails)
            this.cd.detectChanges();
            this.spinner.hide();
          }
        } else {
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  //OIL CO RADIO BTN
  filterByCASH() {
    /** spinner starts on init */
    this.spinner.show();

    this.isBankBlc = false;
    this.isOILBook = false;
    this.isBankBook = false;
    this.isPOSBook = false;
    this.isCASHBook = true;
    this.filterForm.controls["bankAccId"].setValue("")
    this.filterForm.controls["posId"].setValue("")
    this.cashAccountingBookData = []
    this.cashAccountingSearchBookData = [];
    this.oilCoAccountingBookData = []
    this.oilCoAccountingSearchBookData = [];
    this.bankAccountingBookData = []
    this.bankAccountingSearchBookData = [];
    this.posAccountingBookData = []
    this.posAccountingSearchBookData = [];
    this.cashAccountingDetails = []
    let data = {
      accountingFuelDealerId: this.fuelDealerId,
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    }
    this.post.getNEWAccountingBookPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          res.data3.map((res1: any) => {
            const dataJson = {
              accountingDate: '',
              accountingBook: '',
              accountingAmout: 0,
              accountingCreatedBy: '',
              accountingDetails: '',
              accountingFromInput: '',
              accountingCashCr: '',
              accountingCashDb: '',
              accountingToInput: '',
              accountingTransactionType: '',
              paidFromAccountNumber: '',
              paidFromBankName: '',
              paidToAccountNumber: '',
              paidToBankName: '',
              paidFromBankId: '',
              paidToBankId: '',

            };

            dataJson.accountingDate = res1.accountingDate;
            dataJson.accountingBook = res1.accountingBook;
            dataJson.accountingAmout = res1.accountingAmout;
            dataJson.accountingCreatedBy = res1.accountingCreatedBy;
            dataJson.accountingDetails = res1.accountingDetails;
            dataJson.accountingFromInput = res1.accountingFromInput;
            dataJson.accountingCashCr = res1.accountingCashCr;
            dataJson.accountingCashDb = res1.accountingCashDb;
            dataJson.accountingToInput = res1.accountingToInput;
            dataJson.accountingTransactionType = res1.accountingTransactionType;
            dataJson.paidFromAccountNumber = res1.paidFromAccountNumber;
            dataJson.paidFromBankName = res1.paidFromBankName;
            dataJson.paidToBankName = res1.paidToBankName;
            dataJson.paidToAccountNumber = res1.paidToAccountNumber;
            dataJson.paidFromBankId = res1.paidFromBankId;
            dataJson.paidToBankId = res1.paidToBankId;

            this.cashAccountingDetails.push(dataJson);
          })

          if (this.cashCRPaymentDetails.length) {
            this.cashCRPaymentDetails.map((res: any) => {
              const dataJson1 = {
                accountingDate: '',
                accountingBook: '',
                accountingAmout: 0,
                accountingCreatedBy: '',
                accountingDetails: '',
                accountingFromInput: '',
                accountingCashCr: '',
                accountingCashDb: '',
                accountingToInput: '',
                accountingTransactionType: '',
                paidFromAccountNumber: '',
                paidFromBankName: '',
                paidToAccountNumber: '',
                paidToBankName: '',
                paidFromBankId: '',
                paidToBankId: '',

              };

              dataJson1.accountingDate = res.transacDate;
              dataJson1.accountingBook = "Cash";
              dataJson1.accountingAmout = res.grandTotalAmount;
              dataJson1.accountingCreatedBy = "";
              dataJson1.accountingDetails = res.paymentMethod + ' ' + res.chequeNO;
              dataJson1.accountingFromInput = res.companyName
              dataJson1.accountingCashCr = "TRUE";
              dataJson1.accountingCashDb = "FALSE";
              dataJson1.accountingTransactionType = "Credit Payment";
              dataJson1.paidToAccountNumber = res.accountNumber;
              dataJson1.paidFromBankId = "22";
              dataJson1.paidToBankId = res.accountId;
              dataJson1.paidToBankName = res.bankName;

              this.cashAccountingDetails.push(dataJson1);
            })
            this.cashAccountingDetails.sort((a: any, b: any) => (a.accountingDate < b.accountingDate ? -1 : 1))
            this.cashDataWithBlc(this.cashAccountingDetails)
            this.cd.detectChanges();
            this.spinner.hide();
          } else {
            this.cashDataWithBlc(this.cashAccountingDetails)
            this.cd.detectChanges();
            this.spinner.hide();
          }
        } else {
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  //filterBANK RADIO BTN
  filterByBANKBook() {
    /** spinner starts on init */
    this.spinner.show();
    this.isBankBlc = false;
    this.isOILBook = false;
    this.isCASHBook = false;
    this.isBankBook = true;
    this.isPOSBook = false;
    this.filterForm.controls["posId"].setValue("")
    this.filterForm.controls["bankAccId"].setValue("")
    this.bankAccountingBookData = []
    this.bankAccountingSearchBookData = [];
    let data = {
      accountingFuelDealerId: this.fuelDealerId,
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    }
    this.post.getNEWAccountingBookPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.bankAccountingBookData = res.data1;
          this.bankAccountingSearchBookData = res.data1;
          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  //filterBANK DROPDOWN
  filterByBANKACIdBook(id: any) {
    /** spinner starts on init */
    this.spinner.show();

    if (id.target.value) {
      this.isOILBook = false;
      this.isBankBook = true;
      this.isPOSBook = false;
      this.filterForm.controls["posId"].setValue("")
      this.bankAccountingBookData = []
      this.bankAccountingSearchBookData = [];
      this.getBankAcBalance1();
      this.cd.detectChanges();
      this.spinner.hide();
    } else {
      this.filterByBANKBook();
      this.filterForm.controls["bankAccId"].setValue("")
      this.cd.detectChanges();
      this.spinner.hide();
    }
  }

  //filter POS RADIO BTN
  filterByPOSBook() {
    /** spinner starts on init */
    this.spinner.show();
    this.isOILBook = false;
    this.isBankBook = false;
    this.isPOSBook = true;
    this.isCASHBook = false;
    this.posAccountingBookData = []
    this.posAccountingSearchBookData = [];
    this.filterForm.controls["bankAccId"].setValue("")
    this.filterForm.controls["posId"].setValue("")
    let data = {
      accountingFuelDealerId: this.fuelDealerId,
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    }
    this.post.getNEWAccountingBookPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.posAccountingBookData = res.data2;
          this.posAccountingSearchBookData = res.data2;
          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  getBankAccByPOS(id: any) {
    if (id.target.value) {
      this.spinner.show()
      const data = {
        posId: id.target.value,
      };
      this.post.getFuelTerminalDetailsByIdPOST(data)
        .subscribe((res) => {
          if (res.status == 'OK') {
            this.spinner.hide()
            this.filterForm.controls["posBankId"].setValue(res.data[0].attachedAccountId)
            this.filterForm.controls["posName"].setValue(res.data[0].terminalName)
            this.filterByPOSBANKACIdBook(res.data[0].attachedAccountId, res.data[0].terminalName)
            this.cd.detectChanges();
            this.spinner.hide();
          } else {
            this.filterByPOSBook();
            this.filterForm.controls["posId"].setValue("")
            this.cd.detectChanges();
            this.spinner.hide();
          }
        });
    } else {
      this.filterByPOSBook();
      this.filterForm.controls["posId"].setValue("")
      this.cd.detectChanges();
      this.spinner.hide();
    }
  }

  //filter POS DROPDOWN
  filterByPOSBANKACIdBook(posBankId: any, posName: any) {
    this.spinner.show()
    this.isOILBook = false;
    this.isBankBook = false;
    this.isPOSBook = true;
    this.posAccountingBookData = []
    this.posAccountingSearchBookData = [];
    this.filterForm.controls["bankAccId"].setValue("")
    let data = {
      accountingFuelDealerId: this.fuelDealerId,
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      posBankId: posBankId,
      posName: posName,
    }
    this.post.getNEWAccountingBookPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.posAccountingBookData = res.data2;
          this.posAccountingSearchBookData = res.data2;
          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  /**
  * on date selected
  * @param date date object
  */
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
    } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.toDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      this.selected = moment(this.fromDate.toLocaleDateString()).format("DD-MM-YYYY") + ' - ' + moment(this.toDate.toLocaleDateString()).format("DD-MM-YYYY")
      this.filterForm.controls["startDate"].setValue(moment(this.fromDate.toLocaleDateString()).format("DD-MM-YYYY"));
      this.filterForm.controls["endDate"].setValue(moment(this.toDate.toLocaleDateString()).format("DD-MM-YYYY"));
      this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });
      this.fromDate;
      this.toDate;
      this.fromNGDate;
      this.toNGDate;
    } else {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';

    }
  }

  /**
* @param date date obj
*/
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  /**
* @param date date obj
*/
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }

  /**
    * Is hovered over date
    * @param date date obj
    */
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }

  //OIL Book Search
  search() {
    if (this.isOILBook == true) {
      let termm = this.searchTermm;
      this.oilCoAccountingBookData = this.oilCoAccountingSearchBookData.filter(function (res: any) {
        return res.accountingBook.indexOf(termm) >= 0;
      });
      if (this.oilCoAccountingBookData.length == 0) {
        termm = this.searchTermm;
        this.oilCoAccountingBookData = this.oilCoAccountingSearchBookData.filter(function (res: any) {
          return res.accountingTransactionType.indexOf(termm) >= 0;
        });
      } if (this.oilCoAccountingBookData.length == 0) {
        termm = this.searchTermm;
        this.oilCoAccountingBookData = this.oilCoAccountingSearchBookData.filter(function (res: any) {
          return res.accountingDetails.indexOf(termm) >= 0;
        });
      }
      if (this.oilCoAccountingBookData.length == 0) {
        termm = this.searchTermm;
        this.oilCoAccountingBookData = this.oilCoAccountingSearchBookData.filter(function (res: any) {
          return res.paidFromBankName.indexOf(termm) >= 0;
        });
      }
      if (this.oilCoAccountingBookData.length == 0) {
        termm = this.searchTermm;
        this.oilCoAccountingBookData = this.oilCoAccountingSearchBookData.filter(function (res: any) {
          return res.paidFromAccountNumber.indexOf(termm) >= 0;
        });
      }
      if (this.oilCoAccountingBookData.length == 0) {
        termm = this.searchTermm;
        this.oilCoAccountingBookData = this.oilCoAccountingSearchBookData.filter(function (res: any) {
          return res.accountingFromInput.indexOf(termm) >= 0;
        });
      }
      if (this.oilCoAccountingBookData.length == 0) {
        termm = this.searchTermm;
        this.oilCoAccountingBookData = this.oilCoAccountingSearchBookData.filter(function (res: any) {
          return res.paidToBankName.indexOf(termm) >= 0;
        });
      }
      if (this.oilCoAccountingBookData.length == 0) {
        termm = this.searchTermm;
        this.oilCoAccountingBookData = this.oilCoAccountingSearchBookData.filter(function (res: any) {
          return res.paidToAccountNumber.indexOf(termm) >= 0;
        });
      }
      if (this.oilCoAccountingBookData.length == 0) {
        termm = this.searchTermm;
        this.oilCoAccountingBookData = this.oilCoAccountingSearchBookData.filter(function (res: any) {
          return res.accountingToInput.indexOf(termm) >= 0;
        });
      }
      if (this.oilCoAccountingBookData.length == 0) {
        termm = this.searchTermm;
        this.oilCoAccountingBookData = this.oilCoAccountingSearchBookData.filter(function (res: any) {
          return res.accountingCreatedBy.indexOf(termm) >= 0;
        });
      }
      if (this.oilCoAccountingBookData.length == 0) {
        termm = this.searchTermm;
        this.oilCoAccountingBookData = this.oilCoAccountingSearchBookData.filter(function (res: any) {
          return res.accountingAmout.indexOf(termm) >= 0;
        });
      }
    } else {
      if (this.isBankBook == true) {
        let termm = this.searchTermm;
        this.bankAccountingBookData = this.bankAccountingSearchBookData.filter(function (res: any) {
          return res.accountingBook.indexOf(termm) >= 0;
        });

        if (this.bankAccountingBookData.length == 0) {
          termm = this.searchTermm;
          this.bankAccountingBookData = this.bankAccountingSearchBookData.filter(function (res: any) {
            return res.accountingTransactionType.indexOf(termm) >= 0;
          });
        } if (this.bankAccountingBookData.length == 0) {
          termm = this.searchTermm;
          this.bankAccountingBookData = this.bankAccountingSearchBookData.filter(function (res: any) {
            return res.accountingDetails.indexOf(termm) >= 0;

          });
        }
        if (this.bankAccountingBookData.length == 0) {
          termm = this.searchTermm;
          this.bankAccountingBookData = this.bankAccountingSearchBookData.filter(function (res: any) {
            return res.paidFromBankName.indexOf(termm) >= 0;
          });
        }
        if (this.bankAccountingBookData.length == 0) {
          termm = this.searchTermm;
          this.bankAccountingBookData = this.bankAccountingSearchBookData.filter(function (res: any) {
            return res.paidFromAccountNumber.indexOf(termm) >= 0;
          });
        }
        if (this.bankAccountingBookData.length == 0) {
          termm = this.searchTermm;
          this.bankAccountingBookData = this.bankAccountingSearchBookData.filter(function (res: any) {
            return res.accountingFromInput.indexOf(termm) >= 0;
          });
        }
        if (this.bankAccountingBookData.length == 0) {
          termm = this.searchTermm;
          this.bankAccountingBookData = this.bankAccountingSearchBookData.filter(function (res: any) {
            return res.paidToBankName.indexOf(termm) >= 0;
          });
        }
        if (this.bankAccountingBookData.length == 0) {
          termm = this.searchTermm;
          this.bankAccountingBookData = this.bankAccountingSearchBookData.filter(function (res: any) {
            return res.paidToAccountNumber.indexOf(termm) >= 0;
          });
        }
        if (this.bankAccountingBookData.length == 0) {
          termm = this.searchTermm;
          this.bankAccountingBookData = this.bankAccountingSearchBookData.filter(function (res: any) {
            return res.accountingToInput.indexOf(termm) >= 0;
          });
        }
        if (this.bankAccountingBookData.length == 0) {
          termm = this.searchTermm;
          this.bankAccountingBookData = this.bankAccountingSearchBookData.filter(function (res: any) {
            return res.accountingCreatedBy.indexOf(termm) >= 0;
          });
        }
        if (this.bankAccountingBookData.length == 0) {
          termm = this.searchTermm;
          this.bankAccountingBookData = this.bankAccountingSearchBookData.filter(function (res: any) {
            return res.accountingAmout.indexOf(termm) >= 0;
          });
        }
      } else {
        if (this.isPOSBook == true) {
          let termm = this.searchTermm;
          this.posAccountingBookData = this.posAccountingSearchBookData.filter(function (res: any) {
            return res.accountingBook.indexOf(termm) >= 0;
          });
          if (this.posAccountingBookData.length == 0) {
            termm = this.searchTermm;
            this.posAccountingBookData = this.posAccountingSearchBookData.filter(function (res: any) {
              return res.accountingTransactionType.indexOf(termm) >= 0;
            });
          } if (this.posAccountingBookData.length == 0) {
            termm = this.searchTermm;
            this.posAccountingBookData = this.posAccountingSearchBookData.filter(function (res: any) {
              return res.accountingDetails.indexOf(termm) >= 0;
            });
          }
          if (this.posAccountingBookData.length == 0) {
            termm = this.searchTermm;
            this.posAccountingBookData = this.posAccountingSearchBookData.filter(function (res: any) {
              return res.paidFromBankName.indexOf(termm) >= 0;
            });
          }
          if (this.posAccountingBookData.length == 0) {
            termm = this.searchTermm;
            this.posAccountingBookData = this.posAccountingSearchBookData.filter(function (res: any) {
              return res.paidFromAccountNumber.indexOf(termm) >= 0;
            });
          }
          if (this.posAccountingBookData.length == 0) {
            termm = this.searchTermm;
            this.posAccountingBookData = this.posAccountingSearchBookData.filter(function (res: any) {
              return res.accountingFromInput.indexOf(termm) >= 0;
            });
          }
          if (this.posAccountingBookData.length == 0) {
            termm = this.searchTermm;
            this.posAccountingBookData = this.posAccountingSearchBookData.filter(function (res: any) {
              return res.paidToBankName.indexOf(termm) >= 0;
            });
          }
          if (this.posAccountingBookData.length == 0) {
            termm = this.searchTermm;
            this.posAccountingBookData = this.posAccountingSearchBookData.filter(function (res: any) {
              return res.paidToAccountNumber.indexOf(termm) >= 0;
            });
          }
          if (this.posAccountingBookData.length == 0) {
            termm = this.searchTermm;
            this.posAccountingBookData = this.posAccountingSearchBookData.filter(function (res: any) {
              return res.accountingToInput.indexOf(termm) >= 0;
            });
          }
          if (this.posAccountingBookData.length == 0) {
            termm = this.searchTermm;
            this.posAccountingBookData = this.posAccountingSearchBookData.filter(function (res: any) {
              return res.accountingCreatedBy.indexOf(termm) >= 0;
            });
          }
          if (this.posAccountingBookData.length == 0) {
            termm = this.searchTermm;
            this.posAccountingBookData = this.posAccountingSearchBookData.filter(function (res: any) {
              return res.accountingAmout.indexOf(termm) >= 0;
            });
          }
        } else {
          if(this.isCASHBook == true){
            let termm = this.searchTermm;
            this.cashAccountingBookData = this.cashAccountingSearchBookData.filter(function (res: any) {
              return res.accountingBook.indexOf(termm) >= 0;
            });
            if (this.cashAccountingBookData.length == 0) {
              termm = this.searchTermm;
              this.cashAccountingBookData = this.cashAccountingSearchBookData.filter(function (res: any) {
                return res.accountingTransactionType.indexOf(termm) >= 0;
              });
            } if (this.posAccountingBookData.length == 0) {
              termm = this.searchTermm;
              this.cashAccountingBookData = this.cashAccountingSearchBookData.filter(function (res: any) {
                return res.accountingDetails.indexOf(termm) >= 0;
              });
            }
            if (this.cashAccountingBookData.length == 0) {
              termm = this.searchTermm;
              this.cashAccountingBookData = this.cashAccountingSearchBookData.filter(function (res: any) {
                return res.paidFromBankName.indexOf(termm) >= 0;
              });
            }
            if (this.cashAccountingBookData.length == 0) {
              termm = this.searchTermm;
              this.cashAccountingBookData = this.cashAccountingSearchBookData.filter(function (res: any) {
                return res.paidFromAccountNumber.indexOf(termm) >= 0;
              });
            }
            if (this.cashAccountingBookData.length == 0) {
              termm = this.searchTermm;
              this.cashAccountingBookData = this.posAccountingSearchBookData.filter(function (res: any) {
                return res.accountingFromInput.indexOf(termm) >= 0;
              });
            }
            if (this.cashAccountingBookData.length == 0) {
              termm = this.searchTermm;
              this.cashAccountingBookData = this.cashAccountingSearchBookData.filter(function (res: any) {
                return res.paidToBankName.indexOf(termm) >= 0;
              });
            }
            if (this.cashAccountingBookData.length == 0) {
              termm = this.searchTermm;
              this.cashAccountingBookData = this.cashAccountingSearchBookData.filter(function (res: any) {
                return res.paidToAccountNumber.indexOf(termm) >= 0;
              });
            }
            if (this.cashAccountingBookData.length == 0) {
              termm = this.searchTermm;
              this.cashAccountingBookData = this.cashAccountingSearchBookData.filter(function (res: any) {
                return res.accountingToInput.indexOf(termm) >= 0;
              });
            }
            if (this.cashAccountingBookData.length == 0) {
              termm = this.searchTermm;
              this.cashAccountingBookData = this.cashAccountingSearchBookData.filter(function (res: any) {
                return res.accountingCreatedBy.indexOf(termm) >= 0;
              });
            }
            if (this.cashAccountingBookData.length == 0) {
              termm = this.searchTermm;
              this.cashAccountingBookData = this.cashAccountingSearchBookData.filter(function (res: any) {
                return res.accountingAmout.indexOf(termm) >= 0;
              });
            }
          } else{

          }
        }
      }
    }
  }

  //bankWiseCRDB
  bankWiseCRDB(allAccList: any, creditData: any, debitData: any) {
    allAccList.map((res: any) => {
      const dataPAYJson = {
        bankAcc: '',
        debitAmount: 0,
        creditAmount: 0,
      };
      dataPAYJson.bankAcc = res.bankName + ' ' + res.accountNumber;
      debitData.map((res1: any) => {
        if (res.bankDetailsId == res1.accountingPaidFrom) {
          dataPAYJson.debitAmount = res1.debitAmount;
        }
      })
      creditData.map((res2: any) => {
        if (res.bankDetailsId == res2.accountingPaidTo) {
          dataPAYJson.creditAmount = res2.creditAmount;
        }
      })
      this.bankWiseCrDbData.push(dataPAYJson);
    })
    this.cd.detectChanges();
    this.spinner.hide();
  }

  getOilCoAcBalance1() {
    this.oilCoAcTotalAmount = 0;
    this.data3totalDebit1 = 0;
    this.data4totalCredit1 = 0;
    this.data1totalDebit1 = 0;
    this.data2totalCredit1 = 0;
    this.data5totalDebit1 = 0;
    let data = {
      fuelDealerId: this.fuelDealerId,
      expenseCategory: "BALANCE OIL COMPANY A/C",
      startDate: this.openingDate,
      endDate: this.closingDate,
      corporateId: this.dealerCorporateId,
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
            this.cd.detectChanges();
            this.spinner.hide();
          } else {
            this.oilCoStatus = false;
            this.cd.detectChanges();
            this.spinner.hide();
          }
          this.cd.detectChanges();
          this.spinner.hide();
          this.getOilCoBook();
        } else {
          alert("Error")
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  getCashAcBalance1() {
    this.totalCashACCredit = 0;
    this.cashAcTotalAmount = 0;
    this.totalCashACDebit = 0;
    this.closingCashACBlc = 0;
    this.cashCRPaymentDetails = []
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
          if (res.data.length) {
            this.cashAcUpdate = true;
            this.fuelExpenseId = res.data[0].fuelExpenseId;
            this.cashAcTotalAmount = res.data[0].expenseAmount;
            this.cashAcDate = moment(res.data[0].expenseDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY")
            this.balanceCashData = res.data;
            this.cashAcTotalAmount1 = Number(res.data[0].expenseAmount) - Number(res.data6[0].totalDebit) + ((Number(res.data4[0].totalCredit) + Number(res.data5[0].totalCredit)))
            this.cashAcDate1 = res.data[0].expenseDate
            this.cd.detectChanges();
            this.spinner.hide();
          } else {
            this.cd.detectChanges();
            this.spinner.hide();
          }
          this.totalCashACDebit = Number(res.data3[0].totalDebit)
          this.totalCashACCredit = (Number(res.data1[0].totalCredit) + Number(res.data2[0].totalCredit))
          this.closingCashACBlc = Number(this.cashAcTotalAmount1) - Number(this.totalCashACDebit) + Number(this.totalCashACCredit)
          this.cashCRPaymentDetails = res.data7;
          if (this.openingDate >= this.cashAcDate1) {
            this.cashStatus = true;
          } else {
            this.cashStatus = false;
          }

          if (this.isCASHBook == true) {
            this.filterByCASH()
          }
          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          alert("Error")
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  getBankAcBalance1() {
    if (this.filterForm.value.bankAccId) {
      this.bankWiseExpenseAmount = 0
      this.data1totalDebit = 0
      this.data3totalDebit = 0
      this.data2totalCredit = 0
      this.data4totalCredit = 0
      this.data5totalCredit = 0
      this.data7totalCredit = 0
      this.balanceBankData.length = 0
      this.bankWisePaymentDetails = []
      this.bankWiseTotalAmount1 = 0
      this.totalBankWiseDebit = 0
      this.closingBankWiseBlc = 0
      this.totalBankWiseCredit = 0
      this.totalBankWiseDebit = 0
      this.dataPaytotalCredit = 0
      this.bankWisePaymentData = []
      this.dataPaymentTotalCredit = 0
      this.dataPaytotal2223 = 0
      this.bankwisePayment2223Data = []
      this.dataPaytotal2324 = 0
      this.bankwisePayment2324Data = []

      let data = {
        fuelDealerId: this.fuelDealerId,
        corporateId: this.dealerCorporateId,
        expenseCategory: "BALANCE BANK/LOAN A/C",
        startDate: this.openingDate,
        endDate: this.closingDate,
        bankId: this.filterForm.value.bankAccId,
      }
      this.post.getBalanceByExpenseCategoryPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            if (res.data.length) {
              this.bankWiseExpenseAmount = Number(res.data[0].expenseAmount);
              this.bankAccType = res.data[0].type;

              if (res.data3.length) {
                this.data3totalDebit = Number(res.data3[0].totalDebit)
              }
              if (res.data4.length) {
                this.data4totalCredit = Number(res.data4[0].totalCredit)
              }
              if (res.data7.length) {
                this.data7totalCredit = Number(res.data7[0].totalCredit)
              }
              this.spinner.hide();
            }
            if (res.data1.length) {
              this.data1totalDebit = Number(res.data1[0].totalDebit)
            }
            if (res.data2.length) {
              this.data2totalCredit = Number(res.data2[0].totalCredit)
            }

            if (res.data5.length) {
              this.data5totalCredit = Number(res.data5[0].totalCredit)
            }

            if (res.dataPay.length) {
              this.dataPaytotalCredit = Number(res.dataPay[0].totalCredit)
            }

            if (res.payData.length) {
              this.dataPaymentTotalCredit = Number(res.payData[0].totalCredit)
            }

            if (res.dataPay2223.length) {
              this.dataPaytotal2223 = Number(res.dataPay2223[0].totalCredit)
            }

            if (res.dataPay2324.length) {
              this.dataPaytotal2324 = Number(res.dataPay2324[0].totalCredit)
            }
            this.bankWiseTotalAmount1 = this.bankWiseExpenseAmount - this.data3totalDebit + (this.data4totalCredit) + this.data7totalCredit + this.dataPaymentTotalCredit + this.dataPaytotal2223 + this.dataPaytotal2324;
            this.totalBankWiseDebit = this.data1totalDebit
            this.totalBankWiseCredit = this.data2totalCredit + (this.data5totalCredit) + (this.dataPaytotalCredit)
            this.closingBankWiseBlc = Number(this.bankWiseTotalAmount1) - Number(this.totalBankWiseDebit) + Number(this.totalBankWiseCredit)
            this.bankWisePaymentDetails = res.data6;
            this.bankWisePaymentData = res.dataAllPay;
            this.bankwisePayment2223Data = res.dataAllPay2223;
            this.bankwisePayment2324Data = res.dataAllPay2324;
            this.getBankIdWiseBankBook();
            this.cd.detectChanges();
            this.spinner.hide();
          } else {
            alert("Error")
            this.cd.detectChanges();
            this.spinner.hide();
          }
        })
    } else {
      this.isBankBlc = false;
      this.balanceBankData.length = 0;
      this.totalCREDITBankWiseData = [];
      this.totalCRBankWiseData = [];
      this.totalDBBankWiseData = [];
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
          } else {
            alert("Error")
            this.cd.detectChanges();
            this.spinner.hide();
          }
        })
    }
  }

  getBankAcBalanceOPEN(balanceBankData: any, totalCREDITBankWiseData: any, totalCRBankWiseData: any, totalDBBankWiseData: any, totalCreditBankWiseData: any) {
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
          this.balanceBankData.map((res1: any) => {
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
            totalDBBankWiseData.map((res2: any) => {
              if (res1.bankAccountId == res2.bankAccountId) {
                dataJson.totalDebit = Number(res2.totalDebit);
              }
            })
            totalCRBankWiseData.map((res3: any) => {
              if (res1.bankAccountId == res3.bankAccountId) {
                dataJson.totalCredit = Number(res3.totalCredit);
              }
            })
            totalCREDITBankWiseData.map((res4: any) => {
              if (res1.bankAccountId == res4.accountId) {
                dataJson.totalCreditPayment = Number(res4.totalCredit);
              }
            })
            this.totalOpenDBBankWiseData.map((res5: any) => {
              if (res1.bankAccountId == res5.bankAccountId) {
                dataJson.totalOpeningDb = Number(res5.totalDbBANKINGAmt);
              }
            })
            this.totalOpenCREDITBankWiseData.map((res6: any) => {
              if (res1.bankAccountId == res6.accountId) {
                dataJson.totalOpeningCrPayment = Number(res6.totalCredit);
              }
            })
            this.totalOpenCRBankWiseData.map((res7: any) => {
              if (res1.bankAccountId == res7.bankAccountId) {
                dataJson.totalOpeningCr = Number(res7.totalCrBANKINGAmt);
              }
            })
            this.bankStatusWise.map((res8: any) => {
              if (res1.bankAccountId == res8.bankAccountId) {
                dataJson.status = res8.status;
              }
            })
            totalCreditBankWiseData.map((res9: any) => {
              if (res1.bankAccountId == res9.accountId) {
                dataJson.totalCreditPay = Number(res9.totalCredit);
              }
            })
            this.totalOpenCrPay.map((res10: any) => {
              if (res1.bankAccountId == res10.accountId) {
                dataJson.totalOpeningCrPay = Number(res10.totalCredit);
              }
            })
            this.bankWiseDetailsOPEN.push(dataJson);
          })
          let bankwiseBalance = 0
          this.bankWiseDetailsOPEN.map((data: any) => {
            const JSON = {
              bankwiseBalance: 0
            }
            if (((Number(data.expenseAmount) - Number(data.totalOpeningDb) + Number(data.totalOpeningCr) + Number(data.totalOpeningCrPayment) + Number(data.totalOpeningCrPay)) - Number(data.totalDebit) + Number(data.totalCredit) + Number(data.totalCreditPayment) + Number(data.totalCreditPay)) > 0 || data.status == 'FALSE' || data.accType == 'SAVING') {
              bankwiseBalance = Number(bankwiseBalance) + ((Number(data.expenseAmount) - Number(data.totalOpeningDb) + Number(data.totalOpeningCr) + Number(data.totalOpeningCrPayment) + Number(data.totalOpeningCrPay)) - Number(data.totalDebit) + Number(data.totalCredit) + Number(data.totalCreditPayment) + Number(data.totalCreditPay))
              JSON.bankwiseBalance = bankwiseBalance;
              this.bankwiseBalanceData.push(JSON);
            }
          })
          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          this.cd.detectChanges();
          this.spinner.hide();
        }
        console.log("data", this.bankWiseDetailsOPEN)
      })
  }

  // openAcBlcModal 
  openAcBlcModal(openModal: any) {
    this.modalUpdate = this.modalService.open(openModal, { size: 'lg' })
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

  submitBankAcBalance() {
    if (this.bankAcDate) {
      if (this.bankId) {
        if (this.bankAcTotalAmount && Number(this.bankAcTotalAmount) >= 0 || this.bankAcTotalAmount == 0 || this.bankAcTotalAmount < 0) {
          this.spinner.show()
          let data = {
            fuelDealerId: this.fuelDealerId,
            expenseCategory: "BALANCE BANK/LOAN A/C",
            expenseAmount: Number(this.bankAcTotalAmount).toFixed(2),
            expenseDate: moment(this.bankAcDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            bankAccountId: this.bankId,
            entryFrom: 'PORTAL',
          }
          this.post.addBalanceByExpenseCategoryPOST(data)
            .subscribe(res => {
              if (res.status == 'OK') {
                alert("Balance Added successfully..")
                this.bankAcBlcClear()
                this.getBankAcBalance1()
                this.cd.detectChanges();
                this.spinner.hide();
              } else {
                alert("Error")
                this.cd.detectChanges();
                this.spinner.hide();
              }
            })
        } else {
          alert("Please Enter Amount")
        }
      } else {
        alert("Please Select Account")
      }
    } else {
      alert("Please Select Date")
    }
  }

  updateBankAcBalance() {
    if (this.bankAcDate) {
      if (this.bankId) {
        if (this.bankAcTotalAmount && Number(this.bankAcTotalAmount) >= 0 || this.bankAcTotalAmount == 0 || this.bankAcTotalAmount < 0) {
          this.spinner.show()
          let data = {
            expenseAmount: Number(this.bankAcTotalAmount).toFixed(2),
            expenseDate: moment(this.bankAcDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            fuelExpenseId: this.fuelExpenseId,
          }
          this.post.updateBalanceByExpenseCategoryPOST(data)
            .subscribe(res => {
              if (res.status == 'OK') {
                alert("Balance Updated successfully..")
                this.bankAcBlcClear()
                this.getBankAcBalance1()
                this.spinner.hide()
              } else {
                alert("Error")
                this.spinner.hide()
              }
            })
        } else {
          alert("Please Enter Amount")
        }
      } else {
        alert("Please Select Account")
      }
    } else {
      alert("Please Select Date")
    }
  }

  bankAcBlcClear() {
    this.bankAcTotalAmount = 0;
    this.bankAcDate = '';
    this.bankId = '';
    this.showDefault = true;
    this.showBankAc = false;
    this.bankAcUpdate = false;
    this.modalUpdate.close('close');
    this.cd.detectChanges();
    this.spinner.hide();
  }

  getDetailsByBank(id: any) {
    if (id.target.value == '') {
      this.showOilCoAc = false;
      this.showBankAc = false;
      this.showCashAc = false;
      this.showDefault = true;
      this.bankAcTotalAmount = 0;
      this.bankAcDate = '';
    } else {
      if (id.target.value == "Oil Company") {
        this.showOilCoAc = true;
        this.showBankAc = false;
        this.showCashAc = false;
        this.showDefault = false;
      } else {
        if (id.target.value == "Cash") {
          this.showOilCoAc = false;
          this.showBankAc = false;
          this.showCashAc = true;
          this.showDefault = false;
        } else {
          this.showOilCoAc = false;
          this.showBankAc = true;
          this.showCashAc = false;
          this.showDefault = false;
          let data = {
            fuelDealerId: this.fuelDealerId,
            bankId: id.target.value,
            expenseCategory: "BALANCE BANK/LOAN A/C",
          }
          this.post.getBalanceDetailsByBankPOST(data)
            .subscribe(res => {
              if (res.status == 'OK') {
                if (res.data.length) {
                  this.bankAcUpdate = true;
                  this.fuelExpenseId = res.data[0].fuelExpenseId;
                  this.bankAcTotalAmount = res.data[0].expenseAmount;
                  this.bankAcDate = moment(res.data[0].expenseDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY")
                  this.cd.detectChanges();
                  this.spinner.hide();
                } else {
                  this.bankAcUpdate = false;
                  this.cd.detectChanges();
                  this.spinner.hide();
                }
              } else {
                alert("Error")
                this.cd.detectChanges();
                this.spinner.hide();
              }
            })
        }
      }
    }
  }

  submitCashAcBalance() {
    if (this.cashAcDate) {
      if (this.cashAcTotalAmount && Number(this.cashAcTotalAmount) >= 0 || this.cashAcTotalAmount == 0) {
        this.spinner.show()
        let data = {
          fuelDealerId: this.fuelDealerId,
          expenseCategory: "BALANCE CASH A/C",
          expenseAmount: Number(this.cashAcTotalAmount).toFixed(2),
          expenseDate: moment(this.cashAcDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          bankAccountId: '20',
          entryFrom: 'PORTAL',
        }
        this.post.addBalanceByExpenseCategoryPOST(data)
          .subscribe(res => {
            if (res.status == 'OK') {
              alert("Balance Added successfully..")
              this.cashAcBlcClear()
              this.getCashAcBalance1()
              this.spinner.hide()
            } else {
              alert("Error")
              this.spinner.hide()
            }
          })
      } else {
        alert("Please Enter Amount")
      }
    } else {
      alert("Please Select Date")
    }
  }

  updateCashAcBalance() {
    if (this.cashAcDate) {
      if (this.cashAcTotalAmount && Number(this.cashAcTotalAmount) >= 0 || this.cashAcTotalAmount == 0) {
        this.spinner.show()
        let data = {
          expenseAmount: Number(this.cashAcTotalAmount).toFixed(2),
          expenseDate: moment(this.cashAcDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          fuelExpenseId: this.fuelExpenseId,
        }
        this.post.updateBalanceByExpenseCategoryPOST(data)
          .subscribe(res => {
            if (res.status == 'OK') {
              alert("Balance Updated successfully..")
              this.cashAcBlcClear()
              this.getCashAcBalance1()
              this.spinner.hide()
            } else {
              alert("Error")
              this.spinner.hide()
            }
          })
      } else {
        alert("Please Enter Amount")
      }
    } else {
      alert("Please Select Date")
    }
  }

  cashAcBlcClear() {
    this.bankId = '';
    this.showDefault = true;
    this.showCashAc = false;
    this.modalUpdate.close('close');
  }

  getOpeningDBCRBalanceCASH(startDate: any) {
    this.totalOpeningCashCredit = 0;
    this.totalOpeningCashDebit = 0;
    this.openingCashBlc = 0;
    this.closingCashBlc = 0;

    let data = {
      dealerId: this.fuelDealerId,
      corporateId: this.dealerCorporateId,
      startDate: this.cashAcDate1,
      endDate: moment(startDate).subtract(1, 'day').format('YYYY-MM-DD'),
    }
    this.post.getOpeningDBCRBalanceCASHPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.totalOpeningCashCredit = Number(res.data1[0].totalCredit) + Number(res.data[0].totalCredit);
          this.totalOpeningCashDebit = Number(res.data2[0].totalDebit);
          this.openingCashBlc = Number(this.cashAcOpeningBlc) - Number(this.totalOpeningCashDebit) + Number(this.totalOpeningCashCredit);
          this.closingCashBlc = Number(this.openingCashBlc) - Number(this.totalCashDebit) + Number(this.totalCashCredit);
          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          alert("Error")
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  submitOilCoAcBalance() {
    if (this.oilCoAcDate) {
      if (this.oilCoAcTotalAmount && Number(this.oilCoAcTotalAmount) >= 0 || this.oilCoAcTotalAmount == 0 || this.oilCoAcTotalAmount < 0) {
        this.spinner.show()
        let data = {
          fuelDealerId: this.fuelDealerId,
          expenseCategory: "BALANCE OIL COMPANY A/C",
          expenseAmount: Number(this.oilCoAcTotalAmount).toFixed(2),
          expenseDate: moment(this.oilCoAcDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          bankAccountId: '21',
          entryFrom: 'PORTAL',
        }
        this.post.addBalanceByExpenseCategoryPOST(data)
          .subscribe(res => {
            if (res.status == 'OK') {
              alert("Balance Added successfully..")
              this.OilCoAcBlcClear()
              this.getOilCoAcBalance1()
              this.spinner.hide()
            } else {
              alert("Error")
              this.spinner.hide()
            }
          })
      } else {
        alert("Please Enter Amount")
      }
    } else {
      alert("Please Select Date")
    }
  }

  updateOilCoAcBalance() {
    if (this.oilCoAcDate) {
      if (this.oilCoAcTotalAmount && Number(this.oilCoAcTotalAmount) >= 0 || this.oilCoAcTotalAmount == 0 || this.oilCoAcTotalAmount < 0) {
        this.spinner.show()
        let data = {
          expenseAmount: Number(this.oilCoAcTotalAmount).toFixed(2),
          expenseDate: moment(this.oilCoAcDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          fuelExpenseId: this.fuelExpenseIdOil,
        }
        this.post.updateBalanceByExpenseCategoryPOST(data)
          .subscribe(res => {
            if (res.status == 'OK') {
              alert("Balance Updated successfully..")
              this.OilCoAcBlcClear();
              this.getOilCoAcBalance1();
              this.spinner.hide()
            } else {
              alert("Error")
              this.spinner.hide()
            }
          })
      } else {
        alert("Please Enter Amount")
      }
    } else {
      alert("Please Select Date")
    }
  }

  OilCoAcBlcClear() {
    this.bankId = '';
    this.showDefault = true;
    this.showOilCoAc = false;
    this.modalUpdate.close('close');
  }

  getOpeningDBCRBalanceOILCOM(startDate: any) {
    this.totalOpeningCredit = 0;
    this.totalOpeningDebit = 0;
    this.openingBlc = 0;
    this.closingBlc = 0;

    let data = {
      dealerId: this.fuelDealerId,
      startDate: this.oilCoAcDate1,
      endDate: moment(startDate).subtract(1, 'day').format('YYYY-MM-DD'),
    }
    this.post.getOpeningDBCRBalanceOILCOMPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.totalOpeningCredit = Number(res.data1[0].totalExpAmt - res.data2[0].totalDebit);
          this.totalOpeningDebit = Number(res.data2[0].totalDebit);
          this.openingBlc = Number(this.oilCoAcOpeningBlc) - Number(this.totalOpeningDebit) + Number(this.totalOpeningCredit);
          this.closingBlc = Number(this.openingBlc) - Number(this.totalDebit) + Number(this.totalCredit);
          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          alert("Error")
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  /*name of the excel-file which will be downloaded. */
  fileName = 'AccountingBook.xlsx';

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }

  exportToPDF() {
    var doc = new jsPDF('l', 'pt');
    doc.setFontSize(12);
    doc.text(this.headerName1, 40, 25);
    doc.setFontSize(8);
    doc.text(this.headerName2, 40, 40);
    doc.text(this.headerName3, 40, 55);
    doc.text("DATE : " + moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("DD MMM YYYY") + ' To ' + moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("DD MMM YYYY"), 40, 70);
    doc.setFontSize(12);
    doc.text("Accounting Book", 350, 35);
    autoTable(doc, {
      html: '#excel-table',
      startY: 80,
      theme: 'grid',
      didDrawCell: () => { },
    });
    doc.save("AccountingBook.pdf");
  }

  cancel() {
    this.filterForm.controls["startDate"].setValue("01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear())
    this.filterForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
    this.selected = ("01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear()) + ' - ' + (moment(new Date()).format("DD-MM-YYYY"))
    this.isFilter = false;
    this.getOILCOMPANYDataInFuelExpense(this.fuelDealerId);
  }

  oilCompanyWithBlc(dataRes: any) {
    this.oilCoAccountingSearchBookData = [];
    this.oilCoAccountingBookData = [];
    let closingBlcAmount = 0;

    dataRes.map((res1: any) => {
      const dataJson = {
        accountingDate: '',
        accountingBook: '',
        accountingAmout: 0,
        accountingCreatedBy: '',
        accountingDetails: '',
        accountingFromInput: '',
        accountingOilCoCr: '',
        accountingOilCoDb: '',
        accountingToInput: '',
        accountingTransactionType: '',
        paidFromAccountNumber: '',
        paidFromBankName: '',
        paidToAccountNumber: '',
        paidToBankName: '',
        clsBlcAmount: 0,
        paidFromBankId: '',
        paidToBankId: '',
      };
      if (res1.accountingOilCoDb == 'TRUE') {
        closingBlcAmount = Number(closingBlcAmount) - Number(res1.accountingAmout);
      } else {
        if (res1.accountingOilCoCr == 'TRUE') {
          closingBlcAmount = Number(res1.accountingAmout) + Number(closingBlcAmount);
        }
      }

      dataJson.accountingDate = res1.accountingDate;
      dataJson.accountingBook = res1.accountingBook;
      dataJson.accountingAmout = res1.accountingAmout;
      dataJson.accountingCreatedBy = res1.accountingCreatedBy;
      dataJson.accountingDetails = res1.accountingDetails;
      dataJson.accountingFromInput = res1.accountingFromInput;
      dataJson.accountingOilCoCr = res1.accountingOilCoCr;
      dataJson.accountingOilCoDb = res1.accountingOilCoDb;
      dataJson.accountingToInput = res1.accountingToInput;
      dataJson.accountingTransactionType = res1.accountingTransactionType;
      dataJson.clsBlcAmount = Number(this.oilCoAcTotalAmount1) + Number(closingBlcAmount)
      dataJson.paidFromAccountNumber = res1.paidFromAccountNumber;
      dataJson.paidFromBankName = res1.paidFromBankName;
      dataJson.paidToBankName = res1.paidToBankName;
      dataJson.paidToAccountNumber = res1.paidToAccountNumber;
      dataJson.paidFromBankId = res1.paidFromBankId;
      dataJson.paidToBankId = res1.paidToBankId;

      this.oilCoAccountingBookData.push(dataJson);
    })
    this.oilCoAccountingSearchBookData = this.oilCoAccountingBookData;
  }

  cashDataWithBlc(dataRes: any) {
    let closingCASHBlcAmount = 0;
    dataRes.map((res1: any) => {
      const dataJson = {
        accountingDate: '',
        accountingBook: '',
        accountingAmout: 0,
        accountingCreatedBy: '',
        accountingDetails: '',
        accountingFromInput: '',
        accountingCashCr: '',
        accountingCashDb: '',
        accountingToInput: '',
        accountingTransactionType: '',
        paidFromAccountNumber: '',
        paidFromBankName: '',
        paidToAccountNumber: '',
        paidToBankName: '',
        clsBlcAmount: 0,
        paidFromBankId: '',
        paidToBankId: '',
      };
      if (res1.accountingCashDb == 'TRUE') {
        closingCASHBlcAmount = Number(closingCASHBlcAmount) - Number(res1.accountingAmout);
      } else {
        if (res1.accountingCashCr == 'TRUE') {
          closingCASHBlcAmount = Number(res1.accountingAmout) + Number(closingCASHBlcAmount);
        }
      }
      dataJson.accountingDate = res1.accountingDate;
      dataJson.accountingBook = res1.accountingBook;
      dataJson.accountingAmout = res1.accountingAmout;
      dataJson.accountingCreatedBy = res1.accountingCreatedBy;
      dataJson.accountingDetails = res1.accountingDetails;
      dataJson.accountingFromInput = res1.accountingFromInput;
      dataJson.accountingCashCr = res1.accountingCashCr;
      dataJson.accountingCashDb = res1.accountingCashDb;
      dataJson.accountingToInput = res1.accountingToInput;
      dataJson.accountingTransactionType = res1.accountingTransactionType;
      dataJson.clsBlcAmount = Number(this.cashAcTotalAmount1) + Number(closingCASHBlcAmount)
      dataJson.paidFromAccountNumber = res1.paidFromAccountNumber;
      dataJson.paidFromBankName = res1.paidFromBankName;
      dataJson.paidToBankName = res1.paidToBankName;
      dataJson.paidToAccountNumber = res1.paidToAccountNumber;
      dataJson.paidFromBankId = res1.paidFromBankId;
      dataJson.paidToBankId = res1.paidToBankId;

      this.cashAccountingBookData.push(dataJson);
    })
    this.cashAccountingSearchBookData = this.cashAccountingBookData;
  }

  // getOILCOMPANYDataInFuelExpensePOST
  getOILCOMPANYDataInFuelExpense(fuelDealerId: any) {
    this.oilCompanyDetails.length = 0;
    this.totalOilCOPurchase = 0;
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      let data = {
        dealerId: fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post.getOILCOMPANYDataInFuelExpensePOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.oilCompanyDetails = res.data;
            this.totalOilCOPurchase = res.data3[0].totalAmount
            this.getOilCoAcBalance1();
            this.cd.detectChanges();
            this.spinner.hide();
          } else {
            this.getOilCoAcBalance1();
            this.cd.detectChanges();
            this.spinner.hide();
          }
        })
    }
  }

  getOilCoBook() {
    if (this.filterForm.value.posBankId || this.filterForm.value.bankAccId) {
    } else {
      this.spinner.show()
      this.oilCoAccountingDetails = []
      this.oilCoAccountingSearchBookData = []
      this.oilCoAccountingBookData = []
      let data = {
        accountingFuelDealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }
      this.post.getNEWAccountingBookPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            res.data.map((res1: any) => {
              const dataJson = {
                accountingDate: '',
                accountingBook: '',
                accountingAmout: 0,
                accountingCreatedBy: '',
                accountingDetails: '',
                accountingFromInput: '',
                accountingOilCoCr: '',
                accountingOilCoDb: '',
                accountingToInput: '',
                accountingTransactionType: '',
                paidFromAccountNumber: '',
                paidFromBankName: '',
                paidToAccountNumber: '',
                paidToBankName: '',
                paidFromBankId: '',
                paidToBankId: '',
              };
              dataJson.accountingDate = res1.accountingDate;
              dataJson.accountingBook = res1.accountingBook;
              dataJson.accountingAmout = res1.accountingAmout;
              dataJson.accountingCreatedBy = res1.accountingCreatedBy;
              dataJson.accountingDetails = res1.accountingDetails;
              dataJson.accountingFromInput = res1.accountingFromInput;
              dataJson.accountingOilCoCr = res1.accountingOilCoCr;
              dataJson.accountingOilCoDb = res1.accountingOilCoDb;
              dataJson.accountingToInput = res1.accountingToInput;
              dataJson.accountingTransactionType = res1.accountingTransactionType;
              dataJson.paidFromAccountNumber = res1.paidFromAccountNumber;
              dataJson.paidFromBankName = res1.paidFromBankName;
              dataJson.paidToBankName = res1.paidToBankName;
              dataJson.paidToAccountNumber = res1.paidToAccountNumber;
              dataJson.paidFromBankId = res1.paidFromBankId;
              dataJson.paidToBankId = res1.paidToBankId;
              this.oilCoAccountingDetails.push(dataJson);
            })
            if (this.oilCompanyDetails.length) {
              //purchase
              this.oilCompanyDetails.map((res3: any) => {
                const dataJson2 = {
                  accountingDate: '',
                  accountingBook: '',
                  accountingAmout: 0,
                  accountingCreatedBy: '',
                  accountingDetails: '',
                  accountingFromInput: '',
                  accountingOilCoCr: '',
                  accountingOilCoDb: '',
                  accountingToInput: '',
                  accountingTransactionType: '',
                  paidFromAccountNumber: '',
                  paidFromBankName: '',
                  paidToAccountNumber: '',
                  paidToBankName: '',
                  paidFromBankId: '',
                  paidToBankId: '',
                };
                dataJson2.accountingDate = res3.expenseDate;
                dataJson2.accountingBook = "Oil Company";
                dataJson2.accountingAmout = res3.expenseAmount;
                dataJson2.accountingCreatedBy = res3.createdBy;
                dataJson2.accountingDetails = res3.productName + ' ' + res3.vehicleNumber;
                dataJson2.accountingToInput = this.oilBrandName;
                dataJson2.accountingOilCoCr = "FALSE";
                dataJson2.accountingOilCoDb = "TRUE";
                dataJson2.accountingTransactionType = "Product Purchase";
                dataJson2.paidFromAccountNumber = res3.accountNumber;
                dataJson2.paidFromBankId = res3.accountId;
                dataJson2.paidToBankId = "22";
                this.oilCoAccountingDetails.push(dataJson2);
                this.oilCoAccountingDetails.sort((a: any, b: any) => (a.accountingDate < b.accountingDate ? -1 : 1))
              })
              this.oilCompanyWithBlc(this.oilCoAccountingDetails)
              this.cd.detectChanges();
              this.spinner.hide();
            } else {
              this.oilCompanyWithBlc(this.oilCoAccountingDetails)
              this.cd.detectChanges();
              this.spinner.hide();
            }
            this.spinner.hide()
          } else {
            this.spinner.hide()
          }
        })
    }
  }

  getBankIdWiseBankBook() {
    this.spinner.show()
    this.oilCoAccountingBookData1 = []
    this.oilCoAccountingSearchBookData = [];
    this.bankAccountingBookData = []
    this.bankAccountingSearchBookData = [];
    this.posAccountingBookData = []
    this.posAccountingSearchBookData = [];
    this.oilCoAccountingDetails = [];
    this.bankAccountingBookDetails = [];
    let data = {
      accountingFuelDealerId: this.fuelDealerId,
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      bankAccId: this.filterForm.value.bankAccId,
    }
    this.post.getNEWAccountingBookPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          res.data1.map((res1: any) => {
            const dataJson = {
              accountingDate: '',
              accountingBook: '',
              accountingAmout: 0,
              accountingCreatedBy: '',
              accountingDetails: '',
              accountingFromInput: '',
              accountingBankCr: '',
              accountingBankDb: '',
              accountingToInput: '',
              accountingTransactionType: '',
              paidFromAccountNumber: '',
              paidFromBankName: '',
              paidToAccountNumber: '',
              paidToBankName: '',
              paidFromBankId: '',
              paidToBankId: '',
            };
            if (res1.accountingTransactionType == 'A/c Transfer' && res1.paidToBankId == this.filterForm.value.bankAccId) {
              this.accountingBankCr = 'TRUE';
              this.accountingBankDb = 'FALSE';
            } else {
              if (res1.accountingTransactionType == 'A/c Transfer' && res1.paidFromBankId == this.filterForm.value.bankAccId) {
                this.accountingBankCr = 'FALSE';
                this.accountingBankDb = 'TRUE';
              } else {
                if (res1.accountingTransactionType == 'Loan – Repayment' && res1.paidToBankId == this.filterForm.value.bankAccId) {
                  this.accountingBankCr = 'TRUE';
                  this.accountingBankDb = 'FALSE';
                } else {
                  if (res1.accountingTransactionType == 'Loan – Repayment' && res1.paidFromBankId == this.filterForm.value.bankAccId) {
                    this.accountingBankCr = 'FALSE';
                    this.accountingBankDb = 'TRUE';
                  } else {
                    this.accountingBankCr = res1.accountingBankCr;
                    this.accountingBankDb = res1.accountingBankDb;
                  }
                }
              }
            }
            dataJson.accountingDate = res1.accountingDate;
            dataJson.accountingBook = res1.accountingBook;
            dataJson.accountingAmout = res1.accountingAmout;
            dataJson.accountingCreatedBy = res1.accountingCreatedBy;
            dataJson.accountingDetails = res1.accountingDetails;
            dataJson.accountingFromInput = res1.accountingFromInput;
            dataJson.accountingBankCr = this.accountingBankCr;
            dataJson.accountingBankDb = this.accountingBankDb;
            dataJson.accountingToInput = res1.accountingToInput;
            dataJson.accountingTransactionType = res1.accountingTransactionType;
            dataJson.paidFromAccountNumber = res1.paidFromAccountNumber;
            dataJson.paidFromBankName = res1.paidFromBankName;
            dataJson.paidToBankName = res1.paidToBankName;
            dataJson.paidToAccountNumber = res1.paidToAccountNumber;
            dataJson.paidFromBankId = res1.paidFromBankId;
            dataJson.paidToBankId = res1.paidToBankId;
            this.bankAccountingBookDetails.push(dataJson);
          })
          this.cd.detectChanges();
          this.spinner.hide();
          if (this.bankWisePaymentDetails.length) {
            //payment
            this.bankWisePaymentDetails.map((res2: any) => {
              const dataJson1 = {
                accountingDate: '',
                accountingBook: '',
                accountingAmout: 0,
                accountingCreatedBy: '',
                accountingDetails: '',
                accountingFromInput: '',
                accountingBankCr: '',
                accountingBankDb: '',
                accountingToInput: '',
                accountingTransactionType: '',
                paidFromAccountNumber: '',
                paidFromBankName: '',
                paidToAccountNumber: '',
                paidToBankName: '',
                paidFromBankId: '',
                paidToBankId: '',
              };
              dataJson1.accountingDate = res2.transacDate;
              dataJson1.accountingBook = "Bank";
              dataJson1.accountingAmout = res2.grandTotalAmount;
              dataJson1.accountingCreatedBy = "";
              dataJson1.accountingDetails = res2.paymentMethod + ' ' + res2.chequeNO;
              dataJson1.accountingFromInput = res2.companyName
              dataJson1.accountingBankCr = "TRUE";
              dataJson1.accountingBankDb = "FALSE";
              dataJson1.accountingTransactionType = "Credit Payment";
              dataJson1.paidToAccountNumber = res2.accountNumber;
              dataJson1.paidFromBankId = "22";
              dataJson1.paidToBankId = res2.accountId;
              dataJson1.paidToBankName = res2.bankName;
              this.bankAccountingBookDetails.push(dataJson1);
              this.bankAccountingBookDetails.sort((a: any, b: any) => (a.accountingDate < b.accountingDate ? -1 : 1))
            })
            this.getBankWiseBankBook(this.bankAccountingBookDetails);
            this.cd.detectChanges();
            this.spinner.hide();
          } else {
            this.getBankWiseBankBook(this.bankAccountingBookDetails);
            this.cd.detectChanges();
            this.spinner.hide();
          }
          if (this.bankWisePaymentData.length) {
            this.bankWisePaymentData.map((res3: any) => {
              const dataJson2 = {
                accountingDate: '',
                accountingBook: '',
                accountingAmout: 0,
                accountingCreatedBy: '',
                accountingDetails: '',
                accountingFromInput: '',
                accountingBankCr: '',
                accountingBankDb: '',
                accountingToInput: '',
                accountingTransactionType: '',
                paidFromAccountNumber: '',
                paidFromBankName: '',
                paidToAccountNumber: '',
                paidToBankName: '',
                paidFromBankId: '',
                paidToBankId: '',
              };
              dataJson2.accountingDate = res3.transacDate;
              dataJson2.accountingBook = "Bank";
              dataJson2.accountingAmout = res3.grandTotalAmount;
              dataJson2.accountingCreatedBy = "";
              dataJson2.accountingDetails = res3.paymentMethod + ' ' + res3.chequeNO;
              dataJson2.accountingFromInput = res3.companyName
              dataJson2.accountingBankCr = "TRUE";
              dataJson2.accountingBankDb = "FALSE";
              dataJson2.accountingTransactionType = "Credit Payment";
              dataJson2.paidToAccountNumber = res3.accountNumber;
              dataJson2.paidFromBankId = "22";
              dataJson2.paidToBankId = res3.accountId;
              dataJson2.paidToBankName = res3.bankName;
              this.bankAccountingBookDetails.push(dataJson2);
              this.bankAccountingBookDetails.sort((a: any, b: any) => (a.accountingDate < b.accountingDate ? -1 : 1))
            })
            this.getBankWiseBankBook(this.bankAccountingBookDetails);
            this.cd.detectChanges();
            this.spinner.hide();
          } else {
            this.getBankWiseBankBook(this.bankAccountingBookDetails);
            this.cd.detectChanges();
            this.spinner.hide();
          }
          if (this.bankwisePayment2223Data.length) {
            this.bankwisePayment2223Data.map((res4: any) => {
              const dataJson2 = {
                accountingDate: '',
                accountingBook: '',
                accountingAmout: 0,
                accountingCreatedBy: '',
                accountingDetails: '',
                accountingFromInput: '',
                accountingBankCr: '',
                accountingBankDb: '',
                accountingToInput: '',
                accountingTransactionType: '',
                paidFromAccountNumber: '',
                paidFromBankName: '',
                paidToAccountNumber: '',
                paidToBankName: '',
                paidFromBankId: '',
                paidToBankId: '',
              };
              dataJson2.accountingDate = res4.transacDate;
              dataJson2.accountingBook = "Bank";
              dataJson2.accountingAmout = res4.grandTotalAmount;
              dataJson2.accountingCreatedBy = "";
              dataJson2.accountingDetails = res4.paymentMethod + ' ' + res4.chequeNO;
              dataJson2.accountingFromInput = res4.companyName
              dataJson2.accountingBankCr = "TRUE";
              dataJson2.accountingBankDb = "FALSE";
              dataJson2.accountingTransactionType = "Credit Payment";
              dataJson2.paidToAccountNumber = res4.accountNumber;
              dataJson2.paidFromBankId = "22";
              dataJson2.paidToBankId = res4.accountId;
              dataJson2.paidToBankName = res4.bankName;
              this.bankAccountingBookDetails.push(dataJson2);
              this.bankAccountingBookDetails.sort((a: any, b: any) => (a.accountingDate < b.accountingDate ? -1 : 1))
            })
            this.getBankWiseBankBook(this.bankAccountingBookDetails)
            this.cd.detectChanges();
            this.spinner.hide();
          } else {
            this.getBankWiseBankBook(this.bankAccountingBookDetails)
            this.cd.detectChanges();
            this.spinner.hide();
          }

          if (this.bankwisePayment2324Data.length) {
            this.bankwisePayment2324Data.map((res5: any) => {
              const dataJson2 = {
                accountingDate: '',
                accountingBook: '',
                accountingAmout: 0,
                accountingCreatedBy: '',
                accountingDetails: '',
                accountingFromInput: '',
                accountingBankCr: '',
                accountingBankDb: '',
                accountingToInput: '',
                accountingTransactionType: '',
                paidFromAccountNumber: '',
                paidFromBankName: '',
                paidToAccountNumber: '',
                paidToBankName: '',
                paidFromBankId: '',
                paidToBankId: '',
              };
              dataJson2.accountingDate = res5.transacDate;
              dataJson2.accountingBook = "Bank";
              dataJson2.accountingAmout = res5.grandTotalAmount;
              dataJson2.accountingCreatedBy = "";
              dataJson2.accountingDetails = res5.paymentMethod + ' ' + res5.chequeNO;
              dataJson2.accountingFromInput = res5.companyName
              dataJson2.accountingBankCr = "TRUE";
              dataJson2.accountingBankDb = "FALSE";
              dataJson2.accountingTransactionType = "Credit Payment";
              dataJson2.paidToAccountNumber = res5.accountNumber;
              dataJson2.paidFromBankId = "22";
              dataJson2.paidToBankId = res5.accountId;
              dataJson2.paidToBankName = res5.bankName;
              this.bankAccountingBookDetails.push(dataJson2);
              this.bankAccountingBookDetails.sort((a: any, b: any) => (a.accountingDate < b.accountingDate ? -1 : 1))
            })
            this.getBankWiseBankBook(this.bankAccountingBookDetails)
            this.cd.detectChanges();
            this.spinner.hide();
          } else {
            this.getBankWiseBankBook(this.bankAccountingBookDetails)
            this.cd.detectChanges();
            this.spinner.hide();
          }

          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      })
  }

  getBankWiseBankBook(dataRes: any) {
    this.isBankBlc = true;
    this.bankAccountingSearchBookData = [];
    this.bankAccountingBookData = [];
    let closingBlcAmount = 0;
    dataRes.map((res1: any) => {
      const dataJson = {
        accountingDate: '',
        accountingBook: '',
        accountingAmout: 0,
        accountingCreatedBy: '',
        accountingDetails: '',
        accountingFromInput: '',
        accountingBankCr: '',
        accountingBankDb: '',
        accountingToInput: '',
        accountingTransactionType: '',
        paidFromAccountNumber: '',
        paidFromBankName: '',
        paidToAccountNumber: '',
        paidToBankName: '',
        clsBlcAmount: 0,
        paidFromBankId: '',
        paidToBankId: '',
      };
      if (this.bankAccType == 'LOAN') {
        if (res1.accountingBankDb == 'TRUE') {
          closingBlcAmount = Number(closingBlcAmount) + Number(res1.accountingAmout)
        } else {
          if (res1.accountingBankCr == 'TRUE') {
            closingBlcAmount = Number(closingBlcAmount) - Number(res1.accountingAmout)
          }
        }
      } else {
        if (res1.accountingBankDb == 'TRUE') {
          closingBlcAmount = Number(closingBlcAmount) - Number(res1.accountingAmout)
        } else {
          if (res1.accountingBankCr == 'TRUE') {
            closingBlcAmount = Number(res1.accountingAmout) + Number(closingBlcAmount)
          }
        }
      }
      dataJson.accountingDate = res1.accountingDate;
      dataJson.accountingBook = res1.accountingBook;
      dataJson.accountingAmout = res1.accountingAmout;
      dataJson.accountingCreatedBy = res1.accountingCreatedBy;
      dataJson.accountingDetails = res1.accountingDetails;
      dataJson.accountingFromInput = res1.accountingFromInput;
      dataJson.accountingBankCr = res1.accountingBankCr;
      dataJson.accountingBankDb = res1.accountingBankDb;
      dataJson.accountingToInput = res1.accountingToInput;
      dataJson.accountingTransactionType = res1.accountingTransactionType;
      dataJson.clsBlcAmount = Number(this.bankWiseTotalAmount1) + Number(closingBlcAmount)
      dataJson.paidFromAccountNumber = res1.paidFromAccountNumber;
      dataJson.paidFromBankName = res1.paidFromBankName;
      dataJson.paidToBankName = res1.paidToBankName;
      dataJson.paidToAccountNumber = res1.paidToAccountNumber;
      dataJson.paidFromBankId = res1.paidFromBankId;
      dataJson.paidToBankId = res1.paidToBankId;
      this.bankAccountingBookData.push(dataJson);
    })
    this.bankAccountingSearchBookData = this.bankAccountingBookData;
    this.cd.detectChanges();
    this.spinner.hide();
  }

  isOILBookFilter() {
    this.oilCoAccountingBookDataExcelFilter.length = 0
    this.oilCoAccountingBookData.map((res: any) => {
      if (res.paidFromBankId != '22') {
        this.oilCoPaidFromFilter = 'From' + ' ' + res.accountingFromInput + ' ' + res.paidFromAccountNumber + ' ' + res.paidFromBankName
      } else {
        if (res.paidFromBankId == '22') {
          this.oilCoPaidFromFilter = 'From' + ' ' + res.accountingFromInput
        }
      }
      if (res.paidToBankId != '22') {
        this.oilCoPaidToFilter = 'To' + ' ' + res.accountingToInput + ' ' + res.paidToAccountNumber + ' ' + res.paidToBankName;
      } else {
        if (res.paidToBankId == '22') {
          this.oilCoPaidToFilter = 'To' + ' ' + res.accountingToInput
        }
      }
      if (res.accountingOilCoDb == 'TRUE') {
        this.oilCoDebitFilter = res.accountingAmout
      } else {
        if (res.accountingOilCoDb != 'TRUE') {
          this.oilCoDebitFilter = "0.00"
        }
      }
      if (res.accountingOilCoCr == 'TRUE') {
        this.oilCoCreditFilter = res.accountingAmout
      } else {
        if (res.accountingOilCoCr != 'TRUE') {
          this.oilCoCreditFilter = "0.00"
        }
      }
      var json = {
        Date: moment(res.accountingDate).format("YYYY-MM-DD"),
        TransactionType: res.accountingBook + ' ' + res.accountingTransactionType,
        Details: res.accountingDetails + ' ' + this.oilCoPaidFromFilter + " " + this.oilCoPaidToFilter,
        Debit: this.oilCoDebitFilter,
        Credit: this.oilCoCreditFilter,
        ClosingBalance: res.clsBlcAmount,
      };
      this.oilCoAccountingBookDataExcelFilter.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.oilCoAccountingBookDataExcelFilter,
      "Oil Company Book"
    );
  }


  isBankBookFilter() {
    this.bankAccountingBookDataFilter.length = 0;
    this.bankAccountingBookData.map((res: any) => {
      if (res.paidFromBankId != '22') {
        this.isBankPaidFromFilter = 'From' + ' ' + res.accountingFromInput + ' ' + res.paidFromAccountNumber + ' ' + res.paidFromBankName
      } else {
        if (res.paidFromBankId == '22') {
          this.isBankPaidFromFilter = 'From' + ' ' + res.accountingFromInput
        }
      }
      if (res.paidToBankId != '22') {
        this.isBankPaidToFilter = 'To' + ' ' + res.accountingToInput + ' ' + res.paidToAccountNumber + ' ' + res.paidToBankName;
      } else {
        if (res.paidToBankId == '22') {
          this.isBankPaidToFilter = 'To' + ' ' + res.accountingToInput
        }
      }
      if (res.accountingBankDb == 'TRUE') {
        this.isBankDebitFilter = res.accountingAmout
      } else {
        if (res.accountingBankDb != 'TRUE') {
          if (res.accountingLoanAccDb == 'TRUE') {
            this.isBankDebitFilter = res.accountingAmout
          } else {
            if (res.accountingLoanAccDb != 'TRUE') {
              this.isBankDebitFilter = "0.00"
            }
          }
        }
      }
      if (res.accountingBankCr == 'TRUE') {
        this.isBankCreditFilter = res.accountingAmout
      } else {
        if (res.accountingBankCr != 'TRUE') {
          if (res.accountingLoanAccCr == 'TRUE') {
            this.isBankCreditFilter = res.accountingAmout
          } else {
            this.isBankCreditFilter = "0.00"
          }
        }
      }
      var json = {
        Date: moment(res.accountingDate).format("YYYY-MM-DD"),
        TransactionType: res.accountingBook + ' ' + res.accountingTransactionType,
        Details: res.accountingDetails + ' ' + this.isBankPaidFromFilter + ' ' + this.isBankPaidToFilter,
        Debit: this.isBankDebitFilter,
        Credit: this.isBankCreditFilter,
        ClosingBalance: res.clsBlcAmount,
      };
      this.bankAccountingBookDataFilter.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.bankAccountingBookDataFilter,
      "Bank Book"
    );
  }



  isPOSBookFilter() {
    this.posAccountingBookDataFilter.length = 0;
    this.posAccountingBookData.map((res: any) => {
      if (res.paidFromBankId != '22') {
        this.isPOSPaidFromFilter = 'From' + ' ' + res.accountingFromInput + ' ' + res.paidFromAccountNumber + ' ' + res.paidFromBankName
      } else {
        if (res.paidFromBankId == '22') {
          this.isPOSPaidFromFilter = 'From' + ' ' + res.accountingFromInput
        }
      }
      if (res.paidToBankId != '22') {
        this.isPOSPaidToFromFilter = 'To' + res.accountingToInput + ' ' + res.paidToAccountNumber + ' ' + res.paidToBankName;
      } else {
        if (res.paidToBankId == '22') {
          this.isPOSPaidToFromFilter = 'To' + ' ' + res.accountingToInput
        }
      }
      if (res.accountingPOSDb == 'TRUE') {
        this.isPOSDebitFilter = res.accountingAmout
      } else {
        if (res.accountingBankDb != 'TRUE') {
          this.isPOSDebitFilter = res.accountingAmout
        }
      }
      var json = {
        Date: moment(res.accountingDate).format("YYYY-MM-DD"),
        TransactionType: res.accountingBook + ' ' + res.accountingTransactionType,
        Details: res.accountingDetails + ' ' + this.isPOSPaidFromFilter + ' ' + this.isPOSPaidToFromFilter,
        Debit: this.isPOSDebitFilter,
        Credit: "0.00",
      };
      this.posAccountingBookDataFilter.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.posAccountingBookDataFilter,
      "POS Book"
    );
  }

  isCASHBookFilter() {
    this.cashAccountingBookDataFilter.length = 0;
    this.cashAccountingBookData.map((res: any) => {
      if (res.paidFromBankId != '22') {
        this.isCashPaidFromFilter = 'From' + ' ' + res.accountingFromInput + ' ' + res.paidFromAccountNumber + ' ' + res.paidFromBankName
      } else {
        if (res.paidFromBankId == '22') {
          this.isCashPaidFromFilter = 'From' + ' ' + res.accountingFromInput
        }
      }
      if (res.paidToBankId != '22') {
        this.isCashPaidToFromFilter = 'To' + ' ' + res.accountingToInput + ' ' + res.paidToAccountNumber + ' ' + res.paidToBankName;
      } else {
        if (res.paidToBankId == '22') {
          this.isCashPaidToFromFilter = 'To' + ' ' + res.accountingToInput
        }
      }
      if (res.accountingCashDb == 'TRUE') {
        this.isCashDebitFilter = res.accountingAmout
      } else {
        if (res.accountingCashDb != 'TRUE') {
          this.isCashDebitFilter = 0.00
        }
      }
      if (res.accountingCashCr == 'TRUE') {
        this.isCashCreditFilter = res.accountingAmout
      } else {
        if (res.accountingCashCr != 'TRUE') {
          this.isCashCreditFilter = 0.00
        }
      }
      var json = {
        Date: moment(res.accountingDate).format("YYYY-MM-DD"),
        TransactionType: res.accountingBook + ' ' + res.accountingTransactionType,
        Details: res.accountingDetails + ' ' + this.isCashPaidFromFilter + ' ' + this.isCashPaidToFromFilter,
        Debit: this.isCashDebitFilter,
        Credit: this.isCashCreditFilter,
        ClosingBalance: res.clsBlcAmount,
      };
      this.cashAccountingBookDataFilter.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.cashAccountingBookDataFilter,
      "Cash Book"
    );
  }

  isOILBookNoFilter() {
    this.oilCoAccountingBookDataExcel.length = 0;
    this.oilCoAccountingBookData.map((res: any) => {
      if (res.paidFromBankId != '22') {
        this.oilCoPaidFromWithoutFilter = 'From' + ' ' + res.accountingFromInput + ' ' + res.paidFromAccountNumber + ' ' + res.paidFromBankName
      } else {
        if (res.paidFromBankId == '22') {
          this.oilCoPaidFromWithoutFilter = 'From' + ' ' + res.accountingFromInput
        }
      }
      if (res.paidToBankId != '22') {
        this.oilCoPaidToWithoutFilter = 'To' + ' ' + res.accountingToInput + ' ' + res.paidToAccountNumber + ' ' + res.paidToBankName;
      } else {
        if (res.paidToBankId == '22') {
          this.oilCoPaidToWithoutFilter = 'To' + ' ' + res.accountingToInput
        }
      }
      if (res.accountingOilCoDb == 'TRUE') {
        this.oilCoDebitWithoutFilter = res.accountingAmout
      } else {
        if (res.accountingOilCoDb != 'TRUE') {
          this.oilCoDebitWithoutFilter = "0.00"
        }
      }
      if (res.accountingOilCoCr == 'TRUE') {
        this.oilCoCreditWithoutFilter = res.accountingAmout
      } else {
        if (res.accountingOilCoCr != 'TRUE') {
          this.oilCoCreditWithoutFilter = "0.00"
        }
      }
      var json = {
        Date: moment(res.accountingDate).format("YYYY-MM-DD"),
        TransactionType: res.accountingBook + ' ' + res.accountingTransactionType,
        Details: res.accountingDetails + ' ' + this.oilCoPaidFromWithoutFilter + " " + this.oilCoPaidToWithoutFilter,
        Debit: this.oilCoDebitWithoutFilter,
        Credit: this.oilCoCreditWithoutFilter,
        ClosingBalance: res.clsBlcAmount,
      };
      this.oilCoAccountingBookDataExcel.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.oilCoAccountingBookDataExcel,
      "Oil Company Book"
    );
  }

  isBankBookNoFilter() {
    this.bankAccountingBookDataExcel.length = 0;
    this.bankAccountingBookData.map((res: any) => {
      if (res.paidFromBankId != '22') {
        this.isBankPaidFromWithoutFilter = 'From' + ' ' + res.accountingFromInput + ' ' + res.paidFromAccountNumber + ' ' + res.paidFromBankName
      } else {
        if (res.paidFromBankId == '22') {
          this.isBankPaidFromWithoutFilter = 'From' + ' ' + res.accountingFromInput
        }
      }
      if (res.paidToBankId != '22') {
        this.isBankPaidToWithoutFilter = 'To' + ' ' + res.accountingToInput + ' ' + res.paidToAccountNumber + ' ' + res.paidToBankName;
      } else {
        if (res.paidToBankId == '22') {
          this.isBankPaidToWithoutFilter = 'To' + ' ' + res.accountingToInput
        }
      }
      if (res.accountingBankDb == 'TRUE') {
        this.isBankDebitWithoutFilter = res.accountingAmout
      } else {
        if (res.accountingBankDb != 'TRUE') {
          if (res.accountingLoanAccDb == 'TRUE') {
            this.isBankDebitWithoutFilter = res.accountingAmout
          } else {
            if (res.accountingLoanAccDb != 'TRUE') {
              this.isBankDebitWithoutFilter = "0.00"
            }
          }
        }
      }
      if (res.accountingBankCr == 'TRUE') {
        this.isBankCreditWithoutFilter = res.accountingAmout
      } else {
        if (res.accountingBankCr != 'TRUE') {
          if (res.accountingLoanAccCr == 'TRUE') {
            this.isBankCreditWithoutFilter = res.accountingAmout
          } else {
            this.isBankCreditWithoutFilter = "0.00"
          }
        }
      }
      var json = {
        Date: moment(res.accountingDate).format("YYYY-MM-DD"),
        TransactionType: res.accountingBook + ' ' + res.accountingTransactionType,
        Details: res.accountingDetails + ' ' + this.isBankPaidFromWithoutFilter + ' ' + this.isBankPaidToWithoutFilter,
        Debit: this.isBankDebitWithoutFilter,
        Credit: this.isBankCreditWithoutFilter,
        ClosingBalance: res.clsBlcAmount,
      };
      this.bankAccountingBookDataExcel.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.bankAccountingBookDataExcel,
      "Bank Book"
    );
  }

  isPOSBookNoFilter() {
    this.posAccountingBookDataExcel.length = 0;
    this.posAccountingBookData.map((res: any) => {
      if (res.paidFromBankId != '22') {
        this.isPOSPaidFromWithoutFilter = 'From' + ' ' + res.accountingFromInput + ' ' + res.paidFromAccountNumber + ' ' + res.paidFromBankName
      } else {
        if (res.paidFromBankId == '22') {
          this.isPOSPaidFromWithoutFilter = 'From' + ' ' + res.accountingFromInput
        }
      }
      if (res.paidToBankId != '22') {
        this.isPOSPaidToFromWithoutFilter = 'To' + ' ' + res.accountingToInput + ' ' + res.paidToAccountNumber + ' ' + res.paidToBankName;
      } else {
        if (res.paidToBankId == '22') {
          this.isPOSPaidToFromWithoutFilter = 'To' + ' ' + res.accountingToInput
        }
      }
      if (res.accountingPOSDb == 'TRUE') {
        this.isPOSDebitWithoutFilter = res.accountingAmout
      } else {
        if (res.accountingBankDb != 'TRUE') {
          this.isPOSDebitWithoutFilter = "0.00"
        }
      }
      var json = {
        Date: moment(res.accountingDate).format("YYYY-MM-DD"),
        TransactionType: res.accountingBook + ' ' + res.accountingTransactionType,
        Details: res.accountingDetails + ' ' + this.isPOSPaidFromWithoutFilter + ' ' + this.isPOSPaidToFromWithoutFilter,
        Debit: this.isPOSDebitWithoutFilter,
        Credit: "0.00",
      };
      this.posAccountingBookDataExcel.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.posAccountingBookDataExcel,
      "POS Book"
    );
  }

  isCASHBookNoFilter() {
    this.cashAccountingBookDataExcel.length = 0;
    this.cashAccountingBookData.map((res: any) => {
      if (res.paidFromBankId != '22') {
        this.isCashPaidFromWithoutFilter = 'From' + ' ' + res.accountingFromInput + ' ' + res.paidFromAccountNumber + ' ' + res.paidFromBankName
      } else {
        if (res.paidFromBankId == '22') {
          this.isCashPaidFromWithoutFilter = 'From' + ' ' + res.accountingFromInput
        }
      }
      if (res.paidToBankId != '22') {
        this.isCashPaidToFromWithoutFilter = 'To' + ' ' + res.accountingToInput + ' ' + res.paidToAccountNumber + ' ' + res.paidToBankName;
      } else {
        if (res.paidToBankId == '22') {
          this.isCashPaidToFromWithoutFilter = 'To' + ' ' + res.accountingToInput
        }
      }
      if (res.accountingCashDb == 'TRUE') {
        this.isCashDebitWithoutFilter = res.accountingAmout
      } else {
        if (res.accountingCashDb != 'TRUE') {
          this.isCashDebitWithoutFilter = 0.00
        }
      }
      if (res.accountingCashCr == 'TRUE') {
        this.isCashCreditWithoutFilter = res.accountingAmout
      } else {
        if (res.accountingCashCr != 'TRUE') {
          this.isCashCreditWithoutFilter = 0.00
        }
      }
      var json = {
        Date: moment(res.accountingDate).format("YYYY-MM-DD"),
        TransactionType: res.accountingBook + ' ' + res.accountingTransactionType,
        Details: res.accountingDetails + ' ' + this.isCashPaidFromWithoutFilter + ' ' + this.isCashPaidToFromWithoutFilter,
        Debit: this.isCashDebitWithoutFilter,
        Credit: this.isCashCreditWithoutFilter,
        ClosingBalance: res.clsBlcAmount,
      };
      this.cashAccountingBookDataExcel.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.cashAccountingBookDataExcel,
      "Cash Book"
    );

  }

  searchInTable(){ 
    this.searchBox.valueChanges
    .subscribe((dataList: any) => {
      this.searchTermm = dataList;
      this.search();
    })
  }
  

}
