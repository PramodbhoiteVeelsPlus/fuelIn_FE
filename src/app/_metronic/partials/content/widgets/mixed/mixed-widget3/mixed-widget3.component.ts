import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../../stats/stats.services';
import { MixedService } from '../mixed.services';
import { CreditRequestAdvance } from 'src/app/pages/dealer/credit/creditRequestAdvance.modal';
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
  selector: 'app-mixed-widget3',
  templateUrl: './mixed-widget3.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class MixedWidget3Component implements OnInit {
  requestTransporterAdvance = new FormGroup({
    advanceManualCrAmount: new FormControl(),
    advanceName: new FormControl(),
    advanceMobile: new FormControl(),
    advanceAmount: new FormControl(),
    advanceFuelDealerCustomerMapId: new FormControl(),
    advanceFuelDealerId: new FormControl(),
    priceDate: new FormControl(),
    estimatedRefuelDate: new FormControl(),
    productPrice:new FormControl(),
    productName:new FormControl(),
  });

  requestTransporter1 = new FormGroup({
    dealerName: new FormControl(),
    dealerLocation: new FormControl(),
    personName: new FormControl(),
    personPhone1: new FormControl(),
    selectedCorp: new FormControl('', [Validators.required]),
  });
  fuelDealerCustomerMapId: any;
  fuelDealerId: any;
  dealerCorporateId: any;
  dealerLoginVPId: any;
  acceesGroup: any;
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: string;
  dealerAccess: boolean = false;
  liteAccess: boolean = false;
  isSelected1: boolean = false;
  mappingPreviousStatus: any;
  personId: any;
  dealerName: any;
  personName: string;
  gstNumber: any;
  dealerLocation: string;
  lastCRDate: any;
  islastCRDate: boolean = false;
  fuelDealerSQLId: any;
  PANno: any;
  smsMappingStatus: any;
  emailMappingStatus: any;
  updateCorporateId: any;
  personPhone1: any;
  fuelDealerCorpMapIdNew: any;
  rangeFrom: any = 0;
  rangeTo: any = 0;
  corporateList: any = [];
  viewCorpFlag: any = [];
  isAlert: boolean = false;
  calOutstanding: number;
  modalRef: any;
  closeResult: string;
  autoManualStatus: string = 'FALSE';
  countAdvance: any = 1;
  CreditRequestAdvance = new CreditRequestAdvance()
  CreditRequestDataAdvance: any = [];
  autoManualNumberAdvance: any;
  count: number;
  isVehSelectLube: boolean = false;
  combineManualNumber: string;
  indexFuelAdvance: number;
  todayDate = moment(new Date()).format("DD-MM-YYYY");

  constructor(
    private post: MixedService,
    private post1: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.acceesGroup = element.accessGroupId;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.managerName = element.firstName + ' ' + element.lastName
    if (element.accessGroupId == 12 || element.accessGroupId == 14 || element.accessGroupId == 19 || element.accessGroupId == 21) {
      this.dealerAccess = true
      if (element.accessGroupId == 19 || element.accessGroupId == 21) {
        this.liteAccess = true
      }
    }

    this.requestTransporterAdvance.controls["estimatedRefuelDate"].setValue(this.todayDate);
    this.getCorporateMappedListByDealerId(this.fuelDealerId);
    this.addFormRequestAdvance();
    this.cd.detectChanges()
  }
  
  getDetailsByfuelDealerCustomerMapIdId(id: any) {
    if (id.target.value) {
      this.fuelDealerCustomerMapId = id.target.value;
      this.getCorporateInfoByfuelDealerCustomerMapId(this.fuelDealerCustomerMapId);
    }
    else {
      alert("Please select customer")
    }
  }
  
  getCorporateInfoByfuelDealerCustomerMapId(customerName: any) {
    let data = {
      fuelDealerId: this.fuelDealerId,
      customerName: customerName,
    }
    this.post1.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.isSelected1 = true;
          this.mappingPreviousStatus = res.data[0].mappingPreviousStatus;
          if(res.data[0].mappingPreviousStatus == "FALSE"){
            this.dealerName = res.data[0].companyName;
            this.personName = res.data[0].firstName + ' ' + res.data[0].lastName;
            this.gstNumber = res.data[0].GSTNumber;
            // this.checkGST()
          }
          else{
            this.dealerName = res.data[0].mappingCompanyName;
            this.personName = res.data[0].mappingCustomerName;
            this.gstNumber = res.data[0].mappingGST;
            // this.checkGST()
          }
          if (res.data[0].city == '' || res.data[0].city == 'undefined') {
            this.dealerLocation = ''
          } else {
            let cityarea = res.data[0].cityArea
            if(cityarea){
              this.dealerLocation = res.data[0].cityArea + ',' + res.data[0].city;
            }else{
              this.dealerLocation =  res.data[0].city;
 
            }
          }
          if(res.data[0].lastCRDate){
            this.lastCRDate = res.data[0].lastCRDate;
            this.islastCRDate = true;
          }else{
            this.islastCRDate = false;
          }
          
          this.fuelDealerSQLId = res.data[0].fuelDealerId;
          this.PANno = res.data[0].PANno;
          this.smsMappingStatus = res.data[0].isMappingSMS;
          this.emailMappingStatus = res.data[0].isMappingEmail;
          this.updateCorporateId = res.data[0].corporateId;

          this.personPhone1 = res.data[0].phone1;
          this.fuelDealerCorpMapIdNew = res.data[0].fuelDealerCustomerMapId;
          this.rangeFrom = res.data[0].manualNumberStart;
          this.rangeTo = res.data[0].manualNumberEnd;
          this.getFlagStatusByCorpId(res.data[0].corporateId)
          this.getOutstandingBuCustMapId(this.fuelDealerCorpMapIdNew);
          // this.getFuelVehicleByMapId(this.fuelDealerCorpMapIdNew);
          this.requestTransporter1.controls["dealerName"].setValue(res.data[0].companyName);
          this.requestTransporter1.controls["dealerLocation"].setValue(res.data[0].cityArea + ',' + res.data[0].city);
          this.requestTransporter1.controls["personName"].setValue(res.data[0].firstName + ' ' + res.data[0].lastName);
          this.requestTransporter1.controls["personPhone1"].setValue(res.data[0].phone1);
          this.personId = res.data[0].personId;
        } else {
        }
      });

  }
  
  getCorporateMappedListByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post1.getCorporatesAllMappedRequestByDealerPOST(data)
      .subscribe(res => {
        if (res) {
          this.corporateList = res.data;

        } else {
        }
      }
      );
  }

  getFlagStatusByCorpId(corporateIdForFlag: any) {
    let data={
      corporateIdForFlag:corporateIdForFlag
    }
    this.post1.getFlagStatusByCorpIdPOST(data)
    .subscribe(res => {
        if (res.data.length) {
          this.viewCorpFlag = res.data
          this.isAlert = true;
          // this.openModal();
          setTimeout(() => {
            this.isAlert = false;;
          }, 2000);
          setTimeout(() => {
            this.isAlert = true;;
          }, 4000);
          setTimeout(() => {
            this.isAlert = false;;
          }, 6000);
        } else {
        }
      });
  }
  
