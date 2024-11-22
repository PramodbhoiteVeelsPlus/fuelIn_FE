import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { BaseTablesService } from '../base-tables.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

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
  selector: 'app-base-tables-widget12',
  templateUrl: './base-tables-widget12.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class BaseTablesWidget12Component implements OnInit {
  fuelDealerId: any;
  dealerData: any;
  dealerCorporateId: any;
  accessGroup: any;
  companyName: any;
  oilCompanyName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;

  searchDiscountForm = new FormGroup({
    selectCorporateMapId: new FormControl("", Validators.required),
    selectCorporate: new FormControl("", Validators.required),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    dueDate: new FormControl(""),
    type: new FormControl(""),
    selectPersonId: new FormControl("", Validators.required),
    setInvoiceType: new FormControl("all"),
    crDaysLimit: new FormControl("", Validators.required),
    startDateCrDays: new FormControl(""),
    endDateCrDays: new FormControl(""),
    setInvoiceTypeCrDays: new FormControl("all"),
  });
  differenceDays: number;
  endDateCrDays: string;
  customerDetails: any = [];
  crDaysDetails: any = [];
  active: number;
  p: number = 1;
  p1: number = 1;
  total: number = 0;

  constructor(
    private post: BaseTablesService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private router: Router,
    private route: ActivatedRoute,) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    this.dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.accessGroup = element.accessGroupId;
    this.companyName = this.dealerData.companyName
    this.oilCompanyName = this.dealerData.brandName
    this.state = this.dealerData.state
    this.pin = this.dealerData.pin
    this.city = this.dealerData.city
    this.phone1 = this.dealerData.hostPhone
    this.getDetailsCrDaysLimit(this.fuelDealerId)
    // this.getManagerMobileByfuelDealerId(this.fuelDealerId)
    this.cd.detectChanges()
  }


getDiffDayByCrDays(){
  if(this.searchDiscountForm.value.crDaysLimit){
    if(this.searchDiscountForm.value.endDateCrDays){
      this.searchDiscountForm.controls["endDateCrDays"].setValue("");
    }
    this.differenceDays = Number(this.searchDiscountForm.value.crDaysLimit) - 1
    if(this.searchDiscountForm.value.crDaysLimit && this.searchDiscountForm.value.startDateCrDays){
      var todayDate = moment(Date.now()).format("YYYY-MM-DD")
      if((moment(this.searchDiscountForm.value.startDateCrDays,["DD-MM-YYYY"]).add(this.differenceDays,"days").format("YYYY-MM-DD")) > todayDate){
        this.endDateCrDays = todayDate
        this.searchDiscountForm.controls['endDateCrDays'].setValue(moment(todayDate).format("DD-MM-YYYY")) 
        this.getDetailsByCrDaysLimit();
      }else{
        this.endDateCrDays = (moment(this.searchDiscountForm.value.startDateCrDays,["DD-MM-YYYY"]).add(this.differenceDays,"days").format("YYYY-MM-DD"))
        this.searchDiscountForm.controls['endDateCrDays'].setValue(moment(this.searchDiscountForm.value.startDateCrDays,["DD-MM-YYYY"]).add(this.differenceDays,"days").format("DD-MM-YYYY")) 
        this.getDetailsByCrDaysLimit();
      }

    }else{
      this.getDetailsByCrDaysLimit();
    } 
  }    
}

