import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
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
  selector: 'app-tables-widget11',
  templateUrl: './tables-widget11.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget11Component implements OnInit {
  dealerList: any = [];
  fuelDealerId: any;
  currentYear: any;
  lastYear: number;
  last2Year: number;
  lastFifthYear: number;
  lastFourthYear: number;
  dayWiseCredit: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  FilterForm = new FormGroup({
    month: new FormControl(""),
    year: new FormControl(""),
  })

  ngOnInit(): void {
    this.dealerList = JSON.parse(localStorage.getItem('dealerList') || '{}');
    this.currentYear = new Date().getFullYear();
    this.lastYear = Number(this.currentYear) - 1;
    this.last2Year = Number(this.currentYear) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
    this.lastFifthYear = Number(this.currentYear) - 4;
    this.FilterForm.controls['year'].setValue(this.currentYear)
    this.FilterForm.controls['month'].setValue(moment(new Date()).format("MM"));
    if (!this.dealerList.length) {
      this.getDealerList();
    } else {
      this.getDealerList1();
    }
    this.cd.detectChanges();
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getCreditDetailsMonthWise();
  }

  getDealerList() {
    this.spinner.show()
    let data = {

    }

    this.post.getDealerListPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        this.dealerList = res.data;
        localStorage.setItem('dealerList', JSON.stringify(res.data));
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.dealerList = [];
        localStorage.setItem('dealerList', JSON.stringify(res.data));
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }

  getDealerList1() {
    this.spinner.show()
    let data = {

    }

    this.post.getDealerListPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        this.dealerList = res.data;
        localStorage.setItem('dealerList', JSON.stringify(res.data));
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        localStorage.setItem('dealerList', JSON.stringify(res.data));
        this.spinner.hide()
        this.cd.detectChanges();
      }
    })
  }

  getDetailsByCustomerMapName(id: any) {
    let data = {
      name: id.target.value,
    }
    this.post.getDealerIDCorpIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.getCreditDetailsMonthWise()
          this.cd.detectChanges();
        } else {
        }
      });
  }

  getCreditDetailsMonthWise() {
    if (this.fuelDealerId) {
      this.dayWiseCredit = []
      this.spinner.show()
      let data = {
        fuelDealerId: this.fuelDealerId,
        month: moment(this.FilterForm.value.month).format("MM"),
        year: this.FilterForm.value.year
      }

      this.post.getDayWiseCreditPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.dayWiseCredit = res.data;
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.dayWiseCredit = []
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else {
      alert("Please Select Pump Name..!")
    }
  }
}
