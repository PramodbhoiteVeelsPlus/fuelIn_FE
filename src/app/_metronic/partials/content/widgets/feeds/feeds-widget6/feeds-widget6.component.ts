import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedsService } from '../feeds.services';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';


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
  selector: 'app-feeds-widget6',
  templateUrl: './feeds-widget6.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FeedsWidget6Component implements OnInit {
  dailyProfitId: any;
  userName: string;
  fuelDealerId: any;
  incomeData: any = [];
  expenseData: any = [];
  reportData: any = [];
  totalAmt: any = 0;
  totalIncome: number = 0;
  totalExpense: number = 0;
  reportDate: any;
  profitReportId: any;
  opening: number = 0;
  totalCredit: number = 0;
  productsList: any = [];
  reportDate1: string;

  constructor(private post: FeedsService,
    private spinner: NgxSpinnerService,
    public router: Router,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dailyProfitId = this.post.dailyProfitId 
    this.userName = element.firstName + ' ' + element.lastName;    
    this.getProductsByDealerId(this.fuelDealerId);
    this.getDailyReports(this.dailyProfitId);
  }


  //For Product DropDown
  getProductsByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getFuelProductIdByDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.productsList = res.data;
          this.cd.detectChanges();
        } else {
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  getDailyReports(dailyProfitId: any) {
    this.spinner.show()
    let data = {
      reportId: dailyProfitId
    }
    this.post.getDailyProfitReportPOST(data)
      .subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.incomeData = res.incomeData;
          this.expenseData = res.expenseData;
          this.reportDate = moment(res.data[0].profitReportDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY");
          this.reportDate1 = moment(res.data[0].profitReportDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY");
          this.reportData = res.data;
          this.getCreditSales();
          for (let i = 0; i < this.incomeData.length; i++) {
            this.totalIncome += Number(this.incomeData[i].incomeAmount);
          }

          for (let i = 0; i < this.expenseData.length; i++) {
            this.totalExpense += Number(this.expenseData[i].expenseAmount);
          }
          this.spinner.hide()
        } else {
          this.router.navigate(['/dailyReport']);
          this.spinner.hide()
        }
      })
  }

  //totalIncome
  calculateTotalIncome() {
    this.totalIncome = 0;
    for (let i = 0; i < this.incomeData.length; i++) {
      this.totalIncome += Number(this.incomeData[i].incomeAmount);
    }
    this.cd.detectChanges();
  }
  //totalExpense
  calculateTotalExpense() {
    this.totalExpense = 0;
    for (let i = 0; i < this.expenseData.length; i++) {
      this.totalExpense += Number(this.expenseData[i].expenseAmount);
    }
    this.cd.detectChanges();
  }

  onDateSelection() {
    this.spinner.show()
    let data = {
      profitReportDealerId: this.fuelDealerId,
      startDate: moment(this.reportDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
    }

    this.post.checkReportByDatePOST(data)
      .subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          alert("You already created report for selected date..!")
          this.reportDate = this.reportDate1;
          this.getCreditSales();
          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  //getCreditSales
  getCreditSales() {
    if (this.fuelDealerId && this.reportDate) {
      this.spinner.show()
      let data = {
        profitReportDealerId: this.fuelDealerId,
        dealerId: this.fuelDealerId,
        date: moment(this.reportDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      }
      this.post.getCreditSalesPOST(data).subscribe(res => {
        if (res.status == "OK" && (res.data[0].totalCredit > 0)) {
          this.totalCredit = Number(res.data[0].totalCredit)
          const dataJSONCrSales = {
            expenseType: "CREDIT SALES",
            expenseAmount: Number(res.data[0].totalCredit)
          }
          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          const dataJSONCrSales = {
            expenseType: "CREDIT SALES",
            expenseAmount: 0
          }
          this.cd.detectChanges();
          this.spinner.hide();
        }
        if (res.status == "OK") {
          if (res.data2.length) {
            if (res.data1.length) {
              if (moment(this.reportDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD") >= moment(res.data1[0].profitReportDate).format("YYYY-MM-DD")) {
                if (moment(res.data1[0].profitReportDate).format("YYYY-MM-DD") > moment(res.data2[0].profitReportDate).format("YYYY-MM-DD")) {
                  this.opening = Number(res.data1[0].profitReportAmount) + Number(res.data2[0].profitReportAmount)
                } else {
                  this.opening = Number(res.data2[0].profitReportAmount)
                }
              } else {
                this.opening = Number(res.data2[0].profitReportAmount)
              }
            } else {
              this.opening = Number(res.data2[0].profitReportAmount)
            }
            this.cd.detectChanges();
          } else {
            if (res.data1.length) {
              if (moment(this.reportDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD") >= moment(res.data1[0].profitReportDate).format("YYYY-MM-DD")) {
                this.opening = Number(res.data1[0].profitReportAmount)
              } else {
                this.opening = 0
              }
            } else {
              this.opening = 0
            }
            this.cd.detectChanges();
          }
        } else {
          this.opening = 0;
        }
      })
      this.cd.detectChanges();
    }
  }

  updateReport() {
    this.spinner.show()
    let data = {
      profitReportDate: moment(this.reportDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      profitReportId: this.dailyProfitId,
      profitReportUpdateBy: this.userName,
      profitReportAmount: Number(this.opening) + Number(this.totalIncome) - Number(this.totalExpense),
      incomeArray: this.incomeData,
      expenseArray: this.expenseData,
      opening: this.opening,
    }
    // console.log(data)
    this.post.updateDailyProfitReportPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert("Report Updated Successfully..!")
          this.profitReportId = this.dailyProfitId;
          this.post.dailyProfit(this.profitReportId);
          this.router.navigate(['/report/summaryReport']);
          this.spinner.hide()
        } else {
          alert("error to update Report..")
          this.spinner.hide()
        }
      })
  }

}
