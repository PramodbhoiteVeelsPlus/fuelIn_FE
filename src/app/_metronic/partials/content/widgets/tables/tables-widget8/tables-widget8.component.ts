import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

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
  | 'kt_table_widget_8_tab_1'
  | 'kt_table_widget_8_tab_2'
  | 'kt_table_widget_8_tab_3';

@Component({
  selector: 'app-tables-widget8',
  templateUrl: './tables-widget8.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget8Component implements OnInit {
  currentYear: any;
  lastYear: number;
  last2Year: number;
  lastFourthYear: number;
  lastFifthYear: number;
  fastagData: any = [];
  fastagCustData: any = [];

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  activeTab: Tabs = 'kt_table_widget_8_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  FilterForm = new FormGroup({
    month: new FormControl(""),
    year: new FormControl(""),
  })

  ngOnInit(): void {
    this.fastagCustData = JSON.parse(localStorage.getItem('fastagCustData') || '{}');
    this.currentYear = new Date().getFullYear();
    this.lastYear = Number(this.currentYear) - 1;
    this.last2Year = Number(this.currentYear) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
    this.lastFifthYear = Number(this.currentYear) - 4;
    this.FilterForm.controls['year'].setValue(this.currentYear)
    this.FilterForm.controls['month'].setValue(moment(new Date()).format("MM"));
    if(!this.fastagCustData.length){
      this.getFastagMonthWise();
    }else{
      this.getFastagMonthWise1();
    }
    this.cd.detectChanges();
  }

  getFastagMonthWise() {
    this.spinner.show();
    let data = {
      startDate: moment(this.FilterForm.value.month + '-' + this.FilterForm.value.year, ["MM-YYYY"]).format("YYYY-MM-01"),
      endDate: moment(this.FilterForm.value.month + '-' + this.FilterForm.value.year, ["MM-YYYY"]).format("YYYY-MM-31")
    }

    this.post.getCrFastagForAllCustomerByMonthPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.fastagCustData = res.data;
        localStorage.setItem('fastagCustData', JSON.stringify(res.data));
        this.spinner.hide();
        this.cd.detectChanges();
      } else {
        this.fastagCustData = [];
        localStorage.setItem('fastagCustData', JSON.stringify(''));
        this.spinner.hide();
        this.cd.detectChanges();
      }
    })
  }

  getFastagMonthWise1() {
    let data = {
      startDate: moment(this.FilterForm.value.month + '-' + this.FilterForm.value.year, ["MM-YYYY"]).format("YYYY-MM-01"),
      endDate: moment(this.FilterForm.value.month + '-' + this.FilterForm.value.year, ["MM-YYYY"]).format("YYYY-MM-31")
    }

    this.post.getCrFastagForAllCustomerByMonthPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.fastagCustData = res.data;
        localStorage.setItem('fastagCustData', JSON.stringify(res.data));
        this.spinner.hide();
        this.cd.detectChanges();
      } else {
        this.spinner.hide();
        localStorage.setItem('fastagCustData', JSON.stringify(''));
        this.cd.detectChanges();
      }
    })
  }

  exportToPDF() {
    var doc = new jsPDF('l', 'pt');

    autoTable(doc, {
      html: '#excel-table',
      startY: 80,

      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("FastagDetails.pdf");
  }

  /*name of the excel-file which will be downloaded. */
  fileName = 'FastagDetails.xlsx';

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
}
