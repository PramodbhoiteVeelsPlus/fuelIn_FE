import { Component, OnInit, Input, Injectable, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { LayoutService } from '../../../../../layout';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TilesService } from '../../tiles/tiles.services';
import { TransTablesService } from '../trans-tables.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { ExcelService } from 'src/app/pages/excel.service';

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
  selector: 'app-trans-tables-widget11',
  templateUrl: './trans-tables-widget11.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TransTablesWidget11Component implements OnInit {

  dealerForm = new FormGroup({
    logo: new FormControl(''),
  });

  fuelDealerId: any;
  accessGroup: any;
  dropPersonId: any;
  visibleData: any = [];
  isVisible: boolean;
  isFuelStatement: any;
  isCreditPayment: any;
  isOutstanding: any;
  staffPersonId: any;
  fuelStaff: any;
  fuelAddCustomer: any;
  fuelDealerStaffAccessId: any;


  constructor(private cd: ChangeDetectorRef,
    private post: TransTablesService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private modalService: NgbModal,
    config: NgbDatepickerConfig,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';

  }


  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    // var managerData = JSON.parse(localStorage.getItem('managerData') || '');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.accessGroup = element.accessGroupId
    this.getAccessByDealerId(this.fuelDealerId)
    this.cd.detectChanges()
  }

  
getAccessByDealerId(fuelDealerId: any){
  let data = {
    fuelDealerId:fuelDealerId
  }
  this.post.getDealerStaffAccessByDealerIdPOST(data)
  .subscribe(res=>{
    if (res.status=="OK") {
      this.visibleData = res.data
      this.cd.detectChanges()
    } else {
      this.visibleData = []
      this.cd.detectChanges()
    }
  })
  
  }

  
getManagerInfo(event: any){
  let data={
    personId:this.dropPersonId
  }
  this.post.getAccessByPersonIdPOST(data)
  .subscribe(res=>{
    if(res.data.length){
      this.isVisible = true
      this.isFuelStatement = res.data[0].fuelStatement
      this.isCreditPayment = res.data[0].creditPayment
      this.isOutstanding = res.data[0].outstanding
      this.staffPersonId = res.data[0].staffPersonId
      this.fuelStaff = res.data[0].fuelStaff
      this.fuelAddCustomer = res.data[0].fuelAddCustomer
      this.fuelDealerStaffAccessId = res.data[0].fuelDealerStaffAccessId
      this.cd.detectChanges()
    }else{
      this.isVisible = false;
      this.cd.detectChanges()
    }
  })
  }

  updateOutstand(status: any) {
    let outstandStatus;
      if (this.isOutstanding == 'FALSE') {
      //  if (status.target.checked) {
          outstandStatus = "TRUE";
    this.updateAccessByDealerId(this.fuelDealerId,this.staffPersonId,this.isCreditPayment,outstandStatus,this.isFuelStatement,this.fuelStaff,this.fuelAddCustomer)
    //this.modalRefCancel.close('close');
    
       // }
      } else {
        outstandStatus = "FALSE";
        this.updateAccessByDealerId(this.fuelDealerId,this.staffPersonId,this.isCreditPayment,outstandStatus,this.isFuelStatement,this.fuelStaff,this.fuelAddCustomer)
        //this.modalRefCancel.close('close');
    
      }
    
    }
    
updateAccessByDealerId(fuelDealerId: any,staffPersonId: any,creditPayment: any,outstanding: string,fuelStatement: any,fuelStaff: any,fuelAddCustomer: any){
  let data = {
    fuelDealerId:fuelDealerId,
    fuelDealerStaffAccessId:this.fuelDealerStaffAccessId,
    staffPersonId:staffPersonId,
    creditPayment:creditPayment,
    outstanding:outstanding,
    fuelStatement:fuelStatement,
    fuelStaff:fuelStaff,
    fuelAddCustomer:fuelAddCustomer
  }
  this.post.updateDealerStaffAccessPOST(data)
  .subscribe(res=>{
    if (res.status=="OK") {
     // this.visibleData = res.data
     alert(res.msg)
      this.getManagerInfo(this.fuelDealerId)
    }
  
  })
  
  }

  updatePayment(status: any) {
    // console.log('111111');
  
    let outstandStatus;
      if (this.isCreditPayment == 'FALSE') {
      //  if (status.target.checked) {
          outstandStatus = "TRUE";
    this.updateAccessByDealerId(this.fuelDealerId,this.staffPersonId,outstandStatus,this.isOutstanding,this.isFuelStatement,this.fuelStaff,this.fuelAddCustomer)
    //this.modalRefCancel.close('close');
  
       // }
      } else {
        outstandStatus = "FALSE";
        this.updateAccessByDealerId(this.fuelDealerId,this.staffPersonId,outstandStatus,this.isOutstanding,this.isFuelStatement,this.fuelStaff,this.fuelAddCustomer)
        //this.modalRefCancel.close('close');
  
      }
    
    }
    
  updateStatement(status: any) {
    let outstandStatus;
      if (this.isFuelStatement == 'FALSE') {
      //  if (status.target.checked) {
          outstandStatus = "TRUE";
    this.updateAccessByDealerId(this.fuelDealerId,this.staffPersonId,this.isCreditPayment,this.isOutstanding,outstandStatus,this.fuelStaff,this.fuelAddCustomer)
    //this.modalRefCancel.close('close');

      //  }
      } else {
        outstandStatus = "FALSE";
        this.updateAccessByDealerId(this.fuelDealerId,this.staffPersonId,this.isCreditPayment,this.isOutstanding,outstandStatus,this.fuelStaff,this.fuelAddCustomer)
        //this.modalRefCancel.close('close');

      }
    
    }
}

