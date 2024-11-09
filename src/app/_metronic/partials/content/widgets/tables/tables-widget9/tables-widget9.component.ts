import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import * as XLSX from 'xlsx';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';

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
  | 'kt_table_widget_9_tab_1'
  | 'kt_table_widget_9_tab_2'
  | 'kt_table_widget_9_tab_3';


@Component({
  selector: 'app-tables-widget9',
  templateUrl: './tables-widget9.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget9Component {
  allEntityIdLQList: any = [];
  entityId: any;
  customerId: any;
  monthYrLQ1: string;
  monthYrLQ2: string;
  monthYrLQ4: string;
  monthYrLQ3: string;
  monthYrLQ5: string;
  monthYrLQ6: string;
  monthYrLQ7: string;
  monthYrLQ8: string;
  monthYrLQ9: string;
  monthYrLQ10: string;
  monthYrLQ11: string;
  monthYrLQ12: string;
  crSalesMonthLQ1: any;
  crSalesMonthLQ2: any;
  crSalesMonthLQ3: any;
  crSalesMonthLQ4: any;
  crSalesMonthLQ5: any;
  crSalesMonthLQ6: any;
  crSalesMonthLQ7: any;
  crSalesMonthLQ8: any;
  crSalesMonthLQ9: any;
  crSalesMonthLQ10: any;
  crSalesMonthLQ11: any;
  crSalesMonthLQ12: any;
  crPaymentMonthLQ1: any;
  crPaymentMonthLQ2: any;
  crPaymentMonthLQ3: any;
  crPaymentMonthLQ4: any;
  crPaymentMonthLQ5: any;
  crPaymentMonthLQ6: any;
  crPaymentMonthLQ7: any;
  crPaymentMonthLQ8: any;
  crPaymentMonthLQ9: any;
  crPaymentMonthLQ10: any;
  crPaymentMonthLQ11: any;
  crPaymentMonthLQ12: any;
  tollPaymentsLQ1: any;
  tollPaymentsLQ2: any;
  tollPaymentsLQ3: any;
  tollPaymentsLQ4: any;
  tollPaymentsLQ5: any;
  tollPaymentsLQ6: any;
  tollPaymentsLQ7: any;
  tollPaymentsLQ8: any;
  tollPaymentsLQ9: any;
  tollPaymentsLQ10: any;
  tollPaymentsLQ11: any;
  tollPaymentsLQ12: any;
  tollRechargeLQ3: any;
  tollRechargeLQ2: any;
  tollRechargeLQ1: any;
  tollRechargeLQ4: any;
  tollRechargeLQ5: any;
  tollRechargeLQ6: any;
  tollRechargeLQ7: any;
  tollRechargeLQ8: any;
  tollRechargeLQ9: any;
  tollRechargeLQ10: any;
  tollRechargeLQ11: any;
  tollRechargeLQ12: any;

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

  activeTab: Tabs = 'kt_table_widget_9_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }
  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    this.allEntityIdLQList = JSON.parse(localStorage.getItem('allEntityIdLQList') || '{}');
    if (!this.allEntityIdLQList.length) {
      this.getAllLQEntity();
    } else {
      this.getAllLQEntity1();
    }
    this.getCRForFastagLQ()
    this.getTranslogForFastagLQ()
    this.getpaymentForFastagLQ()
    this.getRechargeForFastagLQ()
    this.cd.detectChanges();
  }

  getAllLQEntity() {
    this.spinner.show()
    let data = {

    }
    this.post.getEntityIdAllLQPOST(data)
      .subscribe(res => {
        this.allEntityIdLQList = res.data
        localStorage.setItem('allEntityIdLQList', JSON.stringify(res.data));
        this.cd.detectChanges();
        this.spinner.hide()
      })
  }

  getAllLQEntity1() {
    let data = {

    }
    this.post.getEntityIdAllLQPOST(data)
      .subscribe(res => {
        this.allEntityIdLQList = res.data
        localStorage.setItem('allEntityIdLQList', JSON.stringify(res.data));
        this.cd.detectChanges();
        this.spinner.hide()
      })
  }

  getcustomerIdByEntityLQ(id: any) {
    this.entityId = id.target.value
    if (this.entityId) {
      this.customerIdByEntityLQ(this.entityId);
      this.getpaymentForFastagLQ();
      this.getRechargeForFastagLQ();
      this.cd.detectChanges();
    } else {

    }
  }

  customerIdByEntityLQ(entityId: any) {
    let data = {
      entityId: entityId
    }
    this.post.getcustmerIdByEntityIdLQPOST(data)
      .subscribe(res => {
        this.customerId = res.data[0].corporateId
        this.getTranslogForFastagLQ();
        this.getCRForFastagLQ();
        this.cd.detectChanges();
      })
  }

  //getCRForFastagPOST
  getCRForFastagLQ() {
    if (this.customerId) {
      this.spinner.show()
      let data = {
        customerId: this.customerId
      };
      this.post.getCRForFastagLQPOST(data)
        .subscribe((res) => {
          if (res.status == 'OK') {

            this.monthYrLQ1 = moment(res.data1[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ2 = moment(res.data2[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ3 = moment(res.data3[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ4 = moment(res.data4[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ5 = moment(res.data5[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ6 = moment(res.data6[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ7 = moment(res.data7[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ8 = moment(res.data8[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ9 = moment(res.data9[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ10 = moment(res.data10[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ11 = moment(res.data11[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ12 = moment(res.data12[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")

            if (res.data1[0].creditAmount) {
              this.crSalesMonthLQ1 = res.data1[0].creditAmount;
            } else { this.crSalesMonthLQ1 = 0 }

            if (res.data2[0].creditAmount) {
              this.crSalesMonthLQ2 = res.data2[0].creditAmount;
            } else { this.crSalesMonthLQ2 = 0 }

            if (res.data3[0].creditAmount) {
              this.crSalesMonthLQ3 = res.data3[0].creditAmount;
            } else { this.crSalesMonthLQ3 = 0 }

            if (res.data4[0].creditAmount) {
              this.crSalesMonthLQ4 = res.data4[0].creditAmount;
            } else { this.crSalesMonthLQ4 = 0 }

            if (res.data5[0].creditAmount) {
              this.crSalesMonthLQ5 = res.data5[0].creditAmount;
            } else { this.crSalesMonthLQ5 = 0 }

            if (res.data6[0].creditAmount) {
              this.crSalesMonthLQ6 = res.data6[0].creditAmount;
            } else { this.crSalesMonthLQ6 = 0 }

            if (res.data7[0].creditAmount) {
              this.crSalesMonthLQ7 = res.data7[0].creditAmount;
            } else { this.crSalesMonthLQ7 = 0 }

            if (res.data8[0].creditAmount) {
              this.crSalesMonthLQ8 = res.data8[0].creditAmount;
            } else { this.crSalesMonthLQ8 = 0 }

            if (res.data9[0].creditAmount) {
              this.crSalesMonthLQ9 = res.data9[0].creditAmount;
            } else { this.crSalesMonthLQ9 = 0 }

            if (res.data10[0].creditAmount) {
              this.crSalesMonthLQ10 = res.data10[0].creditAmount;
            } else { this.crSalesMonthLQ10 = 0 }

            if (res.data11[0].creditAmount) {
              this.crSalesMonthLQ11 = res.data11[0].creditAmount;
            } else { this.crSalesMonthLQ11 = 0 }

            if (res.data12[0].creditAmount) {
              this.crSalesMonthLQ12 = res.data12[0].creditAmount;
            } else { this.crSalesMonthLQ12 = 0 }

            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        });
    } else {
      this.spinner.show()
      let data = {

      };
      this.post.getCRForFastagLQPOST(data)
        .subscribe((res) => {
          if (res.status == 'OK') {

            this.monthYrLQ1 = moment(res.data1[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ2 = moment(res.data2[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ3 = moment(res.data3[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ4 = moment(res.data4[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ5 = moment(res.data5[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ6 = moment(res.data6[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ7 = moment(res.data7[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ8 = moment(res.data8[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ9 = moment(res.data9[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ10 = moment(res.data10[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ11 = moment(res.data11[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")
            this.monthYrLQ12 = moment(res.data12[0].estimatedRefuelDate, ["YYYY-MM-DD"]).format("MMM-YYYY")

            if (res.data1[0].creditAmount) {
              this.crSalesMonthLQ1 = res.data1[0].creditAmount;
            } else { this.crSalesMonthLQ1 = 0 }

            if (res.data2[0].creditAmount) {
              this.crSalesMonthLQ2 = res.data2[0].creditAmount;
            } else { this.crSalesMonthLQ2 = 0 }

            if (res.data3[0].creditAmount) {
              this.crSalesMonthLQ3 = res.data3[0].creditAmount;
            } else { this.crSalesMonthLQ3 = 0 }

            if (res.data4[0].creditAmount) {
              this.crSalesMonthLQ4 = res.data4[0].creditAmount;
            } else { this.crSalesMonthLQ4 = 0 }

            if (res.data5[0].creditAmount) {
              this.crSalesMonthLQ5 = res.data5[0].creditAmount;
            } else { this.crSalesMonthLQ5 = 0 }

            if (res.data6[0].creditAmount) {
              this.crSalesMonthLQ6 = res.data6[0].creditAmount;
            } else { this.crSalesMonthLQ6 = 0 }

            if (res.data7[0].creditAmount) {
              this.crSalesMonthLQ7 = res.data7[0].creditAmount;
            } else { this.crSalesMonthLQ7 = 0 }

            if (res.data8[0].creditAmount) {
              this.crSalesMonthLQ8 = res.data8[0].creditAmount;
            } else { this.crSalesMonthLQ8 = 0 }

            if (res.data9[0].creditAmount) {
              this.crSalesMonthLQ9 = res.data9[0].creditAmount;
            } else { this.crSalesMonthLQ9 = 0 }

            if (res.data10[0].creditAmount) {
              this.crSalesMonthLQ10 = res.data10[0].creditAmount;
            } else { this.crSalesMonthLQ10 = 0 }

            if (res.data11[0].creditAmount) {
              this.crSalesMonthLQ11 = res.data11[0].creditAmount;
            } else { this.crSalesMonthLQ11 = 0 }

            if (res.data12[0].creditAmount) {
              this.crSalesMonthLQ12 = res.data12[0].creditAmount;
            } else { this.crSalesMonthLQ12 = 0 }

            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        });
    }
  }

  //getTranslogForFastagPOST
  getTranslogForFastagLQ() {
    if (this.customerId) {
      this.spinner.show()
      let data = {
        customerId: this.customerId
      };
      this.post.getTranslogForFastagLQPOST(data)
        .subscribe((res) => {
          if (res.status == 'OK') {

            if (res.data1[0].grandTotalAmount) {
              this.crPaymentMonthLQ1 = res.data1[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ1 = 0 }

            if (res.data2[0].grandTotalAmount) {
              this.crPaymentMonthLQ2 = res.data2[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ2 = 0 }

            if (res.data3[0].grandTotalAmount) {
              this.crPaymentMonthLQ3 = res.data3[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ3 = 0 }

            if (res.data4[0].grandTotalAmount) {
              this.crPaymentMonthLQ4 = res.data4[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ4 = 0 }

            if (res.data5[0].grandTotalAmount) {
              this.crPaymentMonthLQ5 = res.data5[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ5 = 0 }

            if (res.data6[0].grandTotalAmount) {
              this.crPaymentMonthLQ6 = res.data6[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ6 = 0 }

            if (res.data7[0].grandTotalAmount) {
              this.crPaymentMonthLQ7 = res.data7[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ7 = 0 }

            if (res.data8[0].grandTotalAmount) {
              this.crPaymentMonthLQ8 = res.data8[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ8 = 0 }

            if (res.data9[0].grandTotalAmount) {
              this.crPaymentMonthLQ9 = res.data9[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ9 = 0 }

            if (res.data10[0].grandTotalAmount) {
              this.crPaymentMonthLQ10 = res.data10[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ10 = 0 }

            if (res.data11[0].grandTotalAmount) {
              this.crPaymentMonthLQ11 = res.data11[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ11 = 0 }

            if (res.data12[0].grandTotalAmount) {
              this.crPaymentMonthLQ12 = res.data12[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ12 = 0 }

            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        });
    } else {
      this.spinner.show()
      let data = {

      };
      this.post.getTranslogForFastagLQPOST(data)
        .subscribe((res) => {
          if (res.status == 'OK') {

            if (res.data1[0].grandTotalAmount) {
              this.crPaymentMonthLQ1 = res.data1[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ1 = 0 }

            if (res.data2[0].grandTotalAmount) {
              this.crPaymentMonthLQ2 = res.data2[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ2 = 0 }

            if (res.data3[0].grandTotalAmount) {
              this.crPaymentMonthLQ3 = res.data3[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ3 = 0 }

            if (res.data4[0].grandTotalAmount) {
              this.crPaymentMonthLQ4 = res.data4[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ4 = 0 }

            if (res.data5[0].grandTotalAmount) {
              this.crPaymentMonthLQ5 = res.data5[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ5 = 0 }

            if (res.data6[0].grandTotalAmount) {
              this.crPaymentMonthLQ6 = res.data6[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ6 = 0 }

            if (res.data7[0].grandTotalAmount) {
              this.crPaymentMonthLQ7 = res.data7[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ7 = 0 }

            if (res.data8[0].grandTotalAmount) {
              this.crPaymentMonthLQ8 = res.data8[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ8 = 0 }

            if (res.data9[0].grandTotalAmount) {
              this.crPaymentMonthLQ9 = res.data9[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ9 = 0 }

            if (res.data10[0].grandTotalAmount) {
              this.crPaymentMonthLQ10 = res.data10[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ10 = 0 }

            if (res.data11[0].grandTotalAmount) {
              this.crPaymentMonthLQ11 = res.data11[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ11 = 0 }

            if (res.data12[0].grandTotalAmount) {
              this.crPaymentMonthLQ12 = res.data12[0].grandTotalAmount;
            } else { this.crPaymentMonthLQ12 = 0 }

            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        });
    }

  }


  //getpaymentForFastagPOST
  getpaymentForFastagLQ() {
    if (this.entityId) {
      this.spinner.show()
      let data = {
        fastagTransactionEntityId: this.entityId
      };
      this.post.getpaymentForFastagLQPOST(data)
        .subscribe((res) => {
          if (res.status == 'OK') {

            if (res.data1[0].allPaymentTransaction) {
              this.tollPaymentsLQ1 = res.data1[0].allPaymentTransaction;
            } else {
              this.tollPaymentsLQ1 = 0
            }

            if (res.data2[0].allPaymentTransaction) {
              this.tollPaymentsLQ2 = res.data2[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ2 = 0 }

            if (res.data3[0].allPaymentTransaction) {
              this.tollPaymentsLQ3 = res.data3[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ3 = 0 }

            if (res.data4[0].allPaymentTransaction) {
              this.tollPaymentsLQ4 = res.data4[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ4 = 0 }

            if (res.data5[0].allPaymentTransaction) {
              this.tollPaymentsLQ5 = res.data5[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ5 = 0 }

            if (res.data6[0].allPaymentTransaction) {
              this.tollPaymentsLQ6 = res.data6[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ6 = 0 }

            if (res.data7[0].allPaymentTransaction) {
              this.tollPaymentsLQ7 = res.data7[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ7 = 0 }

            if (res.data8[0].allPaymentTransaction) {
              this.tollPaymentsLQ8 = res.data8[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ8 = 0 }

            if (res.data9[0].allPaymentTransaction) {
              this.tollPaymentsLQ9 = res.data9[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ9 = 0 }

            if (res.data10[0].allPaymentTransaction) {
              this.tollPaymentsLQ10 = res.data10[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ10 = 0 }

            if (res.data11[0].allPaymentTransaction) {
              this.tollPaymentsLQ11 = res.data11[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ11 = 0 }

            if (res.data12[0].allPaymentTransaction) {
              this.tollPaymentsLQ12 = res.data12[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ12 = 0 }

            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        });
    } else {
      this.spinner.show()
      let data = {

      };
      this.post.getpaymentForFastagLQPOST(data)
        .subscribe((res) => {
          if (res.status == 'OK') {

            if (res.data1[0].allPaymentTransaction) {
              this.tollPaymentsLQ1 = res.data1[0].allPaymentTransaction;
            } else {
              this.tollPaymentsLQ1 = 0
            }

            if (res.data2[0].allPaymentTransaction) {
              this.tollPaymentsLQ2 = res.data2[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ2 = 0 }

            if (res.data3[0].allPaymentTransaction) {
              this.tollPaymentsLQ3 = res.data3[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ3 = 0 }

            if (res.data4[0].allPaymentTransaction) {
              this.tollPaymentsLQ4 = res.data4[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ4 = 0 }

            if (res.data5[0].allPaymentTransaction) {
              this.tollPaymentsLQ5 = res.data5[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ5 = 0 }

            if (res.data6[0].allPaymentTransaction) {
              this.tollPaymentsLQ6 = res.data6[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ6 = 0 }

            if (res.data7[0].allPaymentTransaction) {
              this.tollPaymentsLQ7 = res.data7[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ7 = 0 }

            if (res.data8[0].allPaymentTransaction) {
              this.tollPaymentsLQ8 = res.data8[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ8 = 0 }

            if (res.data9[0].allPaymentTransaction) {
              this.tollPaymentsLQ9 = res.data9[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ9 = 0 }

            if (res.data10[0].allPaymentTransaction) {
              this.tollPaymentsLQ10 = res.data10[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ10 = 0 }

            if (res.data11[0].allPaymentTransaction) {
              this.tollPaymentsLQ11 = res.data11[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ11 = 0 }

            if (res.data12[0].allPaymentTransaction) {
              this.tollPaymentsLQ12 = res.data12[0].allPaymentTransaction;
            } else { this.tollPaymentsLQ12 = 0 }

            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        });
    }

  }

  //getRechargeForFastagPOST
  getRechargeForFastagLQ() {
    if (this.entityId) {
      this.spinner.show()
      let data = {
        fastagTransactionEntityId: this.entityId
      };
      this.post.getRechargeForFastagLQPOST(data)
        .subscribe((res) => {
          if (res.status == 'OK') {

            if (res.data1[0].allPaymentTransaction) {
              this.tollRechargeLQ1 = res.data1[0].allPaymentTransaction;
            } else { this.tollRechargeLQ1 = 0 }

            if (res.data2[0].allPaymentTransaction) {
              this.tollRechargeLQ2 = res.data2[0].allPaymentTransaction;
            } else { this.tollRechargeLQ2 = 0 }

            if (res.data3[0].allPaymentTransaction) {
              this.tollRechargeLQ3 = res.data3[0].allPaymentTransaction;
            } else { this.tollRechargeLQ3 = 0 }

            if (res.data4[0].allPaymentTransaction) {
              this.tollRechargeLQ4 = res.data4[0].allPaymentTransaction;
            } else { this.tollRechargeLQ4 = 0 }

            if (res.data5[0].allPaymentTransaction) {
              this.tollRechargeLQ5 = res.data5[0].allPaymentTransaction;
            } else { this.tollRechargeLQ5 = 0 }

            if (res.data6[0].allPaymentTransaction) {
              this.tollRechargeLQ6 = res.data6[0].allPaymentTransaction;
            } else { this.tollRechargeLQ6 = 0 }

            if (res.data7[0].allPaymentTransaction) {
              this.tollRechargeLQ7 = res.data7[0].allPaymentTransaction;
            } else { this.tollRechargeLQ7 = 0 }

            if (res.data8[0].allPaymentTransaction) {
              this.tollRechargeLQ8 = res.data8[0].allPaymentTransaction;
            } else { this.tollRechargeLQ8 = 0 }

            if (res.data9[0].allPaymentTransaction) {
              this.tollRechargeLQ9 = res.data9[0].allPaymentTransaction;
            } else { this.tollRechargeLQ9 = 0 }

            if (res.data10[0].allPaymentTransaction) {
              this.tollRechargeLQ10 = res.data10[0].allPaymentTransaction;
            } else { this.tollRechargeLQ10 = 0 }

            if (res.data11[0].allPaymentTransaction) {
              this.tollRechargeLQ11 = res.data11[0].allPaymentTransaction;
            } else { this.tollRechargeLQ11 = 0 }

            if (res.data12[0].allPaymentTransaction) {
              this.tollRechargeLQ12 = res.data12[0].allPaymentTransaction;
            } else { this.tollRechargeLQ12 = 0 }

            this.spinner.hide()
            this.cd.detectChanges();

          } else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        });
    } else {
      this.spinner.show()
      let data = {

      };
      this.post.getRechargeForFastagLQPOST(data)
        .subscribe((res) => {
          if (res.status == 'OK') {

            if (res.data1[0].allPaymentTransaction) {
              this.tollRechargeLQ1 = res.data1[0].allPaymentTransaction;
            } else { this.tollRechargeLQ1 = 0 }

            if (res.data2[0].allPaymentTransaction) {
              this.tollRechargeLQ2 = res.data2[0].allPaymentTransaction;
            } else { this.tollRechargeLQ2 = 0 }

            if (res.data3[0].allPaymentTransaction) {
              this.tollRechargeLQ3 = res.data3[0].allPaymentTransaction;
            } else { this.tollRechargeLQ3 = 0 }

            if (res.data4[0].allPaymentTransaction) {
              this.tollRechargeLQ4 = res.data4[0].allPaymentTransaction;
            } else { this.tollRechargeLQ4 = 0 }

            if (res.data5[0].allPaymentTransaction) {
              this.tollRechargeLQ5 = res.data5[0].allPaymentTransaction;
            } else { this.tollRechargeLQ5 = 0 }

            if (res.data6[0].allPaymentTransaction) {
              this.tollRechargeLQ6 = res.data6[0].allPaymentTransaction;
            } else { this.tollRechargeLQ6 = 0 }

            if (res.data7[0].allPaymentTransaction) {
              this.tollRechargeLQ7 = res.data7[0].allPaymentTransaction;
            } else { this.tollRechargeLQ7 = 0 }

            if (res.data8[0].allPaymentTransaction) {
              this.tollRechargeLQ8 = res.data8[0].allPaymentTransaction;
            } else { this.tollRechargeLQ8 = 0 }

            if (res.data9[0].allPaymentTransaction) {
              this.tollRechargeLQ9 = res.data9[0].allPaymentTransaction;
            } else { this.tollRechargeLQ9 = 0 }

            if (res.data10[0].allPaymentTransaction) {
              this.tollRechargeLQ10 = res.data10[0].allPaymentTransaction;
            } else { this.tollRechargeLQ10 = 0 }

            if (res.data11[0].allPaymentTransaction) {
              this.tollRechargeLQ11 = res.data11[0].allPaymentTransaction;
            } else { this.tollRechargeLQ11 = 0 }

            if (res.data12[0].allPaymentTransaction) {
              this.tollRechargeLQ12 = res.data12[0].allPaymentTransaction;
            } else { this.tollRechargeLQ12 = 0 }
            this.spinner.hide()
            this.cd.detectChanges();

          } else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        });
    }
  }

  exportToPDF() {
    var doc = new jsPDF('l', 'pt');

    autoTable(doc, {
      html: '#excel-table',
      startY: 80,

      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("FastagDetails.pdf");
  }

  /*name of the excel-file which will be downloaded. */
  fileName = 'FastagDetails.xlsx';

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
