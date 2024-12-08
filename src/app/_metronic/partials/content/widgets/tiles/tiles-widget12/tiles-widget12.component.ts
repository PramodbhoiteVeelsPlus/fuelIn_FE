import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TilesService } from '../tiles.services';
import { ListWidgetService } from '../../lists/listWidget.services';
import moment from 'moment';

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
  selector: 'app-tiles-widget12',
  templateUrl: './tiles-widget12.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TilesWidget12Component implements OnInit {
  @Input() cssClass = '';
  @Input() widgetHeight = '150px';
  @Input() iconColor = 'success';
  svgCSSClass = '';
  userName: string;
  accessGroup: any;
  fuelDealerId: string | null;
  dealerCorporateId: string | null;
  routeView: string;
  shiftTimeId: any;
  endDate: string;
  startDate: string;
  shiftTime: any;
  shiftName: any;
  companyName: any;
  brandName: any;
  city: any;
  todayDate = new Date();
  meterSalesDetails: any = [];
  totalMeterSalesDetails: any;
  totalSalesDetails: any = [];
  tallySalesDetails: any = [];
  cashSales: any;
  digitalSales: any;
  creditSales: any;
  shiftDetails: any = [];
  totalDetails: any = [];
  meterSalesSum: any;
  tallySalesSum: any;
  meterSalesQuantitySum: any;
  digitalDetails: any = [];
  digitalTotalSales: any;

  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private post: TilesService,
    private post1: ListWidgetService,
    private cd: ChangeDetectorRef,
    config: NgbDatepickerConfig,) {
    const currentDate = new Date();

    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '');
    this.userName = element.firstName + ' ' + element.lastName;
    this.accessGroup = element.accessGroupId;
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dealerCorporateId = localStorage.getItem('dealerCorporateId');
    this.companyName = dealerData.companyName;
    this.brandName = dealerData.brandName;
    this.city = dealerData.city;
    this.routeView =  this.post1.address;
    this.shiftTimeId =  this.post1.shiftTimeId;
    this.endDate =  this.post1.endDate;
    this.startDate =  this.post1.startDate;
    this.getfuelShiftDetailById(this.shiftTimeId)
    if (this.routeView == "ShiftBook") {
      this.shiftTimeId = this.shiftTimeId
      this.getSalesDetailsProductWise(this.shiftTimeId, this.fuelDealerId); 
      this.getTallyDetails(this.shiftTimeId, this.fuelDealerId); 
      this.getDSR(this.shiftTimeId, this.fuelDealerId); 
      this.getTotalMeterSalesAndTallyEntery(this.shiftTimeId, this.fuelDealerId); 
      this.getDigitalTotalByDate(this.shiftTimeId, this.fuelDealerId); 

    } else { 
      this.getSalesDetailsProductWise(this.shiftTimeId, this.fuelDealerId); 
      this.getTallyDetails(this.shiftTimeId, this.fuelDealerId); 
      this.getDSR(this.shiftTimeId, this.fuelDealerId); 
      this.getTotalMeterSalesAndTallyEntery(this.shiftTimeId, this.fuelDealerId); 
      this.getDigitalTotalByDate(this.shiftTimeId, this.fuelDealerId); 
  
    }
    this.getSalesDetailsProductWise(this.shiftTimeId, this.fuelDealerId); 
    this.getTallyDetails(this.shiftTimeId, this.fuelDealerId); 
    this.getDSR(this.shiftTimeId, this.fuelDealerId); 
    this.getTotalMeterSalesAndTallyEntery(this.shiftTimeId, this.fuelDealerId); 
    this.getDigitalTotalByDate(this.shiftTimeId, this.fuelDealerId); 
    this.cd.detectChanges()
  }
  
