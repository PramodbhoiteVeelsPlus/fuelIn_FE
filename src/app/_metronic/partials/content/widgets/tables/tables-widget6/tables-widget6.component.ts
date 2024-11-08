import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import { ModalComponent } from 'src/app/_metronic/partials/layout/modals/modal/modal.component';
import { ModalConfig } from 'src/app/_metronic/partials/layout/modals/modal.config';

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
  @ViewChild('modal') private modalComponent: ModalComponent;
  data: any;
  fuelDealerId: any;
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
          localStorage.setItem('creditData', JSON.stringify(res.data));
          this.cd.detectChanges();
        } else {
          this.creditData = [];
          localStorage.setItem('creditData', JSON.stringify(''));
          this.cd.detectChanges();
        }
      })
    
  }
}
