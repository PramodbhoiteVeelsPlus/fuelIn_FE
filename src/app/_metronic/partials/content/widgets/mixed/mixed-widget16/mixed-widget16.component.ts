import { ChangeDetectorRef, Component, Injectable, Input } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from '../../stats/stats.services';
import { MixedService } from '../mixed.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
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
  selector: 'app-mixed-widget16',
  templateUrl: './mixed-widget16.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class MixedWidget16Component {
  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  managerVPPersonId: any;
  managerPersonId: any;

  searchDiscountForm = new FormGroup({
    selectCorporateMapId: new FormControl('', Validators.required),
    customerName: new FormControl(),
    selectCorporate: new FormControl('', Validators.required),
    selectCorporateId: new FormControl('', Validators.required),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    type: new FormControl(''),
    selectPersonId: new FormControl('', Validators.required),
    vehicleNumber: new FormControl(),
    selectCorporateMapIdVehicle: new FormControl(),
    year: new FormControl(''),
  });

  addForm = new FormGroup({
    dueDate: new FormControl('')
  })

  unitForm = new FormGroup({
    mobile: new FormControl('', Validators.required),
  });

  customerName: string;
  allCorporateList: any = [];
  statementData: any = [];
  statementPurData: any = [];
  statementPayData: any = [];
  isTable: boolean = false;
  fuelDealerCorpMapIdNew: any;
  manualNumberEnd: any;
  manualSno: any;
  hsnCode: any;
  finalTotalAmt: any;
  termsAndConditions: string;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  modalRef: any;
  closeResult: string;
  managerList: any;
  managerMobile: any;
  manualNumberStatus: any;
  autoManualStatus: any;
  financialYears: { value: string; label: string; }[];

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
    const year = moment(new Date()).subtract(6, 'year').format("YYYY");
    const lastYear = moment(new Date()).subtract(2, 'year').format("YYYY");
    const currentYear = new Date().getFullYear();

    // Last completed FY end year
    const lastCompletedFYEndYear =
      new Date().getMonth() >= 3
        ? currentYear - 1
        : currentYear - 2;

    config.minDate = {
      year: 2020,
      month: 4,
      day: 1
    };

    config.maxDate = {
      year: lastCompletedFYEndYear,
      month: 3,
      day: 31
    };
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    // this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.accessGroup = element.accessGroupId;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.manualNumberStatus = dealerData.manualNumberStatus;
    this.autoManualStatus = dealerData.autoManualStatus;
    this.getFuelCreditRequestCorporateByfuelDealerId(this.fuelDealerId)
    this.getManagersByfuelDealerId(this.fuelDealerId);
    // this.getFlagStatusByCorpId(this.dealerCorporateId)
    this.financialYears = this.getFinancialYears(6);
    this.searchDiscountForm.controls["year"].setValue(this.financialYears[0].value)
    this.cd.detectChanges()
  }

  getFinancialYears(count: number) {
    const today = new Date();

    let currentFYStartYear =
      today.getMonth() >= 3
        ? today.getFullYear()
        : today.getFullYear() - 1;

    const years = [];

    for (let i = 2; i <= count; i++) {
      const startYear = currentFYStartYear - i;
      const endYear = startYear + 1;

      this.searchDiscountForm.controls["year"].setValue("startYear")
      years.push({
        value: `${String(startYear).slice(-2)}_${String(endYear).slice(-2)}`,
        label: `Apr${String(startYear).slice(-2)}-Mar${String(endYear).slice(-2)}`
      });
    }

    return years;
  }

  getDetailsByCustomerName(id: any) {
    this.spinner.show()
    this.customerName = id.target.value;
    if (this.customerName == "ALL") {
      this.searchDiscountForm.controls["selectCorporateMapId"].setValue("");
      this.searchDiscountForm.controls["selectCorporateMapIdVehicle"].setValue("");
    }
    this.getCorporateInfoByfuelDealerCustomerMapId(this.customerName);
    this.spinner.hide()
    // this.getCorporateInfoByfuelDealerCustomerMapId1(this.customerName);
    // this.getCorporateInfoByfuelDealerCustomerMapId2(this.customerName);
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

  getCorporateInfoByfuelDealerCustomerMapId(customerName: string) {

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
          this.spinner.hide()
        }
      });
  }

  getCrStatement() {
    if (this.searchDiscountForm.value.selectCorporateMapId && this.searchDiscountForm.value.startDate && this.searchDiscountForm.value.endDate) {
      this.post.lrForInvoiceYear(this.searchDiscountForm.value.selectCorporateMapId, moment(this.searchDiscountForm.value.startDate, ["DD-MM-YYYY"]).format('DD-MM-YYYY'), moment(this.searchDiscountForm.value.endDate, ["DD-MM-YYYY"]).format('DD-MM-YYYY'), this.termsAndConditions, this.searchDiscountForm.value.year);
      this.spinner.show();
      let data = {
        CorporateMapId: this.searchDiscountForm.value.selectCorporateMapId,
        startDate: moment(this.searchDiscountForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.searchDiscountForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        year: this.searchDiscountForm.value.year
      }

      this.post.getCrStatementYearWisePOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.statementData = res.data;
            this.statementPurData = res.data1;
            this.statementPayData = res.data2;
            this.isTable = true
            this.spinner.hide();
            this.cd.detectChanges();
          } else {
            this.isTable = false
            this.spinner.hide();
            this.cd.detectChanges();
          }
        })
    } else {
      alert("Please Select Corporate and Date Range")
      this.cd.detectChanges();
    }
  }

  createInvoiceWithoutPaymentDetails() {
    this.post.lrOldInvoice1("FALSE");
    const data = {
      fuelDealerCustomerMapId: this.searchDiscountForm.value.selectCorporateMapId,
      totalAmount: this.finalTotalAmt,
    };
    this.post.updateTotalInvCreditAmtPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
          localStorage.setItem("manualSno", this.manualSno);
          if (this.addForm.value.dueDate) {
            localStorage.setItem("isDueDate", "TRUE");
            localStorage.setItem("dueDate", this.addForm.value.dueDate);
          } else {
            localStorage.setItem("isDueDate", "FALSE");
          }
          localStorage.setItem("hsnCode", this.hsnCode);
          localStorage.setItem("termsAndConditions", this.termsAndConditions)

          this.router.navigate(['/credit/fuelCreditInvoiceDocument/' + '0'], { queryParams: { s: '0' } });
        }
      });
  }

  statementCreate() {
    this.post.lrOldInvoice2("FALSE");
    this.updateTotalInvCreditAmt1();
  }

  updateTotalInvCreditAmt1() {
    const data = {
      fuelDealerCustomerMapId: this.searchDiscountForm.value.selectCorporateMapId,
      totalAmount: this.finalTotalAmt,
    };
    this.post.updateTotalInvCreditAmtPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
          localStorage.setItem("manualSno", this.manualSno);
          if (this.addForm.value.dueDate) {
            localStorage.setItem("isDueDate", "TRUE");
            localStorage.setItem("dueDate", this.addForm.value.dueDate);
          } else {
            localStorage.setItem("isDueDate", "FALSE");
          }
          localStorage.setItem("hsnCode", this.hsnCode);
          localStorage.setItem("termsAndConditions", this.termsAndConditions)
          this.router.navigate(['/credit/FuelCreditInvoiceDocYear/' + '0'], { queryParams: { s: '0' } });
        }
      });
  }

  updateTotalInvCreditAmtForInterval() {
    this.post.lrOldInvoice3("FALSE");
    const data = {
      fuelDealerCustomerMapId: this.searchDiscountForm.value.selectCorporateMapId,
      totalAmount: this.finalTotalAmt,
    };
    this.post.updateTotalInvCreditAmtPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
          localStorage.setItem("manualSno", this.manualSno);
          if (this.addForm.value.dueDate) {
            localStorage.setItem("isDueDate", "TRUE");
            localStorage.setItem("dueDate", this.addForm.value.dueDate);
          } else {
            localStorage.setItem("isDueDate", "FALSE");
          }
          localStorage.setItem("hsnCode", this.hsnCode);
          localStorage.setItem("termsAndConditions", this.termsAndConditions)

          this.router.navigate(['/credit/fuelCreditInvoiceDoc/' + '0'], { queryParams: { s: '0' } });
        }
      });
  }

  createInvoiceWithoutPaymentDetails1() {
    this.post.lrOldInvoice1("TRUE");
    const data = {
      fuelDealerCustomerMapId: this.searchDiscountForm.value.selectCorporateMapId,
      totalAmount: this.finalTotalAmt,
    };
    this.post.updateTotalInvCreditAmtPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
          localStorage.setItem("manualSno", this.manualSno);
          if (this.addForm.value.dueDate) {
            localStorage.setItem("isDueDate", "TRUE");
            localStorage.setItem("dueDate", this.addForm.value.dueDate);
          } else {
            localStorage.setItem("isDueDate", "FALSE");
          }
          localStorage.setItem("hsnCode", this.hsnCode);
          localStorage.setItem("termsAndConditions", this.termsAndConditions)

          this.router.navigate(['/credit/fuelCreditInvoiceDocument/' + '0'], { queryParams: { s: '0' } });
        }
      });
  }

  statementCreate1() {
    this.post.lrOldInvoice2("TRUE");
    this.updateTotalInvCreditAmt1();
  }

  updateTotalInvCreditAmtForInterval1() {
    this.post.lrOldInvoice3("TRUE");
    const data = {
      fuelDealerCustomerMapId: this.searchDiscountForm.value.selectCorporateMapId,
      totalAmount: this.finalTotalAmt,
    };
    this.post.updateTotalInvCreditAmtPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
          localStorage.setItem("manualSno", this.manualSno);
          if (this.addForm.value.dueDate) {
            localStorage.setItem("isDueDate", "TRUE");
            localStorage.setItem("dueDate", this.addForm.value.dueDate);
          } else {
            localStorage.setItem("isDueDate", "FALSE");
          }
          localStorage.setItem("hsnCode", this.hsnCode);
          localStorage.setItem("termsAndConditions", this.termsAndConditions)

          this.router.navigate(['/credit/fuelCreditInvoiceDocYear/' + '0'], { queryParams: { s: '0' } });
        }
      });
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getCrStatement();
  }

  openSelectMobile(selectMobile: any) {
    this.modalRef = this.modalService.open(selectMobile, { size: "sm" });
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

  getManagersByfuelDealerId(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId
    };
    this.post.getManagerDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.managerList = res.data;
          this.cd.detectChanges()
        } else {
          this.managerList = [];
          this.cd.detectChanges()
        }
      }
      );
  }


}
