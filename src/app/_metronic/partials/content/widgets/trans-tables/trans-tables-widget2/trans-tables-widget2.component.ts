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
  selector: 'app-trans-tables-widget2',
  templateUrl: './trans-tables-widget2.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TransTablesWidget2Component implements OnInit {
  basicTrip = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  fuelDealerId: any;
  accessGroup: any;
  thisMonthYear = moment(new Date()).format("MMM y")
  lastMonthYear = moment(new Date()).subtract(1, 'month').format("MMM y")
  transporterCorpId: any;
  isPurchasePayment: boolean = false;
  crData: any = [];
  currentMonth: any;
  currentMonthPurchase: any;
  currentMonthPayment: any;
  lastMon: any;
  lastMonthPurchase: any;
  lastMonthPayment: any;
  last2Mon: string;

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
    this.transporterCorpId = localStorage.getItem('transporterCorpId');
    this.accessGroup = element.accessGroupId
    this.currentMonth = moment(new Date()).format("MMM")
    this.lastMon = moment(new Date()).subtract(1, 'month').format("MMM")
    this.last2Mon = moment(new Date()).subtract(2, 'month').format("MMM")
    this.getMonthlyCredits(this.transporterCorpId)
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
          this.spinner.hide()
          this.cd.detectChanges()

        } else {
          this.spinner.hide()
          this.cd.detectChanges()

        }
      })
  }

}