getOutstandingBuCustMapId(fuelDealerCustomerMapId: any){
  let data = {
    custMapId:fuelDealerCustomerMapId
  }
  this.post1.getOutstandingByCustMapIdPOST(data)
  .subscribe(res=>{
    if(res.status=="OK"){
      this.calOutstanding = Number(res.data[0].netOS)
    }
  })
}

viewFlag(viewFlagModel: any) {

  this.modalRef = this.modalService.open(viewFlagModel, {size : 'lg'});
  this.modalRef.result.then(
    (result: any) => {
      this.closeResult = `Closed with: ${result}`;
    },
    (reason: any) => {
      this.closeResult = `Dismissed`;
    }
  );
}

addFormRequestAdvance() {
  if(this.autoManualStatus == 'TRUE'){
    this.countAdvance = this.countAdvance + 1;
    this.CreditRequestAdvance = new CreditRequestAdvance();
    this.CreditRequestAdvance.advanceManualCrAmount = this.autoManualNumberAdvance
    this.CreditRequestDataAdvance.push(this.CreditRequestAdvance);
  }else{
  this.countAdvance = this.countAdvance + 1;
  if (this.countAdvance < 12) {
    this.CreditRequestAdvance = new CreditRequestAdvance();
    this.CreditRequestDataAdvance.push(this.CreditRequestAdvance);
  }
  else {
    this.count = 11;
    alert("Please save 10 credit entries, before adding more credit entries for a customer (max entries allowed per submit is currently capped at 5)")
  }
}
}

