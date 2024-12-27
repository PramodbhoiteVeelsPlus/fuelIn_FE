import { Component, OnInit, Input, Injectable, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { LayoutService } from '../../../../../layout';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { TilesService } from '../../tiles/tiles.services';
import { TransTablesService } from '../trans-tables.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
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

@Component({
  selector: 'app-trans-tables-widget8',
  templateUrl: './trans-tables-widget8.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TransTablesWidget8Component implements OnInit {
  @Input() fromDate: any;
  @Input() toDate: any;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();
  hoveredDate: any;
  fromNGDate: any;
  toNGDate: any;
  selected: any;
  hidden: boolean = true;
  crPaymentDetails2: any = [];
  crPaymentDetails: any = [];
  crPaymentDetailsData: any = [];
  showHeading: boolean = false;
  crPaymentDetails1: any = [];
  fuelDealerCorpMapIdNew: any;
  paymentDetails: any = [];
  createdBy: any;
  ownerName: string;

  /**
* @param date date obj
*/
  isInside(date: NgbDate) {
    return date.after(this.fromNGDate) && date.before(this.toNGDate);
  }

  /**
 * @param date date obj
 */
  isRange(date: NgbDate) {
    return date.equals(this.fromNGDate) || date.equals(this.toNGDate) || this.isInside(date) || this.isHovered(date);
  }

  /**
  * Is hovered over date
  * @param date date obj
  */
  isHovered(date: NgbDate) {
    return this.fromNGDate && !this.toNGDate && this.hoveredDate && date.after(this.fromNGDate) && date.before(this.hoveredDate);
  }

  /**
   * on date selected
   * @param date date object
   */
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';
      // console.log('11111111');
      // console.log(this.selected);

    } else if (this.fromDate && !this.toDate && date.after(this.fromNGDate)) {
      this.toNGDate = date;
      this.toDate = new Date(date.year, date.month - 1, date.day);
      this.hidden = true;
      // this.selected = this.fromDate.toLocaleDateString() + '-' + this.toDate.toLocaleDateString();

      this.selected = moment(this.fromDate.toLocaleDateString()).format("DD-MM-YYYY") + ' - ' + moment(this.toDate.toLocaleDateString()).format("DD-MM-YYYY")
      this.filterForm.controls["startDate"].setValue(moment(this.fromDate.toLocaleDateString()).format("DD-MM-YYYY"));
      this.filterForm.controls["endDate"].setValue(moment(this.toDate.toLocaleDateString()).format("DD-MM-YYYY"));


      this.dateRangeSelected.emit({ fromDate: this.fromDate, toDate: this.toDate });
      // console.log('2222222222');
      // console.log(this.selected);

      this.fromDate = null;
      this.toDate = null;
      this.fromNGDate = null;
      this.toNGDate = null;

    } else {
      this.fromNGDate = date;
      this.fromDate = new Date(date.year, date.month - 1, date.day);
      this.selected = '';

      // console.log('33333333');
      // console.log(this.selected);

    }
  }
  filterForm = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    selectCorporateName: new FormControl(''),
  });

  fuelDealerId: any;
  accessGroup: any;
  transporterCorpId: any;

  p: number = 1;
  p1: number = 1;
  total: number = 0;
  brandName: any;

  constructor(private cd: ChangeDetectorRef,
    private post: TransTablesService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private modalService: NgbModal,
    config: NgbDatepickerConfig,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';

  }


  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.transporterCorpId = localStorage.getItem('transporterCorpId');
    this.ownerName = element.firstName + ' ' + element.lastName
    this.accessGroup = element.accessGroupId
    this.getCRPayment(this.transporterCorpId);
    this.getAllDealersNameList(this.transporterCorpId);
    this.cd.detectChanges()
  }


  getAllDealersNameList(transporterCorpId: any) {
    let data = {
      corporateId: transporterCorpId,
    }
    this.post.getAllDealersListPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.crPaymentDetails2 = res.data;
          }
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
        }
      })
  }

  getCorporateInfoByfuelDealerCustomerMapId(id: any) {
    let data = {
      fuelDealerId: this.fuelDealerId,
      customerName: id.target.value,
    }
    this.post.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.fuelDealerCorpMapIdNew = res.data[0].fuelDealerCustomerMapId;
          // this.getFilterCRPaymentFORDealer();
          this.cd.detectChanges()
        } else {
          this.getCRPayment(this.transporterCorpId);
          this.cd.detectChanges()
        }
      });

  }

  getFilterCRPayment() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      if (this.filterForm.value.selectCorporateName) {
        let data = {
          fuelDealerId: this.fuelDealerId,
          corporateId: this.transporterCorpId,
          customerName: this.filterForm.value.selectCorporateName,
          startDate: moment(this.filterForm.value.startDate, ["MM-DD-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["MM-DD-YYYY"]).format("YYYY-MM-DD"),
        }

        this.post.getAllCRPaymentByCustNameCorporatePOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                this.crPaymentDetails = res.data;
                this.crPaymentDetailsData = res.data;
                this.showHeading = true;
                this.cd.detectChanges()
              }
              else {
                alert("Don't have any Credit Payment in this Month!")
                this.cd.detectChanges()
              }
            }
            else {
            }
          })


      }
      else {
        let data = {
          corporateId: this.transporterCorpId,
          startDate: moment(this.filterForm.value.startDate, ["MM-DD-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["MM-DD-YYYY"]).format("YYYY-MM-DD"),
        }

        this.post.getAllCRPaymentByCorporatePOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                this.crPaymentDetails = res.data;
                this.crPaymentDetailsData = res.data;
                this.showHeading = true;
                this.cd.detectChanges()
              }
              else {
                alert("Don't have any Credit Payment in this Month!")
                this.cd.detectChanges()
              }
            }
            else {
            }
          })


      }
    }
    else {
      if (this.filterForm.value.selectCorporateName) {

        let data = {
          fuelDealerId: this.fuelDealerId,
          corporateId: this.transporterCorpId,
          customerName: this.filterForm.value.selectCorporateName,
          // startDate:  moment(startDate).format("YYYY-MM-DD") ,
          startDate: moment(new Date()).subtract(15, 'day').format("YYYY-MM-DD"),
          endDate: moment(new Date()).format("YYYY-MM-DD"),
        }

        this.post.getAllCRPaymentByCustNameCorporatePOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                this.crPaymentDetails = res.data;
                this.crPaymentDetailsData = res.data;
                this.showHeading = true;
                this.cd.detectChanges()
              }
              else {
                alert("Don't have any Credit Payment in this Month for selected Customer!")
                this.cd.detectChanges()
              }
            }
            else {
            }
          })


      }
      else {
        this.getCRPayment(this.transporterCorpId);
        this.cd.detectChanges()
        //this.excelDownload()
      }
    }

  }

  getCRPayment(transporterCorpId: any) {

    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      if (this.filterForm.value.selectCorporateName) {
        this.spinner.show()
        let data = {
          fuelDealerId: this.fuelDealerId,
          corporateId: this.transporterCorpId,
          mapId: this.fuelDealerCorpMapIdNew,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {
          this.post.getAllCRPaymentByCustNameDealerPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                if (res.data.length) {
                  this.crPaymentDetails = res.data;
                  this.crPaymentDetailsData = res.data;

                  this.showHeading = true;
                  this.spinner.hide()
                  this.cd.detectChanges()
                }
                else {
                  alert("Don't have any Credit Payment in this Month!")
                  this.showHeading = false;
                  this.spinner.hide()
                  this.cd.detectChanges()
                }
              }
              else {
              }
            })
        }

      }
      else {
        this.spinner.show()
        let data = {
          corporateId: this.transporterCorpId,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {
          this.post.getAllCRPaymentByDealerPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                if (res.data.length) {
                  this.crPaymentDetails = res.data;
                  this.crPaymentDetailsData = res.data;
                  this.showHeading = true;
                  this.spinner.hide()
                  this.cd.detectChanges()
                }
                else {
                  alert("Don't have any Credit Payment in this Month!")
                  this.showHeading = false;
                  this.spinner.hide()
                  this.cd.detectChanges()
                }
              }
              else {
              }
            })
        }

      }
    } else {
      this.spinner.show()
      let data = {
        corporateId: transporterCorpId,
        startDate: moment(new Date()).subtract(15, 'day').format("YYYY-MM-DD"),
        endDate: moment(new Date()).format("YYYY-MM-DD"),
      }

      if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {
        this.post.getAllCRPaymentByDealerPOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                this.crPaymentDetails = res.data;
                this.crPaymentDetailsData = res.data;
                this.crPaymentDetails1 = res.data1;
                this.showHeading = true;
                this.spinner.hide()
                this.cd.detectChanges()
              }
              else {
                //alert("Don't have any Credit Payment in this Month!")
                this.crPaymentDetails1 = res.data1;
                this.crPaymentDetails.length = 0;
                this.spinner.hide()
                this.cd.detectChanges()
              }
            }
            else {
            }
          })
      } else {
        this.spinner.show()
        this.post.getAllCRPaymentByCorporatePOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                this.crPaymentDetails = res.data;
                this.crPaymentDetailsData = res.data;
                this.crPaymentDetails1 = res.data1;
                this.showHeading = true;
                this.spinner.hide()
                this.cd.detectChanges()
              }
              else {
                //alert("Don't have any Credit Payment in this Month!")
                this.crPaymentDetails1 = res.data1;
                this.crPaymentDetails.length = 0;
                this.spinner.hide()
                this.cd.detectChanges()
              }
            }
            else {
            }
          })
      }

    }

  }

  excelDownload() {
    if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {
      this.paymentDetails.length = 0

      this.crPaymentDetails.map((res: { byManager: string; managerName: any; transacDate: moment.MomentInput; companyName: any; hostName: any; hostPhone: any; paymentMethod: any; grandTotalAmount: any; pendingDays: any; bankName: string; accountNumber: string; avgPayment: any; }) => {

        if (res.byManager == 'FALSE') {
          this.createdBy = this.ownerName
        } else {
          this.createdBy = res.managerName
        }

        let json = {
          Date: moment(res.transacDate).format("DD-MM-YYYY"),
          CustomerName: res.companyName,
          KeyPersonName: res.hostName,
          KeyPersonMobile: res.hostPhone,
          PaymentMode: res.paymentMethod,
          Amount: Number(res.grandTotalAmount),
          PendingDays: res.pendingDays,
          Account: res.bankName + ' ' + res.accountNumber,
          PaymentScore: Number(res.avgPayment).toFixed(0),
          CreatedBy: this.createdBy,

        };


        this.paymentDetails.push(json);
      });

      this.excelService.exportAsExcelFile(
        this.paymentDetails,
        "CreditPaymentReport"
      );
    }
    else {

      this.paymentDetails.length = 0

      this.crPaymentDetails.map((res: { transacDate: moment.MomentInput; companyName: any; hostName: any; hostPhone: any; paymentMethod: any; grandTotalAmount: any; }) => {

        let json = {
          Date: moment(res.transacDate).format("DD-MM-YYYY"),
          PumpName: res.companyName,
          KeyPersonName: res.hostName,
          KeyPersonMobile: res.hostPhone,
          PaymentMode: res.paymentMethod,
          Amount: res.grandTotalAmount,
        };

        this.paymentDetails.push(json);
      });

      this.excelService.exportAsExcelFile(
        this.paymentDetails,
        "PaymentReport"
      );

    }

  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getCRPayment(this.transporterCorpId);
  }

}

