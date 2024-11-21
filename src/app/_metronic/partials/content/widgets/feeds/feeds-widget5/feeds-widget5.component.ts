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
  selector: 'app-feeds-widget5',
  templateUrl: './feeds-widget5.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FeedsWidget5Component implements OnInit {
  dealerLoginVPId: any;
  accessGroupId: any;
  userId: any;
  personId: any;
  userName: string;
  ownerName: string;
  loginSQLCorporateId: any;
  petrolPump: any;
  fuelDealerId: any;
  productsList: any = [];
  expenseArray: any = [];
  incomeArray: any = [];
  totalIncome: number = 0;
  totalExpense: number = 0;
  date: any;
  totalCredit: number = 0;
  profitReportId: any;
  opening: number = 0;

  constructor(private post: FeedsService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    public router: Router,
    private cd: ChangeDetectorRef,
  ) { }


  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.petrolPump = dealerData.companyName;
    this.userName = element.firstName + ' ' + element.lastName;
    this.date = moment(new Date()).format("DD-MM-YYYY")
    this.getProductsByDealerId(this.fuelDealerId);
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
          this.getCreditSales();
        } else {
          this.spinner.hide();
        }
      })
  }
  //getArrays
  getArrays() {
    this.productsList.map((res: any) => {
      const dataJSON = {
        incomeType: "",
        incomeAmount: 0
      }
      dataJSON.incomeType = res.productName;
      this.incomeArray.push(dataJSON)
    })
    const dataJSONCash = {
      incomeType: "CASH",
      incomeAmount: 0
    }
    const dataJSONOther = {
      incomeType: "OTHER",
      incomeAmount: 0
    }
    this.incomeArray.push(dataJSONCash)
    this.incomeArray.push(dataJSONOther)
    this.calculateTotalIncome()

    const dataJSONBank = {
      expenseType: "CASH IN BANK",
      expenseAmount: 0
    }
    const dataJSONUPI = {
      expenseType: "UPI SALE",
      expenseAmount: 0
    }
    const dataJSONCard = {
      expenseType: "CARD SALE",
      expenseAmount: 0
    }
    const dataJSONExOther = {
      expenseType: "OTHER",
      expenseAmount: 0
    }
    this.expenseArray.push(dataJSONBank)
    this.expenseArray.push(dataJSONUPI)
    this.expenseArray.push(dataJSONCard)
    this.expenseArray.push(dataJSONExOther)
    this.calculateTotalExpense();
    this.spinner.hide();
  }

  submitReport() {
    if (this.fuelDealerId && this.date) {
      this.spinner.show();
      let data = {
        profitReportDealerId: this.fuelDealerId,
        profitReportDate: moment(this.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        profitReportAmount: Number(this.opening) + Number(this.totalIncome) - Number(this.totalExpense),
        profitReportCreatedBy: this.userName,
        expenseArray: this.expenseArray,
        incomeArray: this.incomeArray,
        opening: Number(this.opening),
      }
      this.post.addDailyReportPOST(data).subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
          this.clear();
          this.profitReportId = res.profitReportId
          this.post.dailyProfit(this.profitReportId);
          this.router.navigate(['/report/summaryReport']);
          this.spinner.hide();
        } else {
          alert(res.msg)
          this.spinner.hide();
        }
      })
    }
  }

  //totalIncome
  calculateTotalIncome() {
    this.totalIncome = 0;
    for (let i = 0; i < this.incomeArray.length; i++) {
      this.totalIncome += Number(this.incomeArray[i].incomeAmount);
    }
    this.cd.detectChanges();
  }
  //totalExpense
  calculateTotalExpense() {
    this.totalExpense = 0;
    for (let i = 0; i < this.expenseArray.length; i++) {
      this.totalExpense += Number(this.expenseArray[i].expenseAmount);
    }
    this.cd.detectChanges();
  }

  onDateSelection() {
    this.spinner.show()
    let data = {
      profitReportDealerId: this.fuelDealerId,
      startDate: moment(this.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
    }

    this.post.checkReportByDatePOST(data)
      .subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.getCreditSales();
          alert(res.msg)
          this.date = ''
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          alert("For Selected Date Report, you need to add Previous dates opening Outstanding first..!")
          this.getCreditSales();
          this.spinner.hide()
        }
      })
  }

  //getCreditSales
  getCreditSales() {
    if (this.fuelDealerId && this.date) {
      this.spinner.show()
      let data = {
        profitReportDealerId: this.fuelDealerId,
        dealerId: this.fuelDealerId,
        date: moment(this.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      }
      this.post.getCreditSalesPOST(data).subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.totalCredit = Number(res.data[0].totalCredit)
          const dataJSONCrSales = {
            expenseType: "CREDIT SALES",
            expenseAmount: Number(res.data[0].totalCredit)
          }
          this.expenseArray.push(dataJSONCrSales)
          this.getArrays();
          this.spinner.hide();
        } else {
          const dataJSONCrSales = {
            expenseType: "CREDIT SALES",
            expenseAmount: 0
          }
          this.expenseArray.push(dataJSONCrSales)
          this.getArrays();
          this.cd.detectChanges();
          this.spinner.hide();
        }
        if (res.status == "OK") {
          if (res.data2.length) {
            if (res.data1.length) {
              if (moment(this.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD") >= moment(res.data1[0].profitReportDate).format("YYYY-MM-DD")) {
                if (moment(res.data1[0].profitReportDate).format("YYYY-MM-DD") > moment(res.data2[0].profitReportDate).format("YYYY-MM-DD")) {
                  this.opening = Number(res.data1[0].profitReportAmount) + Number(res.data2[0].profitReportAmount)
                } else {
                  this.opening = Number(res.data2[0].profitReportAmount)
                }
              } else {
                this.opening = Number(res.data2[0].profitReportAmount)
              }
              this.cd.detectChanges();
            } else {
              this.opening = Number(res.data2[0].profitReportAmount)
              this.cd.detectChanges();
            }
            this.cd.detectChanges();
          } else {
            if (res.data1.length) {
              if (moment(this.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD") >= moment(res.data1[0].profitReportDate).format("YYYY-MM-DD")) {
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
    }
  }

  clear() {
    this.expenseArray = []
    this.incomeArray = []
    const dataJSONCrSales = {
      expenseType: "CREDIT SALES",
      expenseAmount: this.totalCredit
    }
    this.expenseArray.push(dataJSONCrSales)
    this.cd.detectChanges();
    this.getArrays();
  }
}