import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { ListWidgetService } from '../../lists/listWidget.services';
import { ChartsService } from '../charts.services';
import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { SetNozzle } from './setNozzle.model';

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
  selector: 'app-charts-widget10',
  templateUrl: './charts-widget10.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ChartsWidget10Component implements OnInit {

  pumpInfra = new FormGroup({
    tankNo: new FormControl(''),
    duNo: new FormControl(''),
    fuelDealerId:new FormControl(''),
    nozNo:new FormControl(''),
    productType:new FormControl(''),
    dealerTankMap:new FormControl(''),
    productName:new FormControl(''),
    productCode:new FormControl(''),
    mapstatus:new FormControl(''),
    mapDate:new FormControl(''),
    mapBy:new FormControl(''),
    dealerTankPumpId:new FormControl(''),
    volume:new FormControl(''),
    dip:new FormControl(''),
    meterReading:new FormControl('')
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
  dealerAccess: boolean = false;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  setNozzle = new SetNozzle();
  viewsetupNozzles: boolean = true;
  countNozzle: any = 1;
  SetNozzelData: any = [];
  allTankDetails: any = [];
  fuelDealerVFId: any;
  pumpInfraDetails: any = [];
  pumpInfralength: any = [];
  productsData: any = [];
  productsList: any = [];
  allProductPriceList: any = [];
  tankData: any = [];
  tankList: any = [];

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
    this.fuelDealerVFId = dealerData.FuelVeelsId
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
    }
    this.addFormSetNozzel()
    this.getAllTankdetails()
    this.getPumpInfra()
    this.cd.detectChanges()
  }

  pageChangeEvent(event: number) {
    this.p = event;
    // this.getPurchaseDetailsTx();
  }
  
  setupNozzlesTable(){
    if(this.viewsetupNozzles == true){
      this.viewsetupNozzles = false;
    }else{
      this.viewsetupNozzles = true;
    }
  }
  
  addFormSetNozzel() {
    this.countNozzle = this.countNozzle + 1;
    if (this.countNozzle < 12) {
      this.setNozzle = new SetNozzle();
      this.SetNozzelData.push(this.setNozzle);
      // console.log(this.SetNozzel);
    }
    else {
      this.countNozzle = 11;
      alert("Please save 10 entries ")
    }
  
  }
  
  setNozzelForTankNo(i: number){
  
    let data = {
      fuelDealerId:this.fuelDealerId,
      tankNo:this.SetNozzelData[i].tank
    }
    this.post.getTankDetailByfuelDealerIdPOST(data)
    .subscribe(result=>{
      if(result.status == "OK" && result.data.length){
        this.SetNozzelData[i].product =  result.data[0].productName
        this.SetNozzelData[i].productId = result.data[0].fuelProductId
        this.SetNozzelData[i].tankVolume = result.data[0].tankVolume
        this.cd.detectChanges()
  
      }
    })
  }
  
  getAllTankdetails(){
    let data = {
    fuelDealerId:this.fuelDealerId,
    }
    this.post.getTankDetailPOST(data)
    .subscribe(result=>{
      if (result.status == "OK" && result.data.length) {
      this.allTankDetails = result
      this.cd.detectChanges()
    }
    })
  }
  
  validateSetupNozzlesForm(i: any) {
    if (this.SetNozzelData[i].tank && this.SetNozzelData[i].product && this.SetNozzelData[i].tankVolume && this.SetNozzelData[i].pump && this.SetNozzelData[i].nozzel) {
      this.addFormSetNozzel();
    } else {
      alert("Please enter valid details");
    }
  }
  
  removeSetNozzel(i: number) {
    this.SetNozzelData.splice(i, 1);
    this.countNozzle = this.countNozzle - 1;
    // console.log("COUNT:", this.countNozzel)
  }
  
  submitNozzelDetailForAll(){
    // console.log('this.setTankData',this.SetNozzelData);
    let mappedDate = new Date()
  this.spinner.show()
    let data = {
      fuelDealerId:this.fuelDealerId,
      mapstatus:"MAPPED",
      mapDate:mappedDate,
      mapBy:this.fuelDealerVFId,
      SetNozzelData:this.SetNozzelData,
      dealerTankMapCode:this.fuelDealerVFId
  
    }
    this.post.addPumpInfraForAllPOST(data)
    .subscribe(res=>{
      if(res.status == "OK"){
          alert("Data Submitted Successfully!")
          this.spinner.hide();
          this.getAllTankdetails();
          this.getPumpInfra();
          this.getTankByDealerId(this.fuelDealerId)
          this.getProductsByDealerId(this.fuelDealerId)
          this.SetNozzelData=[];
          this.countNozzle = 1;
          this.addFormSetNozzel()
      }
      else{
        alert(res.msg)
        this.spinner.hide();
      }
  });
  }

  
  getProductsByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId:fuelDealerId
    }
    this.post1.getFuelProductIdByDealerIdPOST(data).subscribe(res=>
      {
        if (res)
        {
          this.productsData = res;
          this.productsList = res.data;
          this.allProductPriceList = res.data;
        }
    })
  }
  getTankByDealerId(fuelDealerId: any) {
    let data = {
      fuelVendorId:fuelDealerId
    }
    this.post.getTankByDealerIdPOST(data).subscribe(res=>
      {
        if (res)
        {
          this.tankData = res;
          this.tankList = res.data;
  
        }
        else{
        }
    })
  }

  getPumpInfra() {
    let data = {
      fuelDealerId:this.fuelDealerId,
    }
    this.post.getPumpNozzelByDealerIdPOST(data)
    .subscribe(res=>{
      if(res){
          this.pumpInfraDetails = res;
          this.pumpInfralength = res.data;
          this.cd.detectChanges()
      }
  });
  }
  
  cancelNozzelDetailForAll(){
    this.SetNozzelData.length = 0;
    this.addFormSetNozzel()
  }
  
  setDuNo() {
    this.pumpInfra.controls["duNo"].setValue(this.setNozzle.pump)
  }
  
  setNozzel() {
    this.pumpInfra.controls["nozNo"].setValue(this.setNozzle.nozzel)
    if(this.setNozzle.nozzel && this.setNozzle.pump && this.setNozzle.tank){
      this.getAllNozzelInfradetails(this.setNozzle.nozzel,this.setNozzle.pump,this.setNozzle.tank)
    }else{
      alert("please enter all valid details!")
    }
  }
  
  getAllNozzelInfradetails(nozzel: any,pump: any,tank: any){
    let data = {
    fuelDealerId:this.fuelDealerId,
    nozzel:nozzel,
    pump:pump,
    tank:tank
    }
    this.post.getfuelinframappingDealerIdPOST(data)
    .subscribe(result=>{
      if (result.status == "OK" && result.data.length) {
        alert("nozzle and pump Already mapped!")
    }
    })
  }
}
