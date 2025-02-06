import { Component, OnInit, Input, Injectable, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TransTablesService } from '../trans-tables.service';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
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
  selector: 'app-trans-tables-widget12',
  templateUrl: './trans-tables-widget12.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TransTablesWidget12Component implements OnInit {

  constructor(private cd: ChangeDetectorRef,
    private post: TransTablesService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';

  }


  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.cd.detectChanges()
  }

  users = [
    { id: 1, name: 'Tejaswini', code: '120452', date: '01 Feb, 2025', creditSales: '5000', amt: '1500', payment: '2000', tranId: '1532300544500'},
    { id: 2, name: 'Tejaswini', code: '120452', date: '02 Feb, 2025', creditSales: '4000', amt: '500', payment: '2500', tranId: '158891246622'},
    { id: 3, name: 'Tejaswini', code: '120452', date: '04 Feb, 2025', creditSales: '3000', amt: '1000', payment: '500', tranId: '154896232120'},
    { id: 4, name: 'Tejaswini', code: '120452', date: '05 Feb, 2025', creditSales: '3500', amt: '1500', payment: '2500', tranId: '10145236412'},
  ];

  download(){
    const element = document.getElementById('sanjay')
    if (element) {
      htmlToImage.toJpeg(element, { backgroundColor: 'white' })
        .then(function (dataUrl: string) {
          var link = document.createElement('a');
          link.download = 'report.png';
          link.href = dataUrl;
          link.click();
        });
    }
  }

  
  exportToPDF() {
    var doc = new jsPDF('l', 'pt');
   
    doc.setFontSize(12);    
    doc.text("UBI Credit",350, 35 );   
  
     autoTable(doc, {
      html: '#excel-table', 
      startY: 70,  
      theme: 'grid',
      didDrawCell: (data) => { },
  });
    doc.save("Ubi_Credit.pdf");
  }


/*name of the excel-file which will be downloaded. */ 
fileName = 'Ubi_Credit.xlsx'; 
exportexcel(): void 
{
   /* table id is passed over here */   
   let element = document.getElementById('excel-table'); 
   const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

   /* generate workbook and add the worksheet */
   const wb: XLSX.WorkBook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

   /* save to file */
   XLSX.writeFile(wb, this.fileName);
  
}

}

