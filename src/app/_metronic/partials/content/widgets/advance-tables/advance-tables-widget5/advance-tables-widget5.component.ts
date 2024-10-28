import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { Adv_TablesService } from '../adv_tables.services';
import * as XLSX  from 'xlsx';

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
  selector: 'app-advance-tables-widget5',
  templateUrl: './advance-tables-widget5.component.html',
  styleUrl: './advance-tables-widget5.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class AdvanceTablesWidget5Component {
  fastagVichleDataKit: any = [];
  fastagDataKitDetails: any = [];
  fastagDataKitDetails1: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  searchData: any;
  fastagVichleDataKitSearch: any = [];
  arrayBuffer: any;

  constructor(private excelService: ExcelService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private post: Adv_TablesService,
    private cd: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '');
    this.getKitNumberAll();
    this.cd.detectChanges();
  }


  pageChangeEvent(event: number) {
    this.p = event;
    this.getKitNumberAll();
  }

  getKitNumberAll() {
    let data = {

    }
    this.post.getAllKitNoPOST(data)
      .subscribe(res => {

        if (res) {
          this.fastagVichleDataKit = res.data;
          this.fastagVichleDataKitSearch = res.data;
        } else {
        }
      });
  }

  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query     
    this.fastagVichleDataKit = this.fastagVichleDataKitSearch.filter((item: { parentId: any; }) =>
      item.parentId.toLowerCase().includes(query)
    );
    if (!this.fastagVichleDataKit.length) {
      this.fastagVichleDataKit = this.fastagVichleDataKitSearch.filter((item: { serialNumber: any; }) =>
        item.serialNumber.toLowerCase().includes(query)
      );
    }
    if (!this.fastagVichleDataKit.length) {
      this.fastagVichleDataKit = this.fastagVichleDataKitSearch.filter((item: { kitNo: any; }) =>
        item.kitNo.toLowerCase().includes(query)
      );
    }
    if (!this.fastagVichleDataKit.length) {
      this.fastagVichleDataKit = this.fastagVichleDataKitSearch.filter((item: { entityId: any; }) =>
        item.entityId.toLowerCase().includes(query)
      );
    }
    if (!this.fastagVichleDataKit.length) {
      this.fastagVichleDataKit = this.fastagVichleDataKitSearch.filter((item: { tagclass: any; }) =>
        item.tagclass.toLowerCase().includes(query)
      );
    }
    if (!this.fastagVichleDataKit.length) {
      this.fastagVichleDataKit = this.fastagVichleDataKitSearch.filter((item: { status: any; }) =>
        item.status.toLowerCase().includes(query)
      );
    }
  }


  onExcelKitpload(event: Event): void {
    this.spinner.show();
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
    const FILE = input.files[0];
    let fileReader = new FileReader();
    fileReader.readAsArrayBuffer(FILE);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      // this.addkitBarCodeMapByExcel(arraylist)
    }
  } else {
    console.log('No file selected.');
  }

  }
}
