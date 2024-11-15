import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
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
  | 'kt_table_widget_7_tab_1'
  | 'kt_table_widget_7_tab_2'
  | 'kt_table_widget_7_tab_3';

@Component({
  selector: 'app-tables-widget7',
  templateUrl: './tables-widget7.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget7Component implements OnInit {
  allentityList: any = [];
  entityId: any;
  fastagData: any = [];
  currentYear: number;
  customerId: any;

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

  activeTab: Tabs = 'kt_table_widget_7_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    this.allentityList = JSON.parse(localStorage.getItem('allentityList') || '{}');
    this.fastagData = JSON.parse(localStorage.getItem('fastagData') || '{}');
    this.currentYear = new Date().getFullYear();
    if(!this.allentityList.length){
      this.getAllEntity()
    }else{
      this.getAllEntity1();
    }
    if(!this.fastagData.length){
      this.getFastag();
    }else{
      this.getFastag1();
    }
    this.cd.detectChanges();
  }

  getAllEntity() {
    let data = {
    }
    this.post.getAllEntityIdPOST(data)
      .subscribe(res => {
        this.allentityList = res.data;
        localStorage.setItem('allentityList', JSON.stringify(res.data));
        this.cd.detectChanges();
      })
  }
  getAllEntity1() {
    let data = {
    }
    this.post.getAllEntityIdPOST(data)
      .subscribe(res => {
        this.allentityList = res.data;
        localStorage.setItem('allentityList', JSON.stringify(res.data));
        this.cd.detectChanges();
      })
  }
  
  

  getcustomerIdByEntity(id: any) {
    this.entityId = id.target.value
    this.customerIdByEntity(this.entityId)
    this.cd.detectChanges();
  }

  customerIdByEntity(entityId: any) {
    let data = {
      entityId: entityId
    }
    this.post.getcustmerIdByEntityIdPOST(data)
      .subscribe(res => {
        this.customerId = res.data[0].corporateId
        this.getFastag()
        this.cd.detectChanges();
      })
  }

  getFastag() {
    if (this.customerId && this.entityId) {
      this.spinner.show()
      let data = {
        year: this.currentYear,
        corporateId: this.customerId,
        entityId: this.entityId
      };
      this.post.getFastagByYearPOST(data)
        .subscribe((res) => {
          if (res.status == 'OK') {
            this.fastagData = res.data;
            console.log("this.fastagData", this.fastagData)
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else {
      this.spinner.show()
      let data = {
        year: this.currentYear
      };
      this.post.getFastagByYearPOST(data)
        .subscribe((res) => {
          if (res.status == 'OK') {
            this.fastagData = res.data;
            localStorage.setItem('fastagData', JSON.stringify(res.data));
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.spinner.hide()
            localStorage.setItem('fastagData', JSON.stringify([]));
            this.cd.detectChanges();
          }
        })
    }
  }
  getFastag1() {
      let data = {
        year: this.currentYear
      };
      this.post.getFastagByYearPOST(data)
        .subscribe((res) => {
          if (res.status == 'OK') {
            this.fastagData = res.data;
            localStorage.setItem('fastagData', JSON.stringify(res.data));
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.spinner.hide()
            localStorage.setItem('fastagData', JSON.stringify([]));
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
