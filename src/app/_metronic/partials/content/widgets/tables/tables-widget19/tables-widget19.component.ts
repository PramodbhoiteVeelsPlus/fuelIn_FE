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

type Tabs =
  | 'kt_table_widget_19_tab_1'
  | 'kt_table_widget_19_tab_2'
  | 'kt_table_widget_19_tab_3';

@Component({
  selector: 'app-tables-widget19',
  templateUrl: './tables-widget19.component.html',
  styleUrl: './tables-widget19.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget19Component {
  veelsPlusPersonId: any;
  filterForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    demoDealer: new FormControl(),
  });
  liteDealerData: any = [];
  liteDealerDataSearch: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  showLiteDealerList: boolean = false;
  rowNumberLiteDealerList: any;
  GSTNumber: string;
  pin: string;
  email: string;
  city: string;
  state: string;
  onBoardingStatus: string;
  demoDealer: string;
  fuelDealerId: string;
  hostPhone: string;
  userId: string;
  personId: string;
  headQuarterName: string;
  customerId: string;
  isViewCustomerLink: boolean = false;
  searchData: any;
  liteDealerDataExcel: any = [];

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

  activeTab: Tabs = 'kt_table_widget_19_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.liteDealerData = JSON.parse(localStorage.getItem('liteDealerData') || '{}');
    this.veelsPlusPersonId = element.veelsPlusId;
    this.filterForm.controls['demoDealer'].setValue('');
    if(!this.liteDealerData.length){
      this.getLiteDealerDetails();
    }else{
      this.getLiteDealerDetails1();
    }
    this.cd.detectChanges();
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getLiteDealerDetails();
  }

  getLiteDealerDetails() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.spinner.show()
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      }

      this.post.getLiteDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.liteDealerData = res.data
            this.liteDealerDataSearch = res.data
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            alert("Data Not Found..!")
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else {
      this.spinner.show()
      let data = {

      }

      this.post.getLiteDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.liteDealerData = res.data
            this.liteDealerDataSearch = res.data
            localStorage.setItem('liteDealerData', JSON.stringify(res.data));
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.liteDealerData = []
            localStorage.setItem('liteDealerData', JSON.stringify(res.data));
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    }
  }

  getLiteDealerDetails1() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.spinner.show()
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      }

      this.post.getLiteDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.liteDealerData = res.data
            this.liteDealerDataSearch = res.data
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            alert("Data Not Found..!")
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else {
      this.spinner.show()
      let data = {

      }

      this.post.getLiteDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.liteDealerData = res.data
            this.liteDealerDataSearch = res.data
            localStorage.setItem('liteDealerData', JSON.stringify(res.data));
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            localStorage.setItem('liteDealerData', JSON.stringify(res.data));
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    }
  }

  changeValueLiteDealerList(i: any, pin: any, GSTNumber: any, email: any, city: any, state: any, onBoardingStatus: any, demoDealer: any, fuelDealerId: any, hostPhone: any, userId: any, personId: any, headQuarterName: any, customerId: any) {

    this.pin = ''
    this.GSTNumber = ''
    this.email = ''
    this.city = ''
    this.state = ''
    this.onBoardingStatus = ''
    this.demoDealer = ''
    this.fuelDealerId = ''
    this.hostPhone = ''
    this.userId = ''
    this.personId = ''
    this.headQuarterName = ''
    this.customerId = ''

    if (i == this.rowNumberLiteDealerList) {
      this.rowNumberLiteDealerList = ''
      if (this.showLiteDealerList == true) {
        this.showLiteDealerList = false;
      } else {
        this.showLiteDealerList = true;
        this.rowNumberLiteDealerList = i

        this.pin = pin
        this.GSTNumber = GSTNumber
        this.email = email
        this.city = city
        this.state = state
        this.onBoardingStatus = onBoardingStatus
        this.demoDealer = demoDealer
        this.fuelDealerId = fuelDealerId
        this.hostPhone = hostPhone

        this.userId = userId
        this.personId = personId
        this.headQuarterName = headQuarterName
        this.customerId = customerId

      }
    } else {
      this.rowNumberLiteDealerList = i
      this.showLiteDealerList = true;
      this.pin = pin
      this.GSTNumber = GSTNumber

      this.email = email
      this.demoDealer = demoDealer
      this.fuelDealerId = fuelDealerId
      this.hostPhone = hostPhone

      this.userId = userId
      this.personId = personId
      this.headQuarterName = headQuarterName
      this.customerId = customerId
    }

  }

  clearLiteDealerList() {
    this.filterForm.reset();
    this.getLiteDealerDetails();
  }

  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query    
    this.liteDealerData = this.liteDealerDataSearch.filter((item: { companyName: any; }) =>
      item.companyName.toLowerCase().includes(query)
    );
    if (!this.liteDealerData.length) {
      this.liteDealerData = this.liteDealerDataSearch.filter((item: { veelsPlusBranchID: any; }) =>
        item.veelsPlusBranchID.toLowerCase().includes(query)
      );
    }
    if (!this.liteDealerData.length) {
      this.liteDealerData = this.liteDealerDataSearch.filter((item: { FuelVeelsId: any; }) =>
        item.FuelVeelsId.toLowerCase().includes(query)
      );
    }
    if (!this.liteDealerData.length) {
      this.liteDealerData = this.liteDealerDataSearch.filter((item: { hostName: any; }) =>
        item.hostName.toLowerCase().includes(query)
      );
    }
    if (!this.liteDealerData.length) {
      this.liteDealerData = this.liteDealerDataSearch.filter((item: { hostPhone: any; }) =>
        item.hostPhone.toLowerCase().includes(query)
      );
    }
    if (!this.liteDealerData.length) {
      this.liteDealerData = this.liteDealerDataSearch.filter((item: { GSTNumber: any; }) =>
        item.GSTNumber.toLowerCase().includes(query)
      );
    }
    if (!this.liteDealerData.length) {
      this.liteDealerData = this.liteDealerDataSearch.filter((item: { brandName: any; }) =>
        item.brandName.toLowerCase().includes(query)
      );
    }
    if (!this.liteDealerData.length) {
      this.liteDealerData = this.liteDealerDataSearch.filter((item: { email1: any; }) =>
        item.email1.toLowerCase().includes(query)
      );
    }
    if (!this.liteDealerData.length) {
      this.liteDealerData = this.liteDealerDataSearch.filter((item: { city: any; }) =>
        item.city.toLowerCase().includes(query)
      );
    }
    if (!this.liteDealerData.length) {
      this.liteDealerData = this.liteDealerDataSearch.filter((item: { state: any; }) =>
        item.state.toLowerCase().includes(query)
      );
    }
    if (!this.liteDealerData.length) {
      this.liteDealerData = this.liteDealerDataSearch.filter((item: { pin: any; }) =>
        item.pin.toLowerCase().includes(query)
      );
    }
  }

  exportExcel() {
    this.liteDealerDataExcel.length = 0

    this.liteDealerData.map((res: { FuelVeelsId: any; customerCreatedAt: moment.MomentInput; companyName: any; brandName: any; hostName: any; hostPhone: any; email1: any; GSTNumber: any; address1: any; address2: any; city: any; state: any; pin: any; }) => {
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

      this.liteDealerDataExcel.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.liteDealerDataExcel,
      "LiteDealerList"
    );
  }
}
