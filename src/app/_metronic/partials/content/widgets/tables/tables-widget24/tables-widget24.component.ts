import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';

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
  | 'kt_table_widget_24_tab_1'
  | 'kt_table_widget_24_tab_2'
  | 'kt_table_widget_24_tab_3';

@Component({
  selector: 'app-tables-widget24',
  templateUrl: './tables-widget24.component.html',
  styleUrl: './tables-widget24.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget24Component {
  veelsPlusPersonId: any;
  demoDealerData: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
waive: any;

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

  activeTab: Tabs = 'kt_table_widget_24_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.veelsPlusPersonId = element.veelsPlusId;
    this.getDemoDealerDetails();
    this.cd.detectChanges();
  }

  exportExcel() {

  }

  getDemoDealerDetails() {
    this.spinner.show()
    let data = {

    }

    this.post.getDemoDealerDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.demoDealerData = res.data
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.demoDealerData = []
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getDemoDealerDetails();
  }
  
  demoDealerActive(status: any, fuelDealerId: any, demoDealer: string) {
    if (demoDealer == "TRUE") {
      if (status.target.checked) {
        demoDealer = "FALSE";
        let data = {
          demoDealer: demoDealer,
          fuelDealerId: fuelDealerId,

        }
        this.post.updateDealerDemoStatusPOST(data)
          .subscribe(res => {
            if (res) {
              alert("Updated..")
            }
          })
      }
    } else if (demoDealer == "FALSE") {
      demoDealer = "TRUE";

      let data = {
        demoDealer: demoDealer,
        fuelDealerId: fuelDealerId,
      }

      this.post.updateDealerDemoStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Updated..")
          }
        })
    } else {
      alert("Please Select");
    }
  }
}
