import { Component, OnInit, Input, Injectable, ChangeDetectorRef } from '@angular/core';
import { LayoutService } from '../../../../../layout';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TilesService } from '../../tiles/tiles.services';
import { TransTablesService } from '../trans-tables.service';
import { FormControl, FormGroup } from '@angular/forms';
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
  selector: 'app-trans-tables-widget1',
  templateUrl: './trans-tables-widget1.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TransTablesWidget1Component implements OnInit {
  basicTrip = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  fuelDealerId: any;
  accessGroup: any;
  thisMonthYear = moment(new Date()).format("MMM y")
  lastMonthYear = moment(new Date()).subtract(1, 'month').format("MMM y")
  corporateId: any;
  sqlCorporateId: any;
  hostPhone: any;
  isPurchasePayment: boolean = false;
  crData: any = [];
  currentMonth: any;
  currentMonthPurchase: any;
  currentMonthPayment: any;
  lastMon: any;
  lastMonthPurchase: any;
  lastMonthPayment: any;
  FT: boolean = false;
  fastagId: any;
  thrLimit: any;
  isActive: any;
  bothFT: boolean = false;
  LQFT: boolean = false;
  LQ: boolean = false;
  customerId: any;
  sumAllprevious: any;
  sumAllcurrent: any;
  sumAllpreviousRecharge: any;
  sumAllcurrentRecharge: any;
  liquikPrevPayment: any;
  livquikPrevRecharge: any;
  livquikPayment: any;
  livquikRecharge: any;
  thisMonthBillPayment: any;
  lastMonthBillPayment: any;
  lastMonthCrSale: number;
  lastMonthCrPayment: number;
  thisMonthCrSale: number;
  thisMonthCrPayment: number;
  totalPurchase: number;
  totalPayment: number;
  totalOutstanding: any;
  avlBalanceLQ: any;
  avlBalance: any;
  last2Mon: string;
  isCreditPayable: boolean = false;
  transporterCorpId: string | null;

  constructor(private cd: ChangeDetectorRef,
    private post: TransTablesService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    config: NgbDatepickerConfig,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }


  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    var transporterData = JSON.parse(localStorage.getItem('transporterData') || '');
    this.transporterCorpId = localStorage.getItem('transporterCorpId');
    this.accessGroup = element.accessGroupId
    this.corporateId = element.veelsPlusCorporateID;
    this.customerId = transporterData.customerId
    this.hostPhone = transporterData.phone1;
    this.currentMonth = moment(new Date()).format("MMM")
    this.lastMon = moment(new Date()).subtract(1, 'month').format("MMM")
    this.last2Mon = moment(new Date()).subtract(2, 'month').format("MMM")
    this.getMonthlyCredits(this.transporterCorpId);
    this.getLastMonthCrDetailForTransporter(this.transporterCorpId);
    this.getTotalOutstanding(this.transporterCorpId)
    this.getFastagCorporateByCorpId(this.customerId)
    this.getMonthwiseBillPay(this.hostPhone);
    this.cd.detectChanges()
  }

  getMonthlyCredits(transporterCorpId: any) {
    this.spinner.show()
    let data = {
      fuelCorporateId: transporterCorpId
    }

    this.post.getCreditDetailsByMonthPOST(data)
      .subscribe(res => {
        this.isPurchasePayment = true
        if (res.status == "OK" && res.data.length) {
          this.crData = res.data.reverse()
          console.log(this.crData)
          if (this.currentMonth == this.crData[0].month) {
            this.currentMonthPurchase = this.crData[0].purchase
            this.currentMonthPayment = this.crData[0].payment
            // this.totalOutstanding = this.crData[0].totalOutstand
            if (this.lastMon == this.crData[1].month) {
              this.lastMonthPurchase = this.crData[1].purchase
              this.lastMonthPayment = this.crData[1].payment
            } else {
            }
          } else {
            this.currentMonthPurchase = 0
            this.currentMonthPayment = 0
            // this.totalOutstanding = this.crData[0].totalOutstand
            if (this.lastMon == this.crData[0].month) {
              this.lastMonthPurchase = this.crData[0].purchase
              this.lastMonthPayment = this.crData[0].payment

            } else {
              this.lastMonthPurchase = 0
              this.lastMonthPayment = 0
            }
          }

          console.log("pur0", this.lastMonthPurchase)
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()

        }
      })
  }

  getFastagCorporateByCorpId(transporterCorpId: any) {
    const data = {
      corporateId: transporterCorpId,
    };
    this.post.getFastagCorporateByCorpIdPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        if (res.data.length) {
          this.FT = true
          this.fastagId = res.data[0].entityId
          this.thrLimit = res.data[0].thrLimit
          this.isActive = res.data[0].isActive
          // this.getCorpWalletBalance(this.fastagId)
          this.getAllAmount(this.fastagId)
          // this.getFirstSixMonthDetailsForFastag(res.data[0].entityId)
          if (res.data1.length) {
            this.bothFT = true
            this.LQFT = true
            this.fastagId = res.data1[0].entityId
            this.thrLimit = res.data1[0].thrLimit
            this.isActive = res.data1[0].isActive
            this.getBalanceByEntityIdLQ(this.fastagId)
            this.getlivquikDetails(this.fastagId)

          }
          else {

          }

        } else {
          if (res.data1.length) {
            this.LQFT = true
            this.LQ = true
            this.fastagId = res.data1[0].entityId
            this.thrLimit = res.data1[0].thrLimit
            this.isActive = res.data1[0].isActive
            this.getBalanceByEntityIdLQ(this.fastagId)
            this.getlivquikDetails(this.fastagId)

          }
        }
        this.cd.detectChanges()
      } else {
        this.LQFT = false;
        this.FT = false;
        this.cd.detectChanges()
      }
    });
  }

  getAllAmount(entityId: any) {
    const data = {
      fastagTransactionEntityId: entityId,
    };
    this.post.getFastagCorporateByEntityAllPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        if (res.previousData.length) {
          this.sumAllprevious = res.previousData[0].transactionAmountPrevious
        }
        if (res.currentData.length) {
          this.sumAllcurrent = res.currentData[0].transactionAmountCurrent
        }
        if (res.previousRecharge.length) {
          this.sumAllpreviousRecharge = res.previousRecharge[0].transactionAmountRecharge
        }
        if (res.previousRecharge.length) {
          this.sumAllcurrentRecharge = res.currentRecharge[0].transactionAmountCurrent
        }
        this.cd.detectChanges()
      } else {
        this.cd.detectChanges()
      }
    });
  }

  getlivquikDetails(entityId: any) {
    let data = {
      fastagTransactionEntityId: entityId
    }

    this.post.getFastagCorporateByEntityAllLQPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.previousData[0].transactionAmountPrevious) {
            this.liquikPrevPayment = res.previousData[0].transactionAmountPrevious
          }
          if (res.previousRecharge[0].transactionAmountRecharge) {
            this.livquikPrevRecharge = res.previousRecharge[0].transactionAmountRecharge
          }

          if (res.currentData[0].transactionAmountCurrent) {
            this.livquikPayment = res.currentData[0].transactionAmountCurrent
          }

          if (res.currentRecharge[0].transactionAmountCurrent) {
            this.livquikRecharge = res.currentRecharge[0].transactionAmountCurrent
          }

          this.cd.detectChanges()
        }
      })
  }

  getMonthwiseBillPay(mobileNumber: any) {
    this.spinner.show()
    const data = {
      mobileNumber: mobileNumber,
    };
    this.post.getMonthwiseBillPayPOST(data)
      .subscribe((res) => {
        if (res.status == 'OK') {
          if (res.data[0].billPayAmt) {
            this.thisMonthBillPayment = res.data[0].billPayAmt
            if (res.data1[0].billPayAmt) {
              this.lastMonthBillPayment = res.data1[0].billPayAmt
              this.spinner.hide()
            } else {
              this.spinner.hide()
            }
          } else {
            if (res.data1[0].billPayAmt) {
              this.lastMonthBillPayment = res.data1[0].billPayAmt
              this.spinner.hide()
            } else {
              this.spinner.hide()
            }
          }
          this.cd.detectChanges()

        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getLastMonthCrDetailForTransporter(transporterCorpId: any) {
    let data = {
      corporateId: transporterCorpId,
    };
    this.post.getLastMonthCrDetailsForTransporterPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        this.lastMonthCrSale = Number(res.data[0].totalCrSale);
        this.lastMonthCrPayment = Number(res.data1[0].totalCrPayment);
        this.cd.detectChanges()
      }
    });
  }

  getThisMonthCrDetail(fuelDealerId: any, transporterCorpId: any) {
    let data = {
      fuelDealerId: fuelDealerId,
      corporateId: transporterCorpId,
    };
    this.post.getThisMonthCrDetailsPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        this.thisMonthCrSale = Number(res.data[0].totalCrSale);
        this.thisMonthCrPayment = Number(res.data1[0].totalCrPayment);

        this.totalPurchase =
          Number(res.data2[0].totalCrSale) -
          Number(res.data2[0].totalDiscount);
        this.totalPayment = Number(res.data4[0].totalCrPayment);
        this.getMonthlyCredits(this.transporterCorpId)
        this.getTotalOutstanding(this.transporterCorpId)

        // this.getLastMonthCrDetail(fuelDealerId, corporateId);
        this.cd.detectChanges()

      }
    });
  }

  getTotalOutstanding(transporterCorpId: any) {
    this.spinner.hide();
    let data = {
      fuelCorporateId: transporterCorpId
    }

    this.post.getTotalOutstandingByCorpIdPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.totalOutstanding = res.data[0].netOs
        this.cd.detectChanges()
      }
    })
  }

  getBalanceByEntityIdLQ(id: any) {
    const data = {
      entityId: id,
    };
    this.post.getCorpWalletBalLQPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.avlBalanceLQ = res.data.result[0].balance
        this.cd.detectChanges()
      } else {

        this.cd.detectChanges()
      }
    });
  }

  getCorpWalletBalance(id: any) {
    const data = {
      entityId: id,     //VEELS00003       for Testing
    };
    this.post.getCorpWalletBal(data).subscribe((res) => {
      if (res.status == 'OK') {

        this.avlBalance = res.data.result[0].balance
        this.cd.detectChanges()

      } else {
        this.cd.detectChanges()
      }
    });
  }

}
