import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { WidgetService } from '../../widgets.services';

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
  | 'kt_table_widget_25_tab_1'
  | 'kt_table_widget_25_tab_2'
  | 'kt_table_widget_25_tab_3';

@Component({
  selector: 'app-tables-widget25',
  templateUrl: './tables-widget25.component.html',
  styleUrl: './tables-widget25.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget25Component {

  filterForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    isCreatedAt: new FormControl(),
  });
searchData: any;
  veelsPlusPersonId: any;
  removedDealerData: any =[];
  removedDealerDataSearch: any =[];
  removedDealerDataExcel: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  rowNumberRemovedDealerList: any;
  showRemovedDealerList: boolean = false;
  onBoardingStatus: any;
  pin: string;
  GSTNumber: string;
  email: string;
  city: string;
  state: string;

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

activeTab: Tabs = 'kt_table_widget_25_tab_1';

setTab(tab: Tabs) {
  this.activeTab = tab;
}

activeClass(tab: Tabs) {
  return tab === this.activeTab ? 'show active' : '';
}

ngOnInit(): void {
  var element = JSON.parse(localStorage.getItem('element') || '{}');
  this.removedDealerData = JSON.parse(localStorage.getItem('removedDealerData') || '{}');
  this.veelsPlusPersonId = element.veelsPlusId;
  if(!this.removedDealerData.length){
    this.getRemovedDealerDetails();
  }else{
    this.getRemovedDealerDetails();
  }
  this.cd.detectChanges();
}


getRemovedDealerDetails(){
  if(this.filterForm.value.startDate && this.filterForm.value.endDate){
    this.spinner.show()
    let data = {
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
    }
    
    this.post.getRemovedDealerDetailsPOST(data)
    .subscribe(res => {
      if(res.status == "OK" && res.data.length){
        this.removedDealerData = res.data
        this.removedDealerDataSearch = res.data
        this.spinner.hide()
      } else {
        alert("Data Not Found..!")
        this.spinner.hide()
      }
    })
  } else {
    this.spinner.show()
    let data = {
     
    }
    
    this.post.getRemovedDealerDetailsPOST(data)
    .subscribe(res => {
      if(res.status == "OK" && res.data.length){
        this.removedDealerData = res.data
        this.removedDealerDataSearch = res.data
        localStorage.setItem('removedDealerData', JSON.stringify(res.data));
        this.spinner.hide()
      } else {
        localStorage.setItem('removedDealerData', JSON.stringify([]));
        alert("Data Not Found..!")
        this.spinner.hide()
      }
    })
  }
}
getRemovedDealerDetails1(){
  if(this.filterForm.value.startDate && this.filterForm.value.endDate){
    this.spinner.show()
    let data = {
      startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
    }
    
    this.post.getRemovedDealerDetailsPOST(data)
    .subscribe(res => {
      if(res.status == "OK" && res.data.length){
        this.removedDealerData = res.data
        this.removedDealerDataSearch = res.data
        this.spinner.hide()
      } else {
        alert("Data Not Found..!")
        this.spinner.hide()
      }
    })
  } else {
    let data = {
     
    }
    
    this.post.getRemovedDealerDetailsPOST(data)
    .subscribe(res => {
      if(res.status == "OK" && res.data.length){
        this.removedDealerData = res.data
        this.removedDealerDataSearch = res.data
        localStorage.setItem('removedDealerData', JSON.stringify(res.data));
        this.spinner.hide()
      } else {
        this.removedDealerData = []
        localStorage.setItem('removedDealerData', JSON.stringify([]));
        alert("Data Not Found..!")
        this.spinner.hide()
      }
    })
  }
}

