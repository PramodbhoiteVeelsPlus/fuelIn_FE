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
  | 'kt_table_widget_23_tab_1'
  | 'kt_table_widget_23_tab_2'
  | 'kt_table_widget_23_tab_3';

@Component({
  selector: 'app-tables-widget23',
  templateUrl: './tables-widget23.component.html',
  styleUrl: './tables-widget23.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget23Component {
  veelsPlusPersonId: any;

  filterForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    isCreatedAt: new FormControl(),
  });
  isCreatedAt: boolean = false;
  isRequestDate: boolean = false;
  requestCallData: any = [];
  requestCallDataSearch: any = [];
  requestCallDataExcel: any = [];
  searchData: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  demoScheduleId: any;
  demoScheduleRemark: any;
  modalReference: any;
  closeResult: string;

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

  activeTab: Tabs = 'kt_table_widget_23_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.requestCallData = JSON.parse(localStorage.getItem('requestCallData') || '{}');
    this.veelsPlusPersonId = element.veelsPlusId;
    this.filterForm.controls["isCreatedAt"].setValue("created") 
    if(!this.requestCallData.length){
      console.log("oqoo", Array.isArray(this.requestCallData))
      this.getRequestCallDetails();
    }else{
      console.log("oqo11o", Array.isArray(this.requestCallData))
      this.getRequestCallDetails1();
    }
    this.cd.detectChanges();
  }

  changeCreatedAtRadio() {
    this.isCreatedAt = true;
    this.isRequestDate = false;
  }

  changeScheduleRadio() {
    this.isCreatedAt = false;
    this.isRequestDate = true;
  }

  getRequestCallDetails() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      if (this.filterForm.value.isCreatedAt == 'created') {
        this.spinner.show()
        let data = {
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
        }

        this.post.getRequestCallDetailsPOST(data)
          .subscribe(res => {
            if (res.status == "OK" && res.data.length) {
              this.requestCallData = res.data
              this.requestCallDataSearch = res.data
              this.spinner.hide()
            } else {
              alert("Data Not Found..!")
              this.spinner.hide()
            }
          })
      } else {
        this.spinner.show()
        let data = {
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
        }

        this.post.getRequestCallByScheduleDatePOST(data)
          .subscribe(res => {
            if (res.status == "OK" && res.data.length) {
              this.requestCallData = res.data
              this.requestCallDataSearch = res.data
              this.spinner.hide()
            } else {
              alert("Data Not Found..!")
              this.spinner.hide()
            }
          })
      }
    } else {
      this.spinner.show()
      let data = {

      }

      this.post.getRequestCallDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length && Array.isArray(res.data)) {
            this.requestCallData = res.data
            this.requestCallDataSearch = res.data
            localStorage.setItem('requestCallData', JSON.stringify(res.data));
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            localStorage.setItem('requestCallData', JSON.stringify(''));
            alert("Data Not Found..!")
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    }
  }

  getRequestCallDetails1() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      if (this.filterForm.value.isCreatedAt == 'created') {
        this.spinner.show()
        let data = {
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
        }

        this.post.getRequestCallDetailsPOST(data)
          .subscribe(res => {
            if (res.status == "OK" && res.data.length) {
              this.requestCallData = res.data
              this.requestCallDataSearch = res.data
              this.spinner.hide()
            } else {
              alert("Data Not Found..!")
              this.spinner.hide()
            }
          })
      } else {
        this.spinner.show()
        let data = {
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
        }

        this.post.getRequestCallByScheduleDatePOST(data)
          .subscribe(res => {
            if (res.status == "OK" && res.data.length) {
              this.requestCallData = res.data
              this.requestCallDataSearch = res.data
              this.spinner.hide()
            } else {
              alert("Data Not Found..!")
              this.spinner.hide()
            }
          })
      }
    } else {
      let data = {

      }

      this.post.getRequestCallDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.requestCallData = res.data
            this.requestCallDataSearch = res.data
            localStorage.setItem('requestCallData', JSON.stringify(res.data));
            this.spinner.hide()
          } else {
            this.requestCallData = []
            localStorage.setItem('requestCallData', JSON.stringify(''));
            alert("Data Not Found..!")
            this.spinner.hide()
          }
        })
    }
  }

  exportExcel() {
    this.requestCallDataExcel = []
    this.requestCallData.map((res: { demoScheduleCreatedAt: any; companyName: any; hostName: any; hostPhone: any; GSTNumber: any; demoScheduleDate: any; demoScheduleTime: any; demoScheduleMobileNumber: any; demoScheduleStatus: any; demoScheduleRemark: any; demoScheduleCreatedBy: any; headQuarterName: any; }) => {
      let json = {
        OnboardDate: res.demoScheduleCreatedAt,
        CompanyName: res.companyName,
        HostName: res.hostName,
        HostNumber: res.hostPhone,
        GST: res.GSTNumber,
        RequestDate: res.demoScheduleDate,
        RequestTime: res.demoScheduleTime,
        ContactNumber: res.demoScheduleMobileNumber,
        Status: res.demoScheduleStatus,
        Remark: res.demoScheduleRemark,
        DemoScheduleCreatedBy: res.demoScheduleCreatedBy,
        City: res.headQuarterName,
      };
      this.requestCallDataExcel.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.requestCallDataExcel,
      "DemoScheduleSummary"
    );
  }

  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query    
    this.requestCallData = this.requestCallDataExcel.filter((item: { companyName: any; }) =>
      item.companyName.toLowerCase().includes(query)
    );
    if (!this.requestCallData.length) {
      this.requestCallData = this.requestCallDataExcel.filter((item: { demoScheduleRemark: any; }) =>
        item.demoScheduleRemark.toLowerCase().includes(query)
      );
    }
    if (!this.requestCallData.length) {
      this.requestCallData = this.requestCallDataExcel.filter((item: { demoScheduleStatus: any; }) =>
        item.demoScheduleStatus.toLowerCase().includes(query)
      );
    }
    if (!this.requestCallData.length) {
      this.requestCallData = this.requestCallDataExcel.filter((item: { demoScheduleMobileNumber: any; }) =>
        item.demoScheduleMobileNumber.toLowerCase().includes(query)
      );
    }
    if (!this.requestCallData.length) {
      this.requestCallData = this.requestCallDataExcel.filter((item: { hostPhone: any; }) =>
        item.hostPhone.toLowerCase().includes(query)
      );
    }
  }
  
  pageChangeEvent(event: number) {
    this.p = event;
    this.getRequestCallDetails();
  }
  
  openAddRemark(addRemark: any, demoScheduleId: any, demoScheduleRemark: any) {
    this.demoScheduleId = demoScheduleId
    this.demoScheduleRemark = demoScheduleRemark
    this.modalReference = this.modalService.open(addRemark)
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  getDismissReason(reason: any) {
    throw new Error('Method not implemented.');
  }
  

  submitRemark() {
    if (this.demoScheduleRemark) {
      let data = {
        demoScheduleId: this.demoScheduleId,
        demoScheduleRemark: this.demoScheduleRemark,
      }
      this.post.updateDemoScheduleRequestPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("Remark Submited..");
            this.getRequestCallDetails();
            this.modalReference.close('close')
          }
        })
    } else {
      alert("Please Enter Remark..")
    }
  }
  
  clear() {
    this.modalReference.close('close');
    this.demoScheduleId = '';
    this.demoScheduleRemark = '';
  }
  
  updateRequest(demoScheduleId: any, demoScheduleStatus: string) {
    let data = {
      demoScheduleId: demoScheduleId,
      demoScheduleStatus: demoScheduleStatus,
    }
    this.post.updateDemoScheduleRequestPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          alert("Request Status Updated to " + demoScheduleStatus);
          this.getRequestCallDetails();
        }
      })
  }
}
