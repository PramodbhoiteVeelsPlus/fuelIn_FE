import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from 'src/app/_metronic/partials/content/widgets/stats/stats.services';
import { ExcelService } from '../../excel.service';
import { Adv_TablesService } from 'src/app/_metronic/partials/content/widgets/advance-tables/adv_tables.services';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  selector: 'app-delete-dsr',
  templateUrl: './delete-dsr.component.html',
  styleUrl: './delete-dsr.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class DeleteDsrComponent {
  localStoragecorporateId: any;
  headerName2: string;
  month: string;
  year: any;
  product: any;
  DsrDetails: any = [];
  nzData: any = [];
  nzDetails: any = [];
  headerName1: any;
  tkDSRDetails: any = [];
  fuelDealerId: string;
  tkDSRData: any = [];
  nxtMonthTankStockDetails: any = [];
  tkDSRDetail: any = [];
  dsrBookDetails: any = [];
  dsrBookData: any = [];

  filterForm = new FormGroup({
    dealer: new FormControl(''),
    month: new FormControl('', Validators.required),
    year: new FormControl('', Validators.required),
    product: new FormControl('', Validators.required),
  });
  allDealerList: any = [];
  productsList: any = [];
  currentYear: number;
  lastYear: number;
  last2Year: number;
  lastFourthYear: number;
  lastFifthYear: number;
  
  constructor(
    private post: StatsService,
    private post1: Adv_TablesService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const currentDate = new Date();
    const year = moment(new Date()).subtract(1, 'year').format("YYYY");
    config.minDate = { year: 2020, month: 4, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  
  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.localStoragecorporateId = element.veelsPlusCorporateID
    this.currentYear = new Date().getFullYear();
    this.lastYear = Number(this.currentYear) - 1;
    this.last2Year = Number(this.currentYear) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
    this.lastFifthYear = Number(this.currentYear) - 4;
    this.getAllDealerList()
    this.cd.detectChanges();
  }
  
  //getAllDealerList
  getAllDealerList() {
    this.spinner.show()
    let data = {

    }

    this.post.getAllDealersListPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.allDealerList = res.data
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  getDealerId(id: any) {
    let data = {
      name: id.target.value,
    }
    this.post.getDealerIDCorpIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.headerName1 = id.target.value;
          this.getProductsByDealerId(this.fuelDealerId)
          this.cd.detectChanges();
        } else {
          this.fuelDealerId = '';
          this.cd.detectChanges();
        }
      });
  }
  
  selectYear(id: any) {
    this.filterForm.value.year = id.target.value
    this.getDSRMeterSales(this.fuelDealerId)
  }
  
  getDSRByProduct(id: any) {
    if (id.target.value) {
      this.getDSRMeterSales(this.fuelDealerId);
    }
  }
  
  getProductsByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getFuelProductIdByDealerIdPOST(data).subscribe((res) => {
      if (res.data.length) {
        this.productsList = res.data;
      }
    });
  }

  getDSRMeterSales(fuelDealerId: any) {
    this.DsrDetails = []
    this.spinner.show()
    let data = {
      dealerId: fuelDealerId,
      month: 'Oct',
      year: this.filterForm.value.year,
      fuelProductId: this.filterForm.value.product
    }

    this.post1.getDsrMeterSalesPOST(data)
      .subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          // this.showViewTableMETER = true
          this.DsrDetails = res.data;
          this.nzData = res.data[0].nzDSRData
          this.getTankDSRDetails(this.fuelDealerId);
          // Loop through each dsrDetails and extract nzDSRData
          this.DsrDetails.forEach((detail: { nzDSRData: any; }) => {
            this.nzDetails = this.nzDetails.concat(detail.nzDSRData);
          });
          this.spinner.hide();
        } else {
          alert("Data Not Found")
          this.getTankDSRDetails(this.fuelDealerId);
          this.spinner.hide();
        }
      })
  }
  
  //getTankDSRDetails
  getTankDSRDetails(fuelDealerId: any) {
    this.tkDSRDetails = []
    this.spinner.show();
    let data = {
      dealerId: fuelDealerId,
      month: 'Oct',
      year: this.filterForm.value.year,
      fuelProductId: this.filterForm.value.product
    }

    this.post1.getTankDSRDetailPOST(data)
      .subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.tkDSRDetails = res.data;
          this.tkDSRData = res.data[0].tkDSRData
          this.nxtMonthTankStockDetails = res.data1
          // Loop through each dsrDetails and extract nzDSRData
          this.tkDSRDetails.forEach((detail: { tkDSRData: any; }) => {
            this.tkDSRDetail = this.tkDSRDetail.concat(detail.tkDSRData);
          });
          this.getCombine()
          this.spinner.hide();
        } else {
          alert("Data Not Found")
          this.tkDSRDetails = []
          this.getCombine()
          this.spinner.hide();
        }
      })
  }

  //getCombine()
  getCombine() {
    // console.log("P 9")

    this.dsrBookDetails.length = 0
    this.dsrBookData.length = 0
    let j = 1;
    this.DsrDetails.map((res: { dsrDetailsEntryDate: string; rateId: any; dsrDetailsId: string; meterSalesQuantity: any; totalMeterSales: any; pumpTesting: any; rate: any; }) => {
      const dataJson = {
        dsrDetailsId: '',
        date: '',
        openingStock: 0,
        productPurchase: 0,
        totalStock: 0,
        meterSales: 0,
        meterSalesRs: 0,
        totalMeterSales: 0,
        pumpTesting: 0,
        rate: 0,
      };

      this.tkDSRDetails.map((res1: { tankDSRDetailsDate: string; rateId: any; totalStockQuantity: any; productPurchase: any; stockQuantity: any; }) => {
        if (res.dsrDetailsEntryDate == res1.tankDSRDetailsDate && res.rateId == res1.rateId) {
          dataJson.dsrDetailsId = res.dsrDetailsId;
          dataJson.date = res.dsrDetailsEntryDate;
          dataJson.openingStock = Number(res1.totalStockQuantity);
          dataJson.productPurchase = Number(res1.productPurchase);
          if (this.tkDSRDetails.length > 1 && this.tkDSRDetails.length > j) {
            dataJson.totalStock = Number(res1.stockQuantity);
          } else {
            if (this.nxtMonthTankStockDetails.length) {
              dataJson.totalStock = Number(res1.stockQuantity) + this.tkDSRDetails[j - 1].productPurchase

            }

          }


          dataJson.meterSales = Number(res.meterSalesQuantity)
          dataJson.totalMeterSales = Number(res.totalMeterSales)
          dataJson.pumpTesting = Number(res.pumpTesting)
          dataJson.rate = Number(res.rate)

          j = j + 1
          this.dsrBookData.push(dataJson);
          console.log(this.dsrBookData)
        }
      })
    })
    // this.getFinalCombination()

  }
  
  exportToPDF() {

    var doc = new jsPDF('l', 'pt');

    this.headerName2  = moment(this.month, ["MMM"]).format("MMM") + ' ' + this.year
    doc.setFontSize(12);
    doc.text(this.headerName1, 40, 25);
    doc.setFontSize(12);
    doc.text(this.headerName2, 40, 40);
    doc.setFontSize(12);
    doc.text("MeterSales", 350, 35);

    autoTable(doc, {
      html: '#excel-table',
      startY: 80,

      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("MeterSales.pdf");
  }

  /*name of the excel-file which will be downloaded. */
  fileName = 'MeterSales.xlsx';

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

  deleteDsrDetails() {
    this.spinner.show()
    let data = {
      DsrDetails: this.DsrDetails, 
      nzData: this.nzDetails, 
      tkDSRDetails: this.tkDSRDetail, 
      tkDSRData: this.tkDSRDetail
    }

    this.post1.deleteDsrDetailPOST(data).subscribe(res => {
      alert("Data Will be Deleted after Few minutes..!");
      // this.getDSRMeterSales(this.fuelDealerId)
      this.spinner.hide()
    })
  }

  exportToPDF1() {

    var doc = new jsPDF('l', 'pt');

    this.headerName2  = moment(this.filterForm.value.month, ["MMM"]).format("MMM") + ' ' + this.filterForm.value.year
    doc.setFontSize(12);
    doc.text(this.headerName1, 40, 25);
    doc.setFontSize(12);
    doc.text(this.headerName2, 40, 40);
    doc.setFontSize(12);
    doc.text("Stock", 350, 35);

    autoTable(doc, {
      html: '#excel-table',
      startY: 80,

      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("Stock.pdf");
  }

  /*name of the excel-file which will be downloaded. */
  fileName1 = 'Stock.xlsx';

  exportexcel1(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName1);

  }
  
  exportToPDF2() {

    var doc = new jsPDF('l', 'pt');

    this.headerName2  = moment(this.filterForm.value.month, ["MMM"]).format("MMM") + ' ' + this.filterForm.value.year
    doc.setFontSize(12);
    doc.text(this.headerName1, 40, 25);
    doc.setFontSize(12);
    doc.text(this.headerName2, 40, 40);
    doc.setFontSize(12);
    doc.text("DSR", 350, 35);

    autoTable(doc, {
      html: '#excel-table',
      startY: 80,

      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("DSR.pdf");
  }

  /*name of the excel-file which will be downloaded. */
  fileName2 = 'DSR.xlsx';

  exportexcel2(): void {
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
