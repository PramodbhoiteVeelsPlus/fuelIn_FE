import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { ListWidgetService } from '../../lists/listWidget.services';
import { ChartsService } from '../charts.services';
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
  selector: 'app-charts-widget7',
  templateUrl: './charts-widget7.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ChartsWidget7Component implements OnInit {
  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    selectedCorp: new FormControl(""),
    monthDAY: new FormControl(""),
    date: new FormControl(""),
    manualNo: new FormControl(""),
  });
  showDropdown: boolean;
  productIdArrayTx: any = [];
  productIdArrayDay: any = [];
  productIdArrayMonth: any = [];
  phone1: any;
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
  ownerName: string;
  dealerAccess: boolean;
  headerName1: any;
  productsData: any = [];
  mappingAccData: any = [];
  fuelDealerCorpMapId: any;
  crPurchaseData: any = [];
  products = [
    { fuelProductsId: 25, productName: 'LUBRICANTS' },
    // Add more products as needed
  ];
  customerName: any;
  fuelDealerCorpMapIdNew: string;
  crPurchaseDataDay: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  
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

      this.headerName1 = this.companyName;
      // this.headerName2 = res.data[0].address1+', '+res.data[0].address2+', '+ this.city;
      // this.headerName3 = this.state+'-'+ this.pin+'  '+"GST: "+ this.GSTNumber;

    }
    this.filterForm.controls["date"].setValue(moment(new Date()).format("DD-MM-YYYY"))
    this.getMappingAccount(this.fuelDealerId)
    this.getProductsByDealerId(this.fuelDealerId)
    this.cd.detectChanges()
  }
  
toggleDropdown() {
  this.showDropdown = !this.showDropdown;
  this.productIdArrayTx = [];
  this.productIdArrayDay = [];
  this.productIdArrayMonth = [];
}

getProductsByDealerId(fuelDealerId: any) {
  this.productsData = [];
let data = {
  fuelDealerId: fuelDealerId
}
this.post1.getFuelProductIdByDealerIdPOST(data).subscribe(res => {
  if (res.status == "OK") {
    this.productsData = res.data;
    this.spinner.hide();
  }else{
    this.spinner.hide();
  }
})
}

getMappingAccount(fuelDealerId: any){
this.spinner.show();
this.mappingAccData = []
let data = {
  fuelDealerId: fuelDealerId
}
this.post.getMappingAccByFuelDealerIdPOST(data)
.subscribe(res => {
  if(res.status == "OK"){
    this.mappingAccData = res.data;
    // this.getPurchaseDetailsTx();
  } else{
    this.mappingAccData = [];
    this.spinner.hide();
  }
})
}

