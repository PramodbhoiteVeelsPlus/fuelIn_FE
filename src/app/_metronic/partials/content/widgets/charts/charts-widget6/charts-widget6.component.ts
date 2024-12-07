import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { ListWidgetService } from '../../lists/listWidget.services';
import { ChartsService } from '../charts.services';
import moment from 'moment';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<any> {

  readonly DELIMITER = '-';

  fromModel(value: any | null): NgbDateStruct | null {
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

  toModel(date: NgbDateStruct | null): any | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: any): NgbDateStruct | null {
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

  format(date: NgbDateStruct | null): any {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-charts-widget6',
  templateUrl: './charts-widget6.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ChartsWidget6Component implements OnInit {
  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  managerName: string;
  pumpCity: any;
  userId: any;
  dealerLoginId: any;
  companyName: any;
  oilCompanyName: any;
  brandName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  ownerName: string;
  dealerAccess: boolean;
  headerName1: any;
  crPurchaseReportTx: boolean = false;
  crPurchaseData: any = [];
  crPurchaseStartDate: string;
  crPurchaseEndDate: string;
  mapId: any;
  productIdArrayTx: any = [];
  manualNo: any;
  totalCrPurchaseTx: number;
  crPurchaseReportDay: boolean = false;
  crPurchaseDataDay: any = [];
  crPurchaseDate: string;
  custMapId: any;
  productIdArrayDay: any;
  totalCrPurchaseDay: number;
  crPurchaseDataMonth: any = [];
  crPurchaseReportMonth: boolean = false;
  monthDay: any;
  productIdArrayMonth: any;
  totalCrPurchaseMonth: number;
  month: string;
  totalPurchaseData: any = [];
  totalPurchaseDataDay: any = [];
  totalPurchaseMonthData: any = [];
  mobile: any;
  sysGeneInvoiceNumber: string;
  statementCreatedAt: Date;
  address1: any;
  GSTNumber: any;
  address2: any;

  constructor(
    private post: ChartsService,
    private post1: ListWidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private router: Router,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.accessGroup = element.accessGroupId;
    this.mobile = element.phone1
    this.statementCreatedAt = new Date();
    let day = moment(new Date()).format('DDMMYYHHmmss')
    this.sysGeneInvoiceNumber = ('VI' + day)
    if (element.accessGroupId == 12 || element.accessGroupId == 14) {
      this.managerName = element.firstName + ' ' + element.lastName;
      this.pumpCity = dealerData.city
      this.userId = element.userId;
      this.dealerLoginId = element.veelsPlusCorporateID;
      this.companyName = dealerData.companyName
      this.oilCompanyName = dealerData.brandName
      this.brandName = dealerData.brandName
      this.state = dealerData.state
      this.pin = dealerData.pin
      this.city = dealerData.city
      this.address1 = dealerData.address1
      this.address2 = dealerData.address2
      this.GSTNumber = dealerData.GSTNumber
      this.phone1 = dealerData.hostPhone
      this.ownerName = element.firstName + ' ' + element.lastName
      if (element.accessGroupId == 12 || element.accessGroupId == 14) {
        this.dealerAccess = true
      }

      this.headerName1 = this.companyName;

    }

    if (this.post.crPurchaseTab == "CrPurchaseReportTx") {
      this.crPurchaseReportTx = true;
      this.crPurchaseData = this.post.crPurchaseData;
      this.crPurchaseStartDate = moment(this.post.crPurchaseStartDate, ["DD-MM-YYYY"]).format("DD MMM YYYY");
      this.crPurchaseEndDate = moment(this.post.crPurchaseEndDate, ["DD-MM-YYYY"]).format("DD MMM YYYY");
      this.mapId = this.post.mapId;
      this.productIdArrayTx = this.post.productIdArrayTx;
      this.fuelDealerId = this.post.fuelDealerId
      this.manualNo = this.post.manualNo
      console.log(this.productIdArrayTx, this.mapId, this.fuelDealerId, this.manualNo, "idsa")
      this.crPurchaseData.map((res: { totalPurchase: any; }) => {
        this.totalCrPurchaseTx = Number(this.totalCrPurchaseTx) + Number(res.totalPurchase)
      })
      this.getTotalAmtQuantityTx()
    } else if (this.post.crPurchaseTab == "CrPurchaseReportDay") {
      this.crPurchaseReportDay = true;
      this.crPurchaseDataDay = this.post.crPurchaseDataDay;
      this.crPurchaseDate = moment(this.post.crPurchaseDate, ["DD-MM-YYYY"]).format("DD MMM YYYY");
      this.custMapId = this.post.custMapId;
      this.productIdArrayDay = this.post.productIdArrayDay;
      this.fuelDealerId = this.post.fuelDealerId
      this.manualNo = this.post.manualNo
      this.crPurchaseDataDay.map((res: { productData: any[]; }) => {
        res.productData.map(res => {
          this.totalCrPurchaseDay = Number(this.totalCrPurchaseDay) + Number(res.totalPurchase)
        })
      })
      this.getTotalAmtQuantityDay()
    } else if (this.post.crPurchaseTab == "CrPurchaseReportMonth") {
      this.crPurchaseReportMonth = true;
      this.crPurchaseDataMonth = this.post.crPurchaseDataMonth;
      this.monthDay = this.post.monthDay;
      this.custMapId = this.post.fuelDealerCorpMapId;
      this.productIdArrayMonth = this.post.productIdArrayMonth;
      this.fuelDealerId = this.post.fuelDealerId
      this.manualNo = this.post.manualNo
      this.crPurchaseDataMonth.map((res: { productData: any[]; }) => {
        res.productData.map(res => {
          this.totalCrPurchaseMonth = Number(this.totalCrPurchaseMonth) + Number(res.totalPurchase)
        })
      })
      this.month = moment(this.monthDay, ["MM YYYY"]).format("MMM YYYY")
      this.getTotalAmtQuantityMonth()
    } else {
      this.crPurchaseReportTx = false;
      this.crPurchaseReportDay = false;
      this.crPurchaseReportMonth = false;
      this.router.navigate(['/credit/crPurchaseBook']);
    }
    this.cd.detectChanges()
  }

  getTotalAmtQuantityTx() {
    if (this.crPurchaseStartDate && this.crPurchaseEndDate) {
      if (this.productIdArrayTx.length) {
        if (this.mapId) {
          this.totalPurchaseData = [];
          let data = {
            dealerId: this.fuelDealerId,
            mapId: this.mapId,
            startDate: moment(this.crPurchaseStartDate, ["DD MMM YYYY"]).format("YYYY-MM-DD"),
            endDate: moment(this.crPurchaseEndDate, ["DD MMM YYYY"]).format("YYYY-MM-DD"),
            productIdArray: this.productIdArrayTx,
          }
          this.post.getTotalPurchaseDetailsTxPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.totalPurchaseData = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.totalPurchaseData = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        } else {
          this.totalPurchaseData = [];
          let data = {
            dealerId: this.fuelDealerId,
            startDate: moment(this.crPurchaseStartDate, ["DD MMM YYYY"]).format("YYYY-MM-DD"),
            endDate: moment(this.crPurchaseEndDate, ["DD MMM YYYY"]).format("YYYY-MM-DD"),
            productIdArray: this.productIdArrayTx,
          }
          this.post.getTotalPurchaseDetailsTxPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.totalPurchaseData = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.totalPurchaseData = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        }
      } else {
        if (this.mapId) {
          this.totalPurchaseData = [];
          let data = {
            dealerId: this.fuelDealerId,
            mapId: this.mapId,
            startDate: moment(this.crPurchaseStartDate, ["DD MMM YYYY"]).format("YYYY-MM-DD"),
            endDate: moment(this.crPurchaseEndDate, ["DD MMM YYYY"]).format("YYYY-MM-DD"),
            productId: "All",
          }
          this.post.getTotalPurchaseDetailsTxPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.totalPurchaseData = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.totalPurchaseData = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        } else {
          this.totalPurchaseData = [];
          let data = {
            dealerId: this.fuelDealerId,
            startDate: moment(this.crPurchaseStartDate, ["DD MMM YYYY"]).format("YYYY-MM-DD"),
            endDate: moment(this.crPurchaseEndDate, ["DD MMM YYYY"]).format("YYYY-MM-DD"),
            productId: "All",
          }
          this.post.getTotalPurchaseDetailsTxPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.totalPurchaseData = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.totalPurchaseData = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        }
      }
    } else {
      alert("Please select Date Range..!")
    }
  }

  getTotalAmtQuantityDay() {
    if (this.crPurchaseDate) {
      if (this.productIdArrayDay.length) {
        if (this.mapId) {
          this.totalPurchaseDataDay = [];
          let data = {
            dealerId: this.fuelDealerId,
            mapId: this.custMapId,
            date: moment(this.crPurchaseDate, ["DD MMM YYYY"]).format("YYYY-MM-DD"),
            productIdArray: this.productIdArrayDay,
          }
          this.post.getTotalPurchaseByDayPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.totalPurchaseDataDay = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.totalPurchaseDataDay = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        } else {
          this.totalPurchaseDataDay = [];
          let data = {
            dealerId: this.fuelDealerId,
            date: moment(this.crPurchaseDate, ["DD MMM YYYY"]).format("YYYY-MM-DD"),
            productIdArray: this.productIdArrayDay,
          }
          this.post.getTotalPurchaseByDayPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.totalPurchaseDataDay = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.totalPurchaseDataDay = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        }
      } else {
        if (this.mapId) {
          this.totalPurchaseDataDay = [];
          let data = {
            dealerId: this.fuelDealerId,
            mapId: this.custMapId,
            date: moment(this.crPurchaseDate, ["DD MMM YYYY"]).format("YYYY-MM-DD"),
            productId: "All",
          }
          this.post.getTotalPurchaseByDayPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.totalPurchaseDataDay = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.totalPurchaseDataDay = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        } else {
          this.totalPurchaseDataDay = [];
          let data = {
            dealerId: this.fuelDealerId,
            date: moment(this.crPurchaseDate, ["DD MMM YYYY"]).format("YYYY-MM-DD"),
            productId: "All",
          }
          this.post.getTotalPurchaseByDayPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.totalPurchaseDataDay = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.totalPurchaseDataDay = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        }
      }
    } else {
      alert("Please select Date Range..!")
    }

  }

  getTotalAmtQuantityMonth() {
    if (this.monthDay) {
      if (this.productIdArrayMonth.length) {
        if (this.custMapId) {
          this.totalPurchaseMonthData = [];
          let data = {
            dealerId: this.fuelDealerId,
            mapId: this.custMapId,
            startDate: moment(this.monthDay, ["MM YYYY"]).format("YYYY-MM-01"),
            endDate: moment(this.monthDay, ["MM YYYY"]).format("YYYY-MM-31"),
            productIdArray: this.productIdArrayMonth,
          }
          this.post.getTotalPurchaseDetailsTxPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.totalPurchaseMonthData = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.totalPurchaseMonthData = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        } else {
          this.totalPurchaseMonthData = [];
          let data = {
            dealerId: this.fuelDealerId,
            startDate: moment(this.monthDay, ["MM YYYY"]).format("YYYY-MM-01"),
            endDate: moment(this.monthDay, ["MM YYYY"]).format("YYYY-MM-31"),
            productIdArray: this.productIdArrayMonth,
          }
          this.post.getTotalPurchaseDetailsTxPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.totalPurchaseMonthData = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.totalPurchaseMonthData = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        }
      } else {
        if (this.custMapId) {
          this.totalPurchaseMonthData = [];
          let data = {
            dealerId: this.fuelDealerId,
            mapId: this.custMapId,
            startDate: moment(this.monthDay, ["MM YYYY"]).format("YYYY-MM-01"),
            endDate: moment(this.monthDay, ["MM YYYY"]).format("YYYY-MM-31"),
            productId: "All",
          }
          this.post.getTotalPurchaseDetailsTxPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.totalPurchaseMonthData = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.totalPurchaseMonthData = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        } else {
          this.totalPurchaseMonthData = [];
          let data = {
            dealerId: this.fuelDealerId,
            startDate: moment(this.monthDay, ["MM YYYY"]).format("YYYY-MM-01"),
            endDate: moment(this.monthDay, ["MM YYYY"]).format("YYYY-MM-31"),
            productId: "All",
          }
          this.post.getTotalPurchaseDetailsTxPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.totalPurchaseMonthData = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.totalPurchaseMonthData = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        }
      }
    } else {
      alert("Please select Date Range..!")
    }

  }

}
