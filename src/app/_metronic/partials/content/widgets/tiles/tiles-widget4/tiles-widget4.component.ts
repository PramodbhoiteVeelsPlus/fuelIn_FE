import { ChangeDetectorRef, Component, EventEmitter, Injectable, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbDate, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { TilesService } from '../tiles.services';
import { NgxSpinnerService } from 'ngx-spinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  selector: 'app-tiles-widget4',
  templateUrl: './tiles-widget4.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TilesWidget4Component {

  dealerAccess: boolean = false;
  dealerLoginVPId: any;
  accessGroupId: any;
  userId: any;
  userName: string;
  personId: any;
  loginSQLCorporateId: any;
  petrolPumpName: any;
  fuelDealerId: any;
  accountingData: any = [];
  bankAllAccList: any = [];
  bankSavingAccList: any = [];
  bankLoanAccList: any = [];

  searchTermm: any;
  page: any = 1;
  pageSize: any = 10;

  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    formRadios: new FormControl(""),

  });
  accountingSearchData: any = [];
  accountingDataExcel: any = [];
  headerName1: string;
  headerName2: string;
  headerName3: string;
  searchBox: FormControl = new FormControl();

  constructor(
    public activeModal: NgbActiveModal,
    private post: TilesService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private cd: ChangeDetectorRef,
    private excelService: ExcelService,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.filterForm.controls["startDate"].setValue("01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear())
    this.filterForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))

    this.headerName1 = dealerData.companyName;
    this.headerName2 = dealerData.address1 + ', ' + dealerData.address2 + ', ' + dealerData.city;
    this.headerName3 = dealerData.state + '-' + dealerData.pin + '  ' + "GST: " + dealerData.GSTNumber;

    this.getBankDetailsByDealerId(this.fuelDealerId);
    this.getAccounting(this.fuelDealerId);
  }


  //getAccounting
  getAccounting(fuelDealerId: any) {
    this.accountingData = []
    this.accountingSearchData = [];
    let data = {
      accountingFuelDealerId: fuelDealerId,
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    }
    this.post.getAccountingPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.accountingData = res.data;
          this.accountingSearchData = res.data;
          this.cd.detectChanges();
        } else {
          this.cd.detectChanges();
        }
      })
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
          this.cd.detectChanges();
        } else {
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
            this.filter();
          } else {
          }
        })
    }
    else {
    }
  }

  //filter
  filter() {
    if (this.filterForm.value.formRadios) {
      this.spinner.show()
      this.accountingData = []
      this.accountingSearchData = [];
      let data = {
        accountingFuelDealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        accountingBook: this.filterForm.value.formRadios,
      }
      this.post.getAccountingPOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.accountingData = res.data;
            this.accountingSearchData = res.data;
            this.cd.detectChanges();
            this.spinner.hide()
          } else {
            this.cd.detectChanges();
            this.spinner.hide()
          }
        })
    } else {
      this.spinner.show()
      this.accountingData = []
      this.accountingSearchData = [];
      let data = {
        accountingFuelDealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }
      this.post.getAccountingPOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.accountingData = res.data;
            this.accountingSearchData = res.data;
            this.cd.detectChanges();
            this.spinner.hide()
          } else {
            this.cd.detectChanges();
            this.spinner.hide()
          }
        })
    }
  }

  //filter1
  filter1() {
    this.spinner.show()
    this.filterForm.controls["formRadios"].setValue("")
    this.accountingData = []
    this.accountingSearchData = [];
    let data = {
      accountingFuelDealerId: this.fuelDealerId,
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    }
    this.post.getAccountingPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.accountingData = res.data;
          this.accountingSearchData = res.data;
          this.cd.detectChanges();
          this.spinner.hide()
        } else {
          this.cd.detectChanges();
          this.spinner.hide()
        }
      })

  }

  //filterByBook
  filterByBook(id: any) {
    this.spinner.show()
    this.accountingData = []
    this.accountingSearchData = [];
    let data = {
      accountingFuelDealerId: this.fuelDealerId,
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      accountingBook: id.target.value,
    }
    this.post.getAccountingPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.accountingData = res.data;
          this.accountingSearchData = res.data;
          this.cd.detectChanges();
          this.spinner.hide()
        } else {
          this.cd.detectChanges();
          this.spinner.hide()
        }
      })
  }


  search() {
    let termm = this.searchTermm;
    this.accountingData = this.accountingSearchData.filter(function (res: any) {
      return res.accountingBook.indexOf(termm) >= 0;
    });

    if (this.accountingData.length == 0) {
      termm = this.searchTermm;
      this.accountingData = this.accountingSearchData.filter(function (res: any) {
        return res.accountingTransactionType.indexOf(termm) >= 0;
      });
    } if (this.accountingData.length == 0) {
      termm = this.searchTermm;
      this.accountingData = this.accountingSearchData.filter(function (res: any) {
        return res.accountingDetails.indexOf(termm) >= 0;

      });
    }
    if (this.accountingData.length == 0) {
      termm = this.searchTermm;
      this.accountingData = this.accountingSearchData.filter(function (res: any) {
        return res.paidFromBankName.indexOf(termm) >= 0;
      });
    }
    if (this.accountingData.length == 0) {
      termm = this.searchTermm;
      this.accountingData = this.accountingSearchData.filter(function (res: any) {
        return res.paidFromAccountNumber.indexOf(termm) >= 0;
      });
    }
    if (this.accountingData.length == 0) {
      termm = this.searchTermm;
      this.accountingData = this.accountingSearchData.filter(function (res: any) {
        return res.accountingFromInput.indexOf(termm) >= 0;
      });
    }
    if (this.accountingData.length == 0) {
      termm = this.searchTermm;
      this.accountingData = this.accountingSearchData.filter(function (res: any) {
        return res.paidToBankName.indexOf(termm) >= 0;
      });
    }
    if (this.accountingData.length == 0) {
      termm = this.searchTermm;
      this.accountingData = this.accountingSearchData.filter(function (res: any) {
        return res.paidToAccountNumber.indexOf(termm) >= 0;
      });
    }
    if (this.accountingData.length == 0) {
      termm = this.searchTermm;
      this.accountingData = this.accountingSearchData.filter(function (res: any) {
        return res.accountingToInput.indexOf(termm) >= 0;
      });
    }
    if (this.accountingData.length == 0) {
      termm = this.searchTermm;
      this.accountingData = this.accountingSearchData.filter(function (res: any) {
        return res.accountingCreatedBy.indexOf(termm) >= 0;
      });
    }
    if (this.accountingData.length == 0) {
      termm = this.searchTermm;
      this.accountingData = this.accountingSearchData.filter(function (res: any) {
        return res.accountingAmout.indexOf(termm) >= 0;
      });
    }

  }


  /*name of the excel-file which will be downloaded. */
  fileName = 'AccountingEntries.xlsx';

  exportexcel(): void {
    this.accountingDataExcel = []
    this.accountingData.map((res1: any) => {
      const dataJson = {
        Date: '',
        Book: '',
        Transaction_Type: '',
        Details: '',
        Paid_From: '',
        Paid_To: '',
        Amount: 0,
        Created_By: '',
      };

      dataJson.Date = moment(res1.accountingDate).format("DD-MM-YYYY");
      dataJson.Book = res1.accountingBook;
      dataJson.Transaction_Type = res1.accountingTransactionType;
      dataJson.Details = res1.accountingDetails;
      dataJson.Paid_From = res1.paidFromAccountNumber + ' ' + res1.paidFromBankName + ' ' + res1.accountingFromInput;
      dataJson.Paid_To = res1.paidToAccountNumber + ' ' + res1.paidToBankName + ' ' + res1.accountingToInput;
      dataJson.Amount = Number(res1.accountingAmout);
      dataJson.Created_By = res1.accountingCreatedBy;

      this.accountingDataExcel.push(dataJson);
    })
    this.excelService.exportAsExcelFile(
      this.accountingDataExcel,
      "AccountingEntries"
    );
  }

  exportToPDF() {
    var cols = [["Date", "Book", "Transaction Type", "Details", "Paid From", "Paid To", "Amount", "Created By"]];
    var rows = [];
    for (var key in this.accountingData) {
      var temp = [
        moment(this.accountingData[key].accountingDate).format("DD-MM-YYYY"),
        this.accountingData[key].accountingBook,
        this.accountingData[key].accountingTransactionType,
        this.accountingData[key].accountingDetails,
        this.accountingData[key].paidFromAccountNumber + ' ' + this.accountingData[key].paidFromBankName + ' ' + this.accountingData[key].accountingFromInput,
        this.accountingData[key].paidToAccountNumber + ' ' + this.accountingData[key].paidToBankName + ' ' + this.accountingData[key].accountingToInput,
        Number(this.accountingData[key].accountingAmout).toFixed(2),
        this.accountingData[key].accountingCreatedBy,
      ];
      rows.push(temp);
    }

    var doc = new jsPDF('l', 'pt');

    doc.setFontSize(12);
    doc.text(this.headerName1, 40, 25);
    doc.setFontSize(8);
    doc.text(this.headerName2, 40, 40);
    doc.text(this.headerName3, 40, 55);
    doc.text("DATE : " + moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("DD MMM YYYY") + ' To ' + moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("DD MMM YYYY"), 40, 70);
    doc.setFontSize(12);
    doc.text("Accounting Entries", 350, 35);

    autoTable(doc, {
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 75 },
        2: { cellWidth: 90 },
        3: { cellWidth: 80 },
        4: { cellWidth: 130 },
        5: { cellWidth: 130 },
        6: { cellWidth: 80 },
        7: { cellWidth: 90 },
      },
      margin: { top: 80 },
      head: cols,
      body: rows,
      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("AccountingEntries.pdf");
  }

  cancel() {
    this.filterForm.controls["startDate"].setValue("01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear())
    this.filterForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
    this.filterForm.controls["formRadios"].setValue("")
    this.getAccounting(this.fuelDealerId)
  }

  searchInTable() {
    this.searchBox.valueChanges
      // .distinctUntilChanged()
      .subscribe((dataList: any) => {
        this.searchTermm = dataList;
        this.search();
      })
  }


}
