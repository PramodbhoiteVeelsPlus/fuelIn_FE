import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { ListWidgetService } from '../../lists/listWidget.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { oilCompany } from './oilCoPurchase.model';
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
  selector: 'app-charts-widget2',
  templateUrl: './charts-widget2.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ChartsWidget2Component implements OnInit {
  addOilCompanyForm = new FormGroup({
    invoiceDate: new FormControl(''),
    receivedDate: new FormControl(''),
    vehicleNumber: new FormControl(''),
    invoiceNumber: new FormControl(''),
    paidFrom: new FormControl('', Validators.required),
  });

  viewOilCompanyForm = new FormGroup({
    paidFrom: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
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
  dealerAccess: boolean = false;
  countOilCompany: any = 1;
  CreditRequestOilCompany = new oilCompany();
  CreditRequestDataArrayOilCompany: any = [];
  isShowOilCompanySubmit: boolean = false;
  productsList: any = [];
  totalPurchaseAmount: number;
  totalPurchase1: any;
  totalPurchase: any;
  totalPurchase3: any;
  totalPurchase5: any;
  totalPurchase6: number;
  totalPurchase7: any;
  ownerName: string;
  oilCompanyDetails: any = [];
  loginSQLStaffId: any;

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

      this.addFormRequestOilCompany()
      // this.getAllAttendantsByDid(this.fuelDealerId)
      this.getProductsByDealerId(this.fuelDealerId)
      this.cd.detectChanges()
    }
  }

  addFormRequestOilCompany() {
    this.countOilCompany = this.countOilCompany + 1;
    this.CreditRequestOilCompany = new oilCompany();
    this.CreditRequestDataArrayOilCompany.push(this.CreditRequestOilCompany);
  }

  checkValidationOilCompany(i: string | number) {
    if (this.CreditRequestDataArrayOilCompany[i].product && this.CreditRequestDataArrayOilCompany[i].basicAmount && this.CreditRequestDataArrayOilCompany[i].vatAmount) {
      this.isShowOilCompanySubmit = true;
    } else {
      this.isShowOilCompanySubmit = false;
    }
  }

  getTankByDealerProductId(id: any, i: number) {
    let data = {
      fuelDealerId: this.fuelDealerId,
      fuelProductId: id.target.value,
    }
    this.post.getTankByDealerProductIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.CreditRequestDataArrayOilCompany[i].tankList = res.data;
          this.CreditRequestDataArrayOilCompany[i].tank = res.data[0].tankNo;
          this.CreditRequestDataArrayOilCompany[i].expenseDetails = res.data[0].productName;      //res.data[0].productName+'-'+res.data[0].tankNo;
        }
      })
  }

  getProductsByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post1.getFuelProductIdByDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.productsList = res.data;
        }
      })
  }

  calculateOilCoTotalAmount(i: any) {
    this.CreditRequestDataArrayOilCompany[i].basicAmount = Number(this.CreditRequestDataArrayOilCompany[i].basicAmount).toFixed(2)
    this.CreditRequestDataArrayOilCompany[i].vatAmount = Number(this.CreditRequestDataArrayOilCompany[i].vatAmount).toFixed(2)
    this.CreditRequestDataArrayOilCompany[i].otherComponents = Number(this.CreditRequestDataArrayOilCompany[i].otherComponents).toFixed(2)
    this.CreditRequestDataArrayOilCompany[i].cessAmount = Number(this.CreditRequestDataArrayOilCompany[i].cessAmount).toFixed(2)
    this.CreditRequestDataArrayOilCompany[i].totalAmount = Number(this.CreditRequestDataArrayOilCompany[i].vatAmount) + Number(this.CreditRequestDataArrayOilCompany[i].basicAmount) + Number(this.CreditRequestDataArrayOilCompany[i].cessAmount) + Number(this.CreditRequestDataArrayOilCompany[i].otherComponents)
    this.CreditRequestDataArrayOilCompany[i].totalAmount = Number(this.CreditRequestDataArrayOilCompany[i].totalAmount).toFixed(2)

    this.totalPurchaseAmount = Number(this.totalPurchaseAmount) + Number(this.CreditRequestDataArrayOilCompany[i].totalAmount)


    this.totalPurchase1 = this.CreditRequestDataArrayOilCompany[i].totalAmount
    this.totalPurchase = this.totalPurchase1 + this.totalPurchase
    this.totalPurchase3 = this.totalPurchase

    this.totalPurchase5 = this.CreditRequestDataArrayOilCompany[i].totalAmount
    this.totalPurchase6 = Number(this.totalPurchase5)
    this.totalPurchase7 = this.totalPurchase6 + this.totalPurchase7

    // this.totalPurchase1 = 0;
    this.calculateOilCoTotalTax(i);
  }


  calculateOilCoTotalTax(i: any) {
    this.CreditRequestDataArrayOilCompany[i].totalTax = Number(this.CreditRequestDataArrayOilCompany[i].vatAmount) + Number(this.CreditRequestDataArrayOilCompany[i].cessAmount)
    this.CreditRequestDataArrayOilCompany[i].totalTax = Number(this.CreditRequestDataArrayOilCompany[i].totalTax).toFixed(2)
    this.checkValidationOilCompany(i)
  }

  calculateVATPercent(i: any) {
    this.CreditRequestDataArrayOilCompany[i].vatInPercent = (Number(this.CreditRequestDataArrayOilCompany[i].vatAmount) * 100) / Number(this.CreditRequestDataArrayOilCompany[i].basicAmount)
    this.CreditRequestDataArrayOilCompany[i].vatInPercent = Number(this.CreditRequestDataArrayOilCompany[i].vatInPercent).toFixed(2)
    this.calculateOilCoTotalAmount(i);
  }

  addFormRequestOilCompany1(i: number) {
    this.countOilCompany = this.countOilCompany + 1;

    if (this.countOilCompany < 12) {
      if (this.CreditRequestDataArrayOilCompany[i].product) {
        this.isShowOilCompanySubmit = false;
        this.CreditRequestOilCompany = new oilCompany();
        this.CreditRequestDataArrayOilCompany.push(this.CreditRequestOilCompany);
      } else {
        alert("please enter valid details..!");
        this.isShowOilCompanySubmit = false;
      }
    }
    else {
      this.countOilCompany = 11;
      alert("Please save 10 entries, before adding more entries..!")
    }
  }

  removeFormRequestOilCompany(i: number) {
    this.CreditRequestDataArrayOilCompany.splice(i, 1);
    this.countOilCompany = this.countOilCompany - 1;
    this.isShowOilCompanySubmit = true;

  }

  getStaffIdByPersonId(personId: any, userId: any) {
    let data = {
      personId: personId,
      userId: userId,
    }
    this.post.getStaffIdByPersonIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.loginSQLStaffId = res.data[0].fuelDealerStaffId;
          }
          else {
            alert("Getting Error..! Please Logout & Login again..!")
          }
        }
      })
  }

  submitOilCompanyData() {
    if (this.addOilCompanyForm.value.invoiceDate) {
      if (this.addOilCompanyForm.value.receivedDate) {
        if (this.addOilCompanyForm.value.vehicleNumber) {
          this.spinner.show()
          let data = {
            oilCompanyData: this.CreditRequestDataArrayOilCompany,
            createdByDealerId: this.fuelDealerId,
            fuelDealerStaffId: this.loginSQLStaffId,
            bankAccountId: "21",                                //this.addOilCompanyForm.value.paidFrom,
            invoiceDate: moment(this.addOilCompanyForm.value.invoiceDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            receivedDate: moment(this.addOilCompanyForm.value.receivedDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            vehicleNumber: this.addOilCompanyForm.value.vehicleNumber,
            invoiceNumber: this.addOilCompanyForm.value.invoiceNumber,
            entryFrom: "PORTAL",
            createdBy: this.ownerName,
          }
          this.post.addOILCOMPANYDataInFuelExpensePOST(data)
            .subscribe(res => {
              if (res.status == 'OK') {
                alert("Data submitted successfully..")
                this.isShowOilCompanySubmit = false;
                this.countOilCompany = 1;
                this.oilCompanyClear()
                this.getOILCOMPANYDataInFuelExpense(this.fuelDealerId)
                this.spinner.hide()
                this.cd.detectChanges()
              } else {
                this.spinner.hide()
                this.cd.detectChanges()
              }
            })
        } else {
          alert("Please enter vehicle number")
        }
      } else {
        alert("Please select received date")
      }
    } else {
      alert("Please select invoice date")
    }
  }


  oilCompanyClear() {
    this.CreditRequestDataArrayOilCompany.length = 0
    this.addOilCompanyForm.reset();
    this.addOilCompanyForm.controls['paidFrom'].setValue('')
    this.addFormRequestOilCompany();
  }

  getOILCOMPANYDataInFuelExpense(fuelDealerId: any) {
    this.oilCompanyDetails.length = 0;
    if (this.viewOilCompanyForm.value.startDate && this.viewOilCompanyForm.value.endDate) {
      let data = {
        dealerId: this.fuelDealerId,
        startDate: moment(this.viewOilCompanyForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.viewOilCompanyForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post.getOILCOMPANYDataInFuelExpensePOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.oilCompanyDetails = res.data;
          }
        })
    } else {
      let data = {
        dealerId: fuelDealerId
      }
      this.post.getOILCOMPANYDataInFuelExpensePOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.oilCompanyDetails = res.data;
          }
        })
    }

  }
}
