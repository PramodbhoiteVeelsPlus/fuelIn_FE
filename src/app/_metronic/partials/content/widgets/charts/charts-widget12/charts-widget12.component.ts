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
  selector: 'app-charts-widget12',
  templateUrl: './charts-widget12.component.html',
    providers: [
      { provide: NgbDateAdapter, useClass: CustomAdapter },
      { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
    ]
})
export class ChartsWidget12Component implements OnInit {
  filterForm = new FormGroup({
   startDate:new FormControl(''),
   endDate: new FormControl(''),
   });
   
   unitForm = new FormGroup({
    buyPricePerUnit:new FormControl(''),
    product: new FormControl('', [Validators.required]),    
    productPriceDate: new FormControl(''),
  });

  
  updateFuelPrice = new FormGroup({
    priceUpdated:new FormControl(''),
    });

   @Input() fromDate: Date;
   @Input() toDate: Date | null = null;
   @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();
   hoveredDate: NgbDate | null = null;
   fromNGDate: NgbDate | null = null;
   toNGDate: NgbDate | null = null;
   selected: any;
   hidden: boolean = true;
  getFuelPriceDetailsList: any = [];
  getFuelPriceDetailsListDetails: any = [];
  productsData: any = [];
  productsList: any = [];
  allProductPriceList: any = [];
  managerVPPersonId: any;
  managerPersonId: any;
  productPriceDate= new Date();
  getFuelPriceData: any;
  fuelPriceID: any;
   
//     /**
//  * @param date date obj
//  */
// isInside(date: NgbDate) {
//   return date.after(this.fromNGDate) && date.before(this.toNGDate);
// }

//    /**
//  * @param date date obj
//  */
// isRange(date: NgbDate) {
//   return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
// }

// /**
//  * Is hovered over date
//  * @param date date obj
//  */
// isHovered(date: NgbDate) {
//   return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
// }
isInside(date: NgbDate) {
  return (
    this.fromNGDate &&
    this.toNGDate &&
    date.after(this.fromNGDate) &&
    date.before(this.toNGDate)
  );
}

isRange(date: NgbDate) {
  return (
    (this.fromNGDate && date.equals(this.fromNGDate)) ||
    (this.toNGDate && date.equals(this.toNGDate)) ||
    this.isInside(date) ||
    this.isHovered(date)
  );
}

isHovered(date: NgbDate) {
  return (
    this.fromNGDate &&
    !this.toNGDate &&
    this.hoveredDate &&
    date.after(this.fromNGDate) &&
    date.before(this.hoveredDate)
  );
}
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
    this.getFuelPriceData = JSON.parse(localStorage.getItem('getFuelPriceData') || '{}');
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.accessGroup = element.accessGroupId;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.managerName = element.firstName + ' '+ element.lastName
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
      // this.personName = element.firstName + ' ' + element.lastName
      if (element.accessGroupId == 12 || element.accessGroupId == 14) {
        this.dealerAccess = true
      }

    }
    this.unitForm.controls['productPriceDate'].setValue(moment(this.productPriceDate).format('DD-MM-YYYY'))
    if (!this.getFuelPriceData.length) {
      this.getFuelPriceByDealer(this.fuelDealerId);
    } else {
      this.getFuelPriceByDealer1(this.fuelDealerId);
    }  
    this.getProductsByDealerId(this.fuelDealerId); 
  }


  pageChangeEvent(event: number) {
    this.p = event;
    this.getFuelPriceByDealer(this.fuelDealerId);       
   }

  opensetFuelPrice(setFuelPrice: any) {
    this.modalRef = this.modalService.open(setFuelPrice, { size: 'sm' });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

  // onDateSelection(date: NgbDate) {
  //   if (!this.fromDate && !this.toDate) {
  //     this.fromNGDate = date;
  //     this.fromDate = new Date(date.year, date.month - 1, date.day);
  //     this.selected = '';
  //     // console.log('11111111');
  //     // console.log(this.selected);
      
  //   } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
  //     this.toNGDate = date;
  //     this.toDate = new Date(date.year, date.month - 1, date.day);
  //     this.hidden = true;
  //    // this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();

  //    this.selected =  moment(this.fromDate.toLocaleDateString()).format("DD-MM-YYYY")+ ' - ' + moment(this.toDate.toLocaleDateString()).format("DD-MM-YYYY")
  //    this.filterForm.controls["startDate"].setValue( moment(this.fromDate.toLocaleDateString()).format("DD-MM-YYYY"));
  //    this.filterForm.controls["endDate"].setValue(moment(this.toDate.toLocaleDateString()).format("DD-MM-YYYY"));


  //     this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });
  //     // console.log('2222222222');
  //     // console.log(this.selected);

  //     // this.fromDate = null;
  //     // this.toDate = null;
  //     // this.fromNGDate = null;
  //     // this.toNGDate = null;

  //   } else {
  //     this.fromNGDate = date;
  //     this.fromDate = new Date(date.year, date.month - 1, date.day);
  //     this.selected = '';

  //     // console.log('33333333');
  //     // console.log(this.selected);

  //   }
  // }
  onDateSelection(date: NgbDate) {
  // First click OR starting new selection
  if (!this.fromNGDate || (this.fromNGDate && this.toNGDate)) {
    this.fromNGDate = date;
    this.toNGDate = null;
    this.fromDate = new Date(date.year, date.month - 1, date.day);
    this.toDate = null;
    this.selected = '';
    return;
  }

  // Second click (end date)
  if (date.after(this.fromNGDate)) {
    this.toNGDate = date;
    this.toDate = new Date(date.year, date.month - 1, date.day);
    this.hidden = true;

    this.selected =
      moment(this.fromDate).format('DD-MM-YYYY') +
      ' - ' +
      moment(this.toDate).format('DD-MM-YYYY');

    this.filterForm.controls['startDate'].setValue(
      moment(this.fromDate).format('DD-MM-YYYY')
    );
    this.filterForm.controls['endDate'].setValue(
      moment(this.toDate).format('DD-MM-YYYY')
    );

    this.dateRangeSelected.emit({
      fromDate: this.fromDate,
      toDate: this.toDate,
    });
  }
}


  downloadFuelPrice() {
    if(this.filterForm.value.startDate && this.filterForm.value.endDate){
      let data = {
        dealerId : this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD") ,
        endDate:  moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD") ,
      }
      this.post.getFuelPriceDetailsForExcelPOST(data)
      .subscribe(res=>{
        if(res){
          this.getFuelPriceDetailsList = res.data;
          this.getFuelPriceDetailsListExcel();
        }
    });
    
    }
    else{
      alert("Please Select Date!")
    }
    
    }
    
  getFuelPriceDetailsListExcel() {
  
    this.getFuelPriceDetailsListDetails.length = 0
  
    this.getFuelPriceDetailsList.map((result: { productCategory: string; productName: string; productSellingPrice: string; rateCount: string; productPriceDate: moment.MomentInput; productPriceTime: string; }) => {
        var json = {
          Product: result.productCategory+'-'+result.productName,
          Rate:result.productSellingPrice+' '+'('+'Rate'+result.rateCount+')',
          DateTime:moment(result.productPriceDate).format("DD-MM-YYYY")+' '+result.productPriceTime,
           
        };
  
        this.getFuelPriceDetailsListDetails.push(json);
    });
  
    this.excelService.exportAsExcelFile(
        this.getFuelPriceDetailsListDetails,
        "FuelPriceList"
    );
  }
  
  getProductsByDealerId(fuelDealerId: any) {
    this.spinner.show()
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
          this.getProductDetails(res.data);
          this.spinner.hide();
          this.cd.detectChanges()
        }
    })
  }
  
  getProductDetails(data: any[]){
    data.forEach(element => {
  
      let json ={
        fuelProductId:"",
        productSellingPrice:"",
  
      };
      json.fuelProductId = element.fuelProductsId;
      json.productSellingPrice = "";
      
      // console.log("ArrayProductList 1:",this.allProductPriceList)
    });
  }
  
  checkAmount(id: any) {
    if(id.target.value < 0){
   alert("Please enter valid fuel price")
   id.target.value = '';
    }
  }
  
  addFuelPrice() {
    if(this.accessGroup == 12 || this.accessGroup == 19){
      this.spinner.show()
      // console.log("ArrayProductList 2:",this.allProductPriceList)
      let data ={
        allProductPriceList:this.allProductPriceList,
        sellingSetBy : this.fuelDealerId,
        productPriceTime : moment(this.todayDate).format("hh:mm:ss"),
        productPriceDate : moment(this.unitForm.value.productPriceDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }
      this.post.addFuelPriceByDealerIdPOST(data)
      .subscribe(res=>{
        if(res.status == 'OK'){
          alert("Fuel Price Set Successfully!");
          this.getProductsByDealerId(this.fuelDealerId);
          this.getFuelPriceByDealer(this.fuelDealerId);      
          this.modalRef.close('close');
          this.allProductPriceList.length = 0;
          this.spinner.hide();
          this.unitForm.controls['productPriceDate'].setValue(moment(this.productPriceDate).format('DD-MM-YYYY'));
        }else{
          alert(res.msg);
          this.spinner.hide();
        }
        
      })
    }else{
      if(this.accessGroup == 14 || this.accessGroup == 21){
        this.spinner.show()
        // console.log("ArrayProductList 2:",this.allProductPriceList)
        let data ={
          allProductPriceList:this.allProductPriceList,
          sellingSetBy : this.fuelDealerId,
          productPriceTime : moment(this.todayDate).format("hh:mm:ss"),
          productPriceDate : moment(this.unitForm.value.productPriceDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          managerVPPersonId:this.managerVPPersonId,
          managerPersonId:this.managerPersonId,
          managerName:this.managerName,
        }
        this.post.addFuelPriceByDealerIdPOST(data)
        .subscribe(res=>{
          if(res.status == 'OK'){
            alert("Fuel Price Set Successfully!");
            this.getProductsByDealerId(this.fuelDealerId);
            this.getFuelPriceByDealer(this.fuelDealerId);      
            this.modalRef.close('close');
            this.allProductPriceList.length = 0;
            this.spinner.hide();
            this.unitForm.controls['productPriceDate'].setValue(moment(this.productPriceDate).format('DD-MM-YYYY'));
          }else{
            alert(res.msg);
            this.spinner.hide();
          }
          
        })
      }else{
        
      }
    }
  
  }
  
  getFuelPriceByDealer(fuelDealerId: any) {
    this.spinner.show()
    let data ={
      dealerId : fuelDealerId,
    }
    this.post.getPriceByDealerIdPOST(data)
    .subscribe(res=>{
      if(res.data.length){
        this.getFuelPriceData = res.data;
        localStorage.setItem('getFuelPriceData', JSON.stringify(this.getFuelPriceData));
        this.spinner.hide()
        this.cd.detectChanges()
      }
      else{
        this.getFuelPriceData = [];
        localStorage.setItem('getFuelPriceData', JSON.stringify([]));
        this.spinner.hide()
        this.cd.detectChanges()
  
      }
      
    })
  }
  
  getFuelPriceByDealer1(fuelDealerId: any) {
    let data ={
      dealerId : fuelDealerId,
    }
    this.post.getPriceByDealerIdPOST(data)
    .subscribe(res=>{
      if(res.data.length){
        this.getFuelPriceData = res.data;
        localStorage.setItem('getFuelPriceData', JSON.stringify(this.getFuelPriceData));
        this.spinner.hide()
        this.cd.detectChanges()
      }
      else{
        this.getFuelPriceData = [];
        localStorage.setItem('getFuelPriceData', JSON.stringify([]));
        this.spinner.hide()
        this.cd.detectChanges()
  
      }
      
    })
  }

  updatePrice(editPrice: any,FuelPriceID: any,productSellingPrice: any){
    this.modalRef = this.modalService.open(editPrice);
    this.fuelPriceID = FuelPriceID;
    this.updateFuelPrice.controls["priceUpdated"].setValue(productSellingPrice);
    this.modalRef.result.then(
        (result: any) => {
            this.closeResult = `Closed with: ${result}`;
        },
        (reason: any) => {
            this.closeResult = `Dismissed`;
        }
    );
  }
  
  editFuelPrice() {
    if(this.updateFuelPrice.value.priceUpdated){
      this.spinner.show()
      let data = {
        fuelPriceID:this.fuelPriceID,
        productSellingPrice:this.updateFuelPrice.value.priceUpdated,
      }
      this.post.editFuelPricePOST(data)
      .subscribe(res=>{
        alert("Price Updated Successfully!");
        this.spinner.hide();
        this.modalRef.close('close');
        this.updateFuelPrice.reset();
        this.getFuelPriceByDealer(this.fuelDealerId);
      })
    }
    else
    {
      alert("Please Enter Price..!")
    }
  }
}
