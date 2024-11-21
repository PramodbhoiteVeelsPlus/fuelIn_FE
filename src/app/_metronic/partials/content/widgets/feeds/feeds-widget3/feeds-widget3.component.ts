import { ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbActiveModal, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FeedsService } from '../feeds.services';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
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
  selector: 'app-feeds-widget3',
  templateUrl: './feeds-widget3.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FeedsWidget3Component implements OnInit {
  dealerLoginVPId: any;
  accessGroupId: any;
  userId: any;
  personId: any;
  petrolPump: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  modalReference: any;
  closeResult: string;
  filterForm = new FormGroup({
    corporateId: new FormControl('', [Validators.required]),
    startDate: new FormControl(),
    endDate: new FormControl(),
  })
  
  // @ViewChild("excel") excel: TemplateRef<any>;
  @ViewChild("excel",{static:true}) excel:ElementRef;
  allCorporateList: any = [];
  excelData: any = [];
  allCreditReqExcelListDetails: any = [];
  vehicle: string;
  productName: any;
  actualCreditQuantity: any;
  createdBy: string;
  CustomerName: any;

  constructor(
    public activeModal: NgbActiveModal,
    private cd: ChangeDetectorRef,
    private post: FeedsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private modalService: NgbModal,
    private excelService: ExcelService,
  ) {
  }

  ngOnInit(): void {
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.petrolPump = dealerData.companyName;
    this.downloadExcel(this.excel)
    this.getFuelCreditRequestCorporateByfuelDealerId(this.fuelDealerId)
  }

 downloadExcel(excel: any){ 
 this.modalReference = this.modalService.open(excel, {size: 'lg'})
 this.modalReference.result.then((result: any) => {
   this.closeResult = `Closed with: ${result}`;
 }, (reason: any) => {
   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
 });
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

getFuelCreditRequestCorporateByfuelDealerId(fuelDealerId: any) {
  let data = {
    fuelDealerId: fuelDealerId
  }
  this.post.getFuelCreditRequestCorporateByfuelDealerIdPOST(data)
    .subscribe(res => {
      if (res.data.length) {
        this.allCorporateList = res.data;
        this.spinner.hide()
      } else {
        this.spinner.hide()
      }
    });
}

getExcel(){
  if(this.filterForm.value.corporateId){
    this.spinner.show()
    let data = {
    fuelDealerId: this.fuelDealerId,
    fuelCorporateId: this.filterForm.value.corporateId,
    startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
    endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
  }

  this.post.getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1POST(data)
  .subscribe(res => {
    if(res.status == "OK" && res.data.length){
      this.excelData = res.data;
      this.downloadExcelForDealer();
      this.spinner.hide();
    } else {
      alert("Data Not Found..!");
      this.excelData = [];
      this.spinner.hide();
    }
  })
  } else {
    this.spinner.show()
    let data = {
    fuelDealerId: this.fuelDealerId,
    startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
    endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
  }
  this.post.getFuelCreditRequestByfuelDealerIdPOST(data)
  .subscribe(res => {
    if(res.status == "OK" && res.data.length){
      this.excelData = res.data;
      this.downloadExcelForDealer();
      this.spinner.hide();
    } else {
      alert("Data Not Found..!");
      this.excelData = [];
      this.spinner.hide();
    }
  })
  }
  
}

  //downloadExcelForDealer()
  downloadExcelForDealer() {
    this.allCreditReqExcelListDetails.length = 0;
    this.excelData.map((res:any) => {      
      if(res.purpose == 'CREDIT'){
        if(res.vehicleNumber == 'undefined'){
          this.vehicle = ''
          this.productName = res.productName
          if(res.productCategory == 'CNG'){
            this.actualCreditQuantity = res.actualCreditQuantity
          }else{
            this.actualCreditQuantity = res.actualCreditQuantity
          }
        }else{
          this.vehicle = res.vehicleNumber
          this.productName = res.productName
          if(res.productCategory == 'CNG'){
            this.actualCreditQuantity = res.actualCreditQuantity
          }else{
            this.actualCreditQuantity = res.actualCreditQuantity
        }
        }        
      }else{
        if(res.purpose == 'LUBE'){
          if(res.vehicleNumber == 'undefined'){
            this.vehicle = ''
            this.productName = res.lubeName          
            this.actualCreditQuantity = res.actualCreditQuantity
          }else{
            this.vehicle = res.vehicleNumber
            this.productName = res.lubeName          
            this.actualCreditQuantity = res.actualCreditQuantity
          }        
        }else{
          if(res.purpose == 'LUBETAX'){
            if(res.vehicleNumber == 'undefined'){
              this.vehicle = ''
              this.productName = res.lubeName         
              this.actualCreditQuantity = res.actualCreditQuantity
            }else{
              this.vehicle = res.vehicleNumber
              this.productName = res.lubeName          
              this.actualCreditQuantity = res.actualCreditQuantity 
            }          
          }else{
            this.vehicle = res.advName+' '+res.advMobile
            this.productName = 'ADVANCE'         
            this.actualCreditQuantity = ''        
          }
        }
      }        
      if(res.mappingPreviousStatus =='TRUE' ){
        this.CustomerName = res.mappingCompanyName;                                         
      }else{
        this.CustomerName = res.companyName
      }
      var json = {
        date: moment(res.estimatedRefuelDate).format('DD-MM-YYYY'),
        CustomerName: this.CustomerName,
        KeyPersonName: res.hostName,
        customerPhone: res.hostPhone,
        Ref_Bill_No: res.manualCrNumber,
        vehicleNo:this.vehicle,
        product: this.productName,
        rate: res.productRate,
        creditAmount: Number(res.creditAmount).toFixed(2),
        creditQuantity: this.actualCreditQuantity,
        tx_Type: res.purpose,
        basic_Amt: res.fuelcreditBeforeTax,
        tax: res.fuelcreditGST,
        tax_Amt: res.fuelcreditGSTAmount,
        tax_Details: res.fuelcreditTaxDetails,
        quantityInPieces: res.quantityInPieces,
      };
      this.allCreditReqExcelListDetails.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.allCreditReqExcelListDetails,
      "VeelsplusTxExcel"
    );
  }
}
