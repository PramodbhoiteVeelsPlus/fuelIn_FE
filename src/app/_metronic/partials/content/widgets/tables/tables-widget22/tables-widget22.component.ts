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
  | 'kt_table_widget_22_tab_1'
  | 'kt_table_widget_22_tab_2'
  | 'kt_table_widget_22_tab_3';

@Component({
  selector: 'app-tables-widget22',
  templateUrl: './tables-widget22.component.html',
  styleUrl: './tables-widget22.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget22Component {
  veelsPlusPersonId: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;

  filterForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });
  dealerRequestData: any;
  dealerRequestDataSearch: any = [];
  showLiteDealerRequest: boolean = false;
  rowNumberLiteDealerRequest: any;
  email: string;
  GSTNumber: string;
  city: string;
  state: string;
  pin: string;
  fuelDealerConversionStatus: string;
  searchData: any;
  dealerRequestDataExcel: any = [];

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

  activeTab: Tabs = 'kt_table_widget_22_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.veelsPlusPersonId = element.veelsPlusId;
    this.getDealerRequestDetails();
    this.cd.detectChanges();
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getDealerRequestDetails();
  }

  getDealerRequestDetails() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.spinner.show()
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      }

      this.post.getDealerRequestDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.dealerRequestData = res.data
            this.dealerRequestDataSearch = res.data
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

      this.post.getDealerRequestDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.dealerRequestData = res.data
            this.dealerRequestDataSearch = res.data
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    }
  }

  clearPrimeDealerDetails() {
    this.filterForm.reset();
    this.getDealerRequestDetails();
  }

  changeValue(i: any, email: any, GSTNumber: any, city: any, state: any, pin: any, fuelDealerConversionStatus: any) {

    this.email = ''
    this.GSTNumber = ''
    this.city = '';
    this.state = '';
    this.pin = '';
    this.fuelDealerConversionStatus = ''

    if (i == this.rowNumberLiteDealerRequest) {
      this.rowNumberLiteDealerRequest = ''
      if (this.showLiteDealerRequest == true) {
        this.showLiteDealerRequest = false;
      } else {

        this.showLiteDealerRequest = true;
        this.rowNumberLiteDealerRequest = i
        this.email = email
        this.GSTNumber = GSTNumber
        this.city = city
        this.state = state
        this.pin = pin
        this.fuelDealerConversionStatus = fuelDealerConversionStatus

      }
    } else {
      this.rowNumberLiteDealerRequest = i
      this.showLiteDealerRequest = true;

      this.showLiteDealerRequest = true;
      this.rowNumberLiteDealerRequest = i
      this.email = email
      this.GSTNumber = GSTNumber
      this.city = city
      this.state = state
      this.pin = pin
      this.fuelDealerConversionStatus = fuelDealerConversionStatus
    }
  }


  updateConvertion(fuelDealerConversionId: any, status: any, accessGroupId: any, personId: any, fuelDealerId: any, managerAccessGroupId: any) {

    let data = {
      fuelDealerConversionId: fuelDealerConversionId,
      fuelDealerConversionCurrentAccessGroupId: accessGroupId,
      fuelDealerConversionStatus: status,
      convertedByPersonId: personId,
      fuelDealerConversionPersonId: personId,
      convertedAt: moment(new Date()).format('YYYY-MM-DD'),
      fuelDealerId: fuelDealerId,
      managerAccessGroupId: managerAccessGroupId
    }

    this.post.updateStatusForRequestPOST(data)
      .subscribe(res => {
        if (res) {
          alert(res.msg);
          this.getDealerRequestDetails()
          this.cd.detectChanges();
        } else {
        }
      }
      );
  }

  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query    
    this.dealerRequestData = this.dealerRequestDataSearch.filter((item: { companyName: any; }) =>
      item.companyName.toLowerCase().includes(query)
    );
    if (!this.dealerRequestData.length) {
      this.dealerRequestData = this.dealerRequestDataSearch.filter((item: { veelsPlusBranchID: any; }) =>
        item.veelsPlusBranchID.toLowerCase().includes(query)
      );
    }
    if (!this.dealerRequestData.length) {
      this.dealerRequestData = this.dealerRequestDataSearch.filter((item: { FuelVeelsId: any; }) =>
        item.FuelVeelsId.toLowerCase().includes(query)
      );
    }
    if (!this.dealerRequestData.length) {
      this.dealerRequestData = this.dealerRequestDataSearch.filter((item: { hostName: any; }) =>
        item.hostName.toLowerCase().includes(query)
      );
    }
    if (!this.dealerRequestData.length) {
      this.dealerRequestData = this.dealerRequestDataSearch.filter((item: { hostPhone: any; }) =>
        item.hostPhone.toLowerCase().includes(query)
      );
    }
    if (!this.dealerRequestData.length) {
      this.dealerRequestData = this.dealerRequestDataSearch.filter((item: { GSTNumber: any; }) =>
        item.GSTNumber.toLowerCase().includes(query)
      );
    }
    if (!this.dealerRequestData.length) {
      this.dealerRequestData = this.dealerRequestDataSearch.filter((item: { brandName: any; }) =>
        item.brandName.toLowerCase().includes(query)
      );
    }
    if (!this.dealerRequestData.length) {
      this.dealerRequestData = this.dealerRequestDataSearch.filter((item: { email1: any; }) =>
        item.email1.toLowerCase().includes(query)
      );
    }
    if (!this.dealerRequestData.length) {
      this.dealerRequestData = this.dealerRequestDataSearch.filter((item: { city: any; }) =>
        item.city.toLowerCase().includes(query)
      );
    }
    if (!this.dealerRequestData.length) {
      this.dealerRequestData = this.dealerRequestDataSearch.filter((item: { state: any; }) =>
        item.state.toLowerCase().includes(query)
      );
    }
    if (!this.dealerRequestData.length) {
      this.dealerRequestData = this.dealerRequestDataSearch.filter((item: { pin: any; }) =>
        item.pin.toLowerCase().includes(query)
      );
    }
  }
  
  exportExcel() {
    this.dealerRequestDataExcel.length = 0

    this.dealerRequestData.map((res: { FuelVeelsId: any; customerCreatedAt: moment.MomentInput; companyName: any; brandName: any; hostName: any; hostPhone: any; email1: any; GSTNumber: any; address1: any; address2: any; city: any; state: any; pin: any; }) => {
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

      this.dealerRequestDataExcel.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.dealerRequestDataExcel,
      "RequestDealerList"
    );
  }
}

