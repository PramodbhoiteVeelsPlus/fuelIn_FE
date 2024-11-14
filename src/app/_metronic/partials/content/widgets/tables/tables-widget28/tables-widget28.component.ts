import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { WidgetService } from '../../widgets.services';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-tables-widget28',
  templateUrl: './tables-widget28.component.html',
  styleUrl: './tables-widget28.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget28Component {
  veelsPlusPersonId: any;

  filterForm = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    selectedDealer: new FormControl(''),
    table: new FormControl('', Validators.required)
  });

  allDealerList: any = [];
  fuelDealerId: any;
  isCredit: boolean = false;
  isPayment: boolean = false;
  allCredit: any = [];
  allPayment: any  =[];
  corporateId: any;
  fuelDealerCustomMapId: any;
  grandTotal: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;

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
    this.getAllDealerList()
    this.cd.detectChanges();
  }

  //getAllDealerList
  getAllDealerList() {
    this.spinner.show()
    let data = {

    }

    this.post.getAllDealersListPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.allDealerList = res.data
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.view();
  }

  getDealerId(id: any) {

    let data = {
      name: id.target.value,
    }
    this.post.getDealerIDCorpIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.corporateId = res.data[0].corporateId;
          this.cd.detectChanges();
        } else {
          this.fuelDealerId = '';
          this.cd.detectChanges();
        }
      });
  }

  //showTable()
  showTable() {
    if (this.filterForm.value.table == 'CREDIT') {
      this.isCredit = true;
      this.isPayment = false;
    } else {
      if (this.filterForm.value.table == 'PAYMENT') {
        this.isPayment = true;
        this.isCredit = false;
      } else {

      }
    }
  }


  view() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      if (this.filterForm.value.table == 'CREDIT') {
        this.spinner.show();
        let data = {
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          dealerId: this.fuelDealerId,
        }
        this.post.getCreditByDealerIdPOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                this.allCredit = res.data;
                this.isCredit = true;
                this.isPayment = false;
                this.spinner.hide();
                this.cd.detectChanges();
              }
              else {
                alert("Data not found..!")
                this.spinner.hide();
                this.cd.detectChanges();
                this.isCredit = false;
                this.isPayment = false;
              }
            }
          })
      } else {
        if (this.filterForm.value.table == 'PAYMENT') {
          let data = {
            startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD 00:00:01"),
            endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD 23:23:59"),
            corporateId: this.corporateId,
          }
          this.post.getPaymentByDealerIdPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                if (res.data.length) {
                  this.allPayment = res.data;
                  this.isPayment = true;
                  this.isCredit = false;
                  this.spinner.hide();
                  this.cd.detectChanges();
                }
                else {
                  alert("Data not found..!")
                  this.spinner.hide();
                  this.cd.detectChanges();
                  this.isPayment = false;
                }
              }
            })
        } else {
          this.spinner.hide();
          this.cd.detectChanges();
        }
      }
    } else {
      alert("Please select date")
      this.spinner.hide();
    }
  }


  clearFilterForm() {
    this.filterForm.reset();
    // this.selected = '';
    this.isCredit = false;
    this.isPayment = false;
  }


  cancelCredit(fuelCreditId: any, fuelDealerCustomerMapId: any) {
    this.spinner.show();
    let data = {
      fuelCreditId: fuelCreditId,
      fuelDealerCustomerMapId: fuelDealerCustomerMapId
    }
    this.post.cancelFuelCreditReqPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          alert("Delete Successfully!")
          this.view();
          this.spinner.hide();
          this.cd.detectChanges();
        } else {
          alert("Error to delete")
          this.spinner.hide();
          this.cd.detectChanges();
        }
      })
  }

  cancelPayment(id: any, fuelDealerCustomerMapId: any, grandTotalAmount: any) {
    this.fuelDealerCustomMapId = fuelDealerCustomerMapId;
    this.grandTotal = grandTotalAmount
    this.spinner.show();

    let data = {
      accountTransacLogId: id,
    }
    this.post.removeTransactionLogPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert("Delete Successfully!");
          this.view();
          this.cd.detectChanges();
        } else {
          alert("Error to delete")
          this.spinner.hide();
          this.cd.detectChanges();
        }
      })
  }
}
