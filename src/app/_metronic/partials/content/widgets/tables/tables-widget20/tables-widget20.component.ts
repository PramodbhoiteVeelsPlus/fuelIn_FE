import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
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
  selector: 'app-tables-widget20',
  templateUrl: './tables-widget20.component.html',
  styleUrl: './tables-widget20.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget20Component {
  filterForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });
  veelsPlusPersonId: any;
  primeDealerData: any = [];
  primeDealerDataSearch: any = [];
  searchData: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  waive: any;
  currStatus: string;
  currentCrStatus: string;
  currentSmsStatus: string;

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private excelService: ExcelService,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.veelsPlusPersonId = element.veelsPlusId;
    this.getPrimeDealerDetails();
    this.cd.detectChanges();
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getPrimeDealerDetails();
  }

  getPrimeDealerDetails() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.primeDealerData = []
      this.spinner.show()
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }

      this.post.getPrimeDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.primeDealerData = res.data;
            this.primeDealerDataSearch = res.data
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.primeDealerData = []
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else {
      this.primeDealerData = []
      this.spinner.show()
      let data = {

      }

      this.post.getPrimeDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.primeDealerData = res.data;
            this.primeDealerDataSearch = res.data
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.primeDealerData = []
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    }
  }

  clearPrimeDealerDetails() {
    this.filterForm.reset();
    this.getPrimeDealerDetails();
  }

  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query    
    this.primeDealerData = this.primeDealerDataSearch.filter((item: { companyName: any; }) =>
      item.companyName.toLowerCase().includes(query)
    );
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { veelsPlusBranchID: any; }) =>
        item.veelsPlusBranchID.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { FuelVeelsId: any; }) =>
        item.FuelVeelsId.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { hostName: any; }) =>
        item.hostName.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { hostPhone: any; }) =>
        item.hostPhone.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { GSTNumber: any; }) =>
        item.GSTNumber.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { brandName: any; }) =>
        item.brandName.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { email1: any; }) =>
        item.email1.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { city: any; }) =>
        item.city.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { state: any; }) =>
        item.state.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { pin: any; }) =>
        item.pin.toLowerCase().includes(query)
      );
    }
  }

  smsEnable(status: any, corporateId: any, userId: any, smsStatus: string) {
    this.currentSmsStatus = smsStatus
    if (smsStatus == "TRUE") {
      if (status.target.checked) {
        smsStatus = "FALSE";

        let data = {
          smsStatus: smsStatus,
          userId: userId,
          corporateId: corporateId,
          fueldealerSmsSend: "FALSE",
          accessGroup: "12",
          currentSmsStatus: this.currentSmsStatus
        }

        this.post.updateSmsStatusPOST(data)
          .subscribe(res => {
            if (res) {
              alert(res.msg)
              this.getPrimeDealerDetails();
            }
          })
      }
    } else if (smsStatus == "FALSE") {
      smsStatus = "TRUE";

      let data = {
        smsStatus: smsStatus,
        userId: userId,
        corporateId: corporateId,
        accessGroup: "12",
        currentSmsStatus: this.currentSmsStatus
      }

      this.post.updateSmsStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert(res.msg)
            this.getPrimeDealerDetails();
          }
        })
    } else {
      this.getPrimeDealerDetails();
    }
  }

  crSMSActive(status: any, fuelDealerId: any, crUserSMS: string) {
    this.currentCrStatus = crUserSMS
    var crSMS = "";
    if (crUserSMS == "TRUE") {
      if (status.target.checked) {
        crSMS = "FALSE";
        let data = {
          crSMS: crSMS,
          fuelDealerId: fuelDealerId,
          currentCrStatus: this.currentCrStatus
        }
        this.post.updateDealerCRSMSStatusPOST(data)
          .subscribe(res => {
            if (res) {
              alert("Updated..")
              this.getPrimeDealerDetails();
            }
          })
      }
    } else if (crUserSMS == "FALSE") {
      crSMS = "TRUE";
      let data = {
        crSMS: crSMS,
        fuelDealerId: fuelDealerId,
        currentCrStatus: this.currentCrStatus
      }

      this.post.updateDealerCRSMSStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Updated..")
            this.getPrimeDealerDetails();
          }
        })
    } else {
      this.getPrimeDealerDetails();
    }
  }

  
osSmsEnable(status: any, corporateId: any, userId: any, smsStatus: string) {
  this.currStatus = smsStatus;
  if (smsStatus == "TRUE") {
    if (status.target.checked) {
      smsStatus = "FALSE";

      let data = {
        smsStatus: smsStatus,
        userId: userId,
        corporateId: corporateId,
        fueldealerSmsSend: "FALSE",
        accessGroup: "12",
        currStatus : this.currStatus
      }

      this.post.updateOsSmsStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert(res.msg)
            this.getPrimeDealerDetails();
          }
        })
    }
  } else if (smsStatus == "FALSE") {
    smsStatus = "TRUE";

    let data = {
      smsStatus: smsStatus,
      userId: userId,
      corporateId: corporateId,
      accessGroup: "12",
      currStatus : this.currStatus
    }

    this.post.updateOsSmsStatusPOST(data)
      .subscribe(res => {
        if (res) {
          alert(res.msg)
          this.getPrimeDealerDetails();
        }
      })
  } else {
    this.getPrimeDealerDetails();
  }
}
}
