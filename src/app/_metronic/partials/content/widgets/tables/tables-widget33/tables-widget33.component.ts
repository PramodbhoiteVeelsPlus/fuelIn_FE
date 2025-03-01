import { ChangeDetectorRef, Component, Injectable, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { WidgetService } from '../../widgets.services';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExcelService } from 'src/app/pages/excel.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListWidgetService } from '../../lists/listWidget.services';
import { MixedService } from '../../mixed/mixed.services';

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
  selector: 'app-tables-widget33',
  templateUrl: './tables-widget33.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget33Component {
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  searchDiscountForm = new FormGroup({
    selectCorporateMapId: new FormControl('', Validators.required),
    customerName: new FormControl(),
    selectCorporate: new FormControl('', Validators.required),
    selectCorporateId: new FormControl('', Validators.required),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    type: new FormControl(''),
    selectPersonId: new FormControl('', Validators.required),
  });

  dealerLoginVPId: any;
  dealerAccess: boolean = false;
  liteAccess: boolean = false;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  customerName: any;
  fuelDealerCorpMapIdNew: any;
  manualNumberEnd: any;
  allCorporateList: any = [];
  customerId: any;
  showCrDaysLimitTable: boolean = false;
  mapAccData: any = [];
  fuelPaymentIntervalAll: any = [];
  creditDayLimit: any;
  allCrForInterval: any = [];
  furlPaymentInterval: any = [];
  paymentTotal: number;
  endDate: string | null | undefined;
  totalCr: number;
  previousPendingOutstanding: number;
  selected: string;
  managerView: boolean = false;
  accessGroup: any;
  dealerManager: boolean = false;
  isFuelStatement: boolean = false;
  dealerCorporateId: any;
  headerName1: any;
  finalTotalAmt: number;
  termsAndConditions: any;

  constructor(
    private post: WidgetService,
    private post1: ListWidgetService,
    private post2: MixedService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private excelService: ExcelService,
    private modalService: NgbModal,
    private router: Router,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dealerCorporateId = localStorage.getItem('dealerCorporateId');
    this.customerId = dealerData.customerId;
    this.headerName1 = dealerData.companyName;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.accessGroup = element.accessGroupId;

    if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {
      this.dealerManager = true;
      if (this.accessGroup == 14 || this.accessGroup == 21) {
        this.managerView = true;
        this.getAccessByPersonId(element.personId)
      }
    }
    this.getfuelDealerIdByCorporateId(this.dealerCorporateId);
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  getAccessByPersonId(personId: any) {
    this.spinner.show()
    let data = {
      personId: personId,
    };
    this.post.getAccessByPersonIdPOST(data).subscribe((res) => {
      if (res.data[0].fuelStatement == 'TRUE') {
        this.isFuelStatement = true;
        this.spinner.hide();
        this.cd.detectChanges()
      } else {
        this.isFuelStatement = false;
        this.spinner.hide();
        this.cd.detectChanges()
      }
    });
  }

  // getfuelDealerIdByDealerCorporateId
  getfuelDealerIdByCorporateId(dealerCorporateId: any) {
    let data = {
      corporateId: dealerCorporateId
    }
    this.post.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fuelDealerId = res.data[0].fuelDealerId;
          // this.getMappingAccount(this.fuelDealerId);
          this.getFuelCreditRequestCorporateByfuelDealerId(this.fuelDealerId);
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
        }
      })
  }

  getDetailsByCustomerName(id: any) {
    this.customerName = id.target.value;
    if (this.customerName == "ALL") {
      this.searchDiscountForm.controls["selectCorporateMapId"].setValue("");
    }
    this.getCorporateInfoByfuelDealerCustomerMapId(this.customerName);
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
          this.searchDiscountForm.controls['selectCorporateMapId'].setValue(res.data[0].fuelDealerCustomerMapId);

        } else {
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
          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      }
      );
  }

  getMapAccounts() {
    if (this.searchDiscountForm.value.selectCorporateMapId && this.searchDiscountForm.value.startDate && this.searchDiscountForm.value.endDate) {
      this.showCrDaysLimitTable = true;
      this.spinner.show()
      this.mapAccData = []
      let data = {
        CorporateMapId: this.searchDiscountForm.value.selectCorporateMapId,
        startDate: moment(this.searchDiscountForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.searchDiscountForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")

      }

      this.post.getMapAccountsPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.mapAccData = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            this.mapAccData = [];
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })

      this.getTransactionDetails();
    } else {
      alert("Please Select Corporate And Date Range..!")
    }
  }


  getTransactionDetails() {
    this.spinner.show();
    this.totalCr = 0;
    this.paymentTotal = 0;
    this.endDate = this.searchDiscountForm.value.endDate;
    let allTrData = [];
    const data = {
      fuelDealerCustomerMapId: this.searchDiscountForm.value.selectCorporateMapId,
      startDate: moment(this.searchDiscountForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      endDate: moment(this.searchDiscountForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")

    };
    this.post.getAccountTransactionLogBYfuelDealerCustomMapIdByDateRangePOST(data)
      .subscribe((res) => {
        if (res.status == 'OK') {
          allTrData = res.data;
          this.totalCr = res.data1[0].creditQuantityTotal;
          // this.calpayment(res.data)
          this.totalPendingoutstanding()
          this.spinner.hide();
          this.cd.detectChanges()

        } else {
          this.spinner.hide();
          this.cd.detectChanges()
        }
      });
  }

  totalPendingoutstanding() {
    const data = {
      fuelDealerCustomerMapId: this.searchDiscountForm.value.selectCorporateMapId,
    };
    this.post.getFuelCorpIdByMapIdPOST(data).subscribe((res) => {
      if (res) {
        this.previousPendingOutstanding = Number(res.data[0].previousOutstand);
        this.creditDayLimit = res.data[0].creditDayLimit
        // this.getOutStandingNewFlow()
        this.allCrAndPaymentForInterval();
        this.cd.detectChanges()

      }
    });
  }

  allCrAndPaymentForInterval() {
    if (Number(this.creditDayLimit) > 0) {
      this.spinner.show()
      const data = {
        CorporateMapId: this.searchDiscountForm.value.selectCorporateMapId,
        startDate: moment(this.searchDiscountForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.searchDiscountForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        interval: this.creditDayLimit
      };
      this.post.allCrAndPaymentForIntervalPOST(data).subscribe((res) => {
        if (res.status == "OK") {
          this.allCrForInterval = res.furlCreditInterval;
          this.furlPaymentInterval = res.furlPaymentInterval;

          this.getCombineCreditPayment(this.allCrForInterval, this.furlPaymentInterval)
          this.cd.detectChanges()
          this.spinner.hide();
        }
      });
    } else {
      this.fuelPaymentIntervalAll = []
      alert('Credit Day Limit Should Be Greater Than Zero')
      this.cd.detectChanges()
    }
  }

  getCombineCreditPayment(furlCreditInterval: any[], furlPaymentInterval: any[]) {
    this.fuelPaymentIntervalAll = []
    furlCreditInterval.map(res => {

      furlPaymentInterval.map(res1 => {

        let combineJson = {
          startDate: "",
          endDate: "",
          fuelDealerId: "",
          fuelDealerCustomerMapId: "",
          creditAmountInterval: "",
          grandTotalAmountInterval: ""
        }

        if (res.startDate == res1.startDate) {
          combineJson.startDate = res.startDate
          combineJson.endDate = res.endDate
          combineJson.fuelDealerId = res.fuelCRData.fuelDealerId
          combineJson.fuelDealerCustomerMapId = res.fuelCRData.fuelDealerCustomerMapId
          combineJson.creditAmountInterval = res.fuelCRData.creditAmountInterval
          combineJson.grandTotalAmountInterval = res1.fuelpaymentData.grandTotalAmountInterval
          this.fuelPaymentIntervalAll.push(combineJson)
          this.cd.detectChanges()

        }
      })
    })
    this.spinner.hide();
    this.cd.detectChanges()
  }

  clearDaysLimit() {
    this.searchDiscountForm.reset();
    this.selected = '';
    this.showCrDaysLimitTable = false;
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getMapAccounts();
  }

  finalAmt() {
    const data = {
      fuelDealerCustomerMapId: this.searchDiscountForm.value.selectCorporateMapId,
    };
    this.post1.calOutstandingAmountforAllPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
          this.finalTotalAmt = ((Number(result.outstandData[0].totalCRAmt) + Number(result.previousOutstandData[0].previousOutstand)) ) - Number(result.paymentData[0].totalPaymentAmt);
          this.updateTotalInvCreditAmt(this.finalTotalAmt);
        }
      });
  }

  updateTotalInvCreditAmt(finalTotalAmt: number) {
    const data = {
      fuelDealerCustomerMapId: this.searchDiscountForm.value.selectCorporateMapId,
      totalAmount: finalTotalAmt
    };
    this.post.updateTotalInvCreditAmtPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
          this.spinner.hide();
        }else{
          this.spinner.hide();
        }
      });
  }

  updateTotalInvCreditAmtForInterval(startDate: moment.MomentInput,endDate: moment.MomentInput) {
    this.post.inilizeForInvoice();
    const data = {
      fuelDealerCustomerMapId: this.searchDiscountForm.value.selectCorporateMapId,
      totalAmount: this.finalTotalAmt
    };
    this.post.updateTotalInvCreditAmtPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
  
          this.post2.lrForInvoice(this.searchDiscountForm.value.selectCorporateMapId, moment(startDate, ["YYYY-MM-DD"]).format('DD-MM-YYYY'), moment(endDate, ["YYYY-MM-DD"]).format('DD-MM-YYYY'), this.termsAndConditions);
  
          this.router.navigate(['/credit/fuelCreditInvoiceDoc/' + '0'], { queryParams: { s: '0' } });
        }
      });
  
  }
  
}
