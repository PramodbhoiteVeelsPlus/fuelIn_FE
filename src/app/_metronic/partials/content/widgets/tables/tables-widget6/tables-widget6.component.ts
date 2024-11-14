import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import { ModalConfig } from 'src/app/_metronic/partials';

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
  | 'kt_table_widget_6_tab_1'
  | 'kt_table_widget_6_tab_2'
  | 'kt_table_widget_6_tab_3';

@Component({
  selector: 'app-tables-widget6',
  templateUrl: './tables-widget6.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget6Component implements OnInit {
  selectPump: any = "";
  dealerList: any = [];
  lastyr: string;
  nextyr: string;
  creditData: any = [];

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  data: any;
  fuelDealerId: any;
  modalReference: any;
  closeResult: string;
  companyName: any;
  dataCustList: any = [];
  month: any;
  year: any;
  dealerId: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  dataVehList: any = [];

  constructor(
    private modalService: NgbModal,
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  activeTab: Tabs = 'kt_table_widget_6_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit() {
    this.dealerList = JSON.parse(localStorage.getItem('dealerList') || '{}');
    this.creditData = JSON.parse(localStorage.getItem('creditData') || '{}');
    this.lastyr = moment(new Date()).subtract(1, 'year').format("YYYY")
    this.nextyr = moment(new Date()).add(1, 'year').format("YYYY")
    if (!this.dealerList.length) {
      this.getDealerList();
    } else {
      this.getDealerList1();
    }
    if (!this.creditData.length) {
      this.getCreditDetailsYearWise();
    }else{
      this.getCreditDetailsYearWise1();
    }
  }

  getDealerList() {
    this.spinner.show()
    let data = {
    }
    this.post.getDealerListPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        this.dealerList = res.data;
        localStorage.setItem('dealerList', JSON.stringify(res.data));
        this.cd.detectChanges();
      } else {
        this.dealerList = [];
        localStorage.setItem('dealerList', JSON.stringify(''));
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }
  getDealerList1() {
    let data = {
    }
    this.post.getDealerListPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        this.dealerList = res.data;
        localStorage.setItem('dealerList', JSON.stringify(res.data));
        this.cd.detectChanges();
      } else {
        this.dealerList = [];
        localStorage.setItem('dealerList', JSON.stringify(''));
        this.cd.detectChanges();
      }
    })
  }

  getDetailsByCustomerMapName(id: any) {
    this.spinner.show()
    let data = {
      name: id.target.value,
    }
    this.post.getDealerIDCorpIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.getCreditDetailsYearWise()
          this.getActiveCustList()
          this.cd.detectChanges();
        } else {
        }
      });


  }

  getCreditDetailsYearWise() {
    if (this.fuelDealerId) {
      this.spinner.show()
      let data = {
        fuelDealerId: this.fuelDealerId,
        startDate: moment(this.lastyr).format("YYYY-04-01"),
        endDate: moment(this.nextyr).format("YYYY-03-31"),
      }
      this.post.getYearWiseCreditPOST(data).subscribe(res => {
        if (res.status == "OK") {
          this.creditData = res.data;
          this.dataCustList = res.dataCustList
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.creditData = [];
          this.spinner.hide();
          this.cd.detectChanges();
        }
      })
    } else {
      this.spinner.show()
      let data = {
        startDate: moment(this.lastyr).format("YYYY-04-01"),
        endDate: moment(this.nextyr).format("YYYY-03-31"),
      }
      this.post.getYearWiseCreditPOST(data).subscribe(res => {
        if (res.status == "OK") {
          this.creditData = res.data;
          this.dataCustList = res.dataCustList
          this.data = res.data[0].month
          localStorage.setItem('creditData', JSON.stringify(res.data));
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.creditData = [];
          localStorage.setItem('creditData', JSON.stringify(''));
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
    }
  }

  getCreditDetailsYearWise1() {   
      let data = {
        startDate: moment(this.lastyr).format("YYYY-04-01"),
        endDate: moment(this.nextyr).format("YYYY-03-31"),
      }
      this.post.getYearWiseCreditPOST(data).subscribe(res => {
        if (res.status == "OK") {
          this.creditData = res.data;
          this.data = res.data[0].month
          this.dataCustList = res.dataCustList
          localStorage.setItem('creditData', JSON.stringify(res.data));
          this.cd.detectChanges();
        } else {
          this.creditData = [];
          localStorage.setItem('creditData', JSON.stringify(''));
          this.cd.detectChanges();
        }
      })
    
  }
  
  custName(cust: any,fuelDealerId: any,month: any, year:any){

    this.month = month
    this.year = year
    this.dealerId = this.fuelDealerId
    console.log(this.month, this.year, "11")
    this.modalReference = this.modalService.open(cust)
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.getActiveCustList()
  }
  
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getActiveCustList();
  }

  getActiveCustList() {
    if (this.dealerId) {
      this.spinner.show()
      let data = {
        fuelDealerId: this.dealerId,
        startDate: moment(this.month + '-' + this.year, ["MMM-YYYY"]).format("YYYY-MM-01"),
        endDate: moment(this.month + '-' + this.year, ["MMM-YYYY"]).format("YYYY-MM-31"),
      }
      this.post.getActiveCustomerListPOST(data).subscribe(res => {
        if (res.status == "OK") {
          this.dataCustList = res.data
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.dataCustList = [];
          this.spinner.hide();
          this.cd.detectChanges();
        }
      })
    } else {
      this.spinner.show()
      let data = {
        startDate: moment(this.month + '-' + this.year, ["MMM-YYYY"]).format("YYYY-MM-01"),
        endDate: moment(this.month + '-' + this.year, ["MMM-YYYY"]).format("YYYY-MM-31"),
      }
      this.post.getActiveCustomerListPOST(data).subscribe(res => {
        if (res.status == "OK") {
          this.dataCustList = res.data
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.dataCustList = [];
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
    }
  }
  
  vehList(veh: any, fuelDealerId: any,month: any, year:any){

    this.month = month
    this.year = year
    this.dealerId = this.fuelDealerId
    console.log(this.month, this.year, "11")
    this.modalReference = this.modalService.open(veh)
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.getActiveVehList()
  }
  

  getActiveVehList() {
    if (this.dealerId) {
      this.spinner.show()
      let data = {
        fuelDealerId: this.dealerId,
        startDate: moment(this.month + '-' + this.year, ["MMM-YYYY"]).format("YYYY-MM-01"),
        endDate: moment(this.month + '-' + this.year, ["MMM-YYYY"]).format("YYYY-MM-31"),
      }
      this.post.getActiveVehicleListPOST(data).subscribe(res => {
        if (res.status == "OK") {
          this.dataVehList = res.data
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.dataVehList = [];
          this.spinner.hide();
          this.cd.detectChanges();
        }
      })
    } else {
      this.spinner.show()
      let data = {
        startDate: moment(this.month + '-' + this.year, ["MMM-YYYY"]).format("YYYY-MM-01"),
        endDate: moment(this.month + '-' + this.year, ["MMM-YYYY"]).format("YYYY-MM-31"),
      }
      this.post.getActiveVehicleListPOST(data).subscribe(res => {
        if (res.status == "OK") {
          this.dataVehList = res.data
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.dataVehList = [];
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
    }
  }
}