setAdvanceManualCr(i: string | number) {
  this.isVehSelectLube = true;
  if(Number(this.CreditRequestAdvance.advanceManualCrAmount) >= Number(this.rangeFrom) && Number(this.CreditRequestAdvance.advanceManualCrAmount) <= Number(this.rangeTo) ||  Number(this.rangeTo) == 0){

    if (Number(this.rangeTo) == 0) {
      this.requestTransporterAdvance.controls["advanceManualCrAmount"].setValue(this.CreditRequestAdvance.advanceManualCrAmount)
      this.checkManualNumRangeForNotAssign(this.CreditRequestAdvance.advanceManualCrAmount,i,'ADVANCE')

    }else{
      this.requestTransporterAdvance.controls["advanceManualCrAmount"].setValue(this.CreditRequestAdvance.advanceManualCrAmount)
      this.checkBillnameAdvance(this.CreditRequestAdvance.advanceManualCrAmount,i)
    }
     }else{
      if(this.autoManualStatus == 'TRUE'){
        this.requestTransporterAdvance.controls["advanceManualCrAmount"].setValue(this.CreditRequestAdvance.advanceManualCrAmount)
      }else{
       alert('manual number exceed limit!')
        this.CreditRequestDataAdvance[i].advanceManualCrAmount = '';
        this.requestTransporterAdvance.controls["advanceManualCrAmount"].setValue('')
      }
     }
}

checkManualNumRangeForNotAssign(manualNumber: any,i: string | number,purpose: string){
  let data={
    manualNumber:manualNumber,
    fuelDealerId:this.fuelDealerId,
  }
  this.post1.checkManualNumRangeForNotAssignPOST(data)
  .subscribe(res=>{
    if(res.data.length){
      alert('Manual number series already Assign To Other Customer')
      this.combineManualNumber= '';
      this.requestTransporterAdvance.controls["advanceManualCrAmount"].setValue('')

      if(this.CreditRequestDataAdvance.length){
        this.CreditRequestDataAdvance[i].advanceManualCrAmount = '';
      } 

    }else{
      if(purpose == 'ADVANCE'){
        this.checkBillnameAdvance(this.CreditRequestAdvance.advanceManualCrAmount,i)

      }
    }
  })
}

checkBillnameAdvance(manualNumber: any,i: string | number){
  let data={
    manualNumber:manualNumber,
    fuelDealerCustomerMapId:this.fuelDealerCorpMapIdNew,
    fuelDealerId:this.fuelDealerId,
    purpose:'AdvAmt'

  }
  this.post1.getManualNumberPOST(data)
  .subscribe(res=>{
    if(res.data.length){
      alert('Manual number already exist')
      this.CreditRequestDataAdvance[i].advanceManualCrAmount = '';
      this.requestTransporterAdvance.controls["advanceManualCrAmount"].setValue('')

    }
  })
}

setAdvanceName() {
  this.requestTransporterAdvance.controls["advanceName"].setValue(this.CreditRequestAdvance.advanceName)
  this.requestTransporterAdvance.controls["advanceManualCrAmount"].setValue(this.CreditRequestAdvance.advanceManualCrAmount)
}

setMobileAdvance() {
  this.requestTransporterAdvance.controls["advanceMobile"].setValue(this.CreditRequestAdvance.advanceMobile)
}

setAdvance() {
  this.requestTransporterAdvance.controls["advanceAmount"].setValue(this.CreditRequestAdvance.advanceAmount)
}

removeFormRequestAdvance(i: number,removeTable: any) {
  this.indexFuelAdvance = i;
  this.modalRef = this.modalService.open(removeTable, {size : 'md'});
  this.modalRef.result.then(
    (result: any) => {
      this.closeResult = `Closed with: ${result}`;
    },
    (reason: any) => {
      this.closeResult = `Dismissed`;
    }
  );
}

removeAdvanceIndex() {
  this.CreditRequestDataAdvance.splice(this.indexFuelAdvance, 1);
  this.countAdvance = this.countAdvance - 1;
}
}
