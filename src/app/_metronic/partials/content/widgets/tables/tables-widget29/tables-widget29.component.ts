import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

type Tabs =
  | 'kt_table_widget_29_tab_1'
  | 'kt_table_widget_29_tab_2'
  | 'kt_table_widget_29_tab_3';

@Component({
  selector: 'app-tables-widget29',
  templateUrl: './tables-widget29.component.html',
  styleUrl: './tables-widget29.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget29Component {
  veelsPlusPersonId: any;
  allDealerList: any = [];

  filterForm = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    selectedDealer: new FormControl(''),
  });

  fuelDealerId: any;
  getFuelPriceData: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  headerName1: any;
  isDealer: boolean = false;
  headerName2: string;
  getFuelPriceDataExcel: any = [];

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private excelService: ExcelService,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  activeTab: Tabs = 'kt_table_widget_29_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.veelsPlusPersonId = element.veelsPlusId;
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

  pageChangeEvent(event: number) {
    this.p = event;
    this.getFuelPriceByDealer();
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
          this.isDealer = true
          this.cd.detectChanges();
        } else {
          this.fuelDealerId = '';
          this.headerName1 = '';
          this.isDealer = false
          this.cd.detectChanges();
        }
      });
  }


  getFuelPriceByDealer() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.spinner.show()
      let data = {
        dealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      }

      this.post.getPriceByDealerIdPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.getFuelPriceData = res.data;
            this.spinner.hide()
            this.cd.detectChanges();
          }
          else {
            alert("Data Not Found..!")
            this.getFuelPriceData = []
            this.spinner.hide()
            this.cd.detectChanges();
          }

        })
    } else {
      this.spinner.show()
      let data = {
        dealerId: this.fuelDealerId,
      }
      this.post.getPriceByDealerIdPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.getFuelPriceData = res.data;
            this.spinner.hide()
            this.cd.detectChanges();
          }
          else {
            alert("Data Not Found..!")
            this.getFuelPriceData = []
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    }
  }

  deleteFuelPrice() {
    this.spinner.show()
    let data = {
      getFuelPriceData: this.getFuelPriceData
    }

    this.post.deleteFuelPricePOST(data).subscribe(res => {
      alert("Data Will be Deleted after Few minutes..!");
      this.getFuelPriceByDealer()
      this.spinner.hide()
      this.cd.detectChanges();
    })
  }

  exportToPDF() {
    if (this.isDealer == true) {
      var cols = [["Dealer_Name", "Date_Time", "Rate_(Rs/Ltr)", "Product", "Selling Price"]];
      var rows = [];
      for (var key in this.getFuelPriceData) {

        var temp = [
          this.headerName1,
          this.getFuelPriceData[key].productPriceDate + ' ' + this.getFuelPriceData[key].productPriceTime,
          'Rate' + this.getFuelPriceData[key].rateCount,
          this.getFuelPriceData[key].productName,
          Number(this.getFuelPriceData[key].productSellingPrice).toFixed(2)
        ];
        rows.push(temp);
      }

      var doc = new jsPDF('l', 'pt');

      this.headerName2 = moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("DD-MMM-YYYY") + ' to ' + moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("DD-MMM-YYYY")
      doc.setFontSize(12);
      doc.text(this.headerName2, 40, 25);
      doc.setFontSize(10);
      doc.text('FuelPrice', 350, 35);


      autoTable(doc, {
        columnStyles: {
          0: { cellWidth: 180 },
          1: { cellWidth: 150 },
          2: { cellWidth: 150 },
          3: { cellWidth: 150 },
          4: { cellWidth: 150 },

        },

        margin: { top: 50 },
        head: cols,
        body: rows,
        theme: 'grid',
        didDrawCell: (data) => { },
      });
      // doc.output('dataurlnewwindow')
      doc.save("FuelPrice.pdf");
    } else {
      var cols = [["Dealer_Name", "Date_Time", "Rate_(Rs/Ltr)", "Product", "Selling Price"]];
      var rows = [];
      for (var key in this.getFuelPriceData) {

        var temp = [
          this.getFuelPriceData[key].companyName,
          this.getFuelPriceData[key].productPriceDate + ' ' + this.getFuelPriceData[key].productPriceTime,
          'Rate' + this.getFuelPriceData[key].rateCount,
          this.getFuelPriceData[key].productName,
          Number(this.getFuelPriceData[key].productSellingPrice).toFixed(2)
        ];
        rows.push(temp);
      }

      var doc = new jsPDF('l', 'pt');

      this.headerName2 = moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("DD-MMM-YYYY") + ' to ' + moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("DD-MMM-YYYY")
      doc.setFontSize(12);
      doc.text(this.headerName2, 40, 25);
      doc.setFontSize(10);
      doc.text('FuelPrice', 350, 35);


      autoTable(doc, {
        columnStyles: {
          0: { cellWidth: 180 },
          1: { cellWidth: 150 },
          2: { cellWidth: 150 },
          3: { cellWidth: 150 },
          4: { cellWidth: 150 },

        },

        margin: { top: 50 },
        head: cols,
        body: rows,
        theme: 'grid',
        didDrawCell: (data) => { },
      });
      // doc.output('dataurlnewwindow')
      doc.save("FuelPrice.pdf");

    }
  }

  exportexcel(): void {
    if (this.isDealer == true) {
      this.getFuelPriceDataExcel.length = 0

      this.getFuelPriceData.map((res: { productPriceDate: string; productPriceTime: string; rateCount: string; productName: any; productSellingPrice: any; }) => {

        let json = {
          Dealer_Name: this.headerName1,
          Date_Time: res.productPriceDate + ' ' + res.productPriceTime,
          Rate_RsLtrs: 'Rate' + res.rateCount,
          Product: res.productName,
          Selling_Price: Number(res.productSellingPrice).toFixed(2)
        };

        this.getFuelPriceDataExcel.push(json);
      });

      this.excelService.exportAsExcelFile(
        this.getFuelPriceDataExcel,
        "FuelPrice"
      );
    } else {
      this.getFuelPriceDataExcel.length = 0

      this.getFuelPriceData.map((res: { companyName: any; productPriceDate: string; productPriceTime: string; rateCount: string; productName: any; productSellingPrice: any; }) => {

        let json = {
          Dealer_Name: res.companyName,
          Date_Time: res.productPriceDate + ' ' + res.productPriceTime,
          Rate_RsLtrs: 'Rate' + res.rateCount,
          Product: res.productName,
          Selling_Price: Number(res.productSellingPrice).toFixed(2)
        };

        this.getFuelPriceDataExcel.push(json);
      });

      this.excelService.exportAsExcelFile(
        this.getFuelPriceDataExcel,
        "FuelPrice"
      );
    }
  }
}
