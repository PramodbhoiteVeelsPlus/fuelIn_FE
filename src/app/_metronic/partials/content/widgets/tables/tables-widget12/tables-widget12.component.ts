import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';

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
  selector: 'app-tables-widget12',
  templateUrl: './tables-widget12.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget12Component implements OnInit {
  currentYear: any;
  last2Year: number;
  lastYear: number;
  lastFourthYear: number;
  lastFifthYear: number;
  
  FilterForm = new FormGroup({
    month: new FormControl(""),
    year: new FormControl(""),
  })
  dealerList: any = [];
  fuelDealerId: any;
  
  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';}

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
    this.lastYear = Number(this.currentYear) - 1;
    this.last2Year = Number(this.currentYear) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
    this.lastFifthYear = Number(this.currentYear) - 4;
    this.FilterForm.controls['year'].setValue(this.currentYear)
    this.FilterForm.controls['month'].setValue(moment(new Date()).format("MM"));
    this.getDealerList()
    this.cd.detectChanges();
  }
  getDealerList() {
    this.spinner.show()
    let data = {

    }

    this.post.getDealerListPOST(data).subscribe((res) => {
      if (res.status == "OK") {
        this.dealerList = res.data;
        this.spinner.hide()
        this.cd.detectChanges();
      } else {
        this.dealerList = [];
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
          // this.getCreditDetailsMonthWise()
          this.cd.detectChanges();
        } else {
        }
      });
  }

}