getDetailsByCrDaysLimit(){
  if(this.searchDiscountForm.value.crDaysLimit && this.searchDiscountForm.value.startDateCrDays 
    && this.searchDiscountForm.value.endDateCrDays && this.searchDiscountForm.value.setInvoiceTypeCrDays){
    this.spinner.show();
    this.customerDetails = [];
    let data ={
      fuelDealerId:this.fuelDealerId,
      crDays: this.searchDiscountForm.value.crDaysLimit,
      startDate:moment(this.searchDiscountForm.value.startDateCrDays,["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate:moment(this.searchDiscountForm.value.endDateCrDays,["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      invoiceType:this.searchDiscountForm.value.setInvoiceTypeCrDays
    }
    this.post.getCustomerDetailsByCrDaysLimitPOST(data).subscribe((res)=>{
      if(res.status=="OK"){
        this.customerDetails = res.data;
        this.spinner.hide();
      }else{
        alert(res.msg);
        this.spinner.hide();
      }
    })
  
  }else{
  
  }
  }
  
getDetailsCrDaysLimit(fuelDealerId: any){
  this.spinner.show();
  this.crDaysDetails = [];
  let data = {
    fuelDealerId:fuelDealerId,
  }
  this.post.getCrDaysLimitByDealerIdPOST(data).subscribe((res)=>{
  if(res.status=="OK"){
    this.crDaysDetails = res.data;
    this.spinner.hide();
  }else{
    alert(res.msg)
    this.spinner.hide();
  }
  })
  }
  
getEndDateBySTartDate(){
  if(this.searchDiscountForm.value.crDaysLimit && this.searchDiscountForm.value.startDateCrDays){
   
      var todayDate = moment(Date.now()).format("YYYY-MM-DD")
      if((moment(this.searchDiscountForm.value.startDateCrDays,["DD-MM-YYYY"]).add(this.differenceDays,"days").format("YYYY-MM-DD")) > todayDate){
        this.endDateCrDays = todayDate
        this.searchDiscountForm.controls['endDateCrDays'].setValue(moment(todayDate).format("DD-MM-YYYY")) 
        this.getDetailsByCrDaysLimit();
      }else{
      this.endDateCrDays = (moment(this.searchDiscountForm.value.startDateCrDays,["DD-MM-YYYY"]).add(this.differenceDays,"days").format("YYYY-MM-DD"))
      this.searchDiscountForm.controls['endDateCrDays'].setValue(moment(this.searchDiscountForm.value.startDateCrDays,["DD-MM-YYYY"]).add(this.differenceDays,"days").format("DD-MM-YYYY")) 
      this.getDetailsByCrDaysLimit();
    } 

  }  
}

checkEndDate(){
  if(this.searchDiscountForm.value.crDaysLimit && this.searchDiscountForm.value.startDateCrDays && this.searchDiscountForm.value.endDateCrDays){
    var endDateCreditDay = moment(this.searchDiscountForm.value.endDateCrDays,["DD-MM-YYYY"]).format("YYYY-MM-DD")
    if(endDateCreditDay <= moment(this.endDateCrDays,["YYYY-MM-DD"]).add(1,"day").format("YYYY-MM-DD") ){
      this.getDetailsByCrDaysLimit();
    }else{
      alert("Please Select EndDate upto "+ moment(this.endDateCrDays,["YYYY-MM-DD"]).add(1,"day").format("DD/MM/YYYY") +".. Date Range is as Credit Days from Start Date or Today's Date..")
      this.searchDiscountForm.controls['endDateCrDays'].setValue(moment(this.endDateCrDays,["YYYY-MM-DD"]).format("DD-MM-YYYY")) 
    }
  }else{
    alert("Please Select Credit Days and StartDate..")
  }
}

pageChangeEvent(event: number) {
  this.p = event;
  this.getDetailsByCrDaysLimit();
}

createInvoiceByCrDays(){
  this.spinner.show();
  let data = {
    fuelDealerId:this.fuelDealerId,
    crDays: Number(this.searchDiscountForm.value.crDaysLimit),
    startDate:moment(this.searchDiscountForm.value.startDateCrDays,["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    endDate:moment(this.searchDiscountForm.value.endDateCrDays,["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    invoiceType:this.searchDiscountForm.value.setInvoiceTypeCrDays,
    custData: this.customerDetails,
    // fromName: this.fromName,
    // fromState: this.fromState,
    // fromGSTNo: this.fromGSTNo,
    // fromAddress: this.fromAddress,
    // fuelInvoiceCreatedBy: this.loginVPId,
  }
    this.post.addSavedInvoiceByCrDaysPOST(data).subscribe((res) =>{
      if(res.status=="OK"){
        alert(res.msg);
        this.active = 2;
        this.searchDiscountForm.reset();
        // this.getFCInvoiceList();
        this.customerDetails = [];
        this.spinner.hide();
      }else{
        alert(res.msg);
        this.spinner.hide();
      }
    })
  }
  
}
