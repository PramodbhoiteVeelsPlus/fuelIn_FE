import { Component, OnInit, Input, Injectable, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { LayoutService } from '../../../../../layout';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TilesService } from '../../tiles/tiles.services';
import { TransTablesService } from '../trans-tables.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-trans-tables-widget6',
  templateUrl: './trans-tables-widget6.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TransTablesWidget6Component implements OnInit {
  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  });

  editPaymentForm = new FormGroup({
    editpaymentMethod: new FormControl('', Validators.required),
    editpaymentTransactionNo: new FormControl('', Validators.required),
    editpaymentDate: new FormControl('', Validators.required),
    editpaymentAmount: new FormControl('', Validators.required),
    editpaymentType: new FormControl('', Validators.required),
    accountTransacLogId: new FormControl('', Validators.required),
    mapID: new FormControl('', Validators.required),

  });
  
  billingForm = new FormGroup({
    fuelDealerCustomerMapIdForBilling: new FormControl('', Validators.required),
    billingStartDate: new FormControl('', Validators.required),
    billingEndDate: new FormControl('', Validators.required),
    personName: new FormControl('', Validators.required),
    personMobile: new FormControl('', Validators.required),
  });
  
  fuelDealerId: any;
  accessGroup: any;
  transporterCorpId: any;
  crAccDetails: any = [];
  totalOutstanding: number;
  isDateFiltrer: boolean = false;
  searchBox: FormControl = new FormControl();
  searchTerm1: any = "";
  allActiveCreditAccByDealer: any  =[];
  allCreditAccByDealer: any = [];
  allCreditAccByDealerList: any = [];
  allCreditAccByDealerList1: any = [];
  allCreditAccByDealerLength: any = [];
  allCorporateFlagJson: any = [];
  allCorporateFlag: any;
  allCreditAccByDealerListFilter: any  =[];
  allCreditAccByDealerList2: any  =[];
  allSumCrANDdiscount: any;
  allActiveCreditAccByDealer1: any  =[];
  dateToday = new Date();
   
  @Input() fromDate: any;
  @Input() toDate: any;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();
  hoveredDate: NgbDate;
  fromNGDate: any;
  toNGDate: any;
  selected: any;
  hidden: boolean = true;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
