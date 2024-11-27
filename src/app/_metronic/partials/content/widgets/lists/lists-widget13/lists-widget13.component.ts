import { ChangeDetectorRef, Component, Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListWidgetService } from '../listWidget.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { ExcelService } from 'src/app/pages/excel.service';
import * as XLSX from 'xlsx';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<any > {

  readonly DELIMITER = '-';

  fromModel(value: any  | null): NgbDateStruct | null {
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

  toModel(date: NgbDateStruct | null): any  | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: any ): NgbDateStruct | null {
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

  format(date: NgbDateStruct | null): any  {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-lists-widget13',
  templateUrl: './lists-widget13.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget13Component {
  
  filterForm = new FormGroup({
    month: new FormControl("", Validators.required),
    year: new FormControl("", Validators.required),
    product: new FormControl("", Validators.required),
  });

  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  managerName: any ;
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
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  currentYear: number;
  lastYear: number;
  lastThirdYear: number;
  lastFourthYear: number;
  lastFifthYear: number;
  shiftWiseQuantityData: any = [];
  shiftWiseData: any = [];
  shiftDetails: any;
  meterSalesAmount: any;

  constructor(
    private post: ListWidgetService,
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
    this.currentYear = new Date().getFullYear();
    this.lastYear = Number(this.currentYear) - 1;
    this.lastThirdYear = Number(this.currentYear) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
      this.lastFifthYear = Number(this.currentYear) - 4;

      // this.getProductsByDealerId(this.fuelDealerId)
      // this.isMonth()
      this.cd.detectChanges()
    }

  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getShiftWiseBookDetailsMonthWise(this.fuelDealerId);
  }

  getShiftWiseBookDetailsMonthWise(tickValue: any) {     
    this.filterForm.controls["month"].setValue(moment(tickValue,["MM"]).format("MM"))
    let startDate = this.filterForm.value.year+'-'+this.filterForm.value.month+'-'+'01'
    let endDate = this.filterForm.value.year+'-'+this.filterForm.value.month+'-'+'31'
    this.shiftWiseData.length = 0;
    this.shiftWiseQuantityData.length = 0;
    const data = {
        dealerId: this.fuelDealerId,
        startDate:startDate,  //startDate,
        endDate: endDate,
    };
    this.post.getShiftWiseBookDetailsPOST(data).subscribe((res) => {
        if (res.status == 'OK') {
            this.meterSalesAmount = res.data;
            this.shiftDetails = res.data1;
  
              this.shiftDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; totalCashTally: string; paytmTotalAmount: string; totalCreditTally: string; expenseAmount: string; shortamount: string; totalAmountTally: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; idfuelShiftDetails: any; }) => {
                const dataPAYJson = {
                  openDate: '',
                  name: '',
                  meterSaleAmount: 0,
                  cash: '',
                  digital:'',
                  credit: '',
                  expenses: '',
                  short: '',
                  shiftTally: '',
                  shiftTime: '',
                };
  
                  dataPAYJson.openDate = moment(shift.openDate).format("YYYY-MM-DD");
                  dataPAYJson.name = shift.firstName+' '+shift.lastName;
                  dataPAYJson.cash = shift.totalCashTally;
                  dataPAYJson.digital = shift.paytmTotalAmount;
                  dataPAYJson.credit = shift.totalCreditTally;
                  dataPAYJson.expenses = shift.expenseAmount;
                  dataPAYJson.short = shift.shortamount;
                  dataPAYJson.shiftTally = shift.totalAmountTally;
                  dataPAYJson.shiftTime = shift.fuelShiftTimeDetails+' '+shift.fuelShiftTimeShiftName;
  
                  this.meterSalesAmount.map((sales: { fuelShiftDetailsId: any; meterSaleAmount: number; }) => {
                    if (sales.fuelShiftDetailsId == shift.idfuelShiftDetails) {
                        dataPAYJson.meterSaleAmount = sales.meterSaleAmount;
                    }
                })
  
                  this.shiftWiseData.push(dataPAYJson);
              })
  
        } else {
        }
    });
  
    this.post.getShiftWiseBookQuantityDetailsPOST(data).subscribe((res) => {
      if(res.status == 'OK'){
        if(res.data.length){
          if(res.data1.length){
            res.data.map((res1: { fuelProductId: string; fuelShiftDetailsId: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; meterSaleAmount: string; meterSaleQuantity: string; openDate: string; productName: string; firstName: string; lastName: string; shiftTimeId: any; }) => {
              const dataJson = {
                fuelProductId:'',
                fuelShiftDetailsId: '',
                meterSaleAmount: '',
                meterSaleQuantity: '',
                openDate:'',
                productName:'',
                creditQuantity: '', 
                fuelShiftTimeShiftName:'',
                fuelShiftTimeDetails:'',
                firstName:'',
                lastName:'',
              };
              dataJson.fuelProductId = res1.fuelProductId;
              dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
              dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
              dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
              dataJson.meterSaleAmount = res1.meterSaleAmount;
              dataJson.meterSaleQuantity = res1.meterSaleQuantity;
              dataJson.openDate = res1.openDate;
              dataJson.productName = res1.productName;
              dataJson.firstName = res1.firstName;
              dataJson.lastName = res1.lastName;
              res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; idfuelShiftDetails: string; creditQuantity: string; }) => {
                if(res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId && res1.fuelShiftDetailsId == res2.idfuelShiftDetails){
                  dataJson.creditQuantity = res2.creditQuantity;
                }
              })
               
              this.shiftWiseQuantityData.push(dataJson); 
             
              })
          }else{
            this.shiftWiseQuantityData = res.data;
          }
        }else{
          this.shiftWiseQuantityData = []
        }
      }
    })
  }

  routeShift(date: string){
    this.post.setNavigate(date,'Book')
      this.router.navigate(['/shift/addShift']);
    }
  
}
