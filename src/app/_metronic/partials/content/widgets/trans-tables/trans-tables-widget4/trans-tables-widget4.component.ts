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
  selector: 'app-trans-tables-widget4',
  templateUrl: './trans-tables-widget4.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TransTablesWidget4Component implements OnInit {
  basicTrip = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  fuelDealerId: any;
  accessGroup: any;
  thisMonthYear = moment(new Date()).format("MMM y")
  lastMonthYear = moment(new Date()).subtract(1, 'month').format("MMM y")
  corporateId: any;
  transporterCorpId: any;
  FT: boolean;
  fastagId: any;
  thrLimit: any;
  isActive: any = "NO";
  bothFT: boolean = false;
  LQFT: boolean = false;
  LQ: boolean = false;
  sumAllprevious: any;
  sumAllcurrent: any;
  sumAllpreviousRecharge: any;
  sumAllcurrentRecharge: any;
  liquikPrevPayment: any;
  livquikPrevRecharge: any;
  livquikPayment: any;
  livquikRecharge: any;

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
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.transporterCorpId = localStorage.getItem('transporterCorpId');
    this.accessGroup = element.accessGroupId
    this.corporateId = element.veelsPlusCorporateID;
    this.getFastagCorporateByCorpId(this.transporterCorpId)
    this.cd.detectChanges()
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
          this.getAllAmount(this.fastagId)
          if (res.data1.length) {
            this.bothFT = true
            this.LQFT = true
            this.fastagId = res.data1[0].entityId
            this.thrLimit = res.data1[0].thrLimit
            this.isActive = res.data1[0].isActive
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
}

