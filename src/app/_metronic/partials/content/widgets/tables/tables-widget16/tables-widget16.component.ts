import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import * as XLSX from 'xlsx';
import moment from 'moment';
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

type Tabs =
  | 'kt_table_widget_16_tab_1'
  | 'kt_table_widget_16_tab_2'
  | 'kt_table_widget_16_tab_3';

@Component({
  selector: 'app-tables-widget16',
  templateUrl: './tables-widget16.component.html',
  styleUrl: './tables-widget16.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget16Component {
  currentMonthYear: string;
  lastMonthYear: string;
  thisMonthFastag: number;
  lastMonthFastag: number;
  thisMonthYearFastag: string;
  lastMonthYearFastag: string;
  fastagEntityTransactionList: any;
  sumFastagEntityAll: any;
  sumFastagTransactionAll: any;
  sumFastagTransactionAllPre: any;
  sumFastagTransactionAllCurrent: any;
  sumFastagTransactionPaymentAllCurrent: any;
  currentFuelCreditSalesDataAll: any;
  preFuelCreditSalesDataAll: any;
  currentAccountCRPaymentAllData: any;
  preAccountCRPaymentAllData: any;
  allFastagEntityTransactionList: any = [];
  allFastagEntityTransactionCurrentPayList: any = [];
  allFastagEntityTransactionPrePurList: any = [];
  currentFuelCreditSalesData: any = [];
  allFastagEntityTransactionPrePayList: any = [];
  preFuelCreditSalesData: any = [];
  currentAccountCRPaymentAllBYentityData: any = [];
  preAccountCRPaymentAllBYentityData: any = [];
  allfastagTransactionData: any = [];
  fastagTransactionExcelTWO: any = [];

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private excelService: ExcelService) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  activeTab: Tabs = 'kt_table_widget_16_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }
  ngOnInit(): void {
    this.currentMonthYear = moment(new Date()).format("MMM y")
    this.lastMonthYear = moment(new Date()).subtract(1, 'month').format("MMM y")
    this.getAllFastagDetails()
    this.cd.detectChanges();
  }


  getAllFastagDetails() {
    this.thisMonthFastag = new Date().getMonth();
    this.lastMonthFastag = new Date().getMonth() - 1;
    this.thisMonthYearFastag = moment(new Date()).format("MMM y")
    this.lastMonthYearFastag = moment(new Date()).subtract(1, 'month').format("MMM y")
    let data = {

    }
    this.post.getAllFastagTransactionDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fastagEntityTransactionList = res
          this.sumFastagEntityAll = res.allEntity
          if (res.preData.length) {
            this.sumFastagTransactionAll = res.preData[0].allPurchaseTransaction
          }
          if (res.prePaymentDetails.length) {
            this.sumFastagTransactionAllPre = res.prePaymentDetails[0].allPaymentTransaction
          }
          if (res.curData.length) {
            this.sumFastagTransactionAllCurrent = res.curData[0].allPurchaseTransaction
          }
          if (res.curPaymentData1.length) {
            this.sumFastagTransactionPaymentAllCurrent = res.curPaymentData1[0].allPaymentTransaction
          }
          if (res.currentFuelCreditSalesAllData.length) {
            this.currentFuelCreditSalesDataAll = res.currentFuelCreditSalesAllData[0].fuelCreditAmount
          }
          if (res.preFuelCreditSalesAllData.length) {
            this.preFuelCreditSalesDataAll = res.preFuelCreditSalesAllData[0].fuelCreditAmount
          }

          if (res.currentAccountCRPaymentAllData.length) {
            this.currentAccountCRPaymentAllData = res.currentAccountCRPaymentAllData[0].grandTotalAmountAll
          }
          if (res.preAccountCRPaymentAllData.length) {
            this.preAccountCRPaymentAllData = res.preAccountCRPaymentAllData[0].grandTotalAmountAll
          }

          this.allFastagEntityTransactionList = res.curData1
          this.allFastagEntityTransactionCurrentPayList = res.curPaymentData
          this.allFastagEntityTransactionPrePurList = res.preData1
          this.allFastagEntityTransactionPrePayList = res.preAllPayment
          this.currentFuelCreditSalesData = res.currentFuelCreditSalesData
          this.preFuelCreditSalesData = res.preFuelCreditSalesData

          this.currentAccountCRPaymentAllBYentityData = res.currentAccountCRPaymentAllBYentityData
          this.preAccountCRPaymentAllBYentityData = res.preAccountCRPaymentAllBYentityData

          this.combineFastag()
          this.cd.detectChanges();

        } else {
        }
      });
  }

  combineFastag() {
    this.sumFastagEntityAll.map((res: { entityId: string; }) => {
      let fastagJson = {
        entityId: "",
        previousPurchase: 0,
        previousPayment: 0,
        currentPurchase: 0,
        currentPayment: 0,
        currentFuelCreditSalesData: 0,
        preFuelCreditSalesData: 0,
        currentAccountTransactionForCR: 0,
        preAccountTransactionForCR: 0,

      };
      fastagJson.entityId = res.entityId
      this.allFastagEntityTransactionList.map((res1: { entityId: any; allPurchaseTransaction: number; }) => {
        if (res.entityId == res1.entityId) {
          fastagJson.currentPurchase = res1.allPurchaseTransaction
        }
      })
      this.allFastagEntityTransactionCurrentPayList.map((res2: { entityId: string; allPaymentTransaction: number; }) => {
        if (res.entityId == res2.entityId) {
          fastagJson.currentPayment = res2.allPaymentTransaction
        }
      })
      this.allFastagEntityTransactionPrePayList.map((res3: { entityId: string; allPaymentTransaction: number; }) => {
        if (res.entityId == res3.entityId) {
          fastagJson.previousPayment = res3.allPaymentTransaction
        }
      })
      this.allFastagEntityTransactionPrePurList.map((res4: { entityId: string; allPurchaseTransaction: number; }) => {
        if (res.entityId == res4.entityId) {
          fastagJson.previousPurchase = res4.allPurchaseTransaction
        }
      })
      this.currentFuelCreditSalesData.map((res5: { entityId: string; fuelCreditAmount: number; }) => {
        if (res.entityId == res5.entityId) {
          fastagJson.currentFuelCreditSalesData = res5.fuelCreditAmount
        }

      }),
        this.preFuelCreditSalesData.map((res6: { entityId: string; fuelCreditAmount: number; }) => {
          if (res.entityId == res6.entityId) {
            fastagJson.preFuelCreditSalesData = res6.fuelCreditAmount
          }

        }),

        this.preAccountCRPaymentAllBYentityData.map((res7: { entityId: string; grandTotalAmountAll: number; }) => {
          if (res.entityId == res7.entityId) {
            fastagJson.preAccountTransactionForCR = res7.grandTotalAmountAll
          }

        }),
        this.currentAccountCRPaymentAllBYentityData.map((res8: { entityId: string; grandTotalAmountAll: number; }) => {
          if (res.entityId == res8.entityId) {

            fastagJson.currentAccountTransactionForCR = res8.grandTotalAmountAll
          }
        }),

        this.allfastagTransactionData.push(fastagJson)
    })
    this.allfastagTransactionData = this.allfastagTransactionData.sort((a: { entityId: number; }, b: { entityId: number; }) => (a.entityId < b.entityId ? -1 : 1 && a.entityId < b.entityId ? -1 : 1));

    this.cd.detectChanges();

  }

  /*name of the excel-file which will be downloaded. */
  fileName = 'fastag Transaction Excel.xlsx';

  exportexcel(): void {
  
    this.fastagTransactionExcelTWO.length = 0
  
    this.allfastagTransactionData.map((res: { entityId: any; currentPurchase: any; currentPayment: any; currentFuelCreditSalesData: any; preAccountTransactionForCR: any; previousPurchase: any; previousPayment: any; preFuelCreditSalesData: any; currentAccountTransactionForCR: any; }) => {
  
      let json = {

        EntityId: res.entityId,
        LastMonthTollPayment: res.currentPurchase ,
        LastMonthTollRecharge: res.currentPayment ,
        LastMonthFuelCredit: res.currentFuelCreditSalesData ,
        LastMonthFuelCreditPayment: res.preAccountTransactionForCR ,
        CurrentMonthTollPayment: res.previousPurchase ,
        CurrentMonthTollRecharge: res.previousPayment ,
        CurrentMonthFuelCredit: res.preFuelCreditSalesData ,
        CurrentMonthFuelCreditPayment: res.currentAccountTransactionForCR ,
  
      };
  
      this.fastagTransactionExcelTWO.push(json);
    });
  
    this.excelService.exportAsExcelFile(
      this.fastagTransactionExcelTWO,
      "fastag Transaction Excel TWO"

    );
  
  }
}
