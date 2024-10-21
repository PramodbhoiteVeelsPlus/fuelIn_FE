import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
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
  selector: 'app-tables-widget18',
  templateUrl: './tables-widget18.component.html',
  styleUrl: './tables-widget18.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget18Component {
  veelsPlusPersonId: any;
  filterForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    demoDealer: new FormControl(),
  });
  searchData: any;
  primeDealerData: any = [];
  primeDealerDataSearch: any = [];
  primeDealerDataExcel: any = [];

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
    // this.currentMonthYear = moment(new Date()).format("MMM y")
    // this.lastMonthYear = moment(new Date()).subtract(1, 'month').format("MMM y")
    // console.log("years", this.currentMonthYear, this.lastMonthYear)
    // this.getCurrentMonthCrPay()
    // this.getLastMonthCrPay()
    this.getPrimeDealerDetails();
    this.cd.detectChanges();
  }

  getPrimeDealerDetails() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate && this.filterForm.value.demoDealer) {
      this.primeDealerData = []
      this.spinner.show()
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        demoDealer: this.filterForm.value.demoDealer
      }

      this.post.getPrimeDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.primeDealerData = res.data;
            this.spinner.hide()
          } else {
            this.primeDealerData = []
            this.spinner.hide()
          }
        })
    } else if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.primeDealerData = []
      this.spinner.show()
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      }

      this.post.getPrimeDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.primeDealerData = res.data;
            this.spinner.hide()
          } else {
            this.primeDealerData = []
            this.spinner.hide()
          }
        })
    } else if (this.filterForm.value.demoDealer) {
      this.primeDealerData = []
      this.spinner.show()
      let data = {
        demoDealer: this.filterForm.value.demoDealer
      }

      this.post.getPrimeDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.primeDealerData = res.data;
            this.spinner.hide()
          } else {
            this.primeDealerData = []
            this.spinner.hide()
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
          } else {
            this.primeDealerData = []
            this.spinner.hide()
          }
        })
    }
  }
  
  exportExcel() {
    this.primeDealerDataExcel.length = 0

    this.primeDealerData.map((res: { FuelVeelsId: any; customerCreatedAt: moment.MomentInput; companyName: any; brandName: any; hostName: any; hostPhone: any; email1: any; GSTNumber: any; address1: any; address2: any; city: any; state: any; pin: any; }) => {
      let json = {
        VeelsID: res.FuelVeelsId,
        MappedDate: moment(res.customerCreatedAt).format("DD-MM-YYYY"),
        CompanyName: res.companyName,
        OilCompany: res.brandName,
        HostName: res.hostName,
        ContactNumber: res.hostPhone,
        EmailId: res.email1,
        GST: res.GSTNumber,
        AddressLine1: res.address1,
        AddressLine2: res.address2,
        City: res.city,
        State: res.state,
        PINCode: res.pin,
      };

      this.primeDealerDataExcel.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.primeDealerDataExcel,
      "PrimeDealerList"
    );
  }
  
  clearPrimeDealerDetails() {
    this.filterForm.reset();
    this.getPrimeDealerDetails();
  }
}
