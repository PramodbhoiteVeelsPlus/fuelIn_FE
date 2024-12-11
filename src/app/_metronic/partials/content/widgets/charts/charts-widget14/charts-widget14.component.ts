import { ChangeDetectorRef, Component, EventEmitter, Injectable, Input, OnInit, Output } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { ListWidgetService } from '../../lists/listWidget.services';
import { ChartsService } from '../charts.services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment'; 
import {jsPDF}  from 'jspdf';
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
  selector: 'app-charts-widget14',
  templateUrl: './charts-widget14.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class ChartsWidget14Component implements OnInit {

  filterForm = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    purpose: new FormControl('', Validators.required)
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
  modalRef: any;
  closeResult: string;
  todayDate = new Date();
  fuelCashBillList: any = [];
  allCashBillData: any = [];
  lubeCashBillList: any = [];
  allLubeCashBillData: any = [];
  selected: string;
  status: string;
  headerName1: any;
  headerName3: string;
  GSTNumber: string;
  fuelCashBillDetails: any = [];
  lubeCashBillDetails: any = [];
  cgst: any;
  sgst: any;
  igst: any;
  taxAmount: any;
  cashBillDate1: string;
  cashBillNumber1: string;
  cashBillSystemNumber1: string;
  cashBillCustName1: string;
  cashBillCustMobile1: string;
  cashBillVehicleNumber1: string;
  cashBillProduct1: string;
  cashBillQuantity1: string;
  cashBillGST1: string;
  cashBillAmountWOGST1: string;
  cashBillGSTAmt1: string;
  cashBillSubGST1: string;
  cashBillAmount1: string;
  cashBillCreatedBy1: string;
  rowNumber: any;
  show: boolean = false;
  headerName2: any

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
    this.lubeCashBillList = JSON.parse(localStorage.getItem('lubeCashBillList') || '{}');
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.accessGroup = element.accessGroupId;
    // this.managerVPPersonId = element.veelsPlusId
    // this.managerPersonId = element.personId
    this.managerName = element.firstName + ' ' + element.lastName
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
      this.filterForm.controls["startDate"].setValue(moment(new Date()).subtract(15,'days').format("DD-MM-YYYY"))
      this.filterForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
      this.selected =  (moment(new Date()).subtract(15,'days').format("DD-MM-YYYY"))+ ' - ' + (moment(new Date()).format("DD-MM-YYYY"))
      // this.personName = element.firstName + ' ' + element.lastName
      if (element.accessGroupId == 12 || element.accessGroupId == 14) {
        this.dealerAccess = true
      }
      this.headerName1 = dealerData.companyName;
      this.headerName2 = dealerData.address1+', '+dealerData.address2+', '+dealerData.city;
      this.headerName3 = dealerData.state + '-' + dealerData.pin + '  ' + "GST: " + dealerData.GSTNumber;

    }
    if (!this.lubeCashBillList.length) {
      this.getCashBillDetails();
    } else {
      this.getCashBillDetails1();
    }
    this.cd.detectChanges()
  }


  pageChangeEvent(event: number) {
    this.p = event;
    this.view();
    this.getCashBillDetails()
  }

  view(){
    if(this.filterForm.value.startDate && this.filterForm.value.endDate){
      if(this.filterForm.value.purpose == 'CANCEL'){
        this.fuelCashBillList.length = 0
        let data = {
          fuelDealerId: this.fuelDealerId,
          purpose: this.filterForm.value.purpose,
          startDate: moment(this.filterForm.value.startDate,["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate,["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        this.post1.getCashBillPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            this.fuelCashBillList = res.data1;
            this.allCashBillData = res.data1;

            this.lubeCashBillList = res.data2;
            this.allLubeCashBillData = res.data2;
            this.cd.detectChanges()
          }
        })
      }else{
        this.fuelCashBillList.length = 0
        let data = { 
          fuelDealerId: this.fuelDealerId,
          startDate: moment(this.filterForm.value.startDate,["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate,["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        this.post1.getCashBillPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            this.fuelCashBillList = res.data1;
            this.allCashBillData = res.data1;

            this.lubeCashBillList = res.data2;
            this.allLubeCashBillData = res.data2;
            this.cd.detectChanges()
          }
        })
      }
    }else{
       this.getCashBillDetails()
    }
    
  }
  
  getCashBillDetails() {
    this.spinner.show()
    this.fuelCashBillList.length = 0
    let data = {
      fuelDealerId: this.fuelDealerId
    }
    this.post1.getCashBillPOST(data)
    .subscribe(res => {
      if (res.status == 'OK') {
        this.fuelCashBillList = res.data1;
        this.allCashBillData = res.data1;

        this.lubeCashBillList = res.data2;
        this.allLubeCashBillData = res.data2;
        localStorage.setItem('lubeCashBillList', JSON.stringify(this.lubeCashBillList));
        this.spinner.hide()
        this.cd.detectChanges()
      } else {
        this.lubeCashBillList = [];
        this.allLubeCashBillData = [];
        localStorage.setItem('lubeCashBillList', JSON.stringify([]));
        this.spinner.hide()
        this.cd.detectChanges()
      }
    })
    }
    
  getCashBillDetails1() {
    this.fuelCashBillList.length = 0
    let data = {
      fuelDealerId: this.fuelDealerId
    }
    this.post1.getCashBillPOST(data)
    .subscribe(res => {
      if (res.status == 'OK') {
        this.fuelCashBillList = res.data1;
        this.allCashBillData = res.data1;

        this.lubeCashBillList = res.data2;
        this.allLubeCashBillData = res.data2;
        localStorage.setItem('lubeCashBillList', JSON.stringify(this.lubeCashBillList));
        this.spinner.hide()
        this.cd.detectChanges()
      } else {
        this.lubeCashBillList = [];
        this.allLubeCashBillData = [];
        localStorage.setItem('lubeCashBillList', JSON.stringify([]));
        this.spinner.hide()
        this.cd.detectChanges()
      }
    })
    }

    clearLubeForm(){
      this.filterForm.reset();
        this.filterForm.controls["startDate"].setValue(moment(new Date()).subtract(15,'days').format("DD-MM-YYYY"))
        this.filterForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
        this.selected =  (moment(new Date()).subtract(15,'days').format("DD-MM-YYYY"))+ ' - ' + (moment(new Date()).format("DD-MM-YYYY"))
        this.view()
    
      }
  
  
      exportToPDFLube(){
  
        var cols = [["Date", "Bill Number", "Customer Name", "Customer Mobile", "Vehicle", "Product",  "Quantity", "Total Amount", "Created By", "Bill Status"]];
        var rows = [];
        for (var key in this.lubeCashBillList) {
          if(this.lubeCashBillList[key].deleteStatus == 'TRUE'){
            this.status = 'CANCELLED'
          }else{
            this.status = 'ISSUED'
          }
          var temp = [
            moment(this.lubeCashBillList[key].cashBillDate).format("DD-MM-YYYY"),
            'VEELS'+this.lubeCashBillList[key].cashBillSystemNumber+' '+this.lubeCashBillList[key].cashBillNumber,
            this.lubeCashBillList[key].cashBillCustName,
            this.lubeCashBillList[key].cashBillCustMobile,
            this.lubeCashBillList[key].cashBillVehicleNumber,
            this.lubeCashBillList[key].cashBillProduct,  
            Number(this.lubeCashBillList[key].cashBillQuantity).toFixed(2)+' '+this.lubeCashBillList[key].cashBillUnit,
            Number(this.lubeCashBillList[key].cashBillAmount).toFixed(2),
            this.lubeCashBillList[key].cashBillCreatedBy, 
            this.status,
      
            ];
            rows.push(temp);
        }
      
        var doc = new jsPDF('l', 'pt');
      
        doc.setFontSize(12);  
        doc.text(this.headerName1,40, 25 ); 
        doc.setFontSize(8);  
        // doc.text(this.headerName2,40, 40 );   
        doc.text(this.headerName3,40, 55 );  
        if(this.filterForm.value.startDate && this.filterForm.value.endDate){
          doc.text("DATE : " + moment(this.filterForm.value.startDate,["DD-MM-YYYY"]).format("DD MMM YYYY")+' To '+moment(this.filterForm.value.endDate,["DD-MM-YYYY"]).format("DD MMM YYYY"),40, 70 );
        }
        doc.setFontSize(12);    
        doc.text("Fuel Cash Bill",350, 35 );  
      
         autoTable(doc, {
          columnStyles: {
            0: {cellWidth: 60},    
            1: {cellWidth: 70},    
            2: {cellWidth: 80},     
            3: {cellWidth: 70},     
            4: {cellWidth: 80},     
            5: {cellWidth: 70},     
            6: {cellWidth: 70},     
            7: {cellWidth: 70},     
            8: {cellWidth: 90}, 
            9: {cellWidth: 70},    
      
      
          },
          
          margin: {top: 80},
          head: cols,
          body: rows,
          theme: 'grid',
          didDrawCell: (data) => { },
      });
        doc.save("LubeCashBill.pdf");
      
      }

      excelDownloadLube(){
  
        this.lubeCashBillDetails.length = 0    
        this.lubeCashBillList.map((res: { deleteStatus: string; cashBillSubGST: string; cashBillGSTAmt: any; cashBillDate: moment.MomentInput; cashBillSystemNumber: string; cashBillNumber: string; cashBillCustName: any; cashBillCustMobile: any; cashBillVehicleNumber: any; cashBillProduct: any; cashBillQuantity: any; cashBillUnit: string; cashBillGST: string; cashBillAmountWOGST: any; cashBillAmount: any; cashBillCreatedBy: any; }) => { 
      
          if(res.deleteStatus == 'TRUE'){
            this.status = 'CANCELLED'
          }else{
            this.status = 'ISSUED'
          }
    
          if(res.cashBillSubGST == 'CGST'){
            this.cgst = Number(res.cashBillGSTAmt) / 2
            this.sgst = Number(res.cashBillGSTAmt) / 2
            this.igst = '-'
            this.taxAmount = Number(res.cashBillGSTAmt) 
          }else{
            this.cgst = '-'
            this.sgst = '-'
            this.igst = Number(res.cashBillGSTAmt)
            this.taxAmount = Number(res.cashBillGSTAmt) 
          }
    
          let json = {
            Date: moment(res.cashBillDate).format("DD-MM-YYYY"),
            BillNumber: 'VEELS'+res.cashBillSystemNumber+ '  ' +res.cashBillNumber,
            CustomerName: res.cashBillCustName, 
            CustomerMobile: res.cashBillCustMobile,
            Vehicle: res.cashBillVehicleNumber,  
            Product: res.cashBillProduct, 
            Quantity: Number(res.cashBillQuantity)+' '+res.cashBillUnit,
            Tax: res.cashBillGST+' %',
            BasicAmount: Number(res.cashBillAmountWOGST),
            CGST: this.cgst,
            SGST: this.sgst,
            IGST: this.igst,
            TaxAmount: Number(this.taxAmount),
            TotalAmount: Number(res.cashBillAmount),
            CreatedBy: res.cashBillCreatedBy,
            BillStatus: this.status,
            
          }; 
          this.lubeCashBillDetails.push(json);
        });
      
        this.excelService.exportAsExcelFile(
          this.lubeCashBillDetails,
          "lubeCashBill"
        );
      
    }

