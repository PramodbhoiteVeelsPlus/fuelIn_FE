import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../../stats/stats.services';
import { MixedService } from '../mixed.services';
import moment from 'moment';
import numWords from 'num-words';
import { WidgetService } from '../../widgets.services';

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
  selector: 'app-mixed-widget10',
  templateUrl: './mixed-widget10.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class MixedWidget10Component implements OnInit {
  @Input() chartColor: string = '';
  @Input() chartHeight: string;
  chartOptions: any = {};
  dealerCorporateId: any;
  fuelDealerId: any;
  accessGroup: any;
  oldInvoice: any;
  companyName: any;
  oilCompanyName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  manualNumber: any;
  isDueDate: any;
  dueDate: any;
  hsnCode: any;
  termAndCondition: any;
  managerMobile: any;
  mobileStatus: boolean = false;
  sysGeneInvoiceNumber: string;
  fcDetails: any = [];
  fuelDealerCustomerMapId: any;
  creditAmount: any;
  productQuantityDetails: any = [];
  vehicleNumber: any;
  fuelInvoiceCreatedAt: Date;
  periodStartDate: string;
  periodEndDate: string;
  startDate: string;
  endDate: string;
  billedToCityArea: any;
  billedToName: any;
  billedToGstNo: any;
  billedToMobile: any;
  billedToCity: any;
  billedToAddressLine1: any;
  billedToAddressLine2: any;
  billedToConeenorState: any;
  billedToConneenorPincode: any;
  bankAccList: any = [];
  vehicleData: any = [];
  address1: any;
  address2: any;
  rupeesWrd: any;
  paisaWrd: any;
  amountInWords: string;
  GSTNumber: any;
  customerId: any;

  constructor(
    private post: MixedService,
    private post1: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private router: Router,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    this.accessGroup = element.accessGroupId;
    this.oldInvoice = this.post.oldInvoice3
    this.companyName = dealerData.companyName
    this.oilCompanyName = dealerData.brandName
    this.state = dealerData.state
    this.pin = dealerData.pin
    this.city = dealerData.city
    this.phone1 = dealerData.hostPhone
    this.GSTNumber = dealerData.GSTNumber
    this.address1 = dealerData.address1
    this.address2 = dealerData.address2
    if (localStorage.getItem('manualSno') != "undefined") {
      this.manualNumber = localStorage.getItem('manualSno');
    }
    this.isDueDate = localStorage.getItem('isDueDate');
    this.dueDate = moment(localStorage.getItem('dueDate'), ["DD-MM-YYYY"]).format("D MMM y");
    if (localStorage.getItem('hsnCode') != "undefined") {
      this.hsnCode = localStorage.getItem('hsnCode');
    }
    if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {
      this.getCredit();
    } else {
      this.getVehicleDataByMobile(element.phone1)
    }
    if(this.accessGroup == '14'){
      var managerData = JSON.parse(localStorage.getItem('managerData') || '{}');
      this.customerId = managerData.customerId;
      this.searchDealerBycustomerId(this.customerId)
    }
    this.getBankDetailsByDealerId(this.fuelDealerId)
    this.getManagerMobileByfuelDealerId(this.fuelDealerId)
    let day = moment(new Date()).format('DDMMYYHHmmss')
    this.sysGeneInvoiceNumber = ('VI' + day)
    this.termAndCondition = localStorage.getItem('termsAndConditions');
    this.cd.detectChanges()
  }

  getManagerMobileByfuelDealerId(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getSelectedMobileNumberByDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.managerMobile = res.data[0].mobile;
          this.mobileStatus = true;
        } else {
          this.mobileStatus = false;
        }
      }
      );
  }

  getCredit() {
    this.fcDetails = this.post.array;
    this.fuelDealerCustomerMapId = this.post.selectCorporateMapIdVehicle;
    this.getInfobyCustomerMapId()
    this.creditAmount = this.post.array1[0].creditAmount;
    var osForWrd = ''
    osForWrd = (this.creditAmount).toFixed(2)
    var osForWrd1 = osForWrd.split(".")
    this.rupeesWrd = osForWrd1[0]
    this.paisaWrd = osForWrd1[1]
    if (this.rupeesWrd != 0 && this.paisaWrd != 0) {
      this.amountInWords = numWords((this.rupeesWrd)) + " rupees and " + numWords((this.paisaWrd)) + " paisa only";
    } else if (this.rupeesWrd != 0) {
      this.amountInWords = numWords((this.rupeesWrd)) + " rupees";
    } else if (this.paisaWrd != 0) {
      this.amountInWords = numWords((this.paisaWrd)) + " paisa only";
    } else {
      this.amountInWords = "";
    }
    // this.transform(Math.round(this.creditAmount))
    this.productQuantityDetails = this.post.array2;

    this.vehicleNumber = this.post.vehicleNumber;
    this.fuelInvoiceCreatedAt = new Date();
    let startDate = '';
    startDate = this.post.startDate;
    this.periodStartDate = startDate;
    // console.log('StartDate: ' + startDate);
    let endDate = '';
    endDate = this.post.endDate;
    this.periodEndDate = endDate;
    // console.log('EndDate: ' + endDate); 
    this.startDate = moment(this.periodStartDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      this.endDate = moment(this.periodEndDate, ['DD-MM-YYYY']).format('YYYY-MM-DD')

    let day = moment(new Date()).format('DDMMYYHHmmss')
    this.sysGeneInvoiceNumber = ('VI' + day)
    // console.log('time conversion111');
    // console.log(this.sysGeneInvoiceNumber);

  }

  getInfobyCustomerMapId() {
    const data = {
      fuelDealerCustomerMapId: this.fuelDealerCustomerMapId,
    };
    this.post.getdataBycustomerMapIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.billedToCityArea = res.data[0].cityArea;
          if (res.data[0].mappingPreviousStatus == 'TRUE') {
            this.billedToName = res.data[0].mappingCompanyName;
            this.billedToGstNo = res.data[0].mappingGST;
            this.billedToMobile = res.data[0].hostPhone;
            this.cd.detectChanges()
          } else {
            this.billedToName = res.data[0].companyName;
            this.billedToGstNo = res.data[0].GSTNumber;
            this.billedToMobile = res.data[0].hostPhone;
            this.cd.detectChanges()
          }
          this.billedToCity = res.data[0].city;
          this.billedToAddressLine1 = res.data[0].address1;
          this.billedToAddressLine2 = res.data[0].address2;
          this.billedToConeenorState = res.data[0].state;
          this.billedToConneenorPincode = res.data[0].pin;
          this.cd.detectChanges()
        }
      }
      );
  }

  getBankDetailsByDealerId(fuelDealerId: any) {
    this.bankAccList.length = 0;
    let data = {
      dealerId: fuelDealerId
    }
    this.post.getBankDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.bankAccList = res.data1;
          this.cd.detectChanges()
        }
      })
  }

  getVehicleDataByMobile(mobileNumber: any) {
    let data = {
      mobileNumber: mobileNumber
    }
    this.post.viewVehicleVishwasaByMobileNumberPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.vehicleData = res.data
          if (res.data2.length) {
            this.companyName = res.data2[0].companyName;
            this.address1 = res.data2[0].address1;
            this.address2 = res.data2[0].address2;
            this.city = res.data2[0].city;
            this.state = res.data2[0].state;
            this.pin = res.data2[0].pin;
          }
        } else {

        }
      })
  }
  
  searchDealerBycustomerId(customerId: any) {    
    let data = {
      customerId: customerId,
    };
    this.post1.getCustomerByCustomerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {         
          this.companyName = res.data[0].companyName;
          this.oilCompanyName = res.data[0].brandName;
          this.address1 = res.data[0].address1;
          this.address2 = res.data[0].address2;
          this.city = res.data[0].city;
          this.state = res.data[0].state;
          this.pin = res.data[0].pin;
          this.GSTNumber = res.data[0].GSTNumber;         
          
        } else {
          this.spinner.hide();
        }
      });
}
}
