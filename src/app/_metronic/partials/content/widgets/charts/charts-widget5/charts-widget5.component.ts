import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { ListWidgetService } from '../../lists/listWidget.services';
import { ChartsService } from '../charts.services';
import moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';

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
  selector: 'app-charts-widget5',
  templateUrl: './charts-widget5.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class ChartsWidget5Component implements OnInit {

  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    selectedCorp: new FormControl(""),
    monthDAY: new FormControl(""),
    date: new FormControl(""),
    manualNo: new FormControl(""),
  });

  lastFourthYear: number;
  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  managerName: string;
  pumpCity: any;
  userId: any;
  dealerLoginId: any;
  companyName: any;
  oilCompanyName: any;
  brandName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  ownerName: string;
  dealerAccess: boolean;
  headerName1: any;
  currentYear: string;
  lastYear: number;
  last2Year: number;
  lastFifthYear: number;
  month: string;
  showDropdown: boolean = false;
  productIdArrayTx: any = [];
  productIdArrayDay: any = [];
  productIdArrayMonth: any = [];
  productsData: any = [];
  products = [
    { fuelProductsId: 25, productName: 'LUBRICANTS' },
    // Add more products as needed
  ];
  customerName: any;
  fuelDealerCorpMapIdNew: string;
  fuelDealerCorpMapId: any;
  mappingAccData: any = [];
  crPurchaseData: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;

  constructor(
    private post: ChartsService,
    private post1: ListWidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private router: Router,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.accessGroup = element.accessGroupId;
    if (element.accessGroupId == 12 || element.accessGroupId == 14) {
      this.managerName = element.firstName + ' ' + element.lastName;
      this.pumpCity = dealerData.city
      this.userId = element.userId;
      this.dealerLoginId = element.veelsPlusCorporateID;
      this.companyName = dealerData.companyName
      this.oilCompanyName = dealerData.brandName
      this.brandName = dealerData.brandName
      this.state = dealerData.state
      this.pin = dealerData.pin
      this.city = dealerData.city
      this.phone1 = dealerData.hostPhone
      this.ownerName = element.firstName + ' ' + element.lastName
      if (element.accessGroupId == 12 || element.accessGroupId == 14) {
        this.dealerAccess = true
      }

      this.filterForm.controls["startDate"].setValue( "01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() )
      this.filterForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
      this.headerName1 = this.companyName;
      // this.headerName2 = res.data[0].address1+', '+res.data[0].address2+', '+ this.city;
      // this.headerName3 = this.state+'-'+ this.pin+'  '+"GST: "+ this.GSTNumber;

    }

    this.currentYear = moment(new Date()).format("YYYY");
    this.lastYear = Number(moment(new Date()).format("YYYY")) - 1;
    this.last2Year = Number(moment(new Date()).format("YYYY")) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
    this.lastFifthYear = Number(this.currentYear) - 4;
    this.month = moment(new Date()).format("MMM")
    // this.filterForm.controls["month"].setValue(moment(new Date()).format("MMM"));
    // this.filterForm.controls["year"].setValue(moment(new Date()).format("YYYY"));
    this.getMappingAccount(this.fuelDealerId)
    this.getProductsByDealerId(this.fuelDealerId)
    this.cd.detectChanges()
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
    this.productIdArrayTx = [];
    this.productIdArrayDay = [];
    this.productIdArrayMonth = [];
  }

  getProductsByDealerId(fuelDealerId: any) {
    this.productsData = [];
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post1.getFuelProductIdByDealerIdPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.productsData = res.data;
        this.spinner.hide();
        this.cd.detectChanges()
      } else {
        this.spinner.hide();
        this.cd.detectChanges()
      }
    })
  }

  toggleSelectionTx(product: any) {
    const index = this.productIdArrayTx.findIndex((p: { fuelProductsId: any; }) => p.fuelProductsId === product.fuelProductsId);
    if (index === -1) {
      this.productIdArrayTx.push(product);
      console.log("SelectedProductTx", this.productIdArrayTx)
    } else {
      this.productIdArrayTx.splice(index, 1);
      console.log("SelectedProductTx", this.productIdArrayTx)
    }
  }

  getDetailsByfuelDealerCustomerMapIdId(id: any) {
    this.customerName = id.target.value;
    if (this.customerName) {
      this.getCorporateInfoByfuelDealerCustomerMapId(this.customerName);
    } else {
      this.fuelDealerCorpMapIdNew = ''
    }
  }

  getCorporateInfoByfuelDealerCustomerMapId(customerName: any) {
    let data = {
      fuelDealerId: this.fuelDealerId,
      customerName: customerName
    }
    this.post1.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
      .subscribe(res => {
        if (res) {
          this.fuelDealerCorpMapId = res.data[0].fuelDealerCustomerMapId;
        } else {
        }
      });

  }

  getMappingAccount(fuelDealerId: any) {
    this.spinner.show();
    this.mappingAccData = []
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getMappingAccByFuelDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.mappingAccData = res.data;
          this.getPurchaseDetailsTx();
        } else {
          this.mappingAccData = [];
          this.spinner.hide();
        }
      })
  }

  getPurchaseDetailsTx() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      if (this.productIdArrayTx.length) {
        if (this.fuelDealerCorpMapId) {
          this.crPurchaseData = [];
          let data = {
            dealerId: this.fuelDealerId,
            mapId: this.fuelDealerCorpMapId,
            startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            productId: "Selected",
            productIdArray: this.productIdArrayTx,
          }
          this.post.getPurchaseDetailsTxPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.crPurchaseData = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.crPurchaseData = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        } else {
          this.crPurchaseData = [];
          let data = {
            dealerId: this.fuelDealerId,
            startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            productId: "Selected",
            productIdArray: this.productIdArrayTx,
          }
          this.post.getPurchaseDetailsTxPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.crPurchaseData = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.crPurchaseData = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        }
      } else {
        if (this.fuelDealerCorpMapId) {
          this.crPurchaseData = [];
          let data = {
            dealerId: this.fuelDealerId,
            mapId: this.fuelDealerCorpMapId,
            startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            productId: "All",
          }
          this.post.getPurchaseDetailsTxPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.crPurchaseData = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.crPurchaseData = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        } else {
          this.crPurchaseData = [];
          let data = {
            dealerId: this.fuelDealerId,
            startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
            productId: "All",
          }
          this.post.getPurchaseDetailsTxPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                this.crPurchaseData = res.data;
                this.spinner.hide();
                this.cd.detectChanges()
              } else {
                this.crPurchaseData = [];
                this.spinner.hide();
                this.cd.detectChanges()
              }
            })
        }
      }
    } else {
      alert("Please select Date Range..!")
    }
  }

  clearFilterForm() {
    this.filterForm.controls["startDate"].setValue("");
    this.filterForm.controls["endDate"].setValue("");
    this.fuelDealerCorpMapId = "";
    this.crPurchaseData = [];
    this.productIdArrayTx = [];
  }

  printPdfTx() {
    this.post.setRouteForCrPurchaseTxReport('CrPurchaseReportTx', this.crPurchaseData, this.filterForm.value.startDate, this.filterForm.value.endDate, this.productIdArrayTx, this.fuelDealerCorpMapId, this.fuelDealerId, this.filterForm.value.manualNo)
    this.router.navigate(['/ledger/crPurchaseReport']);
  }


  pageChangeEvent(event: number) {
    this.p = event;
    this.getPurchaseDetailsTx();
  }
}
