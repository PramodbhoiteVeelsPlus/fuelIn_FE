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
import { setTank } from './setTank.model';

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
  selector: 'app-charts-widget9',
  templateUrl: './charts-widget9.component.html',
})

export class ChartsWidget9Component implements OnInit {

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
  viewSetUpTank: boolean = true;
  countTank: any = 1;
  setTankData: any = [];
  setTank = new setTank();
  fuelTankDetail: any;
  dealerTankMapCode: any;
  tankVolume: any;
  allProduct: any = [];
  allTankDetails: any = [];
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
    this.allTankDetails = JSON.parse(localStorage.getItem('allTankDetails') || '{}');
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
    }
    this.addFormSetTank()
    if (!this.allTankDetails.length) {
      this.getAllTankdetails()
    } else {
      this.getAllTankdetails1()
    }
    this.getFuelProductforALL(this.brandName)
    this.cd.detectChanges()
  }

  pageChangeEvent(event: number) {
    this.p = event;
    // this.getPurchaseDetailsTx();
  }
  
  viewSetUpTankTable(){
    if(this.viewSetUpTank == true){
      this.viewSetUpTank = false;
    }else{
      this.viewSetUpTank = true;
    }
  }
  
  addFormSetTank() {
    this.countTank = this.countTank + 1;
    if (this.countTank < 12) {
      this.setTank = new setTank();
        this.setTankData.push(this.setTank);
     
    }
    else {
      this.countTank = 11;
      alert("Please save 10 entries")
    }
  
  }
  
  
  setTankNo(i:number) {
    this.pumpInfra.controls["tankNo"].setValue(this.setTank.tank)
    this.getTankDetailsByDealerId(i);
  
  }
  
  getTankDetailsByDealerId(i:any){
    let data = {
      fuelDealerId:this.fuelDealerId,
      tankNo:this.pumpInfra.value.tankNo
    }
    this.post.getTankDetailByfuelDealerIdPOST(data)
    .subscribe(result=>{
      if(result.status == "OK" && result.data.length){
        this.fuelTankDetail = result.data;
        this.dealerTankMapCode = result.data[0].dealerTankMapCode
        this.tankVolume = result.data[0].tankVolume;
        this.pumpInfra.controls["productCode"].setValue(result.data[0].fuelProductId);
        alert("tank already setup.please check again!")
       this.setTankData[i].tank =""
      }
    })
  }
  
  setvolume() {
    this.pumpInfra.controls["volume"].setValue(this.setTank.volume)
  }
  
  setproductName() {
    this.pumpInfra.controls["productName"].setValue(this.setTank.product)
  }
  
  getFuelProductforALL(brandName: any){
    let data = {
  brandName:brandName
    }
    this.post.getFuelProductPOST(data)
    .subscribe(result => {
      this.allProduct = result
    })
  }
  

  validateSetupTankForm(i: any) {
    if (this.setTankData[i].tank && this.setTankData[i].volume && this.setTankData[i].product) {
      this.addFormSetTank();
    } else {
      alert("Please enter valid details");
    }
  }

  removeSetTank(i: number) {
    this.setTankData.splice(i, 1);
    this.countTank = this.countTank - 1;
    // console.log("COUNT:", this.countTank)
  }
  
  submitTankDetailForAll(){
    // console.log('this.setTankData',this.setTankData);
    
  this.spinner.show()
    let data = {
       fuelDealerId:this.fuelDealerId,
       tankDetailsInfo: this.setTankData,
      tankMapStatus:"MAPPED",
      mapBy:this.dealerLoginId,
      dealerTankMapCode:this.fuelDealerId
      
  
    }
    this.post.addFuelTankDetailInBulkPOST(data)
    .subscribe(res=>{
      if(res.status == "OK"){
          alert("Data Submitted Successfully!")
          this.spinner.hide();
          this.getAllTankdetails();
          this.getPumpInfra();
          this.getTankByDealerId(this.fuelDealerId)
          this.getProductsByDealerId(this.fuelDealerId)
          this.setTankData = []
          this.countTank = 1;
          this.addFormSetTank()
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
      }
  });
  }

  getAllTankdetails(){
    this.spinner.show()
    let data = {
    fuelDealerId:this.fuelDealerId,
    }
    this.post.getTankDetailPOST(data)
    .subscribe(result=>{
      if (result.status == "OK" && result.data.length) {
      this.allTankDetails = result
      localStorage.setItem('allTankDetails', JSON.stringify(this.allTankDetails));
      this.spinner.hide()
      this.cd.detectChanges()
    } else {
      localStorage.setItem('allTankDetails', JSON.stringify([]));
      this.spinner.hide()
      this.cd.detectChanges()
    }
    })
  }
  
  getAllTankdetails1(){
    let data = {
    fuelDealerId:this.fuelDealerId,
    }
    this.post.getTankDetailPOST(data)
    .subscribe(result=>{
      if (result.status == "OK" && result.data.length) {
      this.allTankDetails = result
      localStorage.setItem('allTankDetails', JSON.stringify(this.allTankDetails));
      this.spinner.hide()
      this.cd.detectChanges()
    } else {
      localStorage.setItem('allTankDetails', JSON.stringify([]));
      this.spinner.hide()
      this.cd.detectChanges()
    }
    })
  }

  cancelTankDetailForAll(){
    this.setTankData.length = 0
    this.addFormSetTank()
    }
}