clearFilterRemovedDealerList() {
  this.filterForm.reset();
  this.getRemovedDealerDetails();
}
exportRemovedDealerList() {
  this.removedDealerDataExcel.length = 0

  this.removedDealerData.map((res: { FuelVeelsId: any; customerCreatedAt: moment.MomentInput; companyName: any; brandName: any; hostName: any; hostPhone: any; email1: any; GSTNumber: any; address1: any; address2: any; city: any; state: any; pin: any; }) => {
    let json = {
      VeelsID: res.FuelVeelsId,
      OnboardDate: moment(res.customerCreatedAt).format("DD-MM-YYYY"),
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

    this.removedDealerDataExcel.push(json);
  });

  this.excelService.exportAsExcelFile(
    this.removedDealerDataExcel,
    "RemovedDealerList"
  );

}

pageChangeEvent(event: number) {
  this.p = event;
  this.getRemovedDealerDetails();
}
changeValueRemovedDealerList(i: any, pin: string, GSTNumber: string, email: string, city: string, state: string, onBoardingStatus: any) {
  this.pin = ''
  this.GSTNumber = ''
  this.email = ''
  this.city = ''
  this.state = ''
  this.onBoardingStatus = ''

  if (i == this.rowNumberRemovedDealerList) {
    this.rowNumberRemovedDealerList = ''
    if (this.showRemovedDealerList == true) {
      this.showRemovedDealerList = false;
    } else {
      this.showRemovedDealerList = true;
      this.rowNumberRemovedDealerList = i

      this.pin = pin
      this.GSTNumber = GSTNumber
      this.email = email
      this.city = city
      this.state = state
      this.onBoardingStatus = onBoardingStatus

    }
  } else {
    this.rowNumberRemovedDealerList = i
    this.showRemovedDealerList = true;

    this.pin = pin
    this.GSTNumber = GSTNumber
    this.email = email
  }
}


onSearch() {
  // Trim the query and convert it to lowercase for case-insensitive search
  let query = this.searchData
  query = query.trim().toLowerCase();

  // Filter the data based on the search query    
  this.removedDealerData = this.removedDealerDataSearch.filter((item: { companyName: any; }) =>
    item.companyName.toLowerCase().includes(query)
  );
  if (!this.removedDealerData.length) {
    this.removedDealerData = this.removedDealerDataSearch.filter((item: { veelsPlusBranchID: any; }) =>
      item.veelsPlusBranchID.toLowerCase().includes(query)
    );
  }
  if (!this.removedDealerData.length) {
    this.removedDealerData = this.removedDealerDataSearch.filter((item: { FuelVeelsId: any; }) =>
      item.FuelVeelsId.toLowerCase().includes(query)
    );
  }
  if (!this.removedDealerData.length) {
    this.removedDealerData = this.removedDealerDataSearch.filter((item: { hostName: any; }) =>
      item.hostName.toLowerCase().includes(query)
    );
  }
  if (!this.removedDealerData.length) {
    this.removedDealerData = this.removedDealerDataSearch.filter((item: { hostPhone: any; }) =>
      item.hostPhone.toLowerCase().includes(query)
    );
  }
  if (!this.removedDealerData.length) {
    this.removedDealerData = this.removedDealerDataSearch.filter((item: { GSTNumber: any; }) =>
      item.GSTNumber.toLowerCase().includes(query)
    );
  }
  if (!this.removedDealerData.length) {
    this.removedDealerData = this.removedDealerDataSearch.filter((item: { brandName: any; }) =>
      item.brandName.toLowerCase().includes(query)
    );
  }
  if (!this.removedDealerData.length) {
    this.removedDealerData = this.removedDealerDataSearch.filter((item: { email1: any; }) =>
      item.email1.toLowerCase().includes(query)
    );
  }
  if (!this.removedDealerData.length) {
    this.removedDealerData = this.removedDealerDataSearch.filter((item: { city: any; }) =>
      item.city.toLowerCase().includes(query)
    );
  }
  if (!this.removedDealerData.length) {
    this.removedDealerData = this.removedDealerDataSearch.filter((item: { state: any; }) =>
      item.state.toLowerCase().includes(query)
    );
  }
  if (!this.removedDealerData.length) {
    this.removedDealerData = this.removedDealerDataSearch.filter((item: { pin: any; }) =>
      item.pin.toLowerCase().includes(query)
    );
  }
}
}
