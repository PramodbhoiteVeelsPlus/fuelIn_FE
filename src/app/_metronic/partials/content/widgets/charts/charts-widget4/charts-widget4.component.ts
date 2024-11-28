import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { ListWidgetService } from '../../lists/listWidget.services';
import { ChartsService } from '../charts.services';
import { FormGroup, FormControl } from '@angular/forms';
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
  selector: 'app-charts-widget4',
  templateUrl: './charts-widget4.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ChartsWidget4Component implements OnInit {
  filterForm = new FormGroup({
    month: new FormControl(''),
    year: new FormControl(''),
  });

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
  currentYear: string;
  lastYear: number;
  last2Year: number;
  lastFourthYear: number;
  lastFifthYear: number;
  month: string;
  purchaseData: any = [];
  isVarUpdate: boolean = false;
  isPurchase: boolean = false;

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
      this.phone1 = dealerData.hostPhone
      this.ownerName = element.firstName + ' ' + element.lastName
      if (element.accessGroupId == 12 || element.accessGroupId == 14) {
        this.dealerAccess = true
      }

      this.headerName1 = this.companyName;
      // this.headerName2 = res.data[0].address1+', '+res.data[0].address2+', '+ this.city;
      // this.headerName3 = this.state+'-'+ this.pin+'  '+"GST: "+ this.GSTNumber;

    }

    this.currentYear = moment(new Date()).format("YYYY");
    this.lastYear = Number(moment(new Date()).format("YYYY")) - 1;
    this.last2Year = Number(moment(new Date()).format("YYYY")) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
    this.lastFifthYear = Number(this.currentYear) - 4;
    this.month = moment(new Date()).format("MMM")
    this.filterForm.controls["month"].setValue(moment(new Date()).format("MMM"));
    this.filterForm.controls["year"].setValue(moment(new Date()).format("YYYY"));
    this.cd.detectChanges()
  }

  getFuelExpense() {
    this.spinner.show()
    this.purchaseData = []
    let data = {
      dealerId: this.fuelDealerId,
      month: moment(this.filterForm.value.month, ["MMM"]).format("MM"),
      year: this.filterForm.value.year
    }

    this.post.getFuelExpenseByMonthYearPOST(data).subscribe(res => {
      if (res.status == "OK" && res.data1.length) {
        this.isVarUpdate = true;
        this.isPurchase = true;
        res.data1.map((res2: { monthlyVariationId: string; monthlyVariation: any; productName: string; monthlyVariationProductId: any; }) => {
          const dataJSON = {
            productName: "",
            totalQuantity: "",
            totalAmount: "",
            monthlyVariationId: "",
            monthlyVariation: 0,
          }
          dataJSON.monthlyVariation = res2.monthlyVariation;
          dataJSON.productName = res2.productName;
          dataJSON.monthlyVariationId = res2.monthlyVariationId


          res.data.map((res3: { productName: string; fuelProductsId: any; totalQuantity: string; totalAmount: string; }) => {
            if (res2.monthlyVariationProductId == res3.fuelProductsId) {
              dataJSON.productName = res3.productName;
              dataJSON.totalQuantity = res3.totalQuantity;
              dataJSON.totalAmount = res3.totalAmount;
            }
          })
          this.purchaseData.push(dataJSON)
          this.cd.detectChanges()
        })

        this.spinner.hide()
        this.cd.detectChanges()

      } else if (res.status == "OK" && res.data.length) {
        this.purchaseData = res.data;
        this.isVarUpdate = false;
        this.isPurchase = true;
        this.spinner.hide()
        this.cd.detectChanges()
      } else {
        alert("Data Not Found..!")
        this.isPurchase = false;
        this.spinner.hide()
        this.cd.detectChanges()
      }
    })
  }

  addMonthlyVariation(i: any) {
    this.spinner.show()
    let data = {
      dealerId: this.fuelDealerId,
      monthlyVariation: this.purchaseData[i].monthlyVariation,
      monthlyVariationProductId: this.purchaseData[i].fuelProductsId,
      monthlyVariationMonth: this.filterForm.value.month,
      monthlyVariationYear: this.filterForm.value.year
    }
    // console.log(data)
    this.post.addMonthlyVariationPOST(data).subscribe(res => {
      if (res.status == "OK") {
        alert(res.msg)
        this.isPurchase = false;
        this.spinner.hide()
      } else {
        alert(res.msg)
        this.isPurchase = false;
        this.spinner.hide()
      }
    })
  }


  updateVariation(i: string | number) {
    this.spinner.show()
    let data = {
      monthlyVariationId: this.purchaseData[i].monthlyVariationId,
      monthlyVariation: this.purchaseData[i].monthlyVariation
    }
    // console.log(data)
    this.post.updateMonthlyVariationPOST(data).subscribe(res => {
      if (res.status == "OK") {
        alert(res.msg)
        this.isPurchase = false;
        this.spinner.hide();
      } else {
        alert(res.msg)
        this.isPurchase = false;
        this.spinner.hide();
      }
    })

  }
}

