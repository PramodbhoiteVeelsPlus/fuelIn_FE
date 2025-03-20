import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbModal, NgbDatepickerConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { StatsService } from '../../stats/stats.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BaseTablesService } from '../base-tables.services';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import * as htmlToImage from 'html-to-image';
import { WidgetService } from '../../widgets.services';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<any> {

  readonly DELIMITER = '-';

  fromModel(value: any | null): NgbDateStruct | null {
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

  toModel(date: NgbDateStruct | null): any | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: any): NgbDateStruct | null {
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

  format(date: NgbDateStruct | null): any {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-base-tables-widget1',
  templateUrl: './base-tables-widget1.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class BaseTablesWidget1Component implements OnInit {
  dealerMobile: any;
  dealerLoginVPId: any;
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: any;
  acceesGroup: any;

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
  
  requestTransporter = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    reqQuantity: new FormControl(),
    reqCreditAmount: new FormControl(),
    estimatedRefuelDate: new FormControl(),
    actualCreditAmount: new FormControl(),
    actualCreditQuantity: new FormControl(),
    requestType: new FormControl(),
    requestTypeCR: new FormControl(),
    mobile: new FormControl(),
    vehicleNumber: new FormControl(),
    productPrice: new FormControl('', [Validators.required]),
    priceDate: new FormControl(),
    selectPersonId: new FormControl('', [Validators.required]),
    manualCrNumber: new FormControl(),
    productName1: new FormControl(),
  });

  requestEditCr = new FormGroup({
    productName: new FormControl('', [Validators.required]),
    reqQuantity: new FormControl(),
    reqCreditAmount: new FormControl(),
    estimatedRefuelDate: new FormControl(),
    actualCreditAmount: new FormControl(),
    actualCreditQuantity: new FormControl(),
    requestType: new FormControl(),
    requestTypeCR: new FormControl(),
    mobile: new FormControl(),
    vehicleNumber: new FormControl(),
    productPrice: new FormControl('', [Validators.required]),
    priceDate: new FormControl(),
    productCategory: new FormControl(''),
    productRate: new FormControl(),
    estimatedRefuelDateForEdit: new FormControl(),
  });

  allCorporateList: any;
  fuelDealerId: any;
  isTableLoad: boolean = false;
  allCreditSalesDetails: any = [];
  pageLength: any = [];
  allCreditReq: any = [];
  allCreditReqDataa: any = [];
  productWiseCRAmt: any = [];
  allCreditReqData: any = [];
  allCreditReqExcel: any = [];
  showHeading: boolean = false;
  isFilterByMapId: boolean = false;
  dealerCorporateId: any;
  selectCorporateId: any;
  fuelDealerCustomMapId: any;
  vehicle: any;
  productName: any;
  actualCreditQuantity: any;
  createdBy: any;
  CustomerName: any;
  headerName1: any;
  headerName2: any;
  headerName3: any;
  allCreditReqExcelListDetails: any = [];
  searchData: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  mappingPreviousStatus: any;
  mappingCustomerName: any;
  hostName: any;
  hostPhone: any;
  byManager: any;
  productRate: any;
  advName: any;
  advMobile: any;
  vehicleNumber: any;
  lubeName: any;
  manualCrNumberpopup: any;
  rowNumber: any;
  show: boolean = false;
  modalRefShow: any;
  fuelCreditIdShow: any;
  estimatedRefuelDateShow: any;
  mappingPreviousStatusShow: any;
  mappingCompanyNameShow: any;
  companyNameShow: any;
  hostPhoneShow: any;
  purposeShow: any;
  vehicleNumberShow: any;
  manualCrNumberShow: any;
  closeResult: any;
  productNameShow: any;
  productRateShow: any;
  transactionStatusShow: any;
  productCategoryShow: any;
  actualCreditQuantityShow: any;
  creditAmountShow: any;
  modalRef: any
  transacionName: any;
  fuelDealerCustomerMapId: any;
  fuelCreditIdForCancelReq: any;
  modalRefpass: any;
  modalRef1: any;
  fuelCreditIdForEditReq: any;
  vehicleIdForEdit: any;
  vpStatusForEdit: any;
  personIdForEdit: any;
  fuelProdIdForEdit: any;
  manualCrNumber: any;
  fuelDealerCustomerMapIdEdit: any;
  password: any;
  userId: any;
  modalRefCancel: any;
  modalRefEdit: any;
  vehicleVPStatusForEdit: string;
  isQUANTITY: boolean = false;
  isAMOUNT: boolean = false;
  reqQuantityDecimal: number;
  Amount: number;
  todayDate = moment(new Date()).format("DD-MM-YYYY");
  isCRQUANTITY: boolean = false;
  onlyDealerView: boolean = false;
  ownerName: string;
  isDisabled: boolean = true
  productCategory: any;
  estimatedRefuelDateForEdit: moment.MomentInput;
  reqCreditAmount: any;
  reqQuantity: any;
  customerId: any;
  searchBox:FormControl = new FormControl();
  searchTermm: any = "";

  constructor(
    private modalService: NgbModal,
    private post: BaseTablesService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private post1: WidgetService,
    private router: Router) { }

  ngOnInit(): void {
    this.allCreditReq = JSON.parse(localStorage.getItem('allCreditReq') || '{}');
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.userId = element.userId;
    this.acceesGroup = element.accessGroupId;
    if (this.acceesGroup == 12 || this.acceesGroup == 19) {
      this.onlyDealerView = true;
      this.ownerName = element.firstName + ' ' + element.lastName
      this.headerName1 = dealerData.companyName;
      this.headerName2 = dealerData.address1 + ', ' + dealerData.address2 + ', ' + dealerData.city;
      this.headerName3 = dealerData.state + '-' + dealerData.pin + '  ' + "GST: " + dealerData.GSTNumber;
    }
    this.dealerMobile = element.phone1;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.managerName = element.firstName + ' ' + element.lastName
    this.acceesGroup = element.accessGroupId;
    this.getFuelCreditRequestCorporateByfuelDealerId(this.fuelDealerId)
    if (!this.allCreditReq.length) {
      this.getFuelCreditRequestByfuelDealerId(this.fuelDealerId);
    } else {
      this.getFuelCreditRequestByfuelDealerId1(this.fuelDealerId);
    }
    
    if(element.accessGroupId == '14'){
      var managerData = JSON.parse(localStorage.getItem('managerData') || '{}');
      this.customerId = managerData.customerId;
      this.searchDealerBycustomerId(this.customerId)
    }
    // this.getFuelCreditRequestByCorporateId(this.dealerCorporateId)
  }

  getFuelCreditRequestCorporateByfuelDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getFuelCreditRequestCorporateByfuelDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.allCorporateList = res.data;
          // this.allCorporateListData = res;
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  searchByCorp() {
    this.isTableLoad = true;
    let creditArr = [];
    this.filterForm.controls["transactionType"].setValue("");
    if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
      if (this.selectCorporate.value.selectCorporateId) {
        if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {
          this.searchByCorporate();
        }
        else {
          alert("Please Select Date!")
          this.spinner.hide()
        }
      } else {
        this.isFilterByMapId = false;
        if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {
          this.spinner.show()
          let data = {
            fuelDealerId: this.fuelDealerId,
            startDate: moment(this.selectCorporate.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
            endDate: moment(this.selectCorporate.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
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
                this.getFuelCreditRequestByfuelDealerId(this.fuelDealerId);
                this.cd.detectChanges()
              }
            });
        } else {
          this.spinner.hide()
        }
      }
    } else {
      if (this.selectCorporate.value.selectCorporateId) {
        if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {
          this.searchByCorporate();
        }
        else {
          alert("Please Select Date!")
          this.spinner.hide()
        }
      } else {
        this.isFilterByMapId = false;
        if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {
          this.spinner.show()
          let data = {
            corporateId: this.dealerCorporateId,
            startDate: moment(this.selectCorporate.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
            endDate: moment(this.selectCorporate.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
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
                this.getFuelCreditRequestByCorporateId(this.dealerCorporateId);
                this.cd.detectChanges()
              }
            });
        }
      }
    }
  }

  searchByCorporate() {
    let creditArr = []
    if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
      if (this.selectCorporate.value.selectCorporateId) {
        this.spinner.show();

        let data = {
          fuelDealerId: this.fuelDealerId,
          fuelCorporateId: this.selectCorporate.value.selectCorporateId,
          startDate: moment(this.selectCorporate.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
          endDate: moment(this.selectCorporate.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        }
        this.post.getFuelCreditRequestByfuelDealerIdAndFuelCorporateId1POST(data)
          .subscribe(res => {
            if (res.data.length) {
              creditArr = [];
              creditArr = Object.values(res.data.reduce((acc: any, cur: { fuelCreditId: any; }) => Object.assign(acc, { [cur.fuelCreditId]: cur }), {}))
              this.allCreditSalesDetails = creditArr.sort((a: any, b: any) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
              this.allCreditReq = this.allCreditSalesDetails.sort((a: { estimatedRefuelDate: number; fuelCreditId: number; }, b: { estimatedRefuelDate: number; fuelCreditId: number; }) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
              this.allCreditReqDataa = this.allCreditReq;
              this.productWiseCRAmt = res.data1;
              this.allCreditReqData = this.allCreditReq;
              this.allCreditReqExcel = this.allCreditReq;
              this.pageLength = this.allCreditReq;
              this.selectCorporateId = res.data[0].fuelCorporateId;
              this.fuelDealerCustomMapId = res.data[0].fuelDealerCustomerMapId;
              this.showHeading = true;
              this.spinner.hide();
              this.cd.detectChanges()
            } else {
              alert("Data Not Found..!")
              this.spinner.hide();
              this.showHeading = false;
              this.cd.detectChanges()
            }
          });
      }
      else {
        this.spinner.hide();
      }
    } else {
      if (this.selectCorporate.value.selectCorporateId) {
        this.spinner.show();
        let data = {
          corporateId: this.dealerCorporateId,
          fuelDealer: this.selectCorporate.value.selectCorporateId,
          startDate: moment(this.selectCorporate.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
          endDate: moment(this.selectCorporate.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
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
      }
      else {
        this.spinner.hide();
        this.cd.detectChanges()
      }
    }
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.searchByCorporate();
    this.getFuelCreditRequestByfuelDealerId(this.fuelDealerId);
  }

  getFuelCreditRequestByfuelDealerId(fuelDealerId: any) {
    this.spinner.show()
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

          this.productWiseCRAmt = res.data1;

          this.pageLength = creditArr;
          this.allCreditReqExcel = this.allCreditReq;
          this.showHeading = true;
          localStorage.setItem('allCreditReq', JSON.stringify(this.allCreditReq));
          this.cd.detectChanges()
          this.spinner.hide()
        } else {
          this.showHeading = false;
          this.selectCorporate.controls["startDate"].setValue("");
          this.selectCorporate.controls["endDate"].setValue("");
          localStorage.setItem('mappingAccData', JSON.stringify([]));
          alert("Data not found!")
          this.cd.detectChanges()
          this.spinner.hide()
        }
      }
      );
  }

  getFuelCreditRequestByfuelDealerId1(fuelDealerId: any) {
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

          this.productWiseCRAmt = res.data1;

          this.pageLength = creditArr;
          this.allCreditReqExcel = this.allCreditReq;
          this.showHeading = true;
          localStorage.setItem('allCreditReq', JSON.stringify(this.allCreditReq));
          this.cd.detectChanges()
          this.spinner.hide()
        } else {
          this.showHeading = false;
          this.selectCorporate.controls["startDate"].setValue("");
          this.selectCorporate.controls["endDate"].setValue("");
          localStorage.setItem('mappingAccData', JSON.stringify([]));
          alert("Data not found!")
          this.cd.detectChanges()
          this.spinner.hide()
        }
      }
      );
  }

  getFuelCreditRequestByCorporateId(corporateId: any) {
    this.spinner.show()
    let data = {
      corporateId: corporateId,
    }
    this.post.getFuelCreditByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.allCreditReq = res.data;
          this.allCreditReqData = res;
          this.pageLength = res.data;
          this.allCreditReqExcel = res.data;
          this.spinner.hide()
        } else {
          this.selectCorporate.controls["startDate"].setValue("");
          this.selectCorporate.controls["endDate"].setValue("");
          alert("Data not found!")
          this.spinner.hide()
        }
      }
      );

  }

  exportToPDF1() {
    if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {

      var cols = [["Date", "Customer Name", "Key Person Name", "Key Person Mobile", "Bill No", "VehicleNo, Other Details", "Product", "Rate", "Credit Quantity", "Credit Amount", "Created By"]];
      var rows = [];
      for (var key in this.allCreditReq) {

        if (this.allCreditReq[key].purpose == 'CREDIT') {
          if (this.allCreditReq[key].vehicleNumber == 'undefined') {
            this.vehicle = '-'
            this.productName = this.allCreditReq[key].productName
            if (this.allCreditReq[key].productCategory == 'CNG') {
              this.actualCreditQuantity = this.allCreditReq[key].actualCreditQuantity
            } else {
              this.actualCreditQuantity = this.allCreditReq[key].actualCreditQuantity
            }
          } else {
            this.vehicle = this.allCreditReq[key].vehicleNumber
            this.productName = this.allCreditReq[key].productName
            if (this.allCreditReq[key].productCategory == 'CNG') {
              this.actualCreditQuantity = this.allCreditReq[key].actualCreditQuantity
            } else {
              this.actualCreditQuantity = this.allCreditReq[key].actualCreditQuantity
            }
          }
        } else {
          if (this.allCreditReq[key].purpose == 'LUBE') {
            if (this.allCreditReq[key].vehicleNumber == 'undefined') {
              this.vehicle = this.allCreditReq[key].lubeName
              this.productName = this.allCreditReq[key].productName
              this.actualCreditQuantity = this.allCreditReq[key].actualCreditQuantity + '' + this.allCreditReq[key].lubeUnit
            } else {
              this.vehicle = this.allCreditReq[key].vehicleNumber + ' ' + this.allCreditReq[key].lubeName
              this.productName = this.allCreditReq[key].productName
              this.actualCreditQuantity = this.allCreditReq[key].actualCreditQuantity + '' + this.allCreditReq[key].lubeUnit
            }
          } else {
            if (this.allCreditReq[key].purpose == 'LUBETAX') {
              if (this.allCreditReq[key].vehicleNumber == 'undefined') {
                this.vehicle = this.allCreditReq[key].lubeName
                this.productName = 'LUBRICANTS-TAX'
                this.actualCreditQuantity = this.allCreditReq[key].actualCreditQuantity + '' + this.allCreditReq[key].lubeUnit
              } else {
                this.vehicle = this.allCreditReq[key].vehicleNumber + ' ' + this.allCreditReq[key].lubeName
                this.productName = 'LUBRICANTS-TAX'
                this.actualCreditQuantity = this.allCreditReq[key].actualCreditQuantity + '' + this.allCreditReq[key].lubeUnit
              }
            } else {
              this.vehicle = this.allCreditReq[key].advName + ' ' + this.allCreditReq[key].advMobile
              this.productName = 'ADVANCE'
              this.actualCreditQuantity = '-'
            }
          }
        }

        if (this.allCreditReq[key].byManager == 'FALSE') {
          this.createdBy = this.allCreditReq[key].firstName + ' ' + this.allCreditReq[key].lastName
        } else {
          this.createdBy = this.allCreditReq[key].managerName
        }

        if (this.allCreditReq[key].mappingPreviousStatus == 'TRUE') {
          this.CustomerName = this.allCreditReq[key].mappingCompanyName;
        } else {
          this.CustomerName = this.allCreditReq[key].companyName
        }

        var temp = [
          moment(this.allCreditReq[key].estimatedRefuelDate).format("DD-MM-YYYY"),
          this.CustomerName,
          this.allCreditReq[key].hostName,
          this.allCreditReq[key].hostPhone,
          this.allCreditReq[key].manualCrNumber,
          this.vehicle,
          this.productName,
          this.allCreditReq[key].productRate,
          this.actualCreditQuantity,
          Number(this.allCreditReq[key].creditAmount).toFixed(2),
          this.createdBy,
        ];
        rows.push(temp);
      }

      var doc = new jsPDF('l', 'pt');

      doc.setFontSize(12);
      doc.text(this.headerName1, 40, 25);
      doc.setFontSize(8);
      doc.text(this.headerName2, 40, 40);
      doc.text(this.headerName3, 40, 55);
      if (this.selectCorporate.value.startDate && this.selectCorporate.value.endDate) {
        doc.text("DATE : " + moment(this.selectCorporate.value.startDate, ["DD-MM-YYYY"]).format("DD MMM YYYY") + ' To ' + moment(this.selectCorporate.value.endDate, ["DD-MM-YYYY"]).format("DD MMM YYYY"), 40, 70);
      }
      doc.setFontSize(12);
      doc.text("Credit Sales", 350, 35);

      autoTable(doc, {
        columnStyles: {
          0: { cellWidth: 60 },     // date
          1: { cellWidth: 100 },    // CustomerName
          2: { cellWidth: 90 },     //KeyPersonName
          3: { cellWidth: 70 },     //KeyPersonMobile
          4: { cellWidth: 40 },     // Ref_Bill_No 
          5: { cellWidth: 100 },     // VehicleNo_OtherDetails 
          6: { cellWidth: 80 },     // Product 
          7: { cellWidth: 40 },     //rate 
          8: { cellWidth: 60 },     //CreditQuantity 
          9: { cellWidth: 60 },     //CreditAmount 
          10: { cellWidth: 80 },     //CreatedBy 
        },

        margin: { top: 80 },
        head: cols,
        body: rows,
        theme: 'grid',
        didDrawCell: (data) => { },
      });
      doc.save("CorporateListCreditReport.pdf");
    }

  }

  downloadExcelForDealer() {

    if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
      this.allCreditReqExcelListDetails.length = 0

      this.allCreditReq.map((res: { purpose: any; vehicleNumber: any; productName: any; productCategory: any; actualCreditQuantity: any; lubeName: any; lubeUnit: any; advName: any; advMobile: any; byManager: any; firstName: any; lastName: any; managerName: any; mappingPreviousStatus: any; mappingCompanyName: any; companyName: any; estimatedRefuelDate: moment.MomentInput; hostName: any; hostPhone: any; manualCrNumber: any; productRate: any; creditAmount: any; }) => {

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

      this.allCreditReqExcel.map((res: { purpose: any; vehicleNumber: any; productName: any; productCategory: any; actualCreditQuantity: any; lubeName: any; lubeUnit: any; advName: any; advMobile: any; estimatedRefuelDate: moment.MomentInput; companyName: any; brandName: any; manualCrNumber: any; productRate: any; creditAmount: any; }) => {

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

  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query     
    this.allCreditReq = this.allCreditReqDataa.filter((item: { manualCrNumber: any; }) =>
      item.manualCrNumber.toLowerCase().includes(query)
    );
    if (!this.allCreditReq.length) {
      this.allCreditReq = this.allCreditReqDataa.filter((item: { mappingCompanyName: any; }) =>
        item.mappingCompanyName.toLowerCase().includes(query)
      );
    }
    if (!this.allCreditReq.length) {
      this.allCreditReq = this.allCreditReqDataa.filter((item: { companyName: any; }) =>
        item.companyName.toLowerCase().includes(query)
      );
    }
    if (!this.allCreditReq.length) {
      this.allCreditReq = this.allCreditReqDataa.filter((item: { productName: any; }) =>
        item.productName.toLowerCase().includes(query)
      );
    }
    if (!this.allCreditReq.length) {
      this.allCreditReq = this.allCreditReqDataa.filter((item: { vehicleNumber: any; }) =>
        item.vehicleNumber.toLowerCase().includes(query)
      );
    }
    if (!this.allCreditReq.length) {
      this.allCreditReq = this.allCreditReqDataa.filter((item: { creditAmount: any; }) =>
        item.creditAmount.toLowerCase().includes(query)
      );
    }
    if (!this.allCreditReq.length) {
      this.allCreditReq = this.allCreditReqDataa.filter((item: { transactionStatus: any; }) =>
        item.transactionStatus.toLowerCase().includes(query)
      );
    }
    if (!this.allCreditReq.length) {
      this.allCreditReq = this.allCreditReqDataa.filter((item: { hostName: any; }) =>
        item.hostName.toLowerCase().includes(query)
      );
    }
    if (!this.allCreditReq.length) {
      this.allCreditReq = this.allCreditReqDataa.filter((item: { hostPhone: any; }) =>
        item.hostPhone.toLowerCase().includes(query)
      );
    }
  }

  changeValue(i: any, mappingPreviousStatus: any, mappingCustomerName: any, hostName: any, hostPhone: any, byManager: any, managerName: any, productRate: any, advName: any, advMobile: any, vehicleNumber: any, lubeName: any, manualCrNumber: any) {

    this.mappingPreviousStatus = ''
    this.mappingCustomerName = ''
    this.hostName = ''
    this.hostPhone = ''
    this.byManager = ''
    this.managerName = ''
    this.productRate = ''
    this.advName = ''
    this.advMobile = ''
    this.vehicleNumber = ''
    this.lubeName = ''
    this.manualCrNumberpopup = ''
    if (i == this.rowNumber) {
      this.rowNumber = ''
      if (this.show == true) {
        this.show = false;
      } else {
        this.show = true;
        this.rowNumber = i
        this.mappingPreviousStatus = mappingPreviousStatus
        this.mappingCustomerName = mappingCustomerName
        this.hostName = hostName
        this.hostPhone = hostPhone
        this.byManager = byManager
        this.managerName = managerName
        this.productRate = productRate
        this.advName = advName
        this.advMobile = advMobile
        this.vehicleNumber = vehicleNumber
        this.lubeName = lubeName
        this.manualCrNumberpopup = manualCrNumber
      }
    } else {
      this.rowNumber = i
      this.show = true;
      this.mappingPreviousStatus = mappingPreviousStatus
      this.mappingCustomerName = mappingCustomerName
      this.hostName = hostName
      this.hostPhone = hostPhone
      this.byManager = byManager
      this.managerName = managerName
      this.productRate = productRate
      this.advName = advName
      this.advMobile = advMobile
      this.vehicleNumber = vehicleNumber
      this.lubeName = lubeName
      this.manualCrNumberpopup = manualCrNumber
    }
  }

  openViewBill(viewBill: any, fuelCreditId: any, estimatedRefuelDate: any, mappingPreviousStatus: any, mappingCompanyName: any,
    companyName: any, hostPhone: any, purpose: any, vehicleNumber: any, manualCrNumber: any, productName: any, productRate: any,
    transactionStatus: any, productCategory: any, actualCreditQuantity: any, creditAmount: any) {

    this.fuelCreditIdShow = fuelCreditId;
    this.estimatedRefuelDateShow = estimatedRefuelDate;
    this.mappingPreviousStatusShow = mappingPreviousStatus;
    this.mappingCompanyNameShow = mappingCompanyName;
    this.companyNameShow = companyName;
    this.hostPhoneShow = hostPhone;
    this.purposeShow = purpose;
    this.vehicleNumberShow = vehicleNumber;
    this.manualCrNumberShow = manualCrNumber;
    this.productNameShow = productName;
    this.productRateShow = productRate;
    this.transactionStatusShow = transactionStatus;
    this.productCategoryShow = productCategory;
    this.actualCreditQuantityShow = actualCreditQuantity;
    this.creditAmountShow = creditAmount;

    this.modalRefShow = this.modalService.open(viewBill)    //, { size: 'lg' }
    this.modalRefShow.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  askFordelete(deleteTemplate: any) {
    this.modalRef = this.modalService.open(deleteTemplate)
    this.modalRef.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  askForPass(PasswordTemplate: any, fuelCreditId: any, fuelDealerCustomerMapId: any, transacionName: any) {
    this.transacionName = transacionName
    this.fuelDealerCustomerMapId = fuelDealerCustomerMapId
    this.fuelCreditIdForCancelReq = fuelCreditId;
    this.modalRefpass = this.modalService.open(PasswordTemplate)
    this.modalRefpass.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  askForEdit(editTemplate: any) {
    this.modalRef1 = this.modalService.open(editTemplate)
    this.modalRef1.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  askForPassEdit(PasswordTemplateEdit: any, updateFuelCr: any, fuelCreditId: any, refuelForDriver: any, phone1: any, fuelProdId: any, productCategory: any, productRate: any, vehicleNumber: any, reqQuantity: any, reqCreditAmount: any, actualCreditQuantity: any, creditAmount: any,
    estimatedRefuelDate: any, vehicleId: any, vpStatus: any, fuelDealerCustomerMapId: any, manualCrNumber: any) {
    this.fuelCreditIdForEditReq = fuelCreditId;
    this.vehicleIdForEdit = vehicleId
    this.vpStatusForEdit = vpStatus
    this.personIdForEdit = refuelForDriver;
    this.fuelProdIdForEdit = fuelProdId;
    this.manualCrNumber = manualCrNumber;
    this.productCategory = productCategory;
    this.fuelDealerCustomerMapIdEdit = fuelDealerCustomerMapId;
    this.requestEditCr.controls["mobile"].setValue(phone1);
    this.requestEditCr.controls["productCategory"].setValue(productCategory);
    this.requestEditCr.controls["productRate"].setValue(productRate);
    this.requestEditCr.controls["vehicleNumber"].setValue(vehicleNumber);
    this.requestEditCr.controls["reqQuantity"].setValue(reqQuantity);
    this.requestEditCr.controls["reqCreditAmount"].setValue(reqCreditAmount);
    this.requestEditCr.controls["actualCreditQuantity"].setValue(actualCreditQuantity);
    this.requestEditCr.controls["actualCreditAmount"].setValue(creditAmount);
    this.requestEditCr.controls["estimatedRefuelDateForEdit"].setValue(estimatedRefuelDate);
    this.requestEditCr.controls["estimatedRefuelDate"].setValue(estimatedRefuelDate);
    this.modalRefpass = this.modalService.open(PasswordTemplateEdit)
    this.modalRefpass.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  comparePasswordForDelete(cancelReq: any) {
    const data = {
      password: this.password,
      userId: this.userId
    };
    this.post.comparePasswordPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
          alert(result.msg)
          this.closeResult
          this.modalRefpass.close('close')
          this.password = "";
          this.cancelRequest(cancelReq, this.fuelCreditIdForCancelReq, this.fuelDealerCustomerMapId)
        } else {
          alert(result.msg)
          this.password = "";
        }
      });
  }

  cancelRequest(cancelReq: any, fuelCreditId: any, fuelDealerCustomerMapId: any) {
    this.fuelDealerCustomerMapId = fuelDealerCustomerMapId
    this.fuelCreditIdForCancelReq = fuelCreditId;

    this.modalRefCancel = this.modalService.open(cancelReq)
    this.modalRefCancel.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  comparePasswordForEdit(updateFuelCr: any) {
    const data = {
      password: this.password,
      userId: this.userId
    };
    this.post.comparePasswordPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
          alert(result.msg)
          this.closeResult
          this.modalRefpass.close('close')
          this.password = "";
          this.updateCr(updateFuelCr, this.fuelCreditIdForEditReq, this.personIdForEdit, this.requestEditCr.value.mobile,
            this.fuelProdIdForEdit, this.requestEditCr.value.productCategory, this.requestEditCr.value.productRate,
            this.requestEditCr.value.vehicleNumber, this.requestEditCr.value.reqQuantity,
            this.requestEditCr.value.reqCreditAmount, this.requestEditCr.value.actualCreditQuantity,
            this.requestEditCr.value.reqCreditAmount, this.requestEditCr.value.estimatedRefuelDate, this.vehicleIdForEdit,
            this.vpStatusForEdit, this.fuelDealerCustomerMapIdEdit, this.manualCrNumber)
        } else {
          alert(result.msg)
          this.password = "";
        }
      });
  }

  updateCr(updateFuelCr: any, fuelCreditId: any, refuelForDriver: any, phone1: any, fuelProdId: any, productCategory: any, productRate: any, vehicleNumber: any, reqQuantity: any, reqCreditAmount: any, actualCreditQuantity: any, creditAmount: any, estimatedRefuelDate: moment.MomentInput, vehicleId: any, vpStatus: any, fuelDealerCustomerMapId: any, manualCrNumber: any) {
    this.fuelCreditIdForEditReq = fuelCreditId;
    this.modalRefEdit = this.modalService.open(updateFuelCr, { size: 'lg' })
    this.vehicleIdForEdit = vehicleId
    this.vpStatusForEdit = vpStatus
    this.personIdForEdit = refuelForDriver;
    this.fuelProdIdForEdit = fuelProdId;
    this.manualCrNumber = manualCrNumber;
    this.productCategory = productCategory;
    this.productRate = productRate;
    this.estimatedRefuelDateForEdit = estimatedRefuelDate
    this.fuelDealerCustomerMapIdEdit = fuelDealerCustomerMapId;
    this.reqCreditAmount = reqCreditAmount
    this.reqQuantity = reqQuantity;
    this.requestEditCr.controls["mobile"].setValue(phone1);
    this.requestEditCr.controls["productCategory"].setValue(productCategory);
    this.requestEditCr.controls["productRate"].setValue(productRate);
    this.requestEditCr.controls["vehicleNumber"].setValue(vehicleNumber);
    this.requestEditCr.controls["reqQuantity"].setValue(reqQuantity);
    this.requestEditCr.controls["reqCreditAmount"].setValue(reqCreditAmount);
    this.requestEditCr.controls["actualCreditQuantity"].setValue(actualCreditQuantity);
    this.requestEditCr.controls["actualCreditAmount"].setValue(reqCreditAmount);
    this.requestEditCr.controls["requestType"].setValue("AMOUNT");
    this.requestEditCr.controls["estimatedRefuelDateForEdit"].setValue(moment(estimatedRefuelDate).format('DD-MM-YYYY'));
    this.requestEditCr.controls["estimatedRefuelDate"].setValue(moment(estimatedRefuelDate).format('DD-MM-YYYY'));

    this.modalRefEdit.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  cancelFuelCreditReq() {
    let data = {
      fuelCreditId: this.fuelCreditIdForCancelReq,
      fuelDealerCustomerMapId: this.fuelDealerCustomerMapId
    }
    this.post.cancelFuelCreditReqPOST(data)
      .subscribe(res => {
        if (res) {
          alert(res.msg)
          if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
            let data1 = {
              mapId: this.fuelDealerCustomerMapId
            }
            this.post.updateLastCRDateMapIdWisePOST(data1)
              .subscribe((res) => {
                if (res.status == 'OK') {
                } else {
                }
              })
            if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {
              this.searchByCorp()
            }
            else {
              // this.getfuelDealerIdByCorporateId(this.loginCorporateId);
            }
          }
          this.modalRefCancel.close('close')
          this.getFuelCreditRequestByfuelDealerId(this.fuelDealerId);
        } else {
        }
      })
  }

  submitSearchVehicleEdit() {
    if (this.requestEditCr.value.vehicleNumber) {
      const data = {
        vehicleRegistrationNumber: this.requestEditCr.value.vehicleNumber,
      };
      this.post.VehicleByRegistrationNumberPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.vehicleIdForEdit = res.data[0].vehicleId;
            this.vehicleVPStatusForEdit = 'TRUE';
          } else {
            this.vehicleVPStatusForEdit = 'FALSE';
            this.vehicleIdForEdit = ""
          }
        });
    }
  }

  getCompleteForEdit() {
    this.isQUANTITY = false;
    this.isAMOUNT = true;
  }

  amountCalculateForEdit() {
    if (this.requestEditCr.value.productPrice) {
      this.reqQuantityDecimal = Number(this.requestEditCr.value.reqCreditAmount) / Number(this.requestEditCr.value.productPrice)
      this.requestEditCr.controls["reqQuantity"].setValue(this.reqQuantityDecimal.toFixed(2))
    }
    else {
      this.reqQuantityDecimal = Number(this.requestEditCr.value.reqCreditAmount) / Number(this.requestEditCr.value.productRate)
      this.requestEditCr.controls["reqQuantity"].setValue(this.reqQuantityDecimal.toFixed(2))
    }
    this.requestEditCr.controls["actualCreditQuantity"].setValue(this.requestEditCr.value.reqQuantity)
    this.requestEditCr.controls["actualCreditAmount"].setValue(this.requestEditCr.value.reqCreditAmount)
  }

  getPartialForEdit() {
    this.isQUANTITY = true;
    this.isAMOUNT = false;
  }

  quantityCalculateForEdit() {
    if (this.requestEditCr.value.productPrice) {
      this.Amount = Number(this.requestEditCr.value.productPrice) * Number(this.requestEditCr.value.reqQuantity)
      this.requestEditCr.controls["reqCreditAmount"].setValue(this.Amount.toFixed(2))
    }
    else {
      this.Amount = Number(this.requestEditCr.value.productRate) * Number(this.requestEditCr.value.reqQuantity)
      this.requestEditCr.controls["reqCreditAmount"].setValue(this.Amount.toFixed(2))
    }
  }

  updateCrRequest() {
    if (this.fuelCreditIdForEditReq) {
      let data = {
        fuelCreditId: this.fuelCreditIdForEditReq,
        reqQuantity: this.requestEditCr.value.reqQuantity,
        reqCreditAmount: this.requestEditCr.value.reqCreditAmount,
        estimatedRefuelDate: moment(this.requestEditCr.value.estimatedRefuelDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        vehicleId: this.vehicleIdForEdit,
        fuelProductId: this.fuelProdIdForEdit,
        creditAmount: this.requestEditCr.value.actualCreditAmount,
        actualCreditQuantity: this.requestEditCr.value.actualCreditQuantity,
        productRate: this.requestEditCr.value.productRate,
        vehicleNumber: this.requestEditCr.value.vehicleNumber,
        vehicleVPStatus: this.vehicleVPStatusForEdit,
        updateDate: moment(this.todayDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        fuelDealerCustomerMapId: this.fuelDealerCustomerMapIdEdit,
        manualCrNumber: this.manualCrNumber
      }
      console.log("data", data)
      this.post.updateCreditReqByDealerPOST(data)
        .subscribe(res => {
          if (res) {
            alert(res.msg)
            if (this.selectCorporate.value.startDate || this.selectCorporate.value.endDate) {
              this.searchByCorp()
            }
            else {
              // this.getfuelDealerIdByCorporateId(this.loginCorporateId);
            }

            this.getFuelCreditRequestByfuelDealerId(this.fuelDealerId);
            this.requestEditCr.reset();
            this.isCRQUANTITY = false;
            this.isQUANTITY = false;
            this.requestTransporter.controls["requestType"].setValue("AMOUNT");
            this.requestTransporter.controls["requestTypeCR"].setValue("AMOUNT");
            // this.closeRequestForm.controls["requestTypeClose"].setValue("AMOUNT")
            this.modalRefEdit.close('close')
          }
          else {
            alert("Error to Edit Credit!")
          }
        });
    }
    else {
    }
  }

  closeModalUpdateCr() {
    this.modalRefEdit.close('close')
  }

  downloadBillRedFlag() {
    const element = document.getElementById('sanjay')
    if (element) {
      htmlToImage.toJpeg(element, { backgroundColor: 'white' })
        .then(function (dataUrl: string) {
          var link = document.createElement('a');
          link.download = 'report.png';
          link.href = dataUrl;
          link.click();
        });
    }
  }
  
  searchDealerBycustomerId(customerId: any) {    
    let data = {
      customerId: customerId,
    };
    this.post1.getCustomerByCustomerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {         
          this.headerName1 = res.data[0].companyName;
          this.headerName2 = res.data[0].address1 + ', ' + res.data[0].address2 + ', ' + res.data[0].city;
          this.headerName3 = res.data[0].state + '-' + res.data[0].pin + '  ' + "GST: " + res.data[0].GSTNumber;
          this.spinner.hide();
          this.cd.detectChanges()         
          
        } else {
          this.spinner.hide();
          this.cd.detectChanges()
        }
      });
}

searchInTable(){ 
  this.searchBox.valueChanges
  .subscribe((dataList) => {
    this.searchTermm = dataList;
    this.search1();
  })
}

search1() {
  let quantity=false;
  let termm = this.searchTermm;
  this.allCreditReq = this.allCreditReqDataa.filter(function (res: { manualCrNumber: string | any[]; }) {
    return res.manualCrNumber.indexOf(termm) >= 0;
  });

  if(this.allCreditReq.length == 0){
    termm = this.searchTermm;
    this.allCreditReq = this.allCreditReqDataa.filter(function (res: { mappingPreviousStatus: string; mappingCompanyName: string | any[]; companyName: string | any[]; }) {
      if(res.mappingPreviousStatus =='TRUE'){
        return res.mappingCompanyName.indexOf(termm) >= 0;
      }
      if(res.mappingPreviousStatus =='FALSE'){
        return res.companyName.indexOf(termm) >= 0;
      }
    });
  } 
  
  if(this.allCreditReq.length == 0){
    termm = this.searchTermm;
    this.allCreditReq = this.allCreditReqDataa.filter(function (res: { manualCrNumber: string | any[]; }) {
      return res.manualCrNumber.indexOf(termm) >= 0;
    });
  }


  if(this.allCreditReq.length == 0){
    termm = this.searchTermm;
    this.allCreditReq = this.allCreditReqDataa.filter(function (res: { productName: string | any[]; }) {
      return res.productName.indexOf(termm) >= 0;
    });
  }


  if(this.allCreditReq.length == 0){
    termm = this.searchTermm;
    this.allCreditReq = this.allCreditReqDataa.filter(function (res: { vehicleNumber: string | any[]; }) {
      return res.vehicleNumber.indexOf(termm) >= 0;
    });
  }


  if(this.allCreditReq.length == 0){
    termm = this.searchTermm;
    this.allCreditReq = this.allCreditReqDataa.filter(function (res: { creditAmount: string | any[]; }) {
      return res.creditAmount.indexOf(termm) >= 0;
    });
  }

  
  if(this.allCreditReq.length == 0){
    termm = this.searchTermm;
    this.allCreditReq = this.allCreditReqDataa.filter(function (res: { transactionStatus: string | any[]; }) {
      return res.transactionStatus.indexOf(termm) >= 0;
    });
  }


  if(this.allCreditReq.length == 0){
    termm = this.searchTermm;
    this.allCreditReq = this.allCreditReqDataa.filter(function (res: { mappingPreviousStatus: string; mappingCustomerName: string | any[]; hostName: string | any[]; }) {
      if(res.mappingPreviousStatus =='TRUE'){
        return res.mappingCustomerName.indexOf(termm) >= 0;
      }
      if(res.mappingPreviousStatus =='FALSE'){
        return res.hostName.indexOf(termm) >= 0;
      }
    });
  } 

  if(this.allCreditReq.length == 0){
    termm = this.searchTermm;
    this.allCreditReq = this.allCreditReqDataa.filter(function (res: { hostPhone: string | any[]; }) {
      return res.hostPhone.indexOf(termm) >= 0;
    });
  }

}
}
