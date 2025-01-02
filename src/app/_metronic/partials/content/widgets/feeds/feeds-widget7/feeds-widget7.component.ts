import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedsService } from '../feeds.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import * as htmlToImage from 'html-to-image';


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
  selector: 'app-feeds-widget7',
  templateUrl: './feeds-widget7.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FeedsWidget7Component implements OnInit {
  dealerLoginVPId: any;
  accessGroupId: any;
  userId: any;
  personId: any;
  userName: string;
  ownerName: string;
  loginSQLCorporateId: any;
  petrolPump: any;
  fuelDealerId: any;
  incomeData: any = [];
  totalIncome: number = 0;
  expenseData: any = [];
  totalExpense: number = 0;
  reportData: any;
  totalAmt: any = 0;
  dailyProfitId1: any;
  reportId: any;
  createdAt: any;
  city: any;
  reportFile: any;
  cashAmt: any = 0;
  opening: number = 0;
  statementDate: any;

  constructor(private post: FeedsService,
    private spinner: NgxSpinnerService,
    public router: Router,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    this.dailyProfitId1 = this.post.dailyProfitId;
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.accessGroupId = element.accessGroupId;
    if (this.accessGroupId == '12') {
      var dealerData = JSON.parse(localStorage.getItem('dealerData') || '');
      this.petrolPump = dealerData.companyName;
      this.city = dealerData.city;
    }
    if (this.accessGroupId == '14') {
      var managerData = JSON.parse(localStorage.getItem('managerData') || '');
      this.petrolPump = managerData.companyName;
      this.city = managerData.city;
    }

    this.createdAt = new Date();
    this.getDailyReports();
  }

  getDailyReports() {
    this.spinner.show()
    let data = {
      reportId: this.dailyProfitId1
    }
    this.post.getDailyProfitReportPOST(data)
      .subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.incomeData = res.incomeData;
          this.expenseData = res.expenseData;
          this.reportData = res.data;
          this.opening = Number(res.data[0].opening);
          this.statementDate = res.data[0].profitReportDate;
          this.totalAmt = res.data[0].profitReportAmount;
          for (let i = 0; i < this.incomeData.length; i++) {
            this.totalIncome += Number(this.incomeData[i].incomeAmount);
          }
          for (let i = 0; i < this.expenseData.length; i++) {
            this.totalExpense += Number(this.expenseData[i].expenseAmount);
          }
          this.cd.detectChanges();
          this.spinner.hide()
        } else {
          this.router.navigate(['/report/summaryReport']);
          this.spinner.hide()
        }
      })
  }

  onPrint() {
    this.reportFile = window;
    this.reportFile.print();
  }

  //downloadReport()
  downloadReport() {
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
}