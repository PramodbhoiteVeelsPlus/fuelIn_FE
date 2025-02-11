import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../../stats/stats.services';
import { MixedService } from '../mixed.services';
import { FormGroup, FormControl } from '@angular/forms';
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
  selector: 'app-mixed-widget14',
  templateUrl: './mixed-widget14.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class MixedWidget14Component implements OnInit {
  accessGroup: any;
  fuelDealerId: any;
  dealerCorporateId: any;
  customerName: any;
  companyName: any;
  oilCompanyName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  hsnCode: string | null;
  fuelDealerCustomerMapId: any;
  billedToName: any;
  billedToGstNo: any;
  billedToAddressLine1: any;
  fuelInvoiceCreatedAt: Date;
  periodStartDate: string;
  periodEndDate: string;
  startDate: string;
  endDate: string;
  manualNumber: string | null;
  totalInvoiceAmt: number;
  creditArrayList: any = [];
  array: any = [];
  savedInvoiceData: any = [];
  vehData: any = [];
  vehicleNo: any;
  creditAmountNew: any = 0;
  statementData: never[];
  openningOS: any;
  totalPurchaseAmt: any;
  totalPaymentAmt: any;
  netOS: any;
  bankAccList: any = [];
  paisaWrd: any;
  rupeesWrd: any;
  amountInWords: string;
  oldInvoice5: any;
  GSTNumber: any;
  fromAddress: string;
  isDueDate: string | null;
  dueDate: string;
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
    if (localStorage.getItem('hsnCode') != "undefined") {
      this.hsnCode = localStorage.getItem('hsnCode');
    }
    this.oldInvoice5 = this.post.oldInvoice5
    this.accessGroup = element.accessGroupId;
    this.companyName = dealerData.companyName
    this.oilCompanyName = dealerData.brandName
    this.state = dealerData.state
    this.pin = dealerData.pin
    this.city = dealerData.city
    this.phone1 = dealerData.hostPhone
    this.GSTNumber = dealerData.GSTNumber
    this.fromAddress = dealerData.address1 + ',' + dealerData.address2
    this.isDueDate = localStorage.getItem('isDueDate');
    this.dueDate = moment(localStorage.getItem('dueDate'),["DD-MM-YYYY"]).format("D MMM y");
    if (localStorage.getItem('manualSno') != "undefined") {
      this.manualNumber = localStorage.getItem('manualSno');
    }
    if(this.accessGroup == '14'){
      var managerData = JSON.parse(localStorage.getItem('managerData') || '{}');
      this.customerId = managerData.customerId;
      this.searchDealerBycustomerId(this.customerId)
    }
    this.getCredit()
    this.getBankDetailsByDealerId(this.fuelDealerId)
    this.cd.detectChanges()
  }


  getInfobyCustomerMapId() {

    const data = {
      fuelDealerCustomerMapId: this.fuelDealerCustomerMapId,
    };
    this.post.getdataBycustomerMapIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data[0].mappingPreviousStatus == 'TRUE') {

            this.billedToName = res.data[0].mappingCompanyName;
            this.billedToGstNo = res.data[0].mappingGST;
            this.billedToAddressLine1 = res.data[0].city;

          } else {
            this.billedToName = res.data[0].companyName;
            this.billedToGstNo = res.data[0].GSTNumber;
            this.billedToAddressLine1 = res.data[0].city;

          }
          this.billedToAddressLine1 = res.data[0].city;
          this.cd.detectChanges()
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
    console.log('StartDate: ' + startDate, crId);
    let endDate = '';
    endDate = this.post.endDate;
    this.periodEndDate = endDate;
    console.log('EndDate: ' + endDate);
    this.fuelDealerCustomerMapId = crId;
    this.getCreditSavedInvoice(crId)
    // this.getCrStatement()

    this.startDate = moment(this.periodStartDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      this.endDate = moment(this.periodEndDate, ['DD-MM-YYYY']).format('YYYY-MM-DD')
    // console.log('time conversion');
    // console.log(this.startDate);
    // console.log(this.endDate);

    let day = moment(new Date()).format('DDMMYYHHmmss')
    // this.sysGeneInvoiceNumber = ('VI'+day)
    // console.log('time conversion111');
    // console.log(this.sysGeneInvoiceNumber);


  }

  getCreditSavedInvoice(fuelDealerCustomerMapId: any) {
    this.spinner.show()
    let data = {
      custMapId: fuelDealerCustomerMapId,
      startDate: moment(this.periodStartDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      endDate: moment(this.periodEndDate, ['DD-MM-YYYY']).format('YYYY-MM-DD')
    }

    this.post.getCreditByCustMapIdDatePOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.savedInvoiceData = res.data;
        this.vehData = res.dataVeh;

        for (let item of this.vehData) {
          this.vehicleNo = item.vehicleNumber
          this.getAllCreditDetailsByVehicleId()
        }

        for (let item of this.savedInvoiceData) {
          this.creditAmountNew += Number(item.creditAmount);
        }

        this.getCrStatement()
        // this.transform(Math.round(((Number(this.creditAmountNew) - Number(this.totalTransactionAmountNew)) + Number(this.savedPreviousOutstanding))));
        this.spinner.hide()
        this.cd.detectChanges()
      } else {
        this.spinner.hide()
        this.cd.detectChanges()
      }
    })
  }

  getAllCreditDetailsByVehicleId() {
    this.spinner.show()
    this.totalInvoiceAmt = 0
    let data = {
      custMapId: this.fuelDealerCustomerMapId,
      startDate: moment(this.periodStartDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      endDate: moment(this.periodEndDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      vehicle: this.vehicleNo
    }
    this.post.getCreditByCustMapIdDateVehiclePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.creditArrayList = res.data;
          this.array.push(res.data)
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getCrStatement() {
    this.statementData = []
    this.spinner.show();
    let data = {
      CorporateMapId: this.fuelDealerCustomerMapId,
      startDate: moment(this.periodStartDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      endDate: moment(this.periodEndDate, ['DD-MM-YYYY']).format('YYYY-MM-DD')
    }

    this.post.getCrStatementPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.statementData = res.data;
          this.openningOS = res.data[0].openningOS
          this.totalPurchaseAmt = res.data[0].totalPurchaseAmt
          this.totalPaymentAmt = res.data[0].totalPaymentAmt
          this.netOS = res.data[0].netOS
          var osForWrd = ''
          osForWrd = (this.netOS).toFixed(2)
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
          // this.transform(Math.round(Number(this.netOS)));
          this.getInfobyCustomerMapId()
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
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
  
  searchDealerBycustomerId(customerId: any) {    
    let data = {
      customerId: customerId,
    };
    this.post1.getCustomerByCustomerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {         
          this.companyName = res.data[0].companyName;
          this.oilCompanyName = res.data[0].brandName;
          this.fromAddress = res.data[0].address1 + ',' + res.data[0].address2;
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