deleteCashBill(id: any){
  this.spinner.show()
  let data = {
    cashBillId: id,
  }
  if(confirm("Are you sure to delete ? ")) {
    this.post1.deleteCashBillPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          alert("cash bill delete successfully..")
          this.view();
          this.spinner.hide()
        }else{
          this.spinner.hide()
        }
      })
    }
    else{
    this.spinner.hide()
     }

}

goToFuelBillStatement(cashBillId: any){
  this.post1.setRoutingWithType1("fuelBill",cashBillId)
  this.router.navigate(['/credit/cashBillInvoice']);
  }
  
  changeValue(i: any, cashBillDate: any, cashBillNumber: any, cashBillSystemNumber: any, cashBillCustName: any, cashBillCustMobile: any, cashBillVehicleNumber: any, cashBillProduct: any, cashBillQuantity: any, cashBillGST: any, cashBillAmountWOGST: any, cashBillGSTAmt: any, cashBillSubGST: any, cashBillAmount: any, cashBillCreatedBy: any) { 
            
    this.cashBillDate1 = '';
    this.cashBillNumber1 = '';
    this.cashBillSystemNumber1 = ''; 
    this.cashBillCustName1 = '';
    this.cashBillCustMobile1 = '';
    this.cashBillVehicleNumber1 = '';
    this.cashBillProduct1 = '';
    this.cashBillQuantity1 = '';
    this.cashBillGST1 = '';
    this.cashBillAmountWOGST1 = ''; 
    this.cashBillGSTAmt1 = ''; 
    this.cashBillSubGST1 = ''; 
    this.cashBillAmount1 = '';
    this.cashBillCreatedBy1 = '';


  
    if(i == this.rowNumber){
      this.rowNumber = ''  
      if(this.show == true){
        this.show = false; 
      }else{
        this.show = true;
        this.rowNumber = i   
        this.cashBillDate1 = cashBillDate
        this.cashBillNumber1 = cashBillNumber
        this.cashBillSystemNumber1 = cashBillSystemNumber
        this.cashBillCustName1 = cashBillCustName
        this.cashBillCustMobile1 = cashBillCustMobile
        this.cashBillVehicleNumber1 = cashBillVehicleNumber
        this.cashBillProduct1 = cashBillProduct
        this.cashBillQuantity1 = cashBillQuantity
        this.cashBillGST1 = cashBillGST
        this.cashBillAmountWOGST1 = cashBillAmountWOGST
        this.cashBillGSTAmt1 = cashBillGSTAmt
        this.cashBillSubGST1 = cashBillSubGST
        this.cashBillAmount1 = cashBillAmount
        this.cashBillCreatedBy1 = cashBillCreatedBy
        
      } 
    }else{
      this.rowNumber = i 
      this.show = true;           
      this.cashBillDate1 = cashBillDate
      this.cashBillNumber1 = cashBillNumber
      this.cashBillSystemNumber1 = cashBillSystemNumber
      this.cashBillCustName1 = cashBillCustName
      this.cashBillCustMobile1 = cashBillCustMobile
      this.cashBillVehicleNumber1 = cashBillVehicleNumber
      this.cashBillProduct1 = cashBillProduct
      this.cashBillQuantity1 = cashBillQuantity
      this.cashBillGST1 = cashBillGST
      this.cashBillAmountWOGST1 = cashBillAmountWOGST
      this.cashBillGSTAmt1 = cashBillGSTAmt
      this.cashBillSubGST1 = cashBillSubGST
      this.cashBillAmount1 = cashBillAmount
      this.cashBillCreatedBy1 = cashBillCreatedBy
      
    }
}

dontDelete(id: any) {
  this.spinner.show()
  let data = {
    cashBillId: id,
  }
  if(confirm("Dear Customer, You added this Cash entry to Shift, if you delete or edit this entry it will affect the shift tally. Are you sure to delete ? ")) {
    this.post1.deleteCashBillPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          alert("cash bill delete successfully..")
          this.view();
          this.spinner.hide()
        }else{
          this.spinner.hide()
        }
      })
    }
    else{
    this.spinner.hide()
     }


}

goToLubeBillStatement(cashBillId: any){
  this.post1.setRoutingWithType1("lubeBill",cashBillId)
  this.router.navigate(['/credit/cashBillInvoice']);
  }
}