getfuelShiftDetailById(fuelShiftTimeId: any) {  
  let data = {
    fuelShiftTimeId: fuelShiftTimeId
  }
  this.post1.getFuelShiftTimeDetailsPOST(data)
    .subscribe(res => {
      if (res.status == "OK") {
        if(res.data.length){
          this.shiftTime  = res.data[0].fuelShiftTimeDetails; 
          this.shiftName =  res.data[0].fuelShiftTimeShiftName;
          this.cd.detectChanges()
        }else{
          this.shiftTime  = ''
          this.shiftName = '' 
          this.cd.detectChanges()
        }          
      }
      else { 
      }
    })
  }
  
getSalesDetailsProductWise(shiftTimeId: any,fuelDealerId: any) {
  let data = {
    shiftTimeId: shiftTimeId,
    startDate: moment(this.startDate).format("YYYY-MM-DD"),
    endDate: moment(this.endDate).format("YYYY-MM-DD"),
    fuelDealerId:fuelDealerId,
  };
  this.post.getMETERSALESTotalDSRBYShiftTimePOST(data)
  .subscribe((res) => {
      if (res.status == "OK") {
          this.meterSalesDetails = res.data;
          this.totalMeterSalesDetails = res.data1[0].meterSaleAmount;
          this.cd.detectChanges()
      }
  });
}

getTallyDetails(shiftTimeId: any,fuelDealerId: any) {
  const data = {
    shiftTimeId: shiftTimeId,
    startDate: moment(this.startDate).format("YYYY-MM-DD"),
    endDate: moment(this.endDate).format("YYYY-MM-DD"),
    fuelDealerId:fuelDealerId,
  };
  this.post.getShiftVStallyBYShiftTimePOST(data)
    .subscribe(res => {
      if (res.status == 'OK') {

        this.tallySalesDetails = res.data;
        this.totalSalesDetails = res.data1;

        this.cashSales = res.data1[0].cashTallyAmt
        this.digitalSales = res.data1[0].paytmTotal
        this.creditSales = res.data1[0].creditTally
        this.cd.detectChanges()
      } else {

      }
    });
  }

  getDSR(shiftTimeId: any,fuelDealerId: any) {
    const data = {     
      startDate: moment(this.startDate).format("YYYY-MM-DD"),
      endDate: moment(this.endDate).format("YYYY-MM-DD"),
      shiftTimeId: shiftTimeId,
      fuelDealerId:fuelDealerId,
    };
    this.post.getProductWiseDSRShiftTimePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.shiftDetails = res.data
          this.totalDetails = res.data1
          this.cd.detectChanges()
  
  
        } else {
  
        }
      });
  }
  
getTotalMeterSalesAndTallyEntery(shiftTimeId: any,fuelDealerId: any) {
  const data = {     
    shiftTimeId: shiftTimeId,
    startDate: moment(this.startDate).format("YYYY-MM-DD"),
    endDate: moment(this.endDate).format("YYYY-MM-DD"),
    fuelDealerId:fuelDealerId,
  };
  this.post.getTotalMeterSalesAndTallyEnteryBYShiftTimePOST(data)
    .subscribe(res => {
      if (res.status == 'OK') {
        this.meterSalesSum = res.data[0].meterSaleAmount;
        this.tallySalesSum = res.data1[0].tallySaleAmount;
        this.meterSalesQuantitySum = res.data[0].meterSaleQuantity;
        this.cd.detectChanges()


      } else {

      }
    });
}

getDigitalTotalByDate(shiftTimeId: any,corporateId: any) {
  const data = {
    corporateId: corporateId,
    shiftTimeId: shiftTimeId,
    startDate: moment(this.startDate).format("YYYY-MM-DD"),
    endDate: moment(this.endDate).format("YYYY-MM-DD"),
  };
  this.post.getDigitalTotalByShiftTimePOST(data)
    .subscribe(res => {
      if (res.status == 'OK') {
        this.digitalDetails = res.data;
        this.digitalTotalSales = res.data1[0].digitalEntry
        this.cd.detectChanges()
      } else {

      }
    });
}

}
