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
  acceesGroup: number;
  dealerManager: boolean = false;
  isFuelStatement: boolean = false;

  constructor(
    private post: WidgetService,
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
    this.dealerLoginVPId = element.veelsPlusCorporateID;

    if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
      this.dealerManager = true;
      if (this.acceesGroup == 14 || this.acceesGroup == 21) {
        this.managerView = true;
        this.getAccessByPersonId(element.personId)
      }
    }
    this.getCorporateById(this.dealerLoginVPId);
    this.cd.detectChanges()
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  getAccessByPersonId(personId: any) {
    let data = {
      personId: personId,
    };
    this.post.getAccessByPersonIdPOST(data).subscribe((res) => {
      if (res.data[0].fuelStatement == 'TRUE') {
        this.isFuelStatement = true;
      } else {
        this.isFuelStatement = false;
      }
    });
  }

  // get Corporate DetailsBy VP-Id
  getCorporateById(dealerLoginVPId: any) {
    let data = {
      veelsplusCorporateId: dealerLoginVPId
    }
    this.post.getBranchByVeelsplusIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.customerId = res.data[0].customerId;
            // this.headerName1 = res.data[0].companyName;
            // this.headerName2 = res.data[0].address1 + ', ' + res.data[0].address2 + ', ' + res.data[0].city;
            // this.headerName3 = res.data[0].state + '-' + res.data[0].pin + '  ' + "GST: " + res.data[0].GSTNumber;
            this.loginSQLCorporateId = res.data[0].corporateId;
            this.getfuelDealerIdByCorporateId(this.loginSQLCorporateId);
            // this.searchDealerBycustomerId(this.customerId)
            this.cd.detectChanges()
          }
          else {
            alert("Getting Error..! Please Logout & Login again..!")
            this.cd.detectChanges()
          }
        }
      })
  }

  // getfuelDealerIdByDealerCorporateId
  getfuelDealerIdByCorporateId(loginSQLCorporateId: any) {
    let data = {
      corporateId: loginSQLCorporateId
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
          } else {
            this.mapAccData = [];
            this.spinner.hide();
          }
        })

      this.getTransactionDetails();
    } else {
      alert("Please Select Corporate And Date Range..!")
    }
  }


  getTransactionDetails() {
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

        } else {
          this.spinner.hide();
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

      }
    });
  }

  allCrAndPaymentForInterval() {
    if (Number(this.creditDayLimit) > 0) {
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
        }
      });
    } else {
      this.fuelPaymentIntervalAll = []
      alert('Credit Day Limit Should Be Greater Than Zero')
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

        }
      })
    })
    this.spinner.hide();
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

}