import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../../stats/stats.services';
import { MixedService } from '../mixed.services';
import moment from 'moment';
import numWords from 'num-words';

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
  selector: 'app-mixed-widget12',
  templateUrl: './mixed-widget12.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class MixedWidget12Component implements OnInit {
  @Input() chartColor: string = '';
  @Input() chartHeight: string;
  chartOptions: any = {};
  dealerCorporateId: any;
  fuelDealerId: any;
  accessGroup: any;
  lubeTax1: any;
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
  fuelDealerCustomerMapId: any;
  billedToCityArea: any;
  billedToName: any;
  billedToGstNo: any;
  billedToMobile: any;
  billedToCity: any;
  billedToAddressLine1: any;
  billedToAddressLine2: any;
  billedToConeenorState: any;
  billedToConneenorPincode: any;
  fuelInvoiceCreatedAt: Date;
  periodStartDate: string;
  periodEndDate: string;
  startDate: string;
  endDate: string;
  lubeTaxData: any = [];
  totalPurchase: any;
  totalTaxAmt: any;
  productData: any = [];
  rupeesWrd: any;
  paisaWrd: any;
  amountInWords: string;
  GSTNumber: any;
  address1: any;
  address2: any;

  constructor(
    private post: MixedService,
    private post1: StatsService,
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
    this.lubeTax1 = this.post.lubeTax1
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
      // this.getVehicleDataByMobile(element.phone1)
    }
    // this.getBankDetailsByDealerId(this.fuelDealerId)
    // this.getManagerMobileByfuelDealerId(this.fuelDealerId)
    let day = moment(new Date()).format('DDMMYYHHmmss')
    this.sysGeneInvoiceNumber = ('VI' + day)
    this.termAndCondition = localStorage.getItem('termsAndConditions');
    this.cd.detectChanges()
  }

  
  getInfobyCustomerMapId() {
    const data = {
      fuelDealerCustomerMapId: this.fuelDealerCustomerMapId,
    };
    this.post.getdataBycustomerMapIdPOST(data)
      .subscribe(res => {
        if (res.status === 'OK') {
          this.billedToCityArea = res.data[0].cityArea;
          if (res.data[0].mappingPreviousStatus === 'TRUE') {

            this.billedToName = res.data[0].mappingCompanyName;
            this.billedToGstNo = res.data[0].mappingGST;
            this.billedToMobile = res.data[0].hostPhone;

            if (res.data[0].mappingCity) {  
              this.billedToCity = res.data[0].mappingCity;  
            }else{
              this.billedToCity = res.data[0].city;
            }
            if (res.data[0].mappingAddress1) {   
              this.billedToAddressLine1 = res.data[0].mappingAddress1;  
            }else{
              this.billedToAddressLine1 = res.data[0].address1;

            }
            if (res.data[0].mappingAddress2) {   
              this.billedToAddressLine2 = res.data[0].mappingAddress2;    
            }else{
              this.billedToAddressLine2 = res.data[0].address2;
            }
          } else {
            this.billedToName = res.data[0].companyName;
            this.billedToGstNo = res.data[0].GSTNumber; 
            this.billedToAddressLine2 = res.data[0].address2;
            this.billedToAddressLine1 = res.data[0].address1;
            this.billedToCity = res.data[0].city;
            this.billedToMobile = res.data[0].hostPhone;

          }
          this.cd.detectChanges()
          
          this.billedToConeenorState = res.data[0].state;
          this.billedToConneenorPincode = res.data[0].pin;
        }
      }
      );
  }
  
  getCredit() {
    let crId: any;
    crId = this.post.custMappingID;
    // this.period = '2021-2022';
    this.fuelInvoiceCreatedAt = new Date();
    let startDate = '';
    startDate = this.post.startDate;
    this.periodStartDate = startDate;
    console.log('StartDate: ' + startDate);
    let endDate = '';
    endDate = this.post.endDate;
    this.periodEndDate = endDate;
    console.log('EndDate: ' + endDate);
    this.fuelDealerCustomerMapId = crId;
    this.getLubeTaxStatement(crId)
    this.getInfobyCustomerMapId()

    this.startDate = moment(this.periodStartDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    this.endDate = moment(this.periodEndDate, ['DD-MM-YYYY']).format('YYYY-MM-DD')
    // console.log('time conversion');
    // console.log(this.startDate);
    // console.log(this.endDate);

    let day = moment(new Date()).format('DDMMYYHHmmss')
    this.sysGeneInvoiceNumber = ('VI'+day)
    // console.log('time conversion111');
    // console.log(this.sysGeneInvoiceNumber);
    
    
  }
      
getLubeTaxStatement(fuelDealerCustomerMapId: any){
  this.spinner.show();
  let data = {
    custMapId: fuelDealerCustomerMapId, 
    startDate: moment(this.periodStartDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    endDate: moment(this.periodEndDate, ['DD-MM-YYYY']).format('YYYY-MM-DD')
  }

  console.log(data)
  this.post.getLubeTaxStatementPOST(data).subscribe(res => {
    if(res.status == "OK"){
      this.lubeTaxData = res.allPurData;
      this.totalPurchase = res.purData[0].totalPurchase;
      this.totalTaxAmt = res.taxData[0].totalPurchase;
      this.productData = res.prodData;
      console.log(this.lubeTaxData)
      var osForWrd = ''
      osForWrd = (this.totalPurchase).toFixed(2)
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
      // this.transform(Math.round(this.totalPurchase))
      this.spinner.hide();
      this.cd.detectChanges()
    } else {
      this.spinner.hide();
      this.cd.detectChanges()
    }
  })
}
}