accountHolderName: any;
accountNumber: any;
ifsc: any;
branchName: any;
overAllCRAmountWithPrevOutstandung: any;
discountAmt: any;
AfterDiscountWithPrevOutstanding: any;
overAllPaidAmount: any;
advanceAmt: any;
previousOutstandForDetails: any;
previousOutstandForModal: any;
pendingOutstanding: any;

  constructor(private cd: ChangeDetectorRef,
    private post: TransTablesService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    config: NgbDatepickerConfig,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
    
    this.searchBox.valueChanges
    .subscribe((term1) => {
      this.searchTerm1 = term1;
      this.search();
    })
  }


  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.transporterCorpId = localStorage.getItem('transporterCorpId');
    this.accessGroup = element.accessGroupId
    this.getCreditAccDetails();
    this.getAllCreditAccByDealerId(this.fuelDealerId);
    this.cd.detectChanges()
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
      // console.log('11111111');
      // console.log(this.selected);
      
    } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.toDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
     // this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();
  
     this.selected =  moment(this.fromDate.toLocaleDateString()).format("DD-MM-YYYY")+ ' - ' + moment(this.toDate.toLocaleDateString()).format("DD-MM-YYYY")
     this.filterForm.controls["startDate"].setValue( moment(this.fromDate.toLocaleDateString()).format("DD-MM-YYYY"));
     this.filterForm.controls["endDate"].setValue(moment(this.toDate.toLocaleDateString()).format("DD-MM-YYYY"));
  
  
      this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });
      // console.log('2222222222');
      // console.log(this.selected);
  
      this.fromDate = null;
      this.toDate = null;
      this.fromNGDate = null;
      this.toNGDate = null;
  
    } else {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
  
      // console.log('33333333');
      // console.log(this.selected);
  
    }
  }
  
  getCreditAccDetails() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.crAccDetails = [];
      this.totalOutstanding = 0;
      this.spinner.show();
      let data = {
        fuelCorporateId: this.transporterCorpId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),

      }

      this.post.getCreditAccByFuelCorporateIdNewPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.crAccDetails = res.data;
            res.data.map((res1: { netOS: any; }) => {
              this.totalOutstanding = this.totalOutstanding + Number(res1.netOS)
            })
            console.log(this.totalOutstanding)
            this.isDateFiltrer = true;
            this.spinner.hide()
          } else {
            alert("No Data Found..!")
            this.spinner.hide()
          }
        })
    } else {
      this.crAccDetails = [];
      this.totalOutstanding = 0;
      this.spinner.show();
      let data = {
        fuelCorporateId: this.transporterCorpId
      }

      this.post.getCreditAccByFuelCorporateIdNewPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.crAccDetails = res.data;
            res.data.map((res1: { netOS: any; }) => {
              this.totalOutstanding = this.totalOutstanding + Number(res1.netOS)
            })
            console.log(this.totalOutstanding)
            // this.totalOutstanding = Number(this.totalOutstanding) + Number(res.data[0].netOS)
            this.isDateFiltrer = false;
            this.spinner.hide()
          } else {
            alert("No Data Found..!")
            this.spinner.hide()
          }
        })
    }
  }
  
  getAllCreditAccByDealerId(fuelDealerId: any) {
  
    this.allCreditAccByDealer.length = 0;
    this.allCreditAccByDealerList.length = 0;
    this.allCreditAccByDealerList1.length = 0;
    this.allCreditAccByDealerLength.length = 0;
    this.allCorporateFlagJson.length = 0;
    this.allCorporateFlag.length = 0;
    this.allCreditAccByDealerListFilter.length = 0;

    let data = {
      fuelDealerId: fuelDealerId,
    }
    this.post.getAllCreditAccByDealerIdPOST(data)
      .subscribe(res => {
        if (res) {
       //   this.allCreditAccByDealer = res;
          this.allCreditAccByDealerList = res.data;
          this.allCreditAccByDealerListFilter = res.data;

          this.allCreditAccByDealerList2 = res.data5;
          // this.getCombineActive();
          this.allCreditAccByDealerLength = res.data;
        //  this.allCreditAccByDealerList1 = res.data1;
          this.allCorporateFlagJson = res.data1;

          this.allCorporateFlag = res.data2;
          this.allSumCrANDdiscount = res.CRSum;
         // this.allPaymentSum = res.PaymentAverage;

        //  this.getCombineJson();
        this.getCombineActive();
          // this.getThisMonthCrDetail(this.fuelDealerId, this.loginCorporateId)
          // this.getAllClapsAndStarsCalculation(this.fuelDealerId)

        }
        else {
          alert("Error to Show Account List!")
        }
      })
  }
   
  getCombineActive(){
    // console.log('this.allCreditAccByDealerList',this.allCreditAccByDealerList);
    
        this.allCreditAccByDealerList.map((shift: { corporateReviewFlag: string; mappingCreatedDate: string; mappingPreviousStatus: string; mappingGST: string; mappingEmail: string; hostPhone: string; companyName: string; mappingCustomerName: string; hostName: string; previousOutstand: string; maxCreditAmount: string; totalCRAmt: string; mappingStatus: string; totalDiscount: string; fuelDealerCustomerMapId: string; smsStatus: string; isMappingEmail: string; isMappingSMS: string; creditDayLimit: string; manualNumberStart: string; manualNumberEnd: string; lastCRDate: string | number | Date; }) => {
            const dataPAYJson = {
              corporateReviewFlag:"",
              mappingCreatedDate:"",
              mappingPreviousStatus:"",
              companyName:"",
              mappingCustomerName:"",
              mappingGST:"",
              mappingEmail:"",
              hostPhone:"",
              hostName:"",
              previousOutstand:"",
              maxCreditAmount:"",
              totalCRAmt:"",
              mappingStatus:"",
              totalInvPaidAmt:0,
              totalDiscount:"",
              fuelDealerCustomerMapId:"",
              smsStatus:"",
              isMappingEmail:"",
              isMappingSMS:"",
              pendingDays:0,
              creditDayLimit:"",
              manualNumberStart:"",
              manualNumberEnd:""
    
            };
    
              dataPAYJson.corporateReviewFlag = shift.corporateReviewFlag;
              dataPAYJson.mappingCreatedDate = shift.mappingCreatedDate;
              dataPAYJson.mappingPreviousStatus = shift.mappingPreviousStatus;
              dataPAYJson.mappingGST = shift.mappingGST;
              dataPAYJson.mappingEmail = shift.mappingEmail;
    
              dataPAYJson.hostPhone = shift.hostPhone;
              dataPAYJson.companyName = shift.companyName;
              dataPAYJson.mappingCustomerName = shift.mappingCustomerName;
              dataPAYJson.hostName = shift.hostName;
              dataPAYJson.previousOutstand = shift.previousOutstand;
              dataPAYJson.maxCreditAmount = shift.maxCreditAmount;
              dataPAYJson.totalCRAmt = shift.totalCRAmt;
              dataPAYJson.mappingStatus = shift.mappingStatus;
              dataPAYJson.totalDiscount = shift.totalDiscount;
              dataPAYJson.fuelDealerCustomerMapId = shift.fuelDealerCustomerMapId;
              dataPAYJson.smsStatus = shift.smsStatus;
              dataPAYJson.isMappingEmail = shift.isMappingEmail;
              dataPAYJson.isMappingSMS = shift.isMappingSMS;
              dataPAYJson.creditDayLimit = shift.creditDayLimit;
              dataPAYJson.manualNumberStart = shift.manualNumberStart,
              dataPAYJson.manualNumberEnd =  shift.manualNumberEnd
    
              if(shift.lastCRDate){
                var g1 = new Date(moment(this.dateToday).format('YYYY-MM-DD'));
                var g2 = new Date(shift.lastCRDate);
                
                  const oneDay = 24 * 60 * 60 * 1000
                  const diffDays = Math.round(Math.abs((g1.getTime() - g2.getTime()) / oneDay))
                  //console.log("Diff ",diffDays);   
    
                dataPAYJson.pendingDays = diffDays;
              }
    
              this.allCreditAccByDealerList2.map((sales: { fuelDealerCustomerMapId: any; totalInvPaidAmt: number; }) => {
                if (sales.fuelDealerCustomerMapId == shift.fuelDealerCustomerMapId) {
                    dataPAYJson.totalInvPaidAmt = sales.totalInvPaidAmt;
                }
            })
    
              this.allActiveCreditAccByDealer.push(dataPAYJson);
              this.allActiveCreditAccByDealer1.push(dataPAYJson);
          })    
       
        if(this.allCreditAccByDealerList.length ==  this.allActiveCreditAccByDealer.length){
         // this.getCombineJson()
        }
      }
      
  search() {
     
    let term1 = this.searchTerm1;
    this.allActiveCreditAccByDealer = this.allCreditAccByDealerListFilter.filter(function (res: { companyName: string | any[]; }) {
      return res.companyName.indexOf(term1) >= 0;
    });

    if(this.allActiveCreditAccByDealer.length == 0){
      term1 = this.searchTerm1;
      this.allActiveCreditAccByDealer = this.allCreditAccByDealerListFilter.filter(function (res: { companyName: string | any[]; }) {
        return res.companyName.indexOf(term1) >= 0;
      });
    }

    if(this.allActiveCreditAccByDealer.length == 0){
      term1 = this.searchTerm1;
      this.allActiveCreditAccByDealer = this.allCreditAccByDealerListFilter.filter(function (res: { hostPhone: string | any[]; }) {
        return res.hostPhone.indexOf(term1) >= 0;
      });
    }

    if(this.allActiveCreditAccByDealer.length == 0){
      term1 = this.searchTerm1;
      this.allActiveCreditAccByDealer = this.allCreditAccByDealerListFilter.filter(function (res: { hostName: string | any[]; }) {
        return res.hostName.indexOf(term1) >= 0;
      });
    }

}

pageChangeEvent(event: number) {
  this.p = event;
  // this.showCustomer();
}

removeTransLog() {
  let fuelDealerCustomMapId = this.editPaymentForm.value.mapID;
  this.spinner.show();

  let data = {
    accountTransacLogId: this.editPaymentForm.value.accountTransacLogId,
  }
  this.post.removeTransactionLogPOST(data).subscribe(res => {
    if (res.status == "OK") {
      // this.updatePaymentInFuelDealerCustomerMapAfterRemove(fuelDealerCustomMapId)
      //  alert(res.msg);
    } else {
      //  alert(res.msg);
      this.spinner.hide();

    }
  })

}

updateTransLog() {
  let data = {
    accountTransacLogId: this.editPaymentForm.value.accountTransacLogId,
    paymentMethod: this.editPaymentForm.value.editpaymentMethod,
    paymentTransactionNo: this.editPaymentForm.value.editpaymentTransactionNo,
    paymentDate: this.editPaymentForm.value.editpaymentDate,
    paymentAmount: this.editPaymentForm.value.editpaymentAmount
  }
  this.post.editTransactionLogPOST(data).subscribe(res => {
    if (res.status == "OK") {
      alert(res.msg);
    } else {
      alert(res.msg);
    }
  })

}
}

