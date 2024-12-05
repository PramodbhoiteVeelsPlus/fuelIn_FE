import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { ListWidgetService } from '../../lists/listWidget.services';
import { ChartsService } from '../charts.services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-charts-widget11',
  templateUrl: './charts-widget11.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class ChartsWidget11Component implements OnInit {

  stampForm = new FormGroup({
    stampingReading: new FormControl(0),
    stampingDate: new FormControl('',Validators.required), 
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
  pumpInfraDetails: any =[];
  pumpInfralength: any =[];
  MappedInfraIdForMappStatus: any;
  pumpIdForMappStatus: any;
  nozzelIdForMappStatus: any;
  pumpModelRef: any;
  closeResult: string;
  MappedValue: string;
off: any;
  nzStampingDetails: any = [];
  fuelInfraMapId: string;
  duNz: string;
  modalRef: any;
  personName: string;
reasonForMappStatus: any;
  fuelDealerVFId: any;

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
      this.personName = element.firstName + ' ' + element.lastName
      if (element.accessGroupId == 12 || element.accessGroupId == 14) {
        this.dealerAccess = true
      }

    }
    this.getPumpInfra();
    this.cd.detectChanges()
  }


  pageChangeEvent(event: number) {
    this.p = event;
    this.getPumpInfra();
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
  
  maptank(event: any,setMapped: any,mapid: any,pump: any,nozzel: any){
    this.MappedInfraIdForMappStatus = mapid;
    this.pumpIdForMappStatus = pump;
    this.nozzelIdForMappStatus = nozzel;
    this.pumpModelRef = this.modalService.open(setMapped, { size: 'lg' })
    this.pumpModelRef.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    if(event.target.checked == true){
      this.MappedValue = "MAPPED"
    }else{
      this.MappedValue = "UNMAPPED"
    }
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  
  opensetAddStamp(addStamp: any,fuelInfraMapId: any,duNo: string,nozNo: string){
    this.fuelInfraMapId = ''
    this.duNz = ''
    this.fuelInfraMapId = fuelInfraMapId
    this.getStamping(fuelInfraMapId)
    this.duNz = duNo+' '+nozNo
    this.modalRef = this.modalService.open(addStamp);
    this.modalRef.result.then(
        (result: any) => {
            this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
            this.closeResult = `Dismissed`;
        }
    );
  }
  
  getStamping(fuelInfraMapId: any){ 
    this.nzStampingDetails = []
        this.spinner.show()
        let data = {
          fuelInfraMapId: fuelInfraMapId,
        }
        this.post.getStampingPOST(data)
        .subscribe(res => {
          if(res.status == "OK"){  
            this.nzStampingDetails = res.data;
            this.spinner.hide()
          }else{
            alert("Error to get..Please refresh and try again..!")
            this.spinner.hide()
          }
        })        
  }
  
  submitStamping(){
    if(this.fuelInfraMapId){
      if(this.stampForm.value.stampingDate){
        this.spinner.show()
        let data = {
          fuelDealerId: this.fuelDealerId,
          createdByName: this.personName,
          fuelInfraMapId: this.fuelInfraMapId,
          stampingDate: moment(this.stampForm.value.stampingDate,["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          stampingReading: this.stampForm.value.stampingReading,
        }
        this.post.addStampingPOST(data).subscribe(res => {
          if(res.status == "OK"){ 
            alert("Stamping Reading submited successfully..")
            this.getStamping(this.fuelInfraMapId);
            this.stampForm.controls["stampingReading"].setValue(0);
            this.stampForm.controls["stampingDate"].setValue('');
            this.spinner.hide()
          }else{
            alert("Error to Sumbit..Please refresh and try again..!")
            this.spinner.hide()
          }
        })
      }else{
        alert("Please select Date..")
      }
    }else{
      alert("Error to Submit.. Please refresh and try again..!")
    }
  }
  
  close(){
    this.modalRef.close('close');
    this.stampForm.controls["stampingReading"].setValue(0);
    this.stampForm.controls["stampingDate"].setValue('');
  }
  
  deleteStamping(i: number,nzStampingId: any,stampingReading: any,fuelInfraMapId: any){

    if(i == 1){
      if(this.nzStampingDetails.length == 1){
        this.spinner.show()
        let data = {
          nzStampingId:nzStampingId,
          fuelInfraMapId: fuelInfraMapId,
          stampingDate: "",
          stampingReading: stampingReading,
          stampingStatus: "FALSE"
        }
        if(confirm("Are you sure to delete ? ")) {
        this.post.deleteStampingPOST(data)
        .subscribe(res => {
          if(res.status == "OK"){  
            alert("Deleted Successfully..")
            this.getStamping(fuelInfraMapId); 
            this.spinner.hide()
          }else{
            alert("Error to get..Please refresh and try again..!")
            this.spinner.hide()
          }
        })}
        else{
     this.spinner.hide()
        } 
      }else{
        
        this.spinner.show()
        let data = {
          nzStampingId:nzStampingId,
          fuelInfraMapId: fuelInfraMapId,
          stampingDate: this.nzStampingDetails[i].nzStampingStampingDate,
          stampingReading: stampingReading,
          stampingStatus: "TRUE"
  
        }
        if(confirm("Are you sure to delete ? ")) {
        this.post.deleteStampingPOST(data)
        .subscribe(res => {
          if(res.status == "OK"){  
            alert("Deleted Successfully..")
            this.getStamping(fuelInfraMapId); 
            this.spinner.hide()
          }else{
            alert("Error to get..Please refresh and try again..!")
            this.spinner.hide()
          }
        })}
        else{
     this.spinner.hide()
        } 
      
      }
    }else{
      alert("You can delete only lastest entry..")
    }

  }
  
  submitMappedStatus(){
    this.spinner.show()
    // console.log('2222222');
    let data = {
       fuelInfraMapId:this.MappedInfraIdForMappStatus,
        duNo:this.pumpIdForMappStatus,
        nozNo:this.nozzelIdForMappStatus,
        mapstatus:this.MappedValue,
        unMapReason:this.reasonForMappStatus,
        unMapBy:this.fuelDealerVFId,
    }
    this.post.updateMapPumpInfraPOST(data)
    .subscribe(result => {
      if(result.status == "OK"){
        alert(result.msg);
        this.spinner.hide();
        this.reasonForMappStatus = "";
        this.pumpModelRef.close('close')
        this.getPumpInfra()
      }else{
        alert(result.msg);
        this.spinner.hide();
      }
    })
  }
}
