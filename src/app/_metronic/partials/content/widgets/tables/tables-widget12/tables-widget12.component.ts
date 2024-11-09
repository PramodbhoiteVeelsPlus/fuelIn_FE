import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';

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
  selector: 'app-tables-widget12',
  templateUrl: './tables-widget12.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget12Component implements OnInit {
  currentYear: any;
  last2Year: number;
  lastYear: number;
  lastFourthYear: number;
  lastFifthYear: number;

  FilterForm = new FormGroup({
    month: new FormControl(""),
    year: new FormControl(""),
  })
  dealerList: any = [];
  fuelDealerId: any;
  today = new Date();
  thisYearAdmin: any
  date1: string;
  month: any;
  date2: string;
  date3: string;
  date4: string;
  date5: string;
  date6: string;
  date7: string;
  date8: string;
  date9: string;
  date10: string;
  date11: string;
  date12: string;
  date13: string;
  date14: string;
  date15: string;
  date16: string;
  date17: string;
  date18: string;
  date19: string;
  date20: string;
  date21: string;
  date22: string;
  date23: string;
  date24: string;
  date25: string;
  date26: string;
  date27: string;
  date28: string;
  date29: string;
  date30: string;
  date31: string;
  is31: boolean = false;
  is30: boolean = false;
  isLeap: boolean = false;
  monthNumber: any;
  lastMonth: string;
  monthName: string;
  isFeb: boolean = false;
  meterSales1: any = 0;
  cash1: any = 0;
  digital1: any = 0;
  credit1: any = 0;
  expense1: any = 0;
  short1: any = 0;
  totalAmountTally1: any = 0;
  totalShift1: any = 0;
  meterSales2: any = 0;
  cash2: any = 0;
  digital2: any = 0;
  credit2: any = 0;
  expense2: any = 0;
  short2: any = 0;
  totalAmountTally2: any = 0;
  totalShift2: any = 0;
  meterSales3: any = 0;
  cash3: any = 0;
  digital3: any = 0;
  credit3: any = 0;
  expense3: any = 0;
  short3: any = 0;
  totalAmountTally3: any = 0;
  totalShift3: any = 0;
  meterSales4: any = 0;
  cash4: any = 0;
  digital4: any = 0;
  credit4: any = 0;
  expense4: any = 0;
  short4: any = 0;
  totalAmountTally4: any = 0;
  totalShift4: any = 0;
  meterSales5: any = 0;
  cash5: any = 0;
  digital5: any = 0;
  credit5: any = 0;
  expense5: any = 0;
  short5: any = 0;
  totalAmountTally5: any = 0;
  totalShift5: any = 0;
  meterSales6: any = 0;
  cash6: any = 0;
  digital6: any = 0;
  credit6: any = 0;
  expense6: any = 0;
  short6: any = 0;
  totalAmountTally6: any = 0;
  totalShift6: any = 0;
  meterSales7: any = 0;
  cash7: any = 0;
  digital7: any = 0;
  credit7: any = 0;
  expense7: any = 0;
  short7: any = 0;
  totalAmountTally7: any = 0;
  totalShift7: any = 0;
  meterSales8: any = 0;
  cash8: any = 0;
  digital8: any = 0;
  credit8: any = 0;
  expense8: any = 0;
  short8: any = 0;
  totalAmountTally8: any = 0;
  totalShift8: any = 0;
  meterSales9: any = 0;
  cash9: any = 0;
  digital9: any = 0;
  credit9: any = 0;
  expense9: any = 0;
  short9: any = 0;
  totalAmountTally9: any = 0;
  totalShift9: any = 0;
  meterSales10: any = 0;
  cash10: any = 0;
  digital10: any = 0;
  credit10: any = 0;
  expense10: any = 0;
  short10: any = 0;
  totalAmountTally10: any = 0;
  totalShift10: any = 0;
  meterSales11: any = 0;
  cash11: any = 0;
  digital11: any = 0;
  credit11: any = 0;
  expense11: any = 0;
  short11: any = 0;
  totalAmountTally11: any = 0;
  totalShift11: any = 0;
  meterSales12: any = 0;
  cash12: any = 0;
  digital12: any = 0;
  credit12: any = 0;
  expense12: any = 0;
  short12: any = 0;
  totalAmountTally12: any = 0;
  totalShift12: any = 0;
  meterSales13: any = 0;
  cash13: any = 0;
  digital13: any = 0;
  credit13: any = 0;
  expense13: any = 0;
  short13: any = 0;
  totalAmountTally13: any = 0;
  totalShift13: any = 0;
  meterSales14: any = 0;
  cash14: any = 0;
  digital14: any = 0;
  credit14: any = 0;
  expense14: any = 0;
  short14: any = 0;
  totalAmountTally14: any = 0;
  totalShift14: any = 0;
  meterSales15: any = 0;
  cash15: any = 0;
  digital15: any = 0;
  credit15: any = 0;
  expense15: any = 0;
  short15: any = 0;
  totalAmountTally15: any = 0;
  totalShift15: any = 0;
  meterSales16: any = 0;
  cash16: any = 0;
  digital16: any = 0;
  credit16: any = 0;
  expense16: any = 0;
  short16: any = 0;
  totalAmountTally16: any = 0;
  totalShift16: any = 0;
  meterSales17: any = 0;
  cash17: any = 0;
  digital17: any = 0;
  credit17: any = 0;
  expense17: any = 0;
  short17: any = 0;
  totalAmountTally17: any = 0;
  totalShift17: any = 0;
  meterSales18: any = 0;
  cash18: any = 0;
  digital18: any = 0;
  credit18: any = 0;
  expense18: any = 0;
  short18: any = 0;
  totalAmountTally18: any = 0;
  totalShift18: any = 0;
  meterSales19: any = 0;
  cash19: any = 0;
  digital19: any = 0;
  credit19: any = 0;
  expense19: any = 0;
  short19: any = 0;
  totalAmountTally19: any = 0;
  totalShift19: any = 0;
  meterSales20: any = 0;
  cash20: any = 0;
  digital20: any = 0;
  credit20: any = 0;
  expense20: any = 0;
  short20: any = 0;
  totalAmountTally20: any = 0;
  totalShift20: any = 0;
  meterSales21: any = 0;
  cash21: any = 0;
  digital21: any = 0;
  credit21: any = 0;
  expense21: any = 0;
  short21: any = 0;
  totalAmountTally21: any = 0;
  totalShift21: any = 0;
  meterSales22: any = 0;
  cash22: any = 0;
  digital22: any = 0;
  credit22: any = 0;
  expense22: any = 0;
  short22: any = 0;
  totalAmountTally22: any = 0;
  totalShift22: any = 0;
  adminDashboardFilterForm: any = 0;
  pumpService: any = 0;
  meterSales23: any = 0;
  cash23: any = 0;
  digital23: any = 0;
  credit23: any = 0;
  expense23: any = 0;
  short23: any = 0;
  totalAmountTally23: any = 0;
  totalShift23: any = 0;
  meterSales24: any = 0;
  cash24: any = 0;
  digital24: any = 0;
  credit24: any = 0;
  expense24: any = 0;
  short24: any = 0;
  totalAmountTally24: any = 0;
  totalShift24: any = 0;
  meterSales25: any = 0;
  cash25: any = 0;
  digital25: any = 0;
  credit25: any = 0;
  expense25: any = 0;
  short25: any = 0;
  totalAmountTally25: any = 0;
  totalShift25: any = 0;
  meterSales26: any = 0;
  cash26: any = 0;
  digital26: any = 0;
  credit26: any = 0;
  expense26: any = 0;
  short26: any = 0;
  totalAmountTally26: any = 0;
  totalShift26: any = 0;
  meterSales27: any = 0;
  cash27: any = 0;
  digital27: any = 0;
  credit27: any = 0;
  expense27: any = 0;
  short27: any = 0;
  totalAmountTally27: any = 0;
  totalShift27: any = 0;
  meterSales28: any = 0;
  cash28: any = 0;
  digital28: any = 0;
  credit28: any = 0;
  expense28: any = 0;
  short28: any = 0;
  totalAmountTally28: any = 0;
  totalShift28: any = 0;
  meterSales29: any = 0;
  cash29: any = 0;
  digital29: any = 0;
  credit29: any = 0;
  expense29: any = 0;
  short29: any = 0;
  totalAmountTally29: any = 0;
  totalShift29: any = 0;
  meterSales30: any = 0;
  cash30: any = 0;
  digital30: any = 0;
  credit30: any = 0;
  expense30: any = 0;
  short30: any = 0;
  totalAmountTally30: any = 0;
  totalShift30: any = 0;
  meterSales31: any = 0;
  cash31: any = 0;
  digital31: any = 0;
  credit31: any = 0;
  expense31: any = 0;
  short31: any = 0;
  totalAmountTally31: any = 0;
  totalShift31: any = 0;

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.lastYear = Number(this.currentYear) - 1;
    this.last2Year = Number(this.currentYear) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
    this.lastFifthYear = Number(this.currentYear) - 4;
    this.FilterForm.controls['year'].setValue(this.currentYear)
    this.FilterForm.controls['month'].setValue(moment(new Date()).format("MM"));
    this.showDate() 
    this.isMonth() 
    this.getDealerList()
    this.cd.detectChanges();
  }
  getDealerList() {
    this.spinner.show()
    let data = {

    }

    this.post.getDealerListPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        this.dealerList = res.data;
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.dealerList = [];
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }

  getDetailsByCustomerMapName(id: any) {
    let data = {
      name: id.target.value,
    }
    this.post.getDealerIDCorpIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.getDayWiseShiftDetails()
          this.cd.detectChanges();
        } else {
        }
      });
  }


  showDate() {
    this.thisYearAdmin = this.FilterForm.value.year
    this.month = this.FilterForm.value.month
    this.date1 = this.thisYearAdmin + '-' + this.month + '-01'
    this.date2 = this.thisYearAdmin + '-' + this.month + '-02'
    this.date3 = this.thisYearAdmin + '-' + this.month + '-03'
    this.date4 = this.thisYearAdmin + '-' + this.month + '-04'
    this.date5 = this.thisYearAdmin + '-' + this.month + '-05'
    this.date6 = this.thisYearAdmin + '-' + this.month + '-06'
    this.date7 = this.thisYearAdmin + '-' + this.month + '-07'
    this.date8 = this.thisYearAdmin + '-' + this.month + '-08'
    this.date9 = this.thisYearAdmin + '-' + this.month + '-09'
    this.date10 = this.thisYearAdmin + '-' + this.month + '-10'
    this.date11 = this.thisYearAdmin + '-' + this.month + '-11'
    this.date12 = this.thisYearAdmin + '-' + this.month + '-12'
    this.date13 = this.thisYearAdmin + '-' + this.month + '-13'
    this.date14 = this.thisYearAdmin + '-' + this.month + '-14'
    this.date15 = this.thisYearAdmin + '-' + this.month + '-15'
    this.date16 = this.thisYearAdmin + '-' + this.month + '-16'
    this.date17 = this.thisYearAdmin + '-' + this.month + '-17'
    this.date18 = this.thisYearAdmin + '-' + this.month + '-18'
    this.date19 = this.thisYearAdmin + '-' + this.month + '-19'
    this.date20 = this.thisYearAdmin + '-' + this.month + '-20'
    this.date21 = this.thisYearAdmin + '-' + this.month + '-21'
    this.date22 = this.thisYearAdmin + '-' + this.month + '-22'
    this.date23 = this.thisYearAdmin + '-' + this.month + '-23'
    this.date24 = this.thisYearAdmin + '-' + this.month + '-24'
    this.date25 = this.thisYearAdmin + '-' + this.month + '-25'
    this.date26 = this.thisYearAdmin + '-' + this.month + '-26'
    this.date27 = this.thisYearAdmin + '-' + this.month + '-27'
    this.date28 = this.thisYearAdmin + '-' + this.month + '-28'
    this.date29 = this.thisYearAdmin + '-' + this.month + '-29'
    this.date30 = this.thisYearAdmin + '-' + this.month + '-30'
    this.date31 = this.thisYearAdmin + '-' + this.month + '-31'

  }

  isMonth() {
    var today = new Date();
    this.monthNumber = (today.getMonth() + 1)

    if (this.monthNumber == 1) {
      this.month = '01'
      this.lastMonth = '12'
      this.monthName = 'Jan'
      this.is31 = true;
      this.is30 = false;
      this.isLeap = false;
      this.FilterForm.controls['month'].setValue(this.month);

    } else {
      if (this.monthNumber == 2) {
        this.month = '02'
        this.lastMonth = '01'
        this.monthName = 'Feb'
        this.is31 = false;
        this.is30 = false;
        this.FilterForm.controls['month'].setValue(this.month);
        if (today.getFullYear() / 4 == 0) {
          this.isLeap = true;

        } else {
          this.isLeap = false;
          this.isFeb = true;

        }

      } else {
        if (this.monthNumber == 3) {
          this.month = '03'
          this.lastMonth = '02'
          this.monthName = 'Mar'
          this.is31 = true;
          this.is30 = false;
          this.isLeap = false;
          this.FilterForm.controls['month'].setValue(this.month);

        } else {
          if (this.monthNumber == 4) {
            this.month = '04'
            this.lastMonth = '03'
            this.monthName = 'Apr'
            this.is31 = false;
            this.is30 = true;
            this.isLeap = false;
            this.FilterForm.controls['month'].setValue(this.month);

          } else {
            if (this.monthNumber == 5) {
              this.month = '05'
              this.lastMonth = '04'
              this.monthName = 'May'
              this.is31 = true;
              this.is30 = false;
              this.isLeap = false;
              this.FilterForm.controls['month'].setValue(this.month);

            } else {
              if (this.monthNumber == 6) {
                this.month = '06'
                this.lastMonth = '05'
                this.monthName = 'Jun'
                this.is31 = false;
                this.is30 = true;
                this.isLeap = false;
                this.FilterForm.controls['month'].setValue(this.month);

              } else {
                if (this.monthNumber == 7) {
                  this.month = '07'
                  this.lastMonth = '06'
                  this.monthName = 'Jul'
                  this.is31 = true;
                  this.is30 = false;
                  this.isLeap = false;
                  this.FilterForm.controls['month'].setValue(this.month);

                } else {
                  if (this.monthNumber == 8) {
                    this.month = '08'
                    this.lastMonth = '07'
                    this.monthName = 'Aug'
                    this.is31 = true;
                    this.is30 = false;
                    this.isLeap = false;
                    this.FilterForm.controls['month'].setValue(this.month);

                  } else {
                    if (this.monthNumber == 9) {
                      this.month = '09'
                      this.lastMonth = '08'
                      this.monthName = 'Sep'
                      this.is31 = false;
                      this.is30 = true;
                      this.isLeap = false;
                      this.FilterForm.controls['month'].setValue(this.month);

                    } else {
                      if (this.monthNumber == 10) {
                        this.month = '10'
                        this.lastMonth = '09'
                        this.monthName = 'Oct'
                        this.is31 = true;
                        this.is30 = false;
                        this.isLeap = false;
                        this.FilterForm.controls['month'].setValue(this.month);

                      } else {
                        if (this.monthNumber == 11) {
                          this.month = '11'
                          this.lastMonth = '10'
                          this.monthName = 'Nov'
                          this.is31 = false;
                          this.is30 = true;
                          this.isLeap = false;
                          this.FilterForm.controls['month'].setValue(this.month);

                        } else {
                          if (this.monthNumber == 12) {
                            this.month = '12'
                            this.lastMonth = '11'
                            this.monthName = 'Dec'
                            this.is31 = true;
                            this.is30 = false;
                            this.isLeap = false;
                            this.FilterForm.controls['month'].setValue(this.month);

                          } else {
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


  getDayWiseShiftDetails() {
    this.spinner.show()
  const data = {
    fuelDealerId: this.fuelDealerId,
    month: this.FilterForm.value.month,
    year: this.FilterForm.value.year,
  };
  this.post.getDayWiseShiftBookPOST(data)
    .subscribe(res => {
      if (res.status == 'OK') {

                  if(res.data1.length){
                      
                  this.meterSales1 = res.salesdata1[0].metersSalesTotalAmount
                  this.cash1 = res.data1[0].totalCashTally
                  this.digital1 = res.data1[0].paytmTotalAmount
                  this.credit1 = res.data1[0].totalCreditTally
                  this.expense1 = res.data1[0].expenseAmount
                  this.short1 = res.data1[0].shortamount
                  this.totalAmountTally1 = res.data1[0].totalAmountTally
                  this.totalShift1 = res.data1[0].totalShifts

                }     
              if(res.data2.length){
                  this.meterSales2 = res.salesdata2[0].metersSalesTotalAmount
                  this.cash2 = res.data2[0].totalCashTally
                  this.digital2 = res.data2[0].paytmTotalAmount
                  this.credit2 = res.data2[0].totalCreditTally
                  this.expense2 = res.data2[0].expenseAmount
                  this.short2 = res.data2[0].shortamount
                  this.totalAmountTally2 = res.data2[0].totalAmountTally
                  this.totalShift2 = res.data2[0].totalShifts

              }
              if(res.data3.length){
                  this.meterSales3 = res.salesdata3[0].metersSalesTotalAmount
                  this.cash3 = res.data3[0].totalCashTally
                  this.digital3 = res.data3[0].paytmTotalAmount
                  this.credit3 = res.data3[0].totalCreditTally
                  this.expense3 = res.data3[0].expenseAmount
                  this.short3 = res.data3[0].shortamount
                  this.totalAmountTally3 = res.data3[0].totalAmountTally
                  this.totalShift3 = res.data3[0].totalShifts

              }
              if(res.data4.length){
                  this.meterSales4 = res.salesdata4[0].metersSalesTotalAmount
                  this.cash4 = res.data4[0].totalCashTally
                  this.digital4 = res.data4[0].paytmTotalAmount
                  this.credit4 = res.data4[0].totalCreditTally
                  this.expense4 = res.data4[0].expenseAmount
                  this.short4 = res.data4[0].shortamount
                  this.totalAmountTally4 = res.data4[0].totalAmountTally
                  this.totalShift4 = res.data4[0].totalShifts

              }if(res.data5.length){
                  this.meterSales5 = res.salesdata5[0].metersSalesTotalAmount
                  this.cash5 = res.data5[0].totalCashTally
                  this.digital5 = res.data5[0].paytmTotalAmount
                  this.credit5 = res.data5[0].totalCreditTally
                  this.expense5 = res.data5[0].expenseAmount
                  this.short5 = res.data5[0].shortamount
                  this.totalAmountTally5 = res.data5[0].totalAmountTally
                  this.totalShift5 = res.data5[0].totalShifts

              }if(res.data6.length){
                  this.meterSales6 = res.salesdata6[0].metersSalesTotalAmount
                  this.cash6 = res.data6[0].totalCashTally
                  this.digital6 = res.data6[0].paytmTotalAmount
                  this.credit6 = res.data6[0].totalCreditTally
                  this.expense6 = res.data6[0].expenseAmount
                  this.short6 = res.data6[0].shortamount
                  this.totalAmountTally6 = res.data6[0].totalAmountTally
                  this.totalShift6 = res.data6[0].totalShifts

              }if(res.data7.length){
                  this.meterSales7 = res.salesdata7[0].metersSalesTotalAmount
                  this.cash7 = res.data7[0].totalCashTally
                  this.digital7 = res.data7[0].paytmTotalAmount
                  this.credit7 = res.data7[0].totalCreditTally
                  this.expense7 = res.data7[0].expenseAmount
                  this.short7 = res.data7[0].shortamount
                  this.totalAmountTally7 = res.data7[0].totalAmountTally
                  this.totalShift7 = res.data7[0].totalShifts

              }if(res.data8.length){
                  this.meterSales8 = res.salesdata8[0].metersSalesTotalAmount
                  this.cash8 = res.data8[0].totalCashTally
                  this.digital8 = res.data8[0].paytmTotalAmount
                  this.credit8 = res.data8[0].totalCreditTally
                  this.expense8 = res.data8[0].expenseAmount
                  this.short8 = res.data8[0].shortamount
                  this.totalAmountTally8 = res.data8[0].totalAmountTally
                  this.totalShift8 = res.data8[0].totalShifts

              }if(res.data9.length){
                  this.meterSales9 = res.salesdata9[0].metersSalesTotalAmount
                  this.cash9 = res.data9[0].totalCashTally
                  this.digital9 = res.data9[0].paytmTotalAmount
                  this.credit9 = res.data9[0].totalCreditTally
                  this.expense9 = res.data9[0].expenseAmount
                  this.short9 = res.data9[0].shortamount
                  this.totalAmountTally9 = res.data9[0].totalAmountTally
                  this.totalShift9 = res.data9[0].totalShifts

              }if(res.data10.length){
                  this.meterSales10 = res.salesdata10[0].metersSalesTotalAmount
                  this.cash10 = res.data10[0].totalCashTally
                  this.digital10 = res.data10[0].paytmTotalAmount
                  this.credit10 = res.data10[0].totalCreditTally
                  this.expense10 = res.data10[0].expenseAmount
                  this.short10 = res.data10[0].shortamount
                  this.totalAmountTally10 = res.data10[0].totalAmountTally
                  this.totalShift10 = res.data10[0].totalShifts

              }if(res.data11.length){
                  this.meterSales11 = res.salesdata11[0].metersSalesTotalAmount
                  this.cash11 = res.data11[0].totalCashTally
                  this.digital11 = res.data11[0].paytmTotalAmount
                  this.credit11 = res.data11[0].totalCreditTally
                  this.expense11 = res.data11[0].expenseAmount
                  this.short11 = res.data11[0].shortamount
                  this.totalAmountTally11 = res.data11[0].totalAmountTally
                  this.totalShift11 = res.data11[0].totalShifts

              }

                  this.getDayWiseShiftDetailsMID()
              
      } else {
          this.spinner.hide()
      }
    });
  }
  
  getDayWiseShiftDetailsMID() {
    const data = {
      fuelDealerId: this.fuelDealerId,
      month: this.FilterForm.value.month,
      year: this.FilterForm.value.year,
    };
    this.post.getDayWiseShiftBookMIDPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          
          if(res.data12.length){
                    this.meterSales12 = res.salesdata12[0].metersSalesTotalAmount
                    this.cash12 = res.data12[0].totalCashTally
                    this.digital12 = res.data12[0].paytmTotalAmount
                    this.credit12 = res.data12[0].totalCreditTally
                    this.expense12 = res.data12[0].expenseAmount
                    this.short12 = res.data12[0].shortamount
                    this.totalAmountTally12 = res.data12[0].totalAmountTally
                    this.totalShift12 = res.data12[0].totalShifts
  
                  }if(res.data13.length){
                    this.meterSales13 = res.salesdata13[0].metersSalesTotalAmount
                    this.cash13 = res.data13[0].totalCashTally
                    this.digital13 = res.data13[0].paytmTotalAmount
                    this.credit13 = res.data13[0].totalCreditTally
                    this.expense13 = res.data13[0].expenseAmount
                    this.short13 = res.data13[0].shortamount
                    this.totalAmountTally13 = res.data13[0].totalAmountTally
                    this.totalShift13 = res.data13[0].totalShifts
  
                  }if(res.data14.length){
                    this.meterSales14 = res.salesdata14[0].metersSalesTotalAmount
                    this.cash14 = res.data14[0].totalCashTally
                    this.digital14 = res.data14[0].paytmTotalAmount
                    this.credit14 = res.data14[0].totalCreditTally
                    this.expense14 = res.data14[0].expenseAmount
                    this.short14 = res.data14[0].shortamount
                    this.totalAmountTally14 = res.data14[0].totalAmountTally
                    this.totalShift14 = res.data14[0].totalShifts
  
                  }if(res.data15.length){
                    this.meterSales15 = res.salesdata15[0].metersSalesTotalAmount
                    this.cash15 = res.data15[0].totalCashTally
                    this.digital15 = res.data15[0].paytmTotalAmount
                    this.credit15 = res.data15[0].totalCreditTally
                    this.expense15 = res.data15[0].expenseAmount
                    this.short15 = res.data15[0].shortamount
                    this.totalAmountTally15 = res.data15[0].totalAmountTally
                    this.totalShift15 = res.data15[0].totalShifts
  
                  }if(res.data16.length){
                    this.meterSales16 = res.salesdata16[0].metersSalesTotalAmount
                    this.cash16 = res.data16[0].totalCashTally
                    this.digital16 = res.data16[0].paytmTotalAmount
                    this.credit16 = res.data16[0].totalCreditTally
                    this.expense16 = res.data16[0].expenseAmount
                    this.short16 = res.data16[0].shortamount
                    this.totalAmountTally16 = res.data16[0].totalAmountTally
                    this.totalShift16 = res.data16[0].totalShifts
  
                  }if(res.data17.length){
                    this.meterSales17 = res.salesdata17[0].metersSalesTotalAmount
                    this.cash17 = res.data17[0].totalCashTally
                    this.digital17 = res.data17[0].paytmTotalAmount
                    this.credit17 = res.data17[0].totalCreditTally
                    this.expense17 = res.data17[0].expenseAmount
                    this.short17 = res.data17[0].shortamount
                    this.totalAmountTally17 = res.data17[0].totalAmountTally
                    this.totalShift17 = res.data17[0].totalShifts
  
                  }if(res.data18.length){
                    this.meterSales18 = res.salesdata18[0].metersSalesTotalAmount
                    this.cash18 = res.data18[0].totalCashTally
                    this.digital18 = res.data18[0].paytmTotalAmount
                    this.credit18 = res.data18[0].totalCreditTally
                    this.expense18 = res.data18[0].expenseAmount
                    this.short18 = res.data18[0].shortamount
                    this.totalAmountTally18 = res.data18[0].totalAmountTally
                    this.totalShift18 = res.data18[0].totalShifts
  
                  }if(res.data19.length){
                    this.meterSales19 = res.salesdata19[0].metersSalesTotalAmount
                    this.cash19 = res.data19[0].totalCashTally
                    this.digital19 = res.data19[0].paytmTotalAmount
                    this.credit19 = res.data19[0].totalCreditTally
                    this.expense19 = res.data19[0].expenseAmount
                    this.short19 = res.data19[0].shortamount
                    this.totalAmountTally19 = res.data19[0].totalAmountTally
                    this.totalShift19 = res.data19[0].totalShifts
  
                  }if(res.data20.length){
                    this.meterSales20 = res.salesdata20[0].metersSalesTotalAmount
                    this.cash20 = res.data20[0].totalCashTally
                    this.digital20 = res.data20[0].paytmTotalAmount
                    this.credit20 = res.data20[0].totalCreditTally
                    this.expense20 = res.data20[0].expenseAmount
                    this.short20 = res.data20[0].shortamount
                    this.totalAmountTally20 = res.data20[0].totalAmountTally
                    this.totalShift20 = res.data20[0].totalShifts
  
                  }if(res.data21.length){
                    this.meterSales21 = res.salesdata21[0].metersSalesTotalAmount
                    this.cash21 = res.data21[0].totalCashTally
                    this.digital21 = res.data21[0].paytmTotalAmount
                    this.credit21 = res.data21[0].totalCreditTally
                    this.expense21 = res.data21[0].expenseAmount
                    this.short21 = res.data21[0].shortamount
                    this.totalAmountTally21 = res.data21[0].totalAmountTally
                    this.totalShift21 = res.data21[0].totalShifts
  
                  }if(res.data22.length){
                    this.meterSales22 = res.salesdata22[0].metersSalesTotalAmount
                    this.cash22 = res.data22[0].totalCashTally
                    this.digital22 = res.data22[0].paytmTotalAmount
                    this.credit22 = res.data22[0].totalCreditTally
                    this.expense22 = res.data22[0].expenseAmount
                    this.short22 = res.data22[0].shortamount
                    this.totalAmountTally22 = res.data22[0].totalAmountTally
                    this.totalShift22 = res.data22[0].totalShifts
  
                  }
  
                  this.getDayWiseShiftDetailsLAST()
        } else {
          this.spinner.hide()
        }
      });
    }
  
  
  
    getDayWiseShiftDetailsLAST() {
    const data = {
      fuelDealerId: this.fuelDealerId,
      month: this.month,
      year: this.FilterForm.value.year,
    };
    this.post.getDayWiseShiftBookLASTPOST(data)
      .subscribe((res: { status: string; data23: string | any[]; salesdata23: { metersSalesTotalAmount: any; }[]; data24: string | any[]; salesdata24: { metersSalesTotalAmount: any; }[]; data25: string | any[]; salesdata25: { metersSalesTotalAmount: any; }[]; data26: string | any[]; salesdata26: { metersSalesTotalAmount: any; }[]; data27: string | any[]; salesdata27: { metersSalesTotalAmount: any; }[]; data28: string | any[]; salesdata28: { metersSalesTotalAmount: any; }[]; data29: string | any[]; salesdata29: { metersSalesTotalAmount: any; }[]; data30: string | any[]; salesdata30: { metersSalesTotalAmount: any; }[]; data31: string | any[]; salesdata31: { metersSalesTotalAmount: any; }[]; }) => {
        if (res.status == 'OK') {
  
          if(res.data23.length){
                    this.meterSales23 = res.salesdata23[0].metersSalesTotalAmount
                    this.cash23 = res.data23[0].totalCashTally
                    this.digital23 = res.data23[0].paytmTotalAmount
                    this.credit23 = res.data23[0].totalCreditTally
                    this.expense23 = res.data23[0].expenseAmount
                    this.short23 = res.data23[0].shortamount
                    this.totalAmountTally23 = res.data23[0].totalAmountTally
                    this.totalShift23 = res.data23[0].totalShifts
  
                  }if(res.data24.length){
                    this.meterSales24 = res.salesdata24[0].metersSalesTotalAmount
                    this.cash24 = res.data24[0].totalCashTally
                    this.digital24 = res.data24[0].paytmTotalAmount
                    this.credit24 = res.data24[0].totalCreditTally
                    this.expense24 = res.data24[0].expenseAmount
                    this.short24 = res.data24[0].shortamount
                    this.totalAmountTally24 = res.data24[0].totalAmountTally
                    this.totalShift24 = res.data24[0].totalShifts
  
                  }if(res.data25.length){
                    this.meterSales25 = res.salesdata25[0].metersSalesTotalAmount
                    this.cash25 = res.data25[0].totalCashTally
                    this.digital25 = res.data25[0].paytmTotalAmount
                    this.credit25 = res.data25[0].totalCreditTally
                    this.expense25 = res.data25[0].expenseAmount
                    this.short25 = res.data25[0].shortamount
                    this.totalAmountTally25 = res.data25[0].totalAmountTally
                    this.totalShift25 = res.data25[0].totalShifts
  
                  }if(res.data26.length){
                    this.meterSales26 = res.salesdata26[0].metersSalesTotalAmount
                    this.cash26 = res.data26[0].totalCashTally
                    this.digital26 = res.data26[0].paytmTotalAmount
                    this.credit26 = res.data26[0].totalCreditTally
                    this.expense26 = res.data26[0].expenseAmount
                    this.short26 = res.data26[0].shortamount
                    this.totalAmountTally26 = res.data26[0].totalAmountTally
                    this.totalShift26 = res.data26[0].totalShifts
  
                  }if(res.data27.length){
                    this.meterSales27 = res.salesdata27[0].metersSalesTotalAmount
                    this.cash27 = res.data27[0].totalCashTally
                    this.digital27 = res.data27[0].paytmTotalAmount
                    this.credit27 = res.data27[0].totalCreditTally
                    this.expense27 = res.data27[0].expenseAmount
                    this.short27 = res.data27[0].shortamount
                    this.totalAmountTally27 = res.data27[0].totalAmountTally
                    this.totalShift27 = res.data27[0].totalShifts
  
                  }if(res.data28.length){
                    this.meterSales28 = res.salesdata28[0].metersSalesTotalAmount
                    this.cash28 = res.data28[0].totalCashTally
                    this.digital28 = res.data28[0].paytmTotalAmount
                    this.credit28 = res.data28[0].totalCreditTally
                    this.expense28 = res.data28[0].expenseAmount
                    this.short28 = res.data28[0].shortamount
                    this.totalAmountTally28 = res.data28[0].totalAmountTally
                    this.totalShift28 = res.data28[0].totalShifts
  
                  }if(res.data29.length){
                    this.meterSales29 = res.salesdata29[0].metersSalesTotalAmount
                    this.cash29 = res.data29[0].totalCashTally
                    this.digital29 = res.data29[0].paytmTotalAmount
                    this.credit29 = res.data29[0].totalCreditTally
                    this.expense29 = res.data29[0].expenseAmount
                    this.short29 = res.data29[0].shortamount
                    this.totalAmountTally29 = res.data29[0].totalAmountTally
                    this.totalShift29 = res.data29[0].totalShifts
  
                  }if(res.data30.length){
                    this.meterSales30 = res.salesdata30[0].metersSalesTotalAmount
                    this.cash30 = res.data30[0].totalCashTally
                    this.digital30 = res.data30[0].paytmTotalAmount
                    this.credit30 = res.data30[0].totalCreditTally
                    this.expense30 = res.data30[0].expenseAmount
                    this.short30 = res.data30[0].shortamount
                    this.totalAmountTally30 = res.data30[0].totalAmountTally
                    this.totalShift30 = res.data30[0].totalShifts
  
                  }if(res.data31.length){
                    this.meterSales31 = res.salesdata31[0].metersSalesTotalAmount
                    this.cash31 = res.data31[0].totalCashTally
                    this.digital31 = res.data31[0].paytmTotalAmount
                    this.credit31 = res.data31[0].totalCreditTally
                    this.expense31 = res.data31[0].expenseAmount
                    this.short31 = res.data31[0].shortamount
                    this.totalAmountTally31 = res.data31[0].totalAmountTally
                    this.totalShift31 = res.data31[0].totalShifts
  
                  }
                
                  this.spinner.hide()
           
        } else {
          this.spinner.hide()
        }
      });
    }
}
