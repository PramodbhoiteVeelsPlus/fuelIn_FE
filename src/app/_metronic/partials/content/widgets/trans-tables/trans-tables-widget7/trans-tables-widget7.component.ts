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
  selector: 'app-trans-tables-widget7',
  templateUrl: './trans-tables-widget7.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TransTablesWidget7Component implements OnInit {
  @Input() fromDate: any;
  @Input() toDate: any;
  @Output() dateRangeSelected: EventEmitter<{}> = new EventEmitter();
  hoveredDate: any;
  fromNGDate: any;
  toNGDate: any;
  selected: any;
  hidden: boolean = true;
  isFilterByMapId: boolean = false;

  selectCorporate = new FormGroup({
    selectCorporateId: new FormControl('', [Validators.required]),
    selectPersonId: new FormControl('', [Validators.required]),
    startDate: new FormControl(),
    endDate: new FormControl(),
    startDate1: new FormControl(),
    endDate1: new FormControl(),
    creditTotalQuantity: new FormControl(),
    creditTotal: new FormControl(),
    discount: new FormControl(),
    totalDiscountAmount: new FormControl(),
    totalCreditAmount: new FormControl(),
  });

  filterForm = new FormGroup({
    transactionType: new FormControl('', [Validators.required]),
  });
  allCreditSalesDetails: any = [];
  allCreditReq: any = [];
  allCreditReqDataa: any = [];
  productWiseCRAmt: any;
  allCreditReqData: any = [];
  pageLength: any = [];
  allCreditReqExcel: any = [];
  showHeading: boolean = false;
  allCreditReqExcelListDetails: any = [];
  vehicle: string;
  productName: any;
  actualCreditQuantity: string;
  createdBy: string;
  CustomerName: any;
  selectCorporateId: any;
  fuelDealerCustomMapId: any;

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

  fuelDealerId: any;
  accessGroup: any;
  transporterCorpId: any;

  p: number = 1;
  p1: number = 1;
  total: number = 0;
  brandName: any;
  allCorporateList: any = [];
  allCorporateListData: any;

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
    this.accessGroup = element.accessGroupId
    this.getfuelDealerIdByCorporateId(this.transporterCorpId)
    this.getAllDealersNameList(this.transporterCorpId)
    this.getDetailsByTransactionType()
    this.cd.detectChanges()
  }

  getfuelDealerIdByCorporateId(transporterCorpId: any) {
    this.spinner.show()
    let data = {
      corporateId: transporterCorpId
    }
    this.post.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          // this.fuelDealerId = res.data[0].fuelDealerId;
          this.brandName = res.data[0].brandName;
          console.log("fuelOf", this.fuelDealerId)
          this.spinner.hide()
          this.cd.detectChanges();
        }
        else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  getAllDealersNameList(transporterCorpId: any){
    this.spinner.show()
    let data = {
      corporateId: transporterCorpId,
    }
    this.post.getAllDealersListPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if(res.data.length){
            this.allCorporateList = res.data;
            this.allCorporateListData = res;            
          }   
          this.spinner.hide()
          this.cd.detectChanges();         
        }
        else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

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
      this.selectCorporate.controls["startDate"].setValue(moment(this.fromDate.toLocaleDateString()).format("DD-MM-YYYY"));
      this.selectCorporate.controls["endDate"].setValue(moment(this.toDate.toLocaleDateString()).format("DD-MM-YYYY"));


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

  pageChangeEvent(event: number) {
    this.p = event;
    this.getDetailsByTransactionType()
  }

  searchByCorp() {
    let creditArr = [];
    this.filterForm.controls["transactionType"].setValue("");

    if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {
      if (this.selectCorporate.value.selectCorporateId) {
        if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {

          // this.searchByCorporate();
        }
        else {
          alert("Please Select Date!")
        }
      } else {
        this.isFilterByMapId = false;
        if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {

          this.spinner.show()
          let data = {
            fuelDealerId: this.fuelDealerId,
            startDate: moment(this.selectCorporate.value.startDate, ["MM-DD-YYYY"]).format('YYYY-MM-DD'),
            endDate: moment(this.selectCorporate.value.endDate, ["MM-DD-YYYY"]).format('YYYY-MM-DD'),
          }
          this.post.getFuelCreditRequestByfuelDealerIdPOST(data)
            .subscribe(res => {
              if (res.data.length) {
                creditArr = []
                creditArr = Object.values(res.data.reduce((acc: any, cur: { fuelCreditId: any; }) => Object.assign(acc, { [cur.fuelCreditId]: cur }), {}))
                this.allCreditSalesDetails = creditArr.sort((a: any, b: any) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
                this.allCreditReq = this.allCreditSalesDetails.sort((a: any, b: any) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
                this.allCreditReqDataa = this.allCreditReq;
                this.productWiseCRAmt = res.data1;
                this.allCreditReqData = this.allCreditReq;
                this.pageLength = creditArr;
                this.allCreditReqExcel = this.allCreditReq;
                this.showHeading = true;
                this.spinner.hide()
                this.cd.detectChanges()
              } else {
                this.selectCorporate.controls["startDate"].setValue("");
                this.selectCorporate.controls["endDate"].setValue("");
                alert("Data not found!")
                this.showHeading = false;
                this.spinner.hide()
                this.cd.detectChanges()
                // this.getFuelCreditRequestByfuelDealerId(this.fuelDealerId);
              }
            });
        }
      }
    } else {
      if (this.selectCorporate.value.selectCorporateId) {
        if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {

          // this.searchByCorporate();
        }
        else {
          alert("Please Select Date!")
        }
      } else {
        this.isFilterByMapId = false;
        if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {
          this.spinner.show()
          let data = {
            corporateId: this.transporterCorpId,
            startDate: moment(this.selectCorporate.value.startDate, ["MM-DD-YYYY"]).format('YYYY-MM-DD'),
            endDate: moment(this.selectCorporate.value.endDate, ["MM-DD-YYYY"]).format('YYYY-MM-DD'),
          }
          this.post.getFuelCreditByCorporateIdPOST(data)
            .subscribe(res => {
              if (res.data.length) {
                this.allCreditReq = res.data;
                this.allCreditReqData = res;
                this.pageLength = res.data;
                this.allCreditReqExcel = res.data;
                this.spinner.hide()
                this.cd.detectChanges()
              } else {
                this.selectCorporate.controls["startDate"].setValue("");
                this.selectCorporate.controls["endDate"].setValue("");
                alert("Data not found!")
                this.spinner.hide()
                this.cd.detectChanges()
                // this.getFuelCreditRequestByCorporateId(this.loginCorporateId);
              }
            });
        }
      }
    }


  }

  downloadExcelForDealer() {

    if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {
      this.allCreditReqExcelListDetails.length = 0

      this.allCreditReq.map((res: { purpose: string; vehicleNumber: string; productName: any; productCategory: string; actualCreditQuantity: string; lubeName: string; lubeUnit: string; advName: string; advMobile: string; byManager: string; firstName: string; lastName: string; managerName: any; mappingPreviousStatus: string; mappingCompanyName: any; companyName: any; estimatedRefuelDate: moment.MomentInput; hostName: any; hostPhone: any; manualCrNumber: any; productRate: any; creditAmount: any; }) => {

        if (res.purpose == 'CREDIT') {
          if (res.vehicleNumber == 'undefined') {
            this.vehicle = '-'
            this.productName = res.productName
            if (res.productCategory == 'CNG') {
              this.actualCreditQuantity = res.actualCreditQuantity
            } else {
              this.actualCreditQuantity = res.actualCreditQuantity
            }
          } else {
            this.vehicle = res.vehicleNumber
            this.productName = res.productName
            if (res.productCategory == 'CNG') {
              this.actualCreditQuantity = res.actualCreditQuantity
            } else {
              this.actualCreditQuantity = res.actualCreditQuantity
            }
          }

        } else {
          if (res.purpose == 'LUBE') {
            if (res.vehicleNumber == 'undefined') {
              this.vehicle = res.lubeName
              this.productName = res.productName
              this.actualCreditQuantity = res.actualCreditQuantity + '' + res.lubeUnit
            } else {
              this.vehicle = res.vehicleNumber + ' ' + res.lubeName
              this.productName = res.productName
              this.actualCreditQuantity = res.actualCreditQuantity + '' + res.lubeUnit
            }

          } else {
            if (res.purpose == 'LUBETAX') {
              if (res.vehicleNumber == 'undefined') {
                this.vehicle = res.lubeName
                this.productName = 'LUBRICANTS-TAX'
                this.actualCreditQuantity = res.actualCreditQuantity + '' + res.lubeUnit
              } else {
                this.vehicle = res.vehicleNumber + ' ' + res.lubeName
                this.productName = 'LUBRICANTS-TAX'
                this.actualCreditQuantity = res.actualCreditQuantity + '' + res.lubeUnit
              }

            } else {
              this.vehicle = res.advName + ' ' + res.advMobile
              this.productName = 'ADVANCE'
              this.actualCreditQuantity = '-'
            }
          }
        }

        if (res.byManager == 'FALSE') {
          this.createdBy = res.firstName + ' ' + res.lastName
        } else {
          this.createdBy = res.managerName
        }

        if (res.mappingPreviousStatus == 'TRUE') {
          this.CustomerName = res.mappingCompanyName;
        } else {
          this.CustomerName = res.companyName
        }

        var json = {

          Date: moment(res.estimatedRefuelDate).format('DD-MM-YYYY'),
          CustomerName: this.CustomerName,
          KeyPersonName: res.hostName,
          KeyPersonMobile: res.hostPhone,
          Ref_Bill_No: res.manualCrNumber,
          VehicleNo_OtherDetails: this.vehicle,
          Product: this.productName,
          Rate: res.productRate,
          CreditQuantity: this.actualCreditQuantity,
          CreditAmount: Number(res.creditAmount).toFixed(2),
          CreatedBy: this.createdBy,

        };

        this.allCreditReqExcelListDetails.push(json);
      });

      this.excelService.exportAsExcelFile(
        this.allCreditReqExcelListDetails,
        "CorporateListCreditReport"
      );
    }
    else {
      this.allCreditReqExcelListDetails.length = 0

      this.allCreditReqExcel.map((res: { purpose: string; vehicleNumber: string; productName: any; productCategory: string; actualCreditQuantity: string; lubeName: string; lubeUnit: string; advName: string; advMobile: string; estimatedRefuelDate: moment.MomentInput; companyName: any; brandName: any; manualCrNumber: any; productRate: any; creditAmount: any; }) => {

        if (res.purpose == 'CREDIT') {
          if (res.vehicleNumber == 'undefined') {
            this.vehicle = '-'
            this.productName = res.productName
            if (res.productCategory == 'CNG') {
              this.actualCreditQuantity = res.actualCreditQuantity
            } else {
              this.actualCreditQuantity = res.actualCreditQuantity
            }
          } else {
            this.vehicle = res.vehicleNumber
            this.productName = res.productName
            if (res.productCategory == 'CNG') {
              this.actualCreditQuantity = res.actualCreditQuantity
            } else {
              this.actualCreditQuantity = res.actualCreditQuantity
            }
          }

        } else {
          if (res.purpose == 'LUBE') {
            if (res.vehicleNumber == 'undefined') {
              this.vehicle = res.lubeName
              this.productName = res.productName
              this.actualCreditQuantity = res.actualCreditQuantity + '' + res.lubeUnit
            } else {
              this.vehicle = res.vehicleNumber + ' ' + res.lubeName
              this.productName = res.productName
              this.actualCreditQuantity = res.actualCreditQuantity + '' + res.lubeUnit
            }

          } else {
            if (res.purpose == 'LUBETAX') {
              if (res.vehicleNumber == 'undefined') {
                this.vehicle = res.lubeName
                this.productName = 'LUBRICANTS-TAX'
                this.actualCreditQuantity = res.actualCreditQuantity + '' + res.lubeUnit
              } else {
                this.vehicle = res.vehicleNumber + ' ' + res.lubeName
                this.productName = 'LUBRICANTS-TAX'
                this.actualCreditQuantity = res.actualCreditQuantity + '' + res.lubeUnit
              }

            } else {
              this.vehicle = res.advName + ' ' + res.advMobile
              this.productName = 'ADVANCE'
              this.actualCreditQuantity = '-'
            }
          }
        }

        var json = {

          Date: moment(res.estimatedRefuelDate).format('DD-MM-YYYY'),
          CustomerName: res.companyName,
          OilCompany: res.brandName,
          VehicleNo_OtherDetails: this.vehicle,
          Ref_Bill_No: res.manualCrNumber,
          Product: this.productName,
          Rate: res.productRate,
          CreditQuantity: this.actualCreditQuantity,
          CreditAmount: res.creditAmount,

        };


        this.allCreditReqExcelListDetails.push(json);
      });

      this.excelService.exportAsExcelFile(
        this.allCreditReqExcelListDetails,
        "PurchaseReport"
      );
    }
  }

  getDetailsByTransactionType() {
    if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {

      if (this.selectCorporate.value.selectCorporateId) {
        if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {
          let creditArr = []
          this.spinner.show();

          let data = {
            fuelDealerId: this.fuelDealerId,
            fuelCorporateId: this.selectCorporate.value.selectCorporateId,
            startDate: moment(this.selectCorporate.value.startDate, ["MM-DD-YYYY"]).format('YYYY-MM-DD'),
            endDate: moment(this.selectCorporate.value.endDate, ["MM-DD-YYYY"]).format('YYYY-MM-DD'),
            transactionType: this.filterForm.value.transactionType,
          }
          this.post.getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1POST(data)
            .subscribe(res => {
              if (res.data.length) {
                creditArr = []
                creditArr = Object.values(res.data.reduce((acc: any, cur: { fuelCreditId: any; }) => Object.assign(acc, { [cur.fuelCreditId]: cur }), {}))
                this.allCreditSalesDetails = creditArr.sort((a: any, b: any) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
                this.allCreditReq = this.allCreditSalesDetails.sort((a: any, b: any) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
                this.allCreditReqDataa = this.allCreditReq;
                this.productWiseCRAmt = res.data1;
                this.allCreditReqData = this.allCreditReq;
                this.allCreditReqExcel = this.allCreditReq;
                this.pageLength = this.allCreditReq;
                this.selectCorporateId = res.data[0].fuelCorporateId;
                this.fuelDealerCustomMapId = res.data[0].fuelDealerCustomerMapId;
                //this.selectCredit(this.fuelDealerCustomMapId)

                this.spinner.hide();
                this.cd.detectChanges()
                // this.totalCreditAmt = (res.creditAmount).toFixed(2);
              } else {
                alert("Data Not Found..!")
                this.spinner.hide();
                this.cd.detectChanges()
              }
            });
        } else {
          alert("Please select Date")
        }
      }
      else {
        if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {
          let creditArr = []

          let data = {
            fuelDealerId: this.fuelDealerId,
            startDate: moment(this.selectCorporate.value.startDate, ["MM-DD-YYYY"]).format('YYYY-MM-DD'),
            endDate: moment(this.selectCorporate.value.endDate, ["MM-DD-YYYY"]).format('YYYY-MM-DD'),
            transactionType: this.filterForm.value.transactionType,
          }
          this.post.getFuelCreditRequestByfuelDealerIdPOST(data)
            .subscribe(res => {
              if (res.data.length) {
                creditArr = []
                creditArr = Object.values(res.data.reduce((acc: any, cur: { fuelCreditId: any; }) => Object.assign(acc, { [cur.fuelCreditId]: cur }), {}))
                this.allCreditSalesDetails = creditArr.sort((a: any, b: any) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
                this.allCreditReq = this.allCreditSalesDetails.sort((a: { estimatedRefuelDate: number; fuelCreditId: number; }, b: { estimatedRefuelDate: number; fuelCreditId: number; }) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
                this.allCreditReqDataa = this.allCreditReq;
                this.productWiseCRAmt = res.data1;
                this.allCreditReqData = this.allCreditReq;
                this.pageLength = this.allCreditReq;
                this.allCreditReqExcel = this.allCreditReq;
              } else {
                this.selectCorporate.controls["startDate"].setValue("");
                this.selectCorporate.controls["endDate"].setValue("");
                alert("Data not found!")
                this.getFuelCreditRequestByfuelDealerId(this.fuelDealerId);
              }
            });

        } else {
          let creditArr = []

          let data = {
            fuelDealerId: this.fuelDealerId,
            transactionType: this.filterForm.value.transactionType,
          }
          this.post.getFuelCreditRequestByfuelDealerIdPOST(data)
            .subscribe(res => {
              if (res.data.length) {

                creditArr = Object.values(res.data.reduce((acc: any, cur: { fuelCreditId: any; }) => Object.assign(acc, { [cur.fuelCreditId]: cur }), {}))
                this.allCreditSalesDetails = creditArr.sort((a: any, b: any) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
                this.allCreditReq = this.allCreditSalesDetails.sort((a: { estimatedRefuelDate: number; fuelCreditId: number; }, b: { estimatedRefuelDate: number; fuelCreditId: number; }) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
                this.allCreditReqDataa = this.allCreditReq;

                this.productWiseCRAmt = res.data1;
                //  this.allCreditReq = res.data;
                //this.allCreditReqData = res;
                this.pageLength = res.data;
                this.allCreditReqExcel = res.data;
                this.cd.detectChanges()
              } else {
                this.selectCorporate.controls["startDate"].setValue("");
                this.selectCorporate.controls["endDate"].setValue("");
                alert("Data not found!")
                this.cd.detectChanges()
              }
            }
            );
        }
      }
    }
    else {
      if (this.selectCorporate.value.selectCorporateId) {
        if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {
          this.spinner.show();
          let data = {
            corporateId: this.transporterCorpId,
            fuelDealer: this.selectCorporate.value.selectCorporateId,
            startDate: moment(this.selectCorporate.value.startDate, ["MM-DD-YYYY"]).format('YYYY-MM-DD'),
            endDate: moment(this.selectCorporate.value.endDate, ["MM-DD-YYYY"]).format('YYYY-MM-DD'),
            transactionType: this.filterForm.value.transactionType,
          }
          this.post.getFuelCreditRequestByCorporateIdAndFuelDealerPOST(data)
            .subscribe(res => {
              if (res.data.length) {
                this.allCreditReq = res.data;
                this.allCreditReqData = res;
                this.allCreditReqExcel = res.data;
                this.pageLength = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                alert("Data Not Found..!")
                this.spinner.hide();
                this.cd.detectChanges()
              }
            });
        } else {
          alert("Please select Date")
        }
      }
      else {
        if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {

          let data = {
            corporateId: this.transporterCorpId,
            startDate: moment(this.selectCorporate.value.startDate, ["MM-DD-YYYY"]).format('YYYY-MM-DD'),
            endDate: moment(this.selectCorporate.value.endDate, ["MM-DD-YYYY"]).format('YYYY-MM-DD'),
            transactionType: this.filterForm.value.transactionType,
          }
          this.post.getFuelCreditByCorporateIdPOST(data)
            .subscribe(res => {
              if (res.data.length) {
                this.allCreditReq = res.data;
                this.allCreditReqData = res;
                this.pageLength = res.data;
                this.allCreditReqExcel = res.data;
                this.cd.detectChanges()
              } else {
                this.selectCorporate.controls["startDate"].setValue("");
                this.selectCorporate.controls["endDate"].setValue("");
                alert("Data not found!")
                this.getFuelCreditRequestByCorporateId(this.transporterCorpId);
                this.cd.detectChanges()
              }
            });

        } else {
          let data = {
            corporateId: this.transporterCorpId,
            transactionType: this.filterForm.value.transactionType,
          }
          this.post.getFuelCreditByCorporateIdPOST(data)
            .subscribe(res => {
              if (res.data.length) {
                this.allCreditReq = res.data;
                this.allCreditReqData = res;
                this.pageLength = res.data;
                this.allCreditReqExcel = res.data;
                this.cd.detectChanges()
              } else {
                this.selectCorporate.controls["startDate"].setValue("");
                this.selectCorporate.controls["endDate"].setValue("");
                alert("Data not found!")
                this.cd.detectChanges()
              }
            }
            );
        }
      }
    }

  }

  getFuelCreditRequestByfuelDealerId(fuelDealerId: any) {

    let creditArr = [];
    let data = {
      fuelDealerId: fuelDealerId,
    }
    this.post.getFuelCreditRequestByfuelDealerIdPOST(data)
      .subscribe(res => {
        creditArr = [];
        if (res.data.length) {
          creditArr = Object.values(res.data.reduce((acc: any, cur: { fuelCreditId: any; }) => Object.assign(acc, { [cur.fuelCreditId]: cur }), {}))
          this.allCreditSalesDetails = creditArr.sort((a: any, b: any) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
          this.allCreditReq = this.allCreditSalesDetails.sort((a: { estimatedRefuelDate: number; fuelCreditId: number; }, b: { estimatedRefuelDate: number; fuelCreditId: number; }) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
          this.allCreditReqDataa = this.allCreditReq;

          // console.log("res getFuelCreditRequestByfuelDealerId : ",res.data)
          this.productWiseCRAmt = res.data1;

          this.pageLength = creditArr;
          this.allCreditReqExcel = this.allCreditReq;
          this.showHeading = true;
          this.cd.detectChanges()
        } else {
          this.showHeading = false;
          this.selectCorporate.controls["startDate"].setValue("");
          this.selectCorporate.controls["endDate"].setValue("");
          alert("Data not found!")
          this.cd.detectChanges()
        }
      }
      );

  }

  getFuelCreditRequestByCorporateId(transporterCorpId: any) {
    let data = {
      corporateId: transporterCorpId,
    }
    this.post.getFuelCreditByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.allCreditReq = res.data;
          this.allCreditReqData = res;
          this.pageLength = res.data;
          this.allCreditReqExcel = res.data;
          this.cd.detectChanges()
        } else {
          this.selectCorporate.controls["startDate"].setValue("");
          this.selectCorporate.controls["endDate"].setValue("");
          alert("Data not found!")
          this.cd.detectChanges()
        }
      }
      );

  }
}

