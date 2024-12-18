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
  selector: 'app-trans-tables-widget5',
  templateUrl: './trans-tables-widget5.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TransTablesWidget5Component implements OnInit {
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

  titleFastag = "Fastag Payment And Recharge Bar Chart";
  typeFastag = "ColumnChart";
  creditDataFastag = [];
  columnNamesFastag = [
      "Month",
      "Recharge",
      { role: "annotation", type: "string" },
      "Payment",
      { role: "annotation", type: "string" },
  ];

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
          if (res.data1.length) {
            this.bothFT = true
            this.LQFT = true
            this.fastagId = res.data1[0].entityId
            this.thrLimit = res.data1[0].thrLimit
            this.isActive = res.data1[0].isActive

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

}

