import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import * as XLSX from 'xlsx';

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
type Tabs =
  | 'kt_table_widget_15_tab_1'
  | 'kt_table_widget_15_tab_2'
  | 'kt_table_widget_15_tab_3';


@Component({
  selector: 'app-tables-widget15',
  templateUrl: './tables-widget15.component.html',
  styleUrl: './tables-widget15.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget15Component {
  lastMonthYear: string;
  currentMonthYear: string;
  currentCrSales: any;
  currentPay: any;
  lastCrSales: number;
  lastPay: number;
  sumFastagTransactionAllCurrent: any;
  sumFastagTransactionPaymentAllCurrent: any;
  sumFastagTransactionAll: any;
  sumFastagTransactionAllPre: any;

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

  activeTab: Tabs = 'kt_table_widget_15_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    this.currentMonthYear =  moment(new Date()).format("MMM y")
    this.lastMonthYear = moment(new Date()).subtract(1, 'month').format("MMM y")
    console.log("years", this.currentMonthYear, this.lastMonthYear)
    this.getCurrentMonthCrPay()
    this.getLastMonthCrPay()
    this.getAllFastagDetails()
    this.cd.detectChanges();
  }

  getCurrentMonthCrPay(){
    this.spinner.show()
    let data = {
      startDate: moment(this.currentMonthYear, ["MMM y"]).format("YYYY-MM-01"),
      endDate: moment(this.currentMonthYear, ["MMM y"]).format("YYYY-MM-31")
    }

    this.post.getYearWiseCreditPOST(data).subscribe(res => {
      if(res.status){
        this.currentCrSales = res.data[0].purchase;
        this.currentPay = res.data[0].payment;
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.currentCrSales = 0;
        this.currentPay = 0;
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }

  getLastMonthCrPay(){
    this.spinner.show()
    let data = {
      startDate: moment(this.lastMonthYear, ["MMM y"]).format("YYYY-MM-01"),
      endDate: moment(this.lastMonthYear, ["MMM y"]).format("YYYY-MM-31")
    }

    this.post.getYearWiseCreditPOST(data).subscribe(res => {
      if(res.status){
        this.lastCrSales = res.data[0].purchase;
        this.lastPay = res.data[0].payment;
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.lastCrSales = 0;
        this.lastPay = 0;
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }

  
  getAllFastagDetails() {
    let data = {

    }
    this.post.getAllFastagTransactionDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          // this.fastagEntityTransactionList = res
          // this.sumFastagEntityAll = res.allEntity
          if(res.preData.length){
            this.sumFastagTransactionAll = res.preData[0].allPurchaseTransaction
          }
          if(res.prePaymentDetails.length){
            this.sumFastagTransactionAllPre = res.prePaymentDetails[0].allPaymentTransaction
        }
        if(res.curData.length){
            this.sumFastagTransactionAllCurrent = res.curData[0].allPurchaseTransaction
        }
        if(res.curPaymentData1.length){
            this.sumFastagTransactionPaymentAllCurrent = res.curPaymentData1[0].allPaymentTransaction
        }
        
    this.cd.detectChanges();
        // if(res.currentFuelCreditSalesAllData.length){
        //     this.currentFuelCreditSalesDataAll = res.currentFuelCreditSalesAllData[0].fuelCreditAmount
        // }
        // if(res.preFuelCreditSalesAllData.length){
        //     this.preFuelCreditSalesDataAll = res.preFuelCreditSalesAllData[0].fuelCreditAmount
        // }

        // if(res.currentAccountCRPaymentAllData.length){
        //     this.currentAccountCRPaymentAllData = res.currentAccountCRPaymentAllData[0].grandTotalAmountAll
        // }
        // if(res.preAccountCRPaymentAllData.length){
        //     this.preAccountCRPaymentAllData = res.preAccountCRPaymentAllData[0].grandTotalAmountAll
        // }

        //   this.allFastagEntityTransactionList = res.curData1
        //   this.allFastagEntityTransactionCurrentPayList = res.curPaymentData
        //   this.allFastagEntityTransactionPrePurList = res.preData1
        //   this.allFastagEntityTransactionPrePayList = res.preAllPayment
        //   this.currentFuelCreditSalesData = res.currentFuelCreditSalesData
        //   this.preFuelCreditSalesData = res.preFuelCreditSalesData

        //   this.currentAccountCRPaymentAllBYentityData = res.currentAccountCRPaymentAllBYentityData
        //   this.preAccountCRPaymentAllBYentityData = res.preAccountCRPaymentAllBYentityData
        
          
        } else {
        }
    
   });
  }

  /*name of the excel-file which will be downloaded. */
  fileName = 'fastag Transaction Excel ONE.xlsx';

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }
}
