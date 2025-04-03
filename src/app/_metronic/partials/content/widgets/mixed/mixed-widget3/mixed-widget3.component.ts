import { ChangeDetectorRef, Component, ElementRef, Injectable, Input, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild("myinput") myInputField: ElementRef;
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
  count: any = 1;
  isVehSelectLube: boolean = false;
  combineManualNumber: string;
  indexFuelAdvance: number;
  todayDate = moment(new Date()).format("DD-MM-YYYY");
  closeRequestDate = moment(new Date()).format("DD-MM-YYYY");
  fuelDealerStaffId: any;
  isBalance1: boolean = false;
  isCRQUANTITY: boolean = false;
  isQUANTITY: boolean = false;
  autoManualNumber: any;
  isTable: boolean;
  isTable2: boolean;
  isTable1: boolean;
  isVehicleViewed: boolean;

  constructor(
    private post: MixedService,
    private post1: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,) {
    const currentDate = new Date();
    const month = moment(new Date()).format("MM");
    const year = moment(new Date()).subtract(1, 'year').format("YYYY");
    const lastYear = moment(new Date()).subtract(2, 'year').format("YYYY");
    if(Number(month) > 3){
      config.minDate = { year: Number(year), month: 4, day: 1 };
      config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    } else {
      config.minDate = { year: Number(lastYear), month: 4, day: 1 };
      config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    }
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
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
    // this.addFormRequestAdvance();
    this.getFuelStaffIdByfuelDealerId(this.fuelDealerId);
    this.getfuelDealerIdByCorporateId(this.dealerCorporateId);
    this.cd.detectChanges()
  }
 
  getfuelDealerIdByCorporateId(dealerCorporateId: any) {
    let data = {
      corporateId: dealerCorporateId
    }
    this.post1.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.autoManualNumber = res.data[0].assignedAutoManualNumber;
          this.autoManualNumberAdvance = res.data[0].assignedAutoManualNumberAdvance;
          this.autoManualStatus = res.data[0].autoManualStatus;
          this.addFormRequestAdvance();
          this.getCorporateMappedListByDealerId(this.fuelDealerId)
          this.getFuelStaffIdByfuelDealerId(this.fuelDealerId);
        }
        else {
        }
      })
  }

  getDetailsByfuelDealerCustomerMapIdId(id: any) {
    if (id.target.value) {
      this.fuelDealerCustomerMapId = id.target.value;
      this.getCorporateInfoByfuelDealerCustomerMapId(this.fuelDealerCustomerMapId);
      this.cd.detectChanges()
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
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()
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
      this.cd.detectChanges()
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
  this.modalRef.close()
}

getFuelStaffIdByfuelDealerId(fuelDealerId: any) {
  let data = {
    fuelDealerId: fuelDealerId,
  }
  this.post.getFuelStaffIdByfuelDealerIdPOST(data)
    .subscribe(res => {
      if (res) {
        this.fuelDealerStaffId = res.data[0].fuelDealerStaffId;
      }
      else {

      }
    })

}

submitByDealerForAdvance() {
  if (this.acceesGroup == 12 || this.acceesGroup == 19) {
    this.spinner.show()

    if (this.requestTransporterAdvance.value.estimatedRefuelDate) {
      if (this.requestTransporterAdvance.value.advanceName) {

        if (this.fuelDealerCorpMapIdNew) {
          if (this.requestTransporterAdvance.value.advanceManualCrAmount) {
            if (this.requestTransporterAdvance.value.advanceAmount) {

              if (this.CreditRequestDataAdvance.some((advanceManualCrAmount: { advanceManualCrAmount: any }) => !advanceManualCrAmount.advanceManualCrAmount || String(advanceManualCrAmount.advanceManualCrAmount).trim() === '')) {
                alert("Please enter Bill / Ref Number.");
                this.spinner.hide();
                return;
              }
              
              if (this.CreditRequestDataAdvance.some((advanceAmount: { advanceAmount: any }) => !advanceAmount.advanceAmount || String(advanceAmount.advanceAmount).trim() === '')) {
                alert("Please enter Amount .");
                this.spinner.hide();
                return;
              }

              let data = {
                advanceAllData:this.CreditRequestDataAdvance,
                advanceFuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                estimatedRefuelDate: moment(this.requestTransporterAdvance.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                fuelDealerId: this.fuelDealerSQLId,
                transDateTime: moment(this.closeRequestDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                advanceCreatedAt: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                personId: this.personId,
                fuelDealerStaffId: this.fuelDealerStaffId,
                autoManualStatus:this.autoManualStatus
              }
              this.post.addCreditAdvanceReqByDealerForAllPOST(data)
                .subscribe(res => {
                  if (res.status == "OK") {
                    alert("Credit Added Sccessfully!");
                    this.isBalance1 = false;
                    this.closeModal()
                    this.spinner.hide();
                    this.myInputField.nativeElement.focus();
                    this.checkDates(this.fuelDealerCorpMapIdNew,moment(this.requestTransporterAdvance.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                    this.isCRQUANTITY = false;
                    this.isQUANTITY = false;
                    this.CreditRequestDataAdvance = [];
                    this.countAdvance = 1;
                    if(this.autoManualStatus == 'TRUE'){

                      this.updateAssignedAutoManualNumber('ADVANCE',res.count)
                      }else{
                        this.addFormRequestAdvance()
                      }
                    this.requestTransporterAdvance.controls["advanceManualCrAmount"].setValue("");
                    this.requestTransporterAdvance.controls["advanceName"].setValue("");
                    this.requestTransporterAdvance.controls["advanceMobile"].setValue("");
                    this.requestTransporterAdvance.controls["advanceAmount"].setValue("");
                  } else {
                    alert("Error to Created Request!")
                    this.isBalance1 = false;
                    this.spinner.hide();
                  }
                });
            } else {
              alert("Please Enter Amount!")
              this.spinner.hide();
            }

          } else {
            alert("Please Enter Bill / Ref Number!")
            this.spinner.hide();
          }
        }
        else {
          alert("Please Select customer!")
          this.spinner.hide();
        }

      } else {
        alert("Please Enter Details!")
        this.spinner.hide();
      }

    }
    else {
      alert("Please Select Date!")
      this.spinner.hide();
    }
  } else {
    if (this.acceesGroup == 14 || this.acceesGroup == 21) {
      this.spinner.show()

      if (this.requestTransporterAdvance.value.estimatedRefuelDate) {
        if (this.requestTransporterAdvance.value.advanceName) {

          if (this.fuelDealerCorpMapIdNew) {
            if (this.requestTransporterAdvance.value.advanceManualCrAmount) {
              if (this.requestTransporterAdvance.value.advanceAmount) {
                let data = {
                  advanceAllData: this.CreditRequestDataAdvance,
                  advanceFuelDealerCustomerMapId: this.fuelDealerCorpMapIdNew,
                  estimatedRefuelDate: moment(this.requestTransporterAdvance.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                  fuelDealerId: this.fuelDealerSQLId,
                  transDateTime: moment(this.closeRequestDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                  advanceCreatedAt: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
                  personId: this.personId,
                  managerVPPersonId: this.managerVPPersonId,
                  managerPersonId: this.managerPersonId,
                  managerName:this.managerName,
                  fuelDealerStaffId: this.fuelDealerStaffId,
                  autoManualStatus:this.autoManualStatus
                }
                this.post.addCreditAdvanceReqByDealerForAllPOST(data)
                  .subscribe(res => {
                    if (res.status == "OK") {
                      alert("Credit Added Sccessfully!");
                      this.isBalance1 = false;
                      this.closeModal()
                      this.spinner.hide();
                      this.myInputField.nativeElement.focus();
                      this.checkDates(this.fuelDealerCorpMapIdNew,moment(this.requestTransporterAdvance.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'))
                      this.isCRQUANTITY = false;
                      this.isQUANTITY = false;
                      this.CreditRequestDataAdvance = [];
                      this.countAdvance = 1;
                      if(this.autoManualStatus == 'TRUE'){

                        this.updateAssignedAutoManualNumber('ADVANCE',res.count)
                        }else{
                          this.addFormRequestAdvance()
                        }
                      this.requestTransporterAdvance.controls["advanceManualCrAmount"].setValue("");
                      this.requestTransporterAdvance.controls["advanceName"].setValue("");
                      this.requestTransporterAdvance.controls["advanceMobile"].setValue("");
                      this.requestTransporterAdvance.controls["advanceAmount"].setValue("");
                    } else {
                      alert("Error to Created Request!")
                      this.isBalance1 = false;
                      this.spinner.hide();
                    }
                  });
              } else {
                alert("Please Enter Amount!")
                this.spinner.hide();
              }

            } else {
              alert("Please Enter Bill / Ref Number!")
              this.spinner.hide();
            }
          }
          else {
            alert("Please Select customer!")
            this.spinner.hide();
          }

        } else {
          alert("Please Enter Details!")
          this.spinner.hide();
        }

      }
      else {
        alert("Please Select Date!")
        this.spinner.hide();
      }
    } else {

    }

  }

}

updateAssignedAutoManualNumber(status: string,count: any){
   if (status =="ADVANCE") {
    let data = {
      fuelDealerId:this.fuelDealerId,
      assignedAutoManualNumber:Number(this.autoManualNumberAdvance) + Number(count),
      status:status
    }
    this.post.updateAssignedAutoManualNumberPOST(data)
    .subscribe(res=>{
    // this.getfuelDealerIdByCorporateIdForCalling(status)
  
    })
    
  }
  else {
    
  }
  
    }


checkDates(mapId: any,date: any){ 
  if(this.islastCRDate = true){       
 this.spinner.show();
  var g1 = new Date(date);
 var g2 = new Date(this.lastCRDate);
 if (g1.getTime() >= g2.getTime()){
     const oneDay = 24 * 60 * 60 * 1000
     const diffDays = Math.round(Math.abs((g1.getTime() - g2.getTime()) / oneDay))
     this.spinner.hide();
     this.fuelDealerCorpMapIdNew = ''
     this.isSelected1 = false
     this.requestTransporter1.controls["selectedCorp"].setValue('');
     this.isTable = false
     this.isTable1 = false
     this.isTable2 = false
     this.lastCRDate = ''
     this.isVehicleViewed = false
   }
 else {        
     let data={
       mapId:mapId,
       date:date
     }
     this.post.updateLastCRDateByMapIdPOST(data)
     .subscribe(res => {
         if (res.status == 'OK') {
           this.spinner.hide();
           this.updateDateByMapId(mapId)
           this.isSelected1 = false
           this.requestTransporter1.controls["selectedCorp"].setValue('');
           this.isTable = false
           this.isTable1 = false
           this.isTable2 = false
           this.lastCRDate = ''
           this.isVehicleViewed = false
         } else {
           this.spinner.hide();
           this.updateDateByMapId(mapId)
           this.isSelected1 = false
           this.requestTransporter1.controls["selectedCorp"].setValue('');
           this.isTable = false
           this.isTable1 = false
           this.isTable2 = false
           this.lastCRDate = ''
           this.isVehicleViewed = false
         }
       });
  } 
 }else{
   this.spinner.show();
   let data={
     mapId:mapId,
     date:date
   }
   this.post.updateLastCRDateByMapIdPOST(data)
   .subscribe(res => {
       if (res.status == 'OK') {
         this.updateDateByMapId(mapId)
         this.spinner.hide();           
           this.isSelected1 = false
           this.requestTransporter1.controls["selectedCorp"].setValue('');
           this.isTable = false
           this.isTable1 = false
           this.isTable2 = false
           this.lastCRDate = ''
           this.isVehicleViewed = false
       } else {
         this.spinner.hide();
         this.updateDateByMapId(mapId)
           this.isSelected1 = false
           this.requestTransporter1.controls["selectedCorp"].setValue('');
           this.isTable = false
           this.isTable1 = false
           this.isTable2 = false
           this.lastCRDate = ''
           this.isVehicleViewed = false
       }
     });
 }

}


updateDateByMapId(fuelDealerCustomMapId: any){
  let data1 = {
    mapId:fuelDealerCustomMapId
  }
  this.post.updateLastCRDateMapIdWisePOST(data1)
  .subscribe((res) => {
    if (res.status == 'OK') {
      this.fuelDealerCorpMapIdNew = ''
    }else{
      this.fuelDealerCorpMapIdNew = ''
    }
  })
}

closeModal() {
  this.personPhone1 = '';
  this.personName = '';
  this.dealerLocation = '';
  this.dealerName = '';
  this.requestTransporter1.controls["selectedCorp"].setValue('');
  this.CreditRequestDataAdvance.length = 0;

  this.countAdvance = 1;
  this.isSelected1 = false;
  this.addFormRequestAdvance();
  this.isTable = false;
  this.isTable1 = false;
  this.isTable2 = false;
  this.CreditRequestAdvance.advanceAmount = '';
  this.CreditRequestAdvance.advanceManualCrAmount = '';
  this.CreditRequestAdvance.advanceMobile = '';
  this.CreditRequestAdvance.advanceName = '';
  this.isVehicleViewed = false

}

preventSymbols(event: KeyboardEvent) {
  if (event.key === '+' || event.key === '-') {
    event.preventDefault();
  }
}

}
