import { ChangeDetectorRef, Component, Injectable, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { WidgetService } from '../../widgets.services';
import moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExcelService } from 'src/app/pages/excel.service';
import { FormControl, FormGroup } from '@angular/forms';
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
  selector: 'app-tables-widget32',
  templateUrl: './tables-widget32.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget32Component {
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  p: number = 1;
  p1: number = 1;
  total: number = 0;

  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  });
  dealerLoginVPId: any;
  dealerAccess: boolean = false;
  liteAccess: boolean = false;
  customerId: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  statementInvoice: boolean = false;
  companyName: any;
  city: any;
  GSTNumber: any;
  address1: any;
  state: any;
  mobile: any;
  kycId: any;
  pin: any;
  oilCompanyName: any;
  address2: any;
  isActiveCustomer: boolean = false;
  startDate: any;
  endDate: any;
  finalTotal: any;
  advanceCust: any;
  allActiveCreditAccByDealer: any = [];
  totalpurchase: any = 0;
  totalpayment: any = 0;
  netTotal: any = 0;
  advance: any = 0;
  netOut: any;
  dealerCorporateId: any;
  headerName1: any;

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
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dealerCorporateId = localStorage.getItem('dealerCorporateId');
    this.headerName1 = dealerData.companyName;
    this.customerId = dealerData.customerId;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    if (element.accessGroupId == 12 || element.accessGroupId == 14 || element.accessGroupId == 19 || element.accessGroupId == 21) {
      this.dealerAccess = true
      if (element.accessGroupId == 19 || element.accessGroupId == 21) {
        this.liteAccess = true
      }
    }
    this.getfuelDealerIdByCorporateId(this.dealerCorporateId);
    this.getCustomerAllDataById(this.customerId);
    this.cd.detectChanges()
  }

  async openModal() {
    return await this.modalComponent.open();
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
          this.oilCompanyName = res.data[0].brandName;
          if (this.post.setRouteForActiveArray.length) {
            console.log("Array", this.post.setRouteForActiveArray)
            if (this.post.setRouteForActiveArray[0].activeRoute == 'activeCustomer') {
              this.isActiveCustomer = true;
              this.startDate = this.post.setRouteForActiveArray[0].activeStartDate;
              this.endDate = this.post.setRouteForActiveArray[0].activeEndDate;
              this.finalTotal = this.post.setRouteForActiveArray[0].crOutstanding2;
              this.advanceCust = this.post.setRouteForActiveArray[0].advance;

              this.allActiveCreditAccByDealer = this.post.setRouteForActiveArray[0].allActiveCreditAccByDealer

              this.allActiveCreditAccByDealer.map((purCal: { totalPurchaseAmt: any; totalPaymentAmt: any; netOS: any; totalOutstanding: any; }) => {
                this.totalpurchase = this.totalpurchase + Number(purCal.totalPurchaseAmt)
                this.totalpayment = this.totalpayment + Number(purCal.totalPaymentAmt)
                this.netTotal = this.netTotal + Number(purCal.netOS)
                if (Number(purCal.netOS) < 0) {
                  this.advance = this.advance + Number(purCal.netOS)

                }
                if ((Number(purCal.totalOutstanding)) >= 0) {
                  this.netOut = this.netOut + (Number(purCal.totalOutstanding))
                }
              })
              this.cd.detectChanges()

            } else {
              this.isActiveCustomer = false;
              this.allActiveCreditAccByDealer = this.post.setRouteForActiveArray[0].allActiveCreditAccByDealer

              this.allActiveCreditAccByDealer.map((purCal: { totalPurchaseAmt: any; totalPaymentAmt: any; totalCRAmt: any; totalDiscount: any; totalInvPaidAmt: any; previousOutstand: any; }) => {
                this.totalpurchase = this.totalpurchase + Number(purCal.totalPurchaseAmt)
                this.totalpayment = this.totalpayment + Number(purCal.totalPaymentAmt)
                console.log("total", this.totalpurchase = this.totalpurchase + Number(purCal.totalPurchaseAmt), this.allActiveCreditAccByDealer)

                if (((Number(purCal.totalCRAmt) - Number(purCal.totalDiscount) - Number(purCal.totalInvPaidAmt)) + Number(purCal.previousOutstand)) >= 0) {

                  this.netOut = this.netOut + ((Number(purCal.totalCRAmt) - Number(purCal.totalDiscount) - Number(purCal.totalInvPaidAmt)) + Number(purCal.previousOutstand))
                }
              })
              this.cd.detectChanges()
            }

          }
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
        }
      })
  }

  getCustomerAllDataById(customerId: any) {
    const data = {
      customerId: customerId
    };
    this.post.getCustomerByCustomerIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.companyName = res.data[0].companyName;
          this.city = res.data[0].city;
          this.GSTNumber = res.data[0].GSTNumber;
          this.address1 = res.data[0].address1;
          this.address2 = res.data[0].address2;
          this.state = res.data[0].state;
          this.mobile = res.data[0].hostPhone;
          this.kycId = res.data[0].kycId;
          this.pin = res.data[0].pin;
          // this.logo = this.imageURL + res.data[0].companyLogoLink;
          console.log("this.companyName", this.companyName)
          this.cd.detectChanges()

        }
      });
  }
}
