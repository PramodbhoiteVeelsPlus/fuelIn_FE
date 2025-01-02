import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbActiveModal, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedsService } from '../feeds.services';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';


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
  selector: 'app-feeds-widget2',
  templateUrl: './feeds-widget2.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FeedsWidget2Component implements OnInit {
  dealerLoginVPId: any;
  accessGroupId: any;
  userId: any;
  personId: any;
  userName: string;
  fuelDealerId: any;
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
  countAddArray: any = 1;
  reportData: any = [];

  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    month: new FormControl(""),
    year: new FormControl(""),
    product: new FormControl(""),
  });
  productsList: any = [];
  salesPurData: any = [];
  totalOpeningStock: any;
  totalSales: any;
  totalSalesAmt: any;
  totalPurQty: any;
  totalPurAmt: any;
  productName: any;
  month: string;
  salesPurDataExcel: any;
  oilCompanyName: any;
  petrolPump: string;
  currentYear: any;
  lastYear: number;
  last2Year: number;
  lastFourthYear: number;
  lastFifthYear: number;
  GSTNumber: any;


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
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.fuelDealerId = localStorage.getItem('dealerId');
    
    this.accessGroupId = element.accessGroupId;
    if (this.accessGroupId == '12') {
      var dealerData = JSON.parse(localStorage.getItem('dealerData') || '');
      this.oilCompanyName = dealerData.brandName;
      this.petrolPump = dealerData.companyName;
      this.GSTNumber = dealerData.GSTNumber;
    }
    if (this.accessGroupId == '14') {
      var managerData = JSON.parse(localStorage.getItem('managerData') || '');
      this.oilCompanyName = managerData.brandName;
      this.petrolPump = managerData.companyName;
      this.GSTNumber = managerData.GSTNumber;
    }

    this.currentYear = new Date().getFullYear();
    this.lastYear = Number(this.currentYear) - 1;
    this.last2Year = Number(this.currentYear) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
    this.lastFifthYear = Number(this.currentYear) - 4;
    this.filterForm.controls['year'].setValue(this.currentYear);
    this.filterForm.controls['month'].setValue(moment(new Date()).format("MM"));
    this.getProductsByDealerId(this.fuelDealerId);
    this.cd.detectChanges()
  }

  //For Product DropDown
  getProductsByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getFuelProductIdByDealerIdPOST(data).subscribe((res) => {
      if (res.data.length) {
        this.productsList = res.data;
        this.cd.detectChanges()
      }
    });
  }

  submit() {
    this.spinner.show();
    this.salesPurData = []
    let data = {
      fuelDealerId: this.fuelDealerId,
      month: this.filterForm.value.month,
      year: this.filterForm.value.year,
      productId: this.filterForm.value.product
    }
    this.post.getSalesPurchaseReportByDealerPOST(data)
      .subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.salesPurData = res.data;
          this.totalOpeningStock = res.dataTotalStock[0].totalStockQuantity;
          this.totalSales = res.dataTotalSale[0].totalQuantity;
          this.totalSalesAmt = res.dataTotalSale[0].totalSales;
          this.totalPurQty = res.dataTotalPur[0].quantity;
          this.totalPurAmt = res.dataTotalPur[0].totalPurchase;
          this.productName = res.data[0].product;
          this.month = moment(this.filterForm.value.month).format("MMM") + this.filterForm.value.year;
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.salesPurData = []
          this.totalOpeningStock = '';
          this.totalSales = '';
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  exportexcel() {
    this.salesPurDataExcel.length = 0;
    this.salesPurData.map((res: any) => {
      let json = {
        Product: res.product,
        Invoice_Number: res.invoiceNo,
        Party_Name: this.oilCompanyName,
        GST_No: res.gstNo,
        Date: moment(res.date).format("DD-MM-YYYY"),
        Opening_Stock: res.openingStock,
        Purchase_Qty: res.purchaseQuantity,
        Purchase_Amount: res.purchaseAmt,
        Rate: res.rate,
        Sales_Qty: res.salesQuantity,
        Sales_Amt: res.salesAmt
      };
      this.salesPurDataExcel.push(json);
    });

    //add title row 
    const titleRow: any[] = [this.petrolPump + 'Sales/Purchase Sheet'];
    const headerRow: any[] = ['Product', 'Invoice_Number', 'Party_Name', 'GST_No', 'Date', 'Opening_Stock', 'Purchase_Qty', 'Purchase_Amount', 'Rate', 'Sales_Qty', 'Sales_Amt']

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([titleRow, ...this.salesPurDataExcel]);
    var range = XLSX.utils.decode_range(ws['!ref'] || '');
    range.s.r = 1; // <-- zero-indexed, so setting to 1 will skip row 0
    ws['!ref'] = XLSX.utils.encode_range(range);
    /* Add a row for the totals */
    const totalStock: any[] = ['Total', '', '', '', '', this.totalOpeningStock, '', '', '', this.totalSales];
    XLSX.utils.sheet_add_aoa(ws, [totalStock], { origin: -1 }); // Add totals row at the end
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'salePurchaseReport.xlsx');
  }
  
  fileName = 'salesReport.xlsx'
  exportExcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
}
