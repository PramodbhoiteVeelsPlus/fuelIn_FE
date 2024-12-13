import { ChangeDetectorRef, Component, Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { MixedService } from '../../mixed/mixed.services';
import { StatsService } from '../../stats/stats.services';
import { ListWidgetService } from '../listWidget.services';

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
  selector: 'app-lists-widget4',
  templateUrl: './lists-widget4.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget4Component {
  @Input() items: number = 6;
  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  routeView: string;
  cashBillId: any;
  fuelBill: boolean = false;
  cashBillDate: any;
  cashBillProduct: any;
  cashBillAmount: any;
  cashBillCustName: any;
  cashBillCustMobile: any;
  cashBillNumber: any;
  cashBillQuantity: any;
  cashBillRate: any;
  cashBillSGST: any;
  cashBillSubGST: any;
  cashBillUnit: any;
  cashBillVehicleNumber: any;
  cashBillCGST: any;
  cashBillCreatedBy: any;
  cashBillFor: any;
  cashBillGST: any;
  cashBillIGST: any;
  deleteStatus: any;
  cashBillSystemNumber: any;
  cashBillCustGST: any;
  cashBillGSTAmt: number;
  cashBillAddress: any;
  cashBillAmountWOGST: any;
  companyName: any;
  dealerMobile: any;
  dealerEmail: any;
  keyPerson: string;
  pinCode: any;
  state: any;
  city: any;
  cityArea: any;
  addressLine1: any;
  addressLine2: any;
  gstNumber: any;
  brandName: any;
  lubeBill: boolean = false;
  lubeTaxBill: boolean = false;
  estimatedRefuelDateAdd: any;
  mappingPreviousStatusAdd: any;
  mappingCustomerNameAdd: any;
  companyNameAdd: any;
  lubeNameAdd: any;
  manualCrNumberAdd: any;
  fuelcreditHsnSacNumberAdd: any;
  vehicleNumberAdd: any;
  fuelcreditGSTAmountAdd: any;
  fuelcreditBeforeAdd: any;
  fuelcreditCGSTAdd: any;
  fuelcreditSGSTAdd: any;
  fuelcreditIGSTAdd: any;
  creditAmountAdd: any;
  fuelcreditGSTAdd: any;
  purposeAdd: any;
  GSTNumberAdd: any;
  address1Add: any;
  address2Add: any;
  hostPhoneAdd: any;
  actualCreditQuantityAdd: any;
  fuelcreditTaxDetailsAdd: any;
  totalAmountExclude: number;
  bankAccList: any = [];

  constructor(
    private post: ListWidgetService,
    private post1: StatsService,
    private post2: MixedService,
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

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    var managerData = JSON.parse(localStorage.getItem('managerData') || '{}');
    this.accessGroup = element.accessGroupId;
    this.brandName = dealerData.brandName;
    // this.getLubeTaxDetailsByDealerIdPost()
    this.routeView = this.post.type1;
    this.cashBillId = this.post.cashBillId;
    console.log(this.cashBillId)
    this.getCashBillDetails(this.cashBillId)
    this.getBankDetailsByDealerId(this.fuelDealerId)
    if (this.routeView == "fuelBill") {
      this.fuelBill = true;
    }
    if (this.routeView == "lubeBill") {
      this.lubeBill = true;
    }
    if (this.routeView == "lubeTaxBill") {
      this.getLubeTaxDetailsPost(this.cashBillId)
      this.lubeTaxBill = true;
    }
    this.getCustomerAllDataById(dealerData.customerId)

    if(this.accessGroup == '14'){
      this.getCustomerAllDataById(managerData.customerId)

    }
    this.cd.detectChanges()
  }
  
  getCashBillDetails(cashBillId: any) {
    let data = {
      cashBillId: cashBillId
    }
    this.post.getCashBillPOST(data)
    .subscribe(res => {
      if (res.status == 'OK') {
           this.cashBillDate = res.data[0].cashBillDate;
           this.cashBillProduct = res.data[0].cashBillProduct;
           this.cashBillAmount = res.data[0].cashBillAmount;
           this.cashBillCustName = res.data[0].cashBillCustName;
           this.cashBillCustMobile = res.data[0].cashBillCustMobile;
           this.cashBillNumber = res.data[0].cashBillNumber;
           this.cashBillQuantity = res.data[0].cashBillQuantity;
           this.cashBillRate = res.data[0].cashBillRate;
           this.cashBillSGST = res.data[0].cashBillSGST;
           this.cashBillSubGST = res.data[0].cashBillSubGST; 
           this.cashBillUnit = res.data[0].cashBillUnit; 
           this.cashBillVehicleNumber = res.data[0].cashBillVehicleNumber; 
           this.cashBillCGST = res.data[0].cashBillCGST; 
           this.cashBillCreatedBy = res.data[0].cashBillCreatedBy; 
           this.cashBillFor = res.data[0].cashBillFor; 
           this.cashBillGST = res.data[0].cashBillGST; 
           this.cashBillIGST = res.data[0].cashBillIGST;  
           this.deleteStatus = res.data[0].deleteStatus;  
           this.cashBillSystemNumber = res.data[0].cashBillSystemNumber; 
           this.cashBillCustGST = res.data[0].cashBillCustGST;      
           this.cashBillGSTAmt = Number(res.data[0].cashBillGSTAmt);      
           this.cashBillAddress = res.data[0].cashBillAddress;      
           this.cashBillAmountWOGST = res.data[0].cashBillAmountWOGST;   
           this.cd.detectChanges()   
      }
    })
    }
    
    getCustomerAllDataById(customerId: any) {
      let data = {
          customerId : customerId
      } 
      this.post.getCustomerByCustomerIdPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            this.companyName = res.data[0].companyName;
            this.dealerMobile = res.data[0].phone1;
            this.dealerEmail = res.data[0].email1;
            this.keyPerson = res.data[0].firstName +' '+ res.data[0].lastName;
            this.pinCode = res.data[0].pin;
            this.state = res.data[0].state;
            this.city = res.data[0].city;
            this.cityArea = res.data[0].cityArea;
            this.addressLine1 = res.data[0].address1;
            this.addressLine2 = res.data[0].address2; 
            this.gstNumber = res.data[0].GSTNumber;
            this.cd.detectChanges()
          }
        }) 
    
    }
    
    getLubeTaxDetailsPost(cashBillId: any) {
      let data = {
        cashBillId: cashBillId
      }
      this.post.getLubeTaxBillPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
             this.estimatedRefuelDateAdd = res.data[0].estimatedRefuelDate;
             this.mappingPreviousStatusAdd = res.data[0].mappingPreviousStatus;
             this.mappingCustomerNameAdd = res.data[0].mappingCompanyName;
             this.companyNameAdd = res.data[0].companyName;
             this.lubeNameAdd = res.data[0].lubeName;
             this.manualCrNumberAdd = res.data[0].manualCrNumber;
             this.fuelcreditHsnSacNumberAdd = res.data[0].fuelcreditHsnSacNumber;
             this.vehicleNumberAdd = res.data[0].vehicleNumber;
             this.fuelcreditGSTAmountAdd = res.data[0].fuelcreditGSTAmount;
             this.fuelcreditBeforeAdd = res.data[0].fuelcreditBeforeTax;
             this.fuelcreditCGSTAdd = res.data[0].fuelcreditCGST;
             this.fuelcreditSGSTAdd = res.data[0].fuelcreditSGST;
             this.fuelcreditIGSTAdd = res.data[0].fuelcreditIGST;
             this.creditAmountAdd = res.data[0].creditAmount;
             this.fuelcreditGSTAdd = res.data[0].fuelcreditGST;
             this.purposeAdd = res.data[0].purpose;
             this.GSTNumberAdd = res.data[0].GSTNumber;
             this.address1Add = res.data[0].address1;
             this.address2Add = res.data[0].address2;
             this.hostPhoneAdd = res.data[0].hostPhone;
             this.actualCreditQuantityAdd = res.data[0].actualCreditQuantity;
            this.fuelcreditTaxDetailsAdd = res.data[0].fuelcreditTaxDetails;      
            this.totalAmountExclude =  Number(res.data[0].fuelcreditBeforeTax) + Number(res.data[0].fuelcreditGSTAmount);        
            this.cd.detectChanges()    
        }
      })
      }
      
      getBankDetailsByDealerId(fuelDealerId: any) { 
        this.bankAccList.length = 0;
        let data = {
          dealerId:fuelDealerId
        }
        this.post2.getBankDetailsByDealerIdPOST(data)
          .subscribe(res => {
            if (res.data.length) {
                this.bankAccList = res.data1;
                this.cd.detectChanges()
            }
          }) 
      }
}
