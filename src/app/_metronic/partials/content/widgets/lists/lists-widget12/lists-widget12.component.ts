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
  selector: 'app-lists-widget12',
  templateUrl: './lists-widget12.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget12Component {
  shiftForm = new FormGroup({
    operator: new FormControl(''),
    operatorStaffId: new FormControl('', Validators.required),
    year: new FormControl(),
    month: new FormControl("", Validators.required),
    productName: new FormControl("", Validators.required),
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
  currentYear: any;
  lastYear: number;
  lastThirdYear: number;
  lastFourthYear: number;
  lastFifthYear: number;
  is31: boolean = false;
  is30: boolean = false;
  isLeap: boolean = false;
  isFeb: boolean = false;
  month: any ;
  thisYear = (new Date()).getFullYear()
  quantityDetails: any = [];
  meterSales1: any;
  cash1: any;
  digital1: any;
  credit1: any;
  expense1: any;
  short1: any;
  totalAmountTally1: any;
  meterSales2: any;
  cash2: any;
  digital2: any;
  credit2: any;
  expense2: any;
  short2: any;
  totalAmountTally2: any;
  meterSales3: any;
  cash3: any;
  digital3: any;
  credit3: any;
  expense3: any;
  short3: any;
  totalAmountTally3: any;
  meterSales4: any;
  cash4: any;
  digital4: any;
  credit4: any;
  expense4: any;
  short4: any;
  totalAmountTally4: any;
  meterSales5: any;
  cash5: any;
  digital5: any;
  credit5: any;
  expense5: any;
  short5: any;
  totalAmountTally5: any;
  meterSales6: any;
  cash6: any;
  digital6: any;
  credit6: any;
  expense6: any;
  short6: any;
  totalAmountTally6: any;
  meterSales7: any;
  cash7: any;
  digital7: any;
  credit7: any;
  expense7: any;
  short7: any;
  totalAmountTally7: any;
  meterSales8: any;
  cash8: any;
  digital8: any;
  credit8: any;
  expense8: any;
  short8: any;
  totalAmountTally8: any;
  meterSales9: any;
  cash9: any;
  digital9: any;
  credit9: any;
  expense9: any;
  short9: any;
  totalAmountTally9: any;
  meterSales10: any;
  cash10: any;
  digital10: any;
  credit10: any;
  expense10: any;
  short10: any;
  totalAmountTally10: any;
  meterSales11: any;
  cash11: any;
  digital11: any;
  credit11: any;
  expense11: any;
  short11: any;
  totalAmountTally11: any;
  date1: any;
  date2: any ;
  date3: any ;
  date4: any ;
  date5: any ;
  date6: any ;
  date7: any ;
  date8: any ;
  date9: any ;
  date10: any ;
  date11: any ;
  date12: any;
  meterSales12: any;
  cash12: any = 0;
  digital12: any = 0;
  credit12: any = 0;
  expense12: any = 0;
  short12: any = 0;

  date13: any;
  meterSales13: any;
  cash13: any = 0;
  digital13: any = 0;
  credit13: any = 0;
  expense13: any = 0;
  short13: any = 0;

  date14: any;
  meterSales14: any;
  cash14: any = 0;
  digital14: any = 0;
  credit14: any = 0;
  expense14: any = 0;
  short14: any = 0;

  date15: any;
  meterSales15: any;
  cash15: any = 0;
  digital15: any = 0;
  credit15: any = 0;
  expense15: any = 0;
  short15: any = 0;

  date16: any;
  meterSales16: any;
  cash16: any = 0;
  digital16: any = 0;
  credit16: any = 0;
  expense16: any = 0;
  short16: any = 0;

  date17: any;
  meterSales17: any;
  cash17: any = 0;
  digital17: any = 0;
  credit17: any = 0;
  expense17: any = 0;
  short17: any = 0;

  date18: any;
  meterSales18: any;
  cash18: any = 0;
  digital18: any = 0;
  credit18: any = 0;
  expense18: any = 0;
  short18: any = 0;

  date19: any;
  meterSales19: any;
  cash19: any = 0;
  digital19: any = 0;
  credit19: any = 0;
  expense19: any = 0;
  short19: any = 0;

  date20: any;
  meterSales20: any;
  cash20: any = 0;
  digital20: any = 0;
  credit20: any = 0;
  expense20: any = 0;
  short20: any = 0;

  date22: any;
  meterSales22: any;
  cash22: any = 0;
  digital22: any = 0;
  credit22: any = 0;
  expense22: any = 0;
  short22: any = 0;

  date21: any;
  meterSales21: any;
  cash21: any = 0;
  digital21: any = 0;
  credit21: any = 0;
  expense21: any = 0;
  short21: any = 0;

  date23: any;
  meterSales23: any;
  cash23: any = 0;
  digital23: any = 0;
  credit23: any = 0;
  expense23: any = 0;
  short23: any = 0;

  date24: any;
  meterSales24: any;
  cash24: any = 0;
  digital24: any = 0;
  credit24: any = 0;
  expense24: any = 0;
  short24: any = 0;

  date25: any;
  meterSales25: any;
  cash25: any = 0;
  digital25: any = 0;
  credit25: any = 0;
  expense25: any = 0;
  short25: any = 0;

  date26: any;
  meterSales26: any;
  cash26: any = 0;
  digital26: any = 0;
  credit26: any = 0;
  expense26: any = 0;
  short26: any = 0;

  date27: any;
  meterSales27: any;
  cash27: any = 0;
  digital27: any = 0;
  credit27: any = 0;
  expense27: any = 0;
  short27: any = 0;

  date28: any;
  meterSales28: any;
  cash28: any = 0;
  digital28: any = 0;
  credit28: any = 0;
  expense28: any = 0;
  short28: any = 0;

  date29: any;
  meterSales29: any;
  cash29: any = 0;
  digital29: any = 0;
  credit29: any = 0;
  expense29: any = 0;
  short29: any = 0;

  date30: any;
  meterSales30: any;
  cash30: any = 0;
  digital30: any = 0;
  credit30: any = 0;
  expense30: any = 0;
  short30: any = 0;

  date31: any;
  meterSales31: any;
  cash31: any = 0;
  digital31: any = 0;
  credit31: any = 0;
  expense31: any = 0;
  short31: any = 0;
  totalAmountTally12: any;
  totalAmountTally13: any;
  totalAmountTally14: any;
  totalAmountTally15: any;
  totalAmountTally16: any;
  totalAmountTally17: any;
  totalAmountTally18: any;
  totalAmountTally19: any;
  totalAmountTally20: any;
  totalAmountTally21: any;
  totalAmountTally22: any;
  totalAmountTally23: any;
  totalAmountTally24: any;
  totalAmountTally25: any;
  totalAmountTally26: any;
  totalAmountTally27: any;
  totalAmountTally28: any;
  totalAmountTally29: any;
  totalAmountTally30: any;
  totalAmountTally31: any;
  dateArray: any = [];
  meterSalesArray: any = [];
  creditArray: any = [];
  digitalArray: any = [];
  cashArray: any = [];
  expenseArray: any = [];
  shortArray: any = [];
  totalAmountTallyArray: any = [];
  productsList: any = [];
  dayWiseis311: any = [];
  dayWiseis31: any = [];
  dayWiseis30: any;
  dayWiseisLeap: any;
  dayWiseis28: any;
  monthName: any;
  lastMonth: any;
  monthNumber: any;

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
      this.shiftForm.controls['year'].setValue(this.currentYear);
      this.lastYear = Number(this.currentYear) - 1;
      this.lastThirdYear = Number(this.currentYear) - 2;
      this.lastFourthYear = Number(this.currentYear) - 3;
      this.lastFifthYear = Number(this.currentYear) - 4;

      this.isMonth()
      this.getProductsByDealerId(this.fuelDealerId)
      this.getDayWiseShiftDetailsFilter(this.fuelDealerId);
      // this.isMonth()
      this.cd.detectChanges()
    }

  }

  isMonth(){
    var today = new Date();
    this.monthNumber = (today.getMonth() + 1)

    if(this.monthNumber == 1){
        this.month = '01'
        this.lastMonth = '12'
        this.monthName = 'Jan'
        this.is31 = true;
        this.is30 = false;        
        this.isLeap = false;
        this.shiftForm.controls['month'].setValue(this.month);
        
    }else{
        if(this.monthNumber == 2){
            this.month = '02'
            this.lastMonth = '01'
            this.monthName = 'Feb'
            this.is31 = false;
            this.is30 = false;             
            this.shiftForm.controls['month'].setValue(this.month);
            if(today.getFullYear() / 4 == 0) {
              this.isLeap = true;
              this.is31 = false;
              this.is30 = false; 
            }else{
              this.isLeap = false;
              this.isFeb = true;
              
            }                              
            
        }else{
            if(this.monthNumber == 3){
                this.month = '03'
                this.lastMonth = '02'
                this.monthName = 'Mar'
                this.is31 = true;
                this.is30 = false;                
                this.isLeap = false;
                this.shiftForm.controls['month'].setValue(this.month);
                
            }else{
                if(this.monthNumber == 4){
                    this.month = '04'
                    this.lastMonth = '03'
                    this.monthName = 'Apr'
                    this.is31 = false;
                    this.is30 = true;                                        
                    this.isLeap = false;
                    this.shiftForm.controls['month'].setValue(this.month);
                    
                }else{
                    if(this.monthNumber == 5){
                        this.month = '05'
                        this.lastMonth = '04'
                        this.monthName = 'May'
                        this.is31 = true;
                        this.is30 = false;                        
                        this.isLeap = false;
                        this.shiftForm.controls['month'].setValue(this.month);
                        
                    }else{
                        if(this.monthNumber == 6){
                            this.month = '06'
                            this.lastMonth = '05'
                            this.monthName = 'Jun'
                            this.is31 = false;
                            this.is30 = true;                                        
                            this.isLeap = false;
                            this.shiftForm.controls['month'].setValue(this.month);
                            
                        }else{
                            if(this.monthNumber == 7){
                                this.month = '07'
                                this.lastMonth = '06'
                                this.monthName = 'Jul'
                                this.is31 = true;
                                this.is30 = false;                                
                                this.isLeap = false;
                                this.shiftForm.controls['month'].setValue(this.month);
                                
                            }else{
                                if(this.monthNumber == 8){
                                    this.month = '08'
                                    this.lastMonth = '07'
                                    this.monthName = 'Aug'
                                    this.is31 = true;
                                    this.is30 = false;                                    
                                    this.isLeap = false;
                                    this.shiftForm.controls['month'].setValue(this.month);
                                    
                                }else{
                                    if(this.monthNumber == 9){
                                        this.month = '09'
                                        this.lastMonth = '08'
                                        this.monthName = 'Sep'
                                        this.is31 = false;
                                        this.is30 = true;                                        
                                        this.isLeap = false;
                                        this.shiftForm.controls['month'].setValue(this.month);
                                        
                                    }else{
                                      if(this.monthNumber == 10){
                                        this.month = '10'
                                        this.lastMonth = '09'
                                        this.monthName = 'Oct'
                                        this.is31 = true;
                                        this.is30 = false;                                        
                                        this.isLeap = false;
                                        this.shiftForm.controls['month'].setValue(this.month);
                                        
                                    }else{
                                      if(this.monthNumber == 11){
                                        this.month = '11'
                                        this.lastMonth = '10'
                                        this.monthName = 'Nov'
                                        this.is31 = false;
                                        this.is30 = true;                                        
                                        this.isLeap = false;
                                        this.shiftForm.controls['month'].setValue(this.month);
                                        
                                    }else{
                                      if(this.monthNumber == 12){
                                        this.month = '12'
                                        this.lastMonth = '11'
                                        this.monthName = 'Dec'
                                        this.is31 = true;
                                        this.is30 = false;                                        
                                        this.isLeap = false;
                                        this.shiftForm.controls['month'].setValue(this.month);
                                        
                                    }else{
                                        this.month = this.monthNumber
                                    }
                                    }
                                    }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }    
  }

  filter() {
    if (this.shiftForm.value.month) {
      if (this.shiftForm.value.year) {
        this.is31 = false;
        this.is30 = false;
        this.isLeap = false;
        this.isFeb = false;

        this.month = this.shiftForm.value.month;
        this.thisYear = this.shiftForm.value.year
        if (this.shiftForm.value.month == '01' || this.shiftForm.value.month == '03' || this.shiftForm.value.month == '05' ||
          this.shiftForm.value.month == '07' || this.shiftForm.value.month == '08' || this.shiftForm.value.month == '10' || this.shiftForm.value.month == '12') {
          this.is31 = true;
          this.is30 = false;
          this.isLeap = false;
        } else {
          if (this.shiftForm.value.month == '04' || this.shiftForm.value.month == '06' || this.shiftForm.value.month == '09' ||
            this.shiftForm.value.month == '11') {
            this.is31 = false;
            this.is30 = true;
            this.isLeap = false;
          } else {
            if (this.shiftForm.value.month == '02') {
              if ((this.shiftForm.value.year) / 4 == 0) {
                this.isLeap = true;
                this.is31 = false;
                this.is30 = false;
              } else {
                this.isLeap = false;
                this.isFeb = true;

              }
            }
          }
        }
        this.getDayWiseShiftDetailsFilter(this.fuelDealerId);
        this.cd.detectChanges()
      } else {
        alert("Select Year..!")
        this.cd.detectChanges()
      }
    } else {
      alert("Select Month..!")
      this.cd.detectChanges()
    }


  }


  getDayWiseShiftDetailsFilter(fuelDealerId: any) {
    this.quantityDetails = []
    this.spinner.show()
    const data = {
      fuelDealerId: fuelDealerId,
      month: this.shiftForm.value.month,
      year: this.shiftForm.value.year,
    };
    this.post.getDayWiseQuantityShiftBookPOST(data).subscribe(res => {
      if (res.status == 'OK') {
        if (res.data.length) {
          if (res.data1.length) {
            res.data.map((res1: { fuelProductId: any ; fuelShiftDetailsId: any ; meterSaleAmount: any ; meterSaleQuantity: any ; openDate: any ; productName: any ; }) => {
              const dataJson = {
                fuelProductId: '',
                fuelShiftDetailsId: '',
                meterSaleAmount: '',
                meterSaleQuantity: '',
                openDate: '',
                productName: '',
                creditQuantity: '',
              };
              dataJson.fuelProductId = res1.fuelProductId;
              dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
              dataJson.meterSaleAmount = res1.meterSaleAmount;
              dataJson.meterSaleQuantity = res1.meterSaleQuantity;
              dataJson.openDate = res1.openDate;
              dataJson.productName = res1.productName;
              res.data1.map((res2: { openDate: any ; fuelProdId: any ; creditQuantity: any ; }) => {
                if (res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId) {
                  dataJson.creditQuantity = res2.creditQuantity;
                }
              })


              this.quantityDetails.push(dataJson);
              this.cd.detectChanges()

            })
          } else {
            this.quantityDetails = res.data;
            this.cd.detectChanges()
          }
        } else {
          this.quantityDetails = []
          this.cd.detectChanges()
        }
      }
    })

    this.post.getDayWiseShiftBookPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {

          if (res.data1.length) {

            this.meterSales1 = res.salesdata1[0].metersSalesTotalAmount
            this.cash1 = res.data1[0].totalCashTally
            this.digital1 = res.data1[0].paytmTotalAmount
            this.credit1 = res.data1[0].totalCreditTally
            this.expense1 = res.data1[0].expenseAmount
            this.short1 = res.data1[0].shortamount
            this.totalAmountTally1 = res.data1[0].totalAmountTally
          }
          if (res.data2.length) {
            this.meterSales2 = res.salesdata2[0].metersSalesTotalAmount
            this.cash2 = res.data2[0].totalCashTally
            this.digital2 = res.data2[0].paytmTotalAmount
            this.credit2 = res.data2[0].totalCreditTally
            this.expense2 = res.data2[0].expenseAmount
            this.short2 = res.data2[0].shortamount
            this.totalAmountTally2 = res.data2[0].totalAmountTally
          }
          if (res.data3.length) {
            this.meterSales3 = res.salesdata3[0].metersSalesTotalAmount
            this.cash3 = res.data3[0].totalCashTally
            this.digital3 = res.data3[0].paytmTotalAmount
            this.credit3 = res.data3[0].totalCreditTally
            this.expense3 = res.data3[0].expenseAmount
            this.short3 = res.data3[0].shortamount
            this.totalAmountTally3 = res.data3[0].totalAmountTally
          }
          if (res.data4.length) {
            this.meterSales4 = res.salesdata4[0].metersSalesTotalAmount
            this.cash4 = res.data4[0].totalCashTally
            this.digital4 = res.data4[0].paytmTotalAmount
            this.credit4 = res.data4[0].totalCreditTally
            this.expense4 = res.data4[0].expenseAmount
            this.short4 = res.data4[0].shortamount
            this.totalAmountTally4 = res.data4[0].totalAmountTally
          } if (res.data5.length) {
            this.meterSales5 = res.salesdata5[0].metersSalesTotalAmount
            this.cash5 = res.data5[0].totalCashTally
            this.digital5 = res.data5[0].paytmTotalAmount
            this.credit5 = res.data5[0].totalCreditTally
            this.expense5 = res.data5[0].expenseAmount
            this.short5 = res.data5[0].shortamount
            this.totalAmountTally5 = res.data5[0].totalAmountTally
          } if (res.data6.length) {
            this.meterSales6 = res.salesdata6[0].metersSalesTotalAmount
            this.cash6 = res.data6[0].totalCashTally
            this.digital6 = res.data6[0].paytmTotalAmount
            this.credit6 = res.data6[0].totalCreditTally
            this.expense6 = res.data6[0].expenseAmount
            this.short6 = res.data6[0].shortamount
            this.totalAmountTally6 = res.data6[0].totalAmountTally
          } if (res.data7.length) {
            this.meterSales7 = res.salesdata7[0].metersSalesTotalAmount
            this.cash7 = res.data7[0].totalCashTally
            this.digital7 = res.data7[0].paytmTotalAmount
            this.credit7 = res.data7[0].totalCreditTally
            this.expense7 = res.data7[0].expenseAmount
            this.short7 = res.data7[0].shortamount
            this.totalAmountTally7 = res.data7[0].totalAmountTally
          } if (res.data8.length) {
            this.meterSales8 = res.salesdata8[0].metersSalesTotalAmount
            this.cash8 = res.data8[0].totalCashTally
            this.digital8 = res.data8[0].paytmTotalAmount
            this.credit8 = res.data8[0].totalCreditTally
            this.expense8 = res.data8[0].expenseAmount
            this.short8 = res.data8[0].shortamount
            this.totalAmountTally8 = res.data8[0].totalAmountTally
          } if (res.data9.length) {
            this.meterSales9 = res.salesdata9[0].metersSalesTotalAmount
            this.cash9 = res.data9[0].totalCashTally
            this.digital9 = res.data9[0].paytmTotalAmount
            this.credit9 = res.data9[0].totalCreditTally
            this.expense9 = res.data9[0].expenseAmount
            this.short9 = res.data9[0].shortamount
            this.totalAmountTally9 = res.data9[0].totalAmountTally
          } if (res.data10.length) {
            this.meterSales10 = res.salesdata10[0].metersSalesTotalAmount
            this.cash10 = res.data10[0].totalCashTally
            this.digital10 = res.data10[0].paytmTotalAmount
            this.credit10 = res.data10[0].totalCreditTally
            this.expense10 = res.data10[0].expenseAmount
            this.short10 = res.data10[0].shortamount
            this.totalAmountTally10 = res.data10[0].totalAmountTally
          } if (res.data11.length) {
            this.meterSales11 = res.salesdata11[0].metersSalesTotalAmount
            this.cash11 = res.data11[0].totalCashTally
            this.digital11 = res.data11[0].paytmTotalAmount
            this.credit11 = res.data11[0].totalCreditTally
            this.expense11 = res.data11[0].expenseAmount
            this.short11 = res.data11[0].shortamount
            this.totalAmountTally11 = res.data11[0].totalAmountTally
          }

          this.date1 = this.thisYear + '-' + this.month + '-01'
          this.date2 = this.thisYear + '-' + this.month + '-02'
          this.date3 = this.thisYear + '-' + this.month + '-03'
          this.date4 = this.thisYear + '-' + this.month + '-04'
          this.date5 = this.thisYear + '-' + this.month + '-05'
          this.date6 = this.thisYear + '-' + this.month + '-06'
          this.date7 = this.thisYear + '-' + this.month + '-07'
          this.date8 = this.thisYear + '-' + this.month + '-08'
          this.date9 = this.thisYear + '-' + this.month + '-09'
          this.date10 = this.thisYear + '-' + this.month + '-10'
          this.date11 = this.thisYear + '-' + this.month + '-11'
          console.log("date", this.date1)
          this.getDayWiseShiftDetailsMIDFilter(fuelDealerId)
          this.cd.detectChanges()


        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }


  getDayWiseShiftDetailsMIDFilter(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId,
      month: this.shiftForm.value.month,
      year: this.shiftForm.value.year,
    };
    this.post.getDayWiseShiftBookMIDPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {

          if (res.data12.length) {
            this.meterSales12 = res.salesdata12[0].metersSalesTotalAmount
            this.cash12 = res.data12[0].totalCashTally
            this.digital12 = res.data12[0].paytmTotalAmount
            this.credit12 = res.data12[0].totalCreditTally
            this.expense12 = res.data12[0].expenseAmount
            this.short12 = res.data12[0].shortamount
            this.totalAmountTally12 = res.data12[0].totalAmountTally
          } if (res.data13.length) {
            this.meterSales13 = res.salesdata13[0].metersSalesTotalAmount
            this.cash13 = res.data13[0].totalCashTally
            this.digital13 = res.data13[0].paytmTotalAmount
            this.credit13 = res.data13[0].totalCreditTally
            this.expense13 = res.data13[0].expenseAmount
            this.short13 = res.data13[0].shortamount
            this.totalAmountTally13 = res.data13[0].totalAmountTally
          } if (res.data14.length) {
            this.meterSales14 = res.salesdata14[0].metersSalesTotalAmount
            this.cash14 = res.data14[0].totalCashTally
            this.digital14 = res.data14[0].paytmTotalAmount
            this.credit14 = res.data14[0].totalCreditTally
            this.expense14 = res.data14[0].expenseAmount
            this.short14 = res.data14[0].shortamount
            this.totalAmountTally14 = res.data14[0].totalAmountTally
          } if (res.data15.length) {
            this.meterSales15 = res.salesdata15[0].metersSalesTotalAmount
            this.cash15 = res.data15[0].totalCashTally
            this.digital15 = res.data15[0].paytmTotalAmount
            this.credit15 = res.data15[0].totalCreditTally
            this.expense15 = res.data15[0].expenseAmount
            this.short15 = res.data15[0].shortamount
            this.totalAmountTally15 = res.data15[0].totalAmountTally
          } if (res.data16.length) {
            this.meterSales16 = res.salesdata16[0].metersSalesTotalAmount
            this.cash16 = res.data16[0].totalCashTally
            this.digital16 = res.data16[0].paytmTotalAmount
            this.credit16 = res.data16[0].totalCreditTally
            this.expense16 = res.data16[0].expenseAmount
            this.short16 = res.data16[0].shortamount
            this.totalAmountTally16 = res.data16[0].totalAmountTally
          } if (res.data17.length) {
            this.meterSales17 = res.salesdata17[0].metersSalesTotalAmount
            this.cash17 = res.data17[0].totalCashTally
            this.digital17 = res.data17[0].paytmTotalAmount
            this.credit17 = res.data17[0].totalCreditTally
            this.expense17 = res.data17[0].expenseAmount
            this.short17 = res.data17[0].shortamount
            this.totalAmountTally17 = res.data17[0].totalAmountTally
          } if (res.data18.length) {
            this.meterSales18 = res.salesdata18[0].metersSalesTotalAmount
            this.cash18 = res.data18[0].totalCashTally
            this.digital18 = res.data18[0].paytmTotalAmount
            this.credit18 = res.data18[0].totalCreditTally
            this.expense18 = res.data18[0].expenseAmount
            this.short18 = res.data18[0].shortamount
            this.totalAmountTally18 = res.data18[0].totalAmountTally
          } if (res.data19.length) {
            this.meterSales19 = res.salesdata19[0].metersSalesTotalAmount
            this.cash19 = res.data19[0].totalCashTally
            this.digital19 = res.data19[0].paytmTotalAmount
            this.credit19 = res.data19[0].totalCreditTally
            this.expense19 = res.data19[0].expenseAmount
            this.short19 = res.data19[0].shortamount
            this.totalAmountTally19 = res.data19[0].totalAmountTally
          } if (res.data20.length) {
            this.meterSales20 = res.salesdata20[0].metersSalesTotalAmount
            this.cash20 = res.data20[0].totalCashTally
            this.digital20 = res.data20[0].paytmTotalAmount
            this.credit20 = res.data20[0].totalCreditTally
            this.expense20 = res.data20[0].expenseAmount
            this.short20 = res.data20[0].shortamount
            this.totalAmountTally20 = res.data20[0].totalAmountTally
          } if (res.data21.length) {
            this.meterSales21 = res.salesdata21[0].metersSalesTotalAmount
            this.cash21 = res.data21[0].totalCashTally
            this.digital21 = res.data21[0].paytmTotalAmount
            this.credit21 = res.data21[0].totalCreditTally
            this.expense21 = res.data21[0].expenseAmount
            this.short21 = res.data21[0].shortamount
            this.totalAmountTally21 = res.data21[0].totalAmountTally
          } if (res.data22.length) {
            this.meterSales22 = res.salesdata22[0].metersSalesTotalAmount
            this.cash22 = res.data22[0].totalCashTally
            this.digital22 = res.data22[0].paytmTotalAmount
            this.credit22 = res.data22[0].totalCreditTally
            this.expense22 = res.data22[0].expenseAmount
            this.short22 = res.data22[0].shortamount
            this.totalAmountTally22 = res.data22[0].totalAmountTally
          }

          this.date12 = this.thisYear + '-' + this.month + '-12'
          this.date13 = this.thisYear + '-' + this.month + '-13'
          this.date14 = this.thisYear + '-' + this.month + '-14'
          this.date15 = this.thisYear + '-' + this.month + '-15'
          this.date16 = this.thisYear + '-' + this.month + '-16'
          this.date17 = this.thisYear + '-' + this.month + '-17'
          this.date18 = this.thisYear + '-' + this.month + '-18'
          this.date19 = this.thisYear + '-' + this.month + '-19'
          this.date20 = this.thisYear + '-' + this.month + '-20'
          this.date21 = this.thisYear + '-' + this.month + '-21'
          this.date22 = this.thisYear + '-' + this.month + '-22'
          this.getDayWiseShiftDetailsLASTFilter(fuelDealerId)
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getDayWiseShiftDetailsLASTFilter(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId,
      month: this.shiftForm.value.month,
      year: this.shiftForm.value.year,
    };
    this.post.getDayWiseShiftBookLASTPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {

          if (res.data23.length) {
            this.meterSales23 = res.salesdata23[0].metersSalesTotalAmount
            this.cash23 = res.data23[0].totalCashTally
            this.digital23 = res.data23[0].paytmTotalAmount
            this.credit23 = res.data23[0].totalCreditTally
            this.expense23 = res.data23[0].expenseAmount
            this.short23 = res.data23[0].shortamount
            this.totalAmountTally23 = res.data23[0].totalAmountTally
          } if (res.data24.length) {
            this.meterSales24 = res.salesdata24[0].metersSalesTotalAmount
            this.cash24 = res.data24[0].totalCashTally
            this.digital24 = res.data24[0].paytmTotalAmount
            this.credit24 = res.data24[0].totalCreditTally
            this.expense24 = res.data24[0].expenseAmount
            this.short24 = res.data24[0].shortamount
            this.totalAmountTally24 = res.data24[0].totalAmountTally
          } if (res.data25.length) {
            this.meterSales25 = res.salesdata25[0].metersSalesTotalAmount
            this.cash25 = res.data25[0].totalCashTally
            this.digital25 = res.data25[0].paytmTotalAmount
            this.credit25 = res.data25[0].totalCreditTally
            this.expense25 = res.data25[0].expenseAmount
            this.short25 = res.data25[0].shortamount
            this.totalAmountTally25 = res.data25[0].totalAmountTally
          } if (res.data26.length) {
            this.meterSales26 = res.salesdata26[0].metersSalesTotalAmount
            this.cash26 = res.data26[0].totalCashTally
            this.digital26 = res.data26[0].paytmTotalAmount
            this.credit26 = res.data26[0].totalCreditTally
            this.expense26 = res.data26[0].expenseAmount
            this.short26 = res.data26[0].shortamount
            this.totalAmountTally26 = res.data26[0].totalAmountTally
          } if (res.data27.length) {
            this.meterSales27 = res.salesdata27[0].metersSalesTotalAmount
            this.cash27 = res.data27[0].totalCashTally
            this.digital27 = res.data27[0].paytmTotalAmount
            this.credit27 = res.data27[0].totalCreditTally
            this.expense27 = res.data27[0].expenseAmount
            this.short27 = res.data27[0].shortamount
            this.totalAmountTally27 = res.data27[0].totalAmountTally
          } if (res.data28.length) {
            this.meterSales28 = res.salesdata28[0].metersSalesTotalAmount
            this.cash28 = res.data28[0].totalCashTally
            this.digital28 = res.data28[0].paytmTotalAmount
            this.credit28 = res.data28[0].totalCreditTally
            this.expense28 = res.data28[0].expenseAmount
            this.short28 = res.data28[0].shortamount
            this.totalAmountTally28 = res.data28[0].totalAmountTally
          } if (res.data29.length) {
            this.meterSales29 = res.salesdata29[0].metersSalesTotalAmount
            this.cash29 = res.data29[0].totalCashTally
            this.digital29 = res.data29[0].paytmTotalAmount
            this.credit29 = res.data29[0].totalCreditTally
            this.expense29 = res.data29[0].expenseAmount
            this.short29 = res.data29[0].shortamount
            this.totalAmountTally29 = res.data29[0].totalAmountTally
          } if (res.data30.length) {
            this.meterSales30 = res.salesdata30[0].metersSalesTotalAmount
            this.cash30 = res.data30[0].totalCashTally
            this.digital30 = res.data30[0].paytmTotalAmount
            this.credit30 = res.data30[0].totalCreditTally
            this.expense30 = res.data30[0].expenseAmount
            this.short30 = res.data30[0].shortamount
            this.totalAmountTally30 = res.data30[0].totalAmountTally
          } if (res.data31.length) {
            this.meterSales31 = res.salesdata31[0].metersSalesTotalAmount
            this.cash31 = res.data31[0].totalCashTally
            this.digital31 = res.data31[0].paytmTotalAmount
            this.credit31 = res.data31[0].totalCreditTally
            this.expense31 = res.data31[0].expenseAmount
            this.short31 = res.data31[0].shortamount
            this.totalAmountTally31 = res.data31[0].totalAmountTally
          }

          this.date23 = this.thisYear + '-' + this.month + '-23'
          this.date24 = this.thisYear + '-' + this.month + '-24'
          this.date25 = this.thisYear + '-' + this.month + '-25'
          this.date26 = this.thisYear + '-' + this.month + '-26'
          this.date27 = this.thisYear + '-' + this.month + '-27'
          this.date28 = this.thisYear + '-' + this.month + '-28'
          this.date29 = this.thisYear + '-' + this.month + '-29'
          this.date30 = this.thisYear + '-' + this.month + '-30'
          this.date31 = this.thisYear + '-' + this.month + '-31'
          this.spinner.hide()
          this.cd.detectChanges()

        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  exportToPDF31() {

    var cols = [["date", "meter sales", "credit (a)", "digital (b)", "cash (c)", "expenses", "short", "total tally (a+b+c)"]];
    var rows = [];

    this.dateArray =
      ["", this.date1, this.date2, this.date3, this.date4, this.date5, this.date6, this.date7, this.date8, this.date9, this.date10,
        this.date11, this.date12, this.date13, this.date14, this.date15, this.date16, this.date17, this.date18, this.date19, this.date20,
        this.date21, this.date22, this.date23, this.date24, this.date25, this.date26, this.date27, this.date28, this.date29,
        this.date30, this.date31]

    this.meterSalesArray =
      ["", Number(this.meterSales1).toFixed(2), Number(this.meterSales2).toFixed(2),
        Number(this.meterSales3).toFixed(2), Number(this.meterSales4).toFixed(2),
        Number(this.meterSales5).toFixed(2), Number(this.meterSales6).toFixed(2),
        Number(this.meterSales7).toFixed(2), Number(this.meterSales8).toFixed(2),
        Number(this.meterSales9).toFixed(2), Number(this.meterSales10).toFixed(2),
        Number(this.meterSales11).toFixed(2), Number(this.meterSales12).toFixed(2),
        Number(this.meterSales13).toFixed(2), Number(this.meterSales14).toFixed(2),
        Number(this.meterSales15).toFixed(2), Number(this.meterSales16).toFixed(2),
        Number(this.meterSales17).toFixed(2), Number(this.meterSales18).toFixed(2),
        Number(this.meterSales19).toFixed(2), Number(this.meterSales20).toFixed(2),
        Number(this.meterSales21).toFixed(2), Number(this.meterSales22).toFixed(2),
        Number(this.meterSales23).toFixed(2), Number(this.meterSales24).toFixed(2),
        Number(this.meterSales25).toFixed(2), Number(this.meterSales26).toFixed(2),
        Number(this.meterSales27).toFixed(2), Number(this.meterSales28).toFixed(2),
        Number(this.meterSales29).toFixed(2), Number(this.meterSales30).toFixed(2),
        Number(this.meterSales31).toFixed(2),
      ]

    this.creditArray =
      ["",
        Number(this.credit1).toFixed(2), Number(this.credit2).toFixed(2),
        Number(this.credit3).toFixed(2), Number(this.credit4).toFixed(2),
        Number(this.credit5).toFixed(2), Number(this.credit6).toFixed(2),
        Number(this.credit7).toFixed(2), Number(this.credit8).toFixed(2),
        Number(this.credit9).toFixed(2), Number(this.credit10).toFixed(2),
        Number(this.credit11).toFixed(2), Number(this.credit12).toFixed(2),
        Number(this.credit13).toFixed(2), Number(this.credit14).toFixed(2),
        Number(this.credit15).toFixed(2), Number(this.credit16).toFixed(2),
        Number(this.credit17).toFixed(2), Number(this.credit18).toFixed(2),
        Number(this.credit19).toFixed(2), Number(this.credit20).toFixed(2),
        Number(this.credit21).toFixed(2), Number(this.credit22).toFixed(2),
        Number(this.credit23).toFixed(2), Number(this.credit24).toFixed(2),
        Number(this.credit25).toFixed(2), Number(this.credit26).toFixed(2),
        Number(this.credit27).toFixed(2), Number(this.credit28).toFixed(2),
        Number(this.credit29).toFixed(2), Number(this.credit30).toFixed(2),
        Number(this.credit31).toFixed(2)
      ]

    this.digitalArray =
      ["",
        Number(this.digital1).toFixed(2), Number(this.digital2).toFixed(2),
        Number(this.digital3).toFixed(2), Number(this.digital4).toFixed(2),
        Number(this.digital5).toFixed(2), Number(this.digital6).toFixed(2),
        Number(this.digital7).toFixed(2), Number(this.digital8).toFixed(2),
        Number(this.digital9).toFixed(2), Number(this.digital10).toFixed(2),
        Number(this.digital11).toFixed(2), Number(this.digital12).toFixed(2),
        Number(this.digital13).toFixed(2), Number(this.digital14).toFixed(2),
        Number(this.digital15).toFixed(2), Number(this.digital16).toFixed(2),
        Number(this.digital17).toFixed(2), Number(this.digital18).toFixed(2),
        Number(this.digital19).toFixed(2), Number(this.digital20).toFixed(2),
        Number(this.digital21).toFixed(2), Number(this.digital22).toFixed(2),
        Number(this.digital23).toFixed(2), Number(this.digital24).toFixed(2),
        Number(this.digital25).toFixed(2), Number(this.digital26).toFixed(2),
        Number(this.digital27).toFixed(2), Number(this.digital28).toFixed(2),
        Number(this.digital29).toFixed(2), Number(this.digital30).toFixed(2),
        Number(this.digital31).toFixed(2),]

    this.cashArray =
      ["",
        Number(this.cash1).toFixed(2), Number(this.cash2).toFixed(2),
        Number(this.cash3).toFixed(2), Number(this.cash4).toFixed(2),
        Number(this.cash5).toFixed(2), Number(this.cash6).toFixed(2),
        Number(this.cash7).toFixed(2), Number(this.cash8).toFixed(2),
        Number(this.cash9).toFixed(2), Number(this.cash10).toFixed(2),
        Number(this.cash11).toFixed(2), Number(this.cash12).toFixed(2),
        Number(this.cash13).toFixed(2), Number(this.cash14).toFixed(2),
        Number(this.cash15).toFixed(2), Number(this.cash16).toFixed(2),
        Number(this.cash17).toFixed(2), Number(this.cash18).toFixed(2),
        Number(this.cash19).toFixed(2), Number(this.cash20).toFixed(2),
        Number(this.cash21).toFixed(2), Number(this.cash22).toFixed(2),
        Number(this.cash23).toFixed(2), Number(this.cash24).toFixed(2),
        Number(this.cash25).toFixed(2), Number(this.cash26).toFixed(2),
        Number(this.cash27).toFixed(2), Number(this.cash28).toFixed(2),
        Number(this.cash29).toFixed(2), Number(this.cash30).toFixed(2),
        Number(this.cash31).toFixed(2),
      ]

    this.expenseArray =
      ["",
        Number(this.expense1).toFixed(2), Number(this.expense2).toFixed(2),
        Number(this.expense3).toFixed(2), Number(this.expense4).toFixed(2),
        Number(this.expense5).toFixed(2), Number(this.expense6).toFixed(2),
        Number(this.expense7).toFixed(2), Number(this.expense8).toFixed(2),
        Number(this.expense9).toFixed(2), Number(this.expense10).toFixed(2),
        Number(this.expense11).toFixed(2), Number(this.expense12).toFixed(2),
        Number(this.expense13).toFixed(2), Number(this.expense14).toFixed(2),
        Number(this.expense15).toFixed(2), Number(this.expense16).toFixed(2),
        Number(this.expense17).toFixed(2), Number(this.expense18).toFixed(2),
        Number(this.expense19).toFixed(2), Number(this.expense20).toFixed(2),
        Number(this.expense21).toFixed(2), Number(this.expense22).toFixed(2),
        Number(this.expense23).toFixed(2), Number(this.expense24).toFixed(2),
        Number(this.expense25).toFixed(2), Number(this.expense26).toFixed(2),
        Number(this.expense27).toFixed(2), Number(this.expense28).toFixed(2),
        Number(this.expense29).toFixed(2), Number(this.expense30).toFixed(2),
        Number(this.expense31).toFixed(2)
      ]

    this.shortArray =
      ["",
        Number(this.short1).toFixed(2), Number(this.short2).toFixed(2),
        Number(this.short3).toFixed(2), Number(this.short4).toFixed(2),
        Number(this.short5).toFixed(2), Number(this.short6).toFixed(2),
        Number(this.short7).toFixed(2), Number(this.short8).toFixed(2),
        Number(this.short9).toFixed(2), Number(this.short10).toFixed(2),
        Number(this.short11).toFixed(2), Number(this.short12).toFixed(2),
        Number(this.short13).toFixed(2), Number(this.short14).toFixed(2),
        Number(this.short15).toFixed(2), Number(this.short16).toFixed(2),
        Number(this.short17).toFixed(2), Number(this.short18).toFixed(2),
        Number(this.short19).toFixed(2), Number(this.short20).toFixed(2),
        Number(this.short21).toFixed(2), Number(this.short22).toFixed(2),
        Number(this.short23).toFixed(2), Number(this.short24).toFixed(2),
        Number(this.short25).toFixed(2), Number(this.short26).toFixed(2),
        Number(this.short27).toFixed(2), Number(this.short28).toFixed(2),
        Number(this.short29).toFixed(2), Number(this.short30).toFixed(2),
        Number(this.short31).toFixed(2),
      ]

    this.totalAmountTallyArray =
      ["",
        Number(this.totalAmountTally1).toFixed(2), Number(this.totalAmountTally2).toFixed(2),
        Number(this.totalAmountTally3).toFixed(2), Number(this.totalAmountTally4).toFixed(2),
        Number(this.totalAmountTally5).toFixed(2), Number(this.totalAmountTally6).toFixed(2),
        Number(this.totalAmountTally7).toFixed(2), Number(this.totalAmountTally8).toFixed(2),
        Number(this.totalAmountTally9).toFixed(2), Number(this.totalAmountTally10).toFixed(2),
        Number(this.totalAmountTally11).toFixed(2), Number(this.totalAmountTally12).toFixed(2),
        Number(this.totalAmountTally13).toFixed(2), Number(this.totalAmountTally14).toFixed(2),
        Number(this.totalAmountTally15).toFixed(2), Number(this.totalAmountTally16).toFixed(2),
        Number(this.totalAmountTally17).toFixed(2), Number(this.totalAmountTally18).toFixed(2),
        Number(this.totalAmountTally19).toFixed(2), Number(this.totalAmountTally20).toFixed(2),
        Number(this.totalAmountTally21).toFixed(2), Number(this.totalAmountTally22).toFixed(2),
        Number(this.totalAmountTally23).toFixed(2), Number(this.totalAmountTally24).toFixed(2),
        Number(this.totalAmountTally25).toFixed(2), Number(this.totalAmountTally26).toFixed(2),
        Number(this.totalAmountTally27).toFixed(2), Number(this.totalAmountTally28).toFixed(2),
        Number(this.totalAmountTally29).toFixed(2), Number(this.totalAmountTally30).toFixed(2),
        Number(this.totalAmountTally31).toFixed(2),]


    if (this.is31 == true) {

      for (let i = 1; i <= 31; i++) {

        var temp = [
          this.dateArray[i],
          this.meterSalesArray[i],
          this.creditArray[i],
          this.digitalArray[i],
          this.cashArray[i],
          this.expenseArray[i],
          this.shortArray[i],
          this.totalAmountTallyArray[i],
        ];
        rows.push(temp);
      }
    }

    if (this.is30 == true) {


      for (let i = 1; i <= 30; i++) {

        var temp = [
          this.dateArray[i],
          this.meterSalesArray[i],
          this.creditArray[i],
          this.digitalArray[i],
          this.cashArray[i],
          this.expenseArray[i],
          this.shortArray[i],
          this.totalAmountTallyArray[i],
        ];
        rows.push(temp);
      }

    }

    if (this.isLeap == true) {

      for (let i = 1; i <= 29; i++) {

        var temp = [
          this.dateArray[i],
          this.meterSalesArray[i],
          this.creditArray[i],
          this.digitalArray[i],
          this.cashArray[i],
          this.expenseArray[i],
          this.shortArray[i],
          this.totalAmountTallyArray[i],
        ];
        rows.push(temp);
      }
    }

    if (this.isFeb == true) {
      for (let i = 1; i <= 28; i++) {

        var temp = [
          this.dateArray[i],
          this.meterSalesArray[i],
          this.creditArray[i],
          this.digitalArray[i],
          this.cashArray[i],
          this.expenseArray[i],
          this.shortArray[i],
          this.totalAmountTallyArray[i],
        ];
        rows.push(temp);
      }
    }

    var doc = new jsPDF('l', 'pt');

    doc.setFontSize(20);
    doc.text("Shift Book (day-wise)", 350, 35);
    doc.setFontSize(10);

    autoTable(doc, {
      columnStyles: {
        0: { cellWidth: 80 },     // date
        1: { cellWidth: 90 },    // meter sales
        2: { cellWidth: 90 },     //credit
        3: { cellWidth: 90 },     //digital
        4: { cellWidth: 90 },     //cash
        5: { cellWidth: 90 },     //expenses
        6: { cellWidth: 90 },     //short
        7: { cellWidth: 90 },     //total tally

      },

      margin: { top: 50 },
      head: cols,
      body: rows,
      theme: 'grid',
      didDrawCell: (data) => { },
    });

    doc.save("ShiftBook_daywise.pdf");


  }

  goToShift(date: any) {
    this.post.setRoutingWithDate(date, "ViewSummary")
    this.router.navigate(['/shift/shiftList']);
  }

  goToDSR(date: any) {
    this.post.setRoutingWithDate(date, "ViewSummary")
    localStorage.setItem('reportDate', JSON.stringify(date));
    localStorage.setItem('address', JSON.stringify("ViewSummary"));

    // this.router.navigate([]).then(result => { window.open('./#/shift/shiftReport', '_blank'); });
    this.router.navigate(['/shift/shiftReport']);
  }
  
  getByProduct(id:any){
    this.quantityDetails = []
    const data = {
      fuelDealerId: this.fuelDealerId,
      month: this.month,
      year: this.thisYear,
      fuelProductId: id.target.value
    };

    this.post.getDayWiseQuantityShiftBookPOST(data).subscribe(res =>{
      if(res.status == 'OK'){
        if(res.data.length){
          if(res.data1.length){
            res.data.map((res1: { fuelProductId: any ; fuelShiftDetailsId: any ; meterSaleAmount: any ; meterSaleQuantity: any ; openDate: any ; productName: any ; }) => {
              const dataJson = {
                fuelProductId:'',
                fuelShiftDetailsId: '',
                meterSaleAmount: '',
                meterSaleQuantity: '',
                openDate:'',
                productName:'',
                creditQuantity: '', 
              };
              dataJson.fuelProductId = res1.fuelProductId;
              dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
              dataJson.meterSaleAmount = res1.meterSaleAmount;
              dataJson.meterSaleQuantity = res1.meterSaleQuantity;
              dataJson.openDate = res1.openDate;
              dataJson.productName = res1.productName;
              res.data1.map((res2: { openDate: any ; fuelProdId: any ; creditQuantity: any ; }) => {
                if(res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId){
                  dataJson.creditQuantity = res2.creditQuantity;
                }
              })
  
              this.quantityDetails.push(dataJson); 
             
              })
          }else{
            this.quantityDetails = res.data;
          }
        }else{
          this.quantityDetails = []
        }
      }
    })
  }
  
  getProductsByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId:fuelDealerId
    }
    this.post.getFuelProductIdByDealerIdPOST(data).subscribe(res=>
      {
        if (res.status = 'OK')
        { 
          this.productsList = res.data;  
        }
    })
  }

  exportToPDF1() {
    
    var doc = new jsPDF('l', 'pt');
  
    doc.setFontSize(20);  
    doc.text("Shift DayWise Book ",350, 35 );  
    doc.setFontSize(10);
  
     autoTable(doc, {
      html: '#excel-table', 
      startY: 70,  

      theme: 'grid',
      didDrawCell: (data) => { },
  });
    doc.save("ShiftDayWiseBook.pdf");
  }
  
/*name of the excel-file which will be downloaded. */ 
fileName = 'ShiftDayWiseBook.xlsx'; 


exportexcel1(): void 
  {
     /* table id is passed over here */   
     let element = document.getElementById('excel-table'); 
     const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

     /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

     /* save to file */
     XLSX.writeFile(wb, this.fileName);
    
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getDayWiseShiftDetailsFilter(this.fuelDealerId);
  }
  
  excelDownload31(){

      
    this.dateArray =  
    ["",
    moment(this.date1).format("DD-MM-YYYY"), moment(this.date2).format("DD-MM-YYYY"),
    moment(this.date3).format("DD-MM-YYYY"), moment(this.date4).format("DD-MM-YYYY"),
    moment(this.date5).format("DD-MM-YYYY"), moment(this.date6).format("DD-MM-YYYY"),
    moment(this.date7).format("DD-MM-YYYY"), moment(this.date8).format("DD-MM-YYYY"),
    moment(this.date9).format("DD-MM-YYYY"), moment(this.date10).format("DD-MM-YYYY"),
    moment(this.date11).format("DD-MM-YYYY"), moment(this.date12).format("DD-MM-YYYY"),
    moment(this.date13).format("DD-MM-YYYY"), moment(this.date14).format("DD-MM-YYYY"),
    moment(this.date15).format("DD-MM-YYYY"), moment(this.date16).format("DD-MM-YYYY"),
    moment(this.date17).format("DD-MM-YYYY"), moment(this.date18).format("DD-MM-YYYY"),
    moment(this.date19).format("DD-MM-YYYY"), moment(this.date20).format("DD-MM-YYYY"), 
    moment(this.date21).format("DD-MM-YYYY"), moment(this.date22).format("DD-MM-YYYY"), 
    moment(this.date23).format("DD-MM-YYYY"), moment(this.date24).format("DD-MM-YYYY"), 
    moment(this.date25).format("DD-MM-YYYY"), moment(this.date26).format("DD-MM-YYYY"), 
    moment(this.date27).format("DD-MM-YYYY"), moment(this.date28).format("DD-MM-YYYY"), 
    moment(this.date29).format("DD-MM-YYYY"), moment(this.date30).format("DD-MM-YYYY"), 
    moment(this.date31).format("DD-MM-YYYY"),
    ]

    this.meterSalesArray = 
    ["",Number(this.meterSales1).toFixed(2),Number(this.meterSales2).toFixed(2), 
    Number(this.meterSales3).toFixed(2), Number(this.meterSales4).toFixed(2), 
    Number(this.meterSales5).toFixed(2), Number(this.meterSales6).toFixed(2), 
    Number(this.meterSales7).toFixed(2), Number(this.meterSales8).toFixed(2), 
    Number(this.meterSales9).toFixed(2), Number(this.meterSales10).toFixed(2), 
    Number(this.meterSales11).toFixed(2), Number(this.meterSales12).toFixed(2), 
    Number(this.meterSales13).toFixed(2), Number(this.meterSales14).toFixed(2), 
    Number(this.meterSales15).toFixed(2), Number(this.meterSales16).toFixed(2), 
    Number(this.meterSales17).toFixed(2), Number(this.meterSales18).toFixed(2), 
    Number(this.meterSales19).toFixed(2), Number(this.meterSales20).toFixed(2), 
    Number(this.meterSales21).toFixed(2), Number(this.meterSales22).toFixed(2), 
    Number(this.meterSales23).toFixed(2), Number(this.meterSales24).toFixed(2), 
    Number(this.meterSales25).toFixed(2), Number(this.meterSales26).toFixed(2), 
    Number(this.meterSales27).toFixed(2), Number(this.meterSales28).toFixed(2), 
    Number(this.meterSales29).toFixed(2), Number(this.meterSales30).toFixed(2), 
    Number(this.meterSales31).toFixed(2),
    ]

    this.creditArray = 
    ["",
    Number(this.credit1).toFixed(2), Number(this.credit2).toFixed(2), 
    Number(this.credit3).toFixed(2), Number(this.credit4).toFixed(2), 
    Number(this.credit5).toFixed(2), Number(this.credit6).toFixed(2), 
    Number(this.credit7).toFixed(2), Number(this.credit8).toFixed(2), 
    Number(this.credit9).toFixed(2), Number(this.credit10).toFixed(2), 
    Number(this.credit11).toFixed(2), Number(this.credit12).toFixed(2), 
    Number(this.credit13).toFixed(2), Number(this.credit14).toFixed(2), 
    Number(this.credit15).toFixed(2), Number(this.credit16).toFixed(2), 
    Number(this.credit17).toFixed(2), Number(this.credit18).toFixed(2), 
    Number(this.credit19).toFixed(2), Number(this.credit20).toFixed(2), 
    Number(this.credit21).toFixed(2), Number(this.credit22).toFixed(2), 
    Number(this.credit23).toFixed(2), Number(this.credit24).toFixed(2), 
    Number(this.credit25).toFixed(2), Number(this.credit26).toFixed(2), 
    Number(this.credit27).toFixed(2), Number(this.credit28).toFixed(2), 
    Number(this.credit29).toFixed(2), Number(this.credit30).toFixed(2), 
    Number(this.credit31).toFixed(2)
  ]

    this.digitalArray =
    ["",
    Number(this.digital1).toFixed(2),  Number(this.digital2).toFixed(2), 
    Number(this.digital3).toFixed(2),  Number(this.digital4).toFixed(2), 
    Number(this.digital5).toFixed(2),  Number(this.digital6).toFixed(2), 
    Number(this.digital7).toFixed(2),  Number(this.digital8).toFixed(2), 
    Number(this.digital9).toFixed(2),  Number(this.digital10).toFixed(2), 
    Number(this.digital11).toFixed(2), Number(this.digital12).toFixed(2), 
    Number(this.digital13).toFixed(2), Number(this.digital14).toFixed(2), 
    Number(this.digital15).toFixed(2), Number(this.digital16).toFixed(2), 
    Number(this.digital17).toFixed(2), Number(this.digital18).toFixed(2), 
    Number(this.digital19).toFixed(2), Number(this.digital20).toFixed(2), 
    Number(this.digital21).toFixed(2), Number(this.digital22).toFixed(2), 
    Number(this.digital23).toFixed(2), Number(this.digital24).toFixed(2), 
    Number(this.digital25).toFixed(2), Number(this.digital26).toFixed(2), 
    Number(this.digital27).toFixed(2), Number(this.digital28).toFixed(2), 
    Number(this.digital29).toFixed(2), Number(this.digital30).toFixed(2), 
    Number(this.digital31).toFixed(2), ]

    this.cashArray = 
    ["",
    Number(this.cash1).toFixed(2), Number(this.cash2).toFixed(2), 
    Number(this.cash3).toFixed(2), Number(this.cash4).toFixed(2), 
    Number(this.cash5).toFixed(2), Number(this.cash6).toFixed(2), 
    Number(this.cash7).toFixed(2), Number(this.cash8).toFixed(2), 
    Number(this.cash9).toFixed(2), Number(this.cash10).toFixed(2), 
    Number(this.cash11).toFixed(2), Number(this.cash12).toFixed(2), 
    Number(this.cash13).toFixed(2), Number(this.cash14).toFixed(2), 
    Number(this.cash15).toFixed(2), Number(this.cash16).toFixed(2), 
    Number(this.cash17).toFixed(2), Number(this.cash18).toFixed(2), 
    Number(this.cash19).toFixed(2), Number(this.cash20).toFixed(2), 
    Number(this.cash21).toFixed(2), Number(this.cash22).toFixed(2),
    Number(this.cash23).toFixed(2), Number(this.cash24).toFixed(2), 
    Number(this.cash25).toFixed(2), Number(this.cash26).toFixed(2), 
    Number(this.cash27).toFixed(2), Number(this.cash28).toFixed(2), 
    Number(this.cash29).toFixed(2), Number(this.cash30).toFixed(2), 
    Number(this.cash31).toFixed(2), 
    ]
    
    this.expenseArray = 
    ["",
    Number(this.expense1).toFixed(2), Number(this.expense2).toFixed(2), 
    Number(this.expense3).toFixed(2), Number(this.expense4).toFixed(2), 
    Number(this.expense5).toFixed(2), Number(this.expense6).toFixed(2), 
    Number(this.expense7).toFixed(2), Number(this.expense8).toFixed(2), 
    Number(this.expense9).toFixed(2), Number(this.expense10).toFixed(2), 
    Number(this.expense11).toFixed(2), Number(this.expense12).toFixed(2),
    Number(this.expense13).toFixed(2), Number(this.expense14).toFixed(2), 
    Number(this.expense15).toFixed(2), Number(this.expense16).toFixed(2), 
    Number(this.expense17).toFixed(2), Number(this.expense18).toFixed(2), 
    Number(this.expense19).toFixed(2), Number(this.expense20).toFixed(2), 
    Number(this.expense21).toFixed(2), Number(this.expense22).toFixed(2), 
    Number(this.expense23).toFixed(2), Number(this.expense24).toFixed(2), 
    Number(this.expense25).toFixed(2), Number(this.expense26).toFixed(2), 
    Number(this.expense27).toFixed(2), Number(this.expense28).toFixed(2), 
    Number(this.expense29).toFixed(2), Number(this.expense30).toFixed(2), 
    Number(this.expense31).toFixed(2) 
    ]

    this.shortArray = 
    ["",
    Number(this.short1).toFixed(2), Number(this.short2).toFixed(2), 
    Number(this.short3).toFixed(2), Number(this.short4).toFixed(2), 
    Number(this.short5).toFixed(2), Number(this.short6).toFixed(2), 
    Number(this.short7).toFixed(2), Number(this.short8).toFixed(2), 
    Number(this.short9).toFixed(2), Number(this.short10).toFixed(2), 
    Number(this.short11).toFixed(2), Number(this.short12).toFixed(2), 
    Number(this.short13).toFixed(2), Number(this.short14).toFixed(2), 
    Number(this.short15).toFixed(2), Number(this.short16).toFixed(2), 
    Number(this.short17).toFixed(2), Number(this.short18).toFixed(2), 
    Number(this.short19).toFixed(2), Number(this.short20).toFixed(2), 
    Number(this.short21).toFixed(2), Number(this.short22).toFixed(2), 
    Number(this.short23).toFixed(2), Number(this.short24).toFixed(2), 
    Number( this.short25).toFixed(2), Number(this.short26).toFixed(2), 
    Number(this.short27).toFixed(2), Number(this.short28).toFixed(2), 
    Number(this.short29).toFixed(2), Number(this.short30).toFixed(2), 
    Number(this.short31).toFixed(2), 
  ]

    this.totalAmountTallyArray = 
    ["",
    Number(this.totalAmountTally1).toFixed(2), Number(this.totalAmountTally2).toFixed(2), 
    Number(this.totalAmountTally3).toFixed(2), Number(this.totalAmountTally4).toFixed(2), 
    Number(this.totalAmountTally5).toFixed(2), Number(this.totalAmountTally6).toFixed(2), 
    Number(this.totalAmountTally7).toFixed(2), Number(this.totalAmountTally8).toFixed(2), 
    Number(this.totalAmountTally9).toFixed(2), Number(this.totalAmountTally10).toFixed(2), 
    Number(this.totalAmountTally11).toFixed(2), Number(this.totalAmountTally12).toFixed(2), 
    Number(this.totalAmountTally13).toFixed(2), Number(this.totalAmountTally14).toFixed(2), 
    Number(this.totalAmountTally15).toFixed(2), Number(this.totalAmountTally16).toFixed(2), 
    Number(this.totalAmountTally17).toFixed(2), Number(this.totalAmountTally18).toFixed(2), 
    Number(this.totalAmountTally19).toFixed(2), Number(this.totalAmountTally20).toFixed(2),
    Number(this.totalAmountTally21).toFixed(2), Number(this.totalAmountTally22).toFixed(2), 
    Number(this.totalAmountTally23).toFixed(2), Number(this.totalAmountTally24).toFixed(2), 
    Number(this.totalAmountTally25).toFixed(2), Number(this.totalAmountTally26).toFixed(2), 
    Number(this.totalAmountTally27).toFixed(2), Number(this.totalAmountTally28).toFixed(2), 
    Number(this.totalAmountTally29).toFixed(2), Number(this.totalAmountTally30).toFixed(2), 
    Number(this.totalAmountTally31).toFixed(2), ]

    if(this.is31 == true){

      this.dayWiseis31.length = 0
      this.dayWiseis311.length = 0

     for ( let i=1 ; i<=31;i++){

        let json = {
          date: this.dateArray[i],
          metersales:this.meterSalesArray[i],
          credit: this.creditArray[i],
          digital: this.digitalArray[i],
          cash:this.cashArray[i],
          expenses: this.expenseArray[i],
          short: this.shortArray[i],
          totalAmountTally: this.totalAmountTallyArray[i],
        };
      
        this.dayWiseis311.push(json);
      }
    }

    if(this.is30 == true){
      this.dayWiseis30.length = 0
      this.dayWiseis311.length = 0
      for ( let i=1 ; i<=30;i++){

        let json = {
          date: this.dateArray[i],
          metersales:this.meterSalesArray[i],
          credit: this.creditArray[i],
          digital: this.digitalArray[i],
          cash:this.cashArray[i],
          expenses: this.expenseArray[i],
          short: this.shortArray[i],
          totalAmountTally: this.totalAmountTallyArray[i],
        };
      
        this.dayWiseis311.push(json);
      }
    }

    if(this.isLeap == true){
      this.dayWiseisLeap.length = 0
      this.dayWiseis311.length = 0

      for ( let i=1 ; i<=29;i++){

        let json = {
          date: this.dateArray[i],
          metersales:this.meterSalesArray[i],
          credit: this.creditArray[i],
          digital: this.digitalArray[i],
          cash:this.cashArray[i],
          expenses: this.expenseArray[i],
          short: this.shortArray[i],
          totalAmountTally: this.totalAmountTallyArray[i],
        };
      
        this.dayWiseis311.push(json);
      }
    }

    if(this.isFeb == true){
      this.dayWiseis28.length = 0
      this.dayWiseis311.length = 0

      for ( let i=1 ; i<=28;i++){

        let json = {
          date: this.dateArray[i],
          metersales:this.meterSalesArray[i],
          credit: this.creditArray[i],
          digital: this.digitalArray[i],
          cash:this.cashArray[i],
          expenses: this.expenseArray[i],
          short: this.shortArray[i],
          totalAmountTally: this.totalAmountTallyArray[i],
        };
      
        this.dayWiseis311.push(json);
      }
    }
      this.excelService.exportAsExcelFile(
        this.dayWiseis311,
        "ShiftBook_daywise"
      );
    
    
  }
}
