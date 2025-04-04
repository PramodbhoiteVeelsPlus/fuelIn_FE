import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../../stats/stats.services';
import { MixedService } from '../mixed.services';
import { FormGroup, FormControl } from '@angular/forms';
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
  selector: 'app-mixed-widget13',
  templateUrl: './mixed-widget13.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class MixedWidget13Component implements OnInit {
  accessGroup: any;
  fuelDealerId: any;
  dealerCorporateId: any;
  dealerData: any;
  customerName: any;

  savedInvoice = new FormGroup({
    selectCorporateMapId: new FormControl(""),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  });

  addForm = new FormGroup({
    dueDate: new FormControl('')
  })

  fuelCorporateId: any;
  allCorporateList: any = [];
  totalInvoiceAmt: any;
  totalInvoiceQuantity: any;
  savedInvoiceData: any = [];
  totalInvoicePaymentAmt: any;
  isSavedInvoice: boolean = false;
  manualSno: any;
  hsnCode: any;
  fuelDealerCorpMapIdNew: any;
  manualNumberEnd: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;

  constructor(
    private post: MixedService,
    private post1: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private router: Router,) {
    const currentDate = new Date();
    const month = moment(new Date()).format("MM");
    const year = moment(new Date()).subtract(1, 'year').format("YYYY");
    const lastYear = moment(new Date()).subtract(2, 'year').format("YYYY");
    if(Number(month) > 3){
      config.minDate = { year: Number(year), month: 4, day: 1 };
      config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    } else {
      config.minDate = { year: Number(lastYear), month: 4, day: 1 };
      config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    }
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    this.accessGroup = element.accessGroupId;
    this.getFuelCreditRequestCorporateByfuelDealerId(this.fuelDealerId)
  }

  getDetailsByCustomerName(id: any) {
    this.spinner.show()
    this.customerName = id.target.value;
    if (this.customerName == "ALL") {
      this.savedInvoice.controls["selectCorporateMapId"].setValue("");
    }
    this.getCorporateInfoByfuelDealerCustomerMapId(this.customerName);
    this.spinner.hide()
    // this.getCorporateInfoByfuelDealerCustomerMapId1(this.customerName);
    // this.getCorporateInfoByfuelDealerCustomerMapId2(this.customerName);
  }

  getDetailsByCorpForStatementforDiscount(id: any) {
    this.fuelCorporateId = id.target.value;
  }

  getCorporateInfoByfuelDealerCustomerMapId(customerName: any) {

    const data = {
      fuelDealerId: this.fuelDealerId,
      customerName: customerName,
    };
    this.post.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.fuelDealerCorpMapIdNew = res.data[0].fuelDealerCustomerMapId;
          this.manualNumberEnd = res.data[0].manualNumberEnd
          this.savedInvoice.controls['selectCorporateMapId'].setValue(res.data[0].fuelDealerCustomerMapId);

        } else {
          this.spinner.hide()
        }
      });
  }

  getFuelCreditRequestCorporateByfuelDealerId(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId
    };
    this.post.getFuelCreditRequestCorporateByfuelDealerIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.allCorporateList = res.data;
          this.cd.detectChanges()
        } else {
        }
      }
      );
  }

  getSavedInvoice() {
    if (this.savedInvoice.value.selectCorporateMapId, this.savedInvoice.value.startDate, this.savedInvoice.value.endDate) {

      this.post.lrForInvoice5(this.savedInvoice.value.selectCorporateMapId, moment(this.savedInvoice.value.startDate, ["DD-MM-YYYY"]).format('DD-MM-YYYY'), moment(this.savedInvoice.value.endDate, ["DD-MM-YYYY"]).format('DD-MM-YYYY'));
      this.spinner.show()
      let data = {
        custMapId: this.savedInvoice.value.selectCorporateMapId,
        startDate: moment(this.savedInvoice.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.savedInvoice.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }

      this.post.getCreditByCustMapIdDatePOST(data).subscribe(res => {
        if (res.status == "OK") {
          this.savedInvoiceData = res.data;
          this.totalInvoiceAmt = res.dataTotal[0].totalCr
          this.totalInvoiceQuantity = res.dataTotal[0].totalQuantity
          if (res.dataPayTotal[0].totalPayment) {
            this.totalInvoicePaymentAmt = res.dataPayTotal[0].totalPayment
          } else {
            this.totalInvoicePaymentAmt = 0
          }
          this.isSavedInvoice = true
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.isSavedInvoice = false
          this.spinner.hide()
          this.cd.detectChanges()
        }
      })
    } else {
      alert("Please Select Customer and Date Range..!")
    }
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getSavedInvoice();
  }

  goToInvoice() {
    this.post.lrOldInvoice5("TRUE");
    localStorage.setItem("manualSno", this.manualSno);
    if (this.addForm.value.dueDate) {
      localStorage.setItem("isDueDate", "TRUE");
      localStorage.setItem("dueDate", this.addForm.value.dueDate);
    } else {
      localStorage.setItem("isDueDate", "FALSE");
    }
    localStorage.setItem("hsnCode", this.hsnCode);
    this.router.navigate(['/credit/fuelCrInvoice/' + '0'], { queryParams: { s: '0' } });
  }
}
