import { ChangeDetectorRef, Component, Injectable, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { StatsService } from '../stats.services';
import { NgxSpinnerService } from 'ngx-spinner';
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

@Component({
  selector: 'app-stats-widget9',
  templateUrl: './stats-widget9.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class StatsWidget9Component {
  @Input() title = '';

  acceesGroup: any;
  activityCountDetailsDealer: any = [];
  activityCountDetailsTransporter: any[];
  activityCountDetailsDealerAPP: any[];
  activityCountDetailsTransporterAPP: any[];
  activityCountTransporters: any[];
  activityCountDealers: any[];
  activityCountTransporter: any[];

  filter = new FormGroup({
    dealer: new FormControl(""),
    transporter: new FormControl(""),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  })

  dealerName: boolean = false;
  transportName: boolean = false;
  transportsName: any;
  dealersName: any;
  activityCountDetailsDealerExcel: any = [];
  activityCountDetailsTransporterExcel: any = [];
  activityCountDetailsDealerAPPExcel: any = [];
  activityCountDetailsTransporterAPPExcel: any = [];
  activeUserDetailsExcel: any = [];
  personId: any;
  allKitNumber: any = [];
  allKitNumber1: any = [];

  allEntityList: any = [];
  getAllKitNumbers: any = [];
  fastagVichleDataKit: any = [];
  kbMapid: any;
  kitNo: any;
  parentId: any;
  modalReference: any;
  closeResult: string;

  updateKitForm = new FormGroup({
    kbMapid: new FormControl('', Validators.required),
    kitNo: new FormControl('', Validators.required),
    entityId: new FormControl('', Validators.required),
  });
  entityId: any;
  allKitNumberExcel: any = [];
  activeUserDetails: any = [];
  activeCorporate: any;
  isPORTAL: boolean = false;
  isAPP: boolean = false;


  constructor(
    private post: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
  ) {
    const currentDate = new Date();
    const year = moment(new Date()).subtract(1, 'year').format("YYYY");
    config.minDate = { year: 2020, month: 4, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    // config.outsideDays = 'hidden';
  }
  ngOnInit(): void {
    if (this.title == "PORTAL") {
      this.isPORTAL = true;
      this.isAPP = false;
    } else if (this.title == "APP") {
      this.isAPP = true;
      this.isPORTAL = false;
    }
    this.getAllActiveuser();
  }

  getAllActiveuser() {
    let data = {}
    this.post.getAllActiveUserDetailsPost(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.activeUserDetails = res.data;
          } else {
            this.activeUserDetails = [];
          }
          this.cd.detectChanges();
        }
        else {
          this.cd.detectChanges();
        }
      })
  }

  selectActiveUserFilter(id: any) {
    this.activeCorporate = id.target.value
    this.cd.detectChanges();
  }

  getactiveUserFilter() {
    this.activeUserDetails = [];
    if (this.filter.value.startDate && this.filter.value.endDate) {
      if (this.activeCorporate) {
        let data = {
          activeUserCorporateId: this.activeCorporate,
          startDate: moment(this.filter.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filter.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        this.post.getActiveUserDetailsByCorpIdPost(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                this.activeUserDetails = res.data;
              } else {
                this.activeUserDetails = [];
              }
              this.cd.detectChanges();
            }
            else {
              this.cd.detectChanges();
            }
          })
      } else {
        alert('please select corporate')

      }
    } else {
      alert('please select start date and end date')
    }
  }

  excelDownload() {
    this.activeUserDetailsExcel.length = 0
    this.activeUserDetails.map((res: any) => {
      let json = {
        date: res.activeUserCountCreatedOn,
        userName: res.activeUserName,
        companyName: res.activeUserCompanyName,
        mobileNumber: res.activeUserMobileNumber,
        role: res.activeUserRole
      };
      this.activeUserDetailsExcel.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.activeUserDetailsExcel,
      "ActiveUserDetails"
    );
  }



}