getPurchaseDetailsTx(){
  if(this.filterForm.value.startDate && this.filterForm.value.endDate) {
    if(this.productIdArrayTx.length){
      if(this.fuelDealerCorpMapId) {    
        this.crPurchaseData = [];
        let data = {
          dealerId: this.fuelDealerId,
          mapId: this.fuelDealerCorpMapId,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          productId:"Selected",
          productIdArray: this.productIdArrayTx,
        }
        this.post.getPurchaseDetailsTxPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {        
            this.crPurchaseData = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            this.crPurchaseData = [];
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
        }else{
          this.crPurchaseData = [];
        let data = {
          dealerId: this.fuelDealerId,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          productId:"Selected",
          productIdArray: this.productIdArrayTx,
        }
        this.post.getPurchaseDetailsTxPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {        
            this.crPurchaseData = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            this.crPurchaseData = [];
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
        }
    }else{
      if(this.fuelDealerCorpMapId) {    
        this.crPurchaseData = [];
        let data = {
          dealerId: this.fuelDealerId,
          mapId: this.fuelDealerCorpMapId,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          productId:"All",
        }
        this.post.getPurchaseDetailsTxPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {        
            this.crPurchaseData = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            this.crPurchaseData = [];
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
        }else{
          this.crPurchaseData = [];
        let data = {
          dealerId: this.fuelDealerId,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          productId:"All",
        }
        this.post.getPurchaseDetailsTxPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {        
            this.crPurchaseData = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            this.crPurchaseData = [];
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
        }
    }
  } else {
    alert("Please select Date Range..!")
  }
}


toggleSelectionDay(product: any) {
  const index = this.productIdArrayDay.findIndex((p: { fuelProductsId: any; }) => p.fuelProductsId === product.fuelProductsId);
  if (index === -1) {
    this.productIdArrayDay.push(product);
    console.log("SelectedProductDay", this.productIdArrayDay)
  } else {
    this.productIdArrayDay.splice(index, 1);
    console.log("SelectedProductDay", this.productIdArrayDay)
  }
}

  
getDetailsByfuelDealerCustomerMapIdId(id: any) {
  this.customerName = id.target.value;
  if(this.customerName){      
    this.getCorporateInfoByfuelDealerCustomerMapId(this.customerName);
  }else{
        this.fuelDealerCorpMapIdNew = ''
  }

}

getCorporateInfoByfuelDealerCustomerMapId(customerName: any) {
  let data = {
    fuelDealerId: this.fuelDealerId,
    customerName: customerName
  }
  this.post1.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
    .subscribe(res => {
      if (res) {
        this.fuelDealerCorpMapId = res.data[0].fuelDealerCustomerMapId;
      } else {
      }
    });

}

filterDay(){
  if(this.filterForm.value.date){
    if(this.productIdArrayDay.length){
      if(this.fuelDealerCorpMapId){        
        this.crPurchaseDataDay = []
        this.spinner.show()
        let data ={
        dealerId: this.fuelDealerId,
        mapId: this.fuelDealerCorpMapId,
        date: moment(this.filterForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        productId:"Selected",
        productIdArray: this.productIdArrayDay,
        }
        this.post.getPurchaseDetailsDailyPOST(data)
        .subscribe(res => {
          if(res.status == "OK" && res.data.length){
            this.crPurchaseDataDay = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            // alert("Data Not Found..!")
            this.crPurchaseDataDay = [];
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
        } else {    
        this.crPurchaseDataDay = []
        this.spinner.show()
        let data ={
        dealerId: this.fuelDealerId,
        date: moment(this.filterForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        productId:"Selected",
        productIdArray: this.productIdArrayDay,
        }
        this.post.getPurchaseDetailsDailyPOST(data)
        .subscribe(res => {
          if(res.status == "OK" && res.data.length){
            this.crPurchaseDataDay = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            // alert("Data Not Found..!")
            this.crPurchaseDataDay = [];
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
        }
    }else{
      if(this.fuelDealerCorpMapId){        
        this.crPurchaseDataDay = []
        this.spinner.show()
        let data ={
        dealerId: this.fuelDealerId,
        mapId: this.fuelDealerCorpMapId,
        date: moment(this.filterForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        productId:"All",
        }
        this.post.getPurchaseDetailsDailyPOST(data)
        .subscribe(res => {
          if(res.status == "OK" && res.data.length){
            this.crPurchaseDataDay = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            // alert("Data Not Found..!")
            this.crPurchaseDataDay = [];
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
        } else {    
        this.crPurchaseDataDay = []
        this.spinner.show()
        let data ={
        dealerId: this.fuelDealerId,
        date: moment(this.filterForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        productId:"All",
        }
        this.post.getPurchaseDetailsDailyPOST(data)
        .subscribe(res => {
          if(res.status == "OK" && res.data.length){
            this.crPurchaseDataDay = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            // alert("Data Not Found..!")
            this.crPurchaseDataDay = [];
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
        }
    }

  }else{
    alert("Please Select Date..!")
  }

}

clearDay(){
  this.filterForm.controls["date"].setValue("");
  this.fuelDealerCorpMapId = "";
  this.crPurchaseDataDay = [];
  this.productIdArrayDay = [];
}

printPdfDay(){
  this.post.setRouteForCrPurchaseDayReport('CrPurchaseReportDay', this.crPurchaseDataDay, this.filterForm.value.date, this.productIdArrayDay, this.fuelDealerCorpMapId, this.fuelDealerId, this.filterForm.value.manualNo)
  this.router.navigate(['/ledger/crPurchaseReport']);
}

pageChangeEvent(event: number) {
  this.p = event;
  this.getPurchaseDetailsTx();
}
}
