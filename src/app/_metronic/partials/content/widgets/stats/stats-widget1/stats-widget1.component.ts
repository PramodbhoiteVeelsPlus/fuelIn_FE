import { Component, Injectable, Input, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbActiveModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { WidgetService } from '../../widgets.services';
import { ExcelService } from 'src/app/pages/excel.service';
import { StatsService } from '../stats.services';


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
  selector: 'app-stats-widget1',
  templateUrl: './stats-widget1.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class StatsWidget1Component implements OnInit {
  allCreditReqExcel: any = [];
  allCreditReqExcelListDetails: any = [];
  currentYear: number;
  lastYear: number;
  last2Year: number;
  month: any;
  totalInvCreditAmt: any;
  allPumpNozList1: any = [];
  allSalesExcel: any = [];
  cashTotal: number;
  creditTotal: number;
  digitalTotal: number;
  upiTotal: number;
  allSaleAmountDetails: any = [];
  cardTotal: number;
  allSalesExcel1: any = [];
  swipeTotal: any = 0;
  oilCompanyProgramTotal: any = 0;
  netBankTotal: any = 0;
  totalDailySalesInLtr: any = 0;
  totalTestSales: any = 0;
  totalSalesInLtr: any = 0;
  allSalesExcel11: any = [];
  chequeTotal: any = 0;
  cashAmtTotal: any = 0;
  netBankingTotal: any = 0;
  upiAmtTotal: any = 0;
  creditAmtTotal: any = 0;
  cardAmtTotal: any = 0;
  amexTotal: any = 0;
  otherTotal: any = 0;
  creditQuantityTotal: any = 0;
  allCreditAccByDealerList: any = [];
  allCreditAccByDealerListDetails: any = [];
  allCreditPaymentExcel: any = [];
  allCreditPaymentExcelDetails: any = [];
  mobileNumber: any = '';
  allCreditPurchaseByTransporterExcel: any = [];
  allCreditPurchaseByTransporterDetails: any = [];
  DealerOnboardList: any = [];
  DealerOnboardList1: any = [];
  allAdminList: any = [];
  allAdminList1: any = [];
  selfOnboardList: any = [];
  selfOnboardList1: any = [];
  dealerAddedTransporterData: any = [];
  dealerAddedTransporterDetails: any = [];
  allFTvehicleDetailsByDate: any = [];
  allFTvehicleDetailsByDateExcel: any = [];
  vehicleList: any = [];
  allVehicleListData: any = [];
  allVehicleList: any = [];
  allVehicleListDetails: any = [];
  entityList: any = [];
  allEntityListData: any = [];
  allEntityListDetails: any = [];
  allEntityList: any = [];
  allFTvehicleDetailsByEntityId: any = [];
  allFTvehicleDetailsByVehicleNumber: any = [];
  allFTvehicleDetailsByVehicleNumberExcel: any = [];
  allFTvehicleDetailsByEntityIdExcel: any = [];
  fastagConvertedAmountExcel: any;
  fastagConvertedAmountExceldate: number;
  fastagConvertedAmountExcelvehicle: number;
  activeDealerReportData: any;
  activeDealerSelectedDateReportData: any = [];
  year: any;
  last3Year: any;
  last4Year: any;
  last5Year: any;
  years: any = [];
  allVehicleListLQ: any = [];
  allEntityListLQ: any = [];
  FastagDetailsByDateExcel: any = [];
  allFTvehicleDetailsByEntityIdLQ: any = [];
  FastagDetailsLQByDateExcel: any = [];
  createdBy: string;

  constructor(
    public activeModal: NgbActiveModal,
    private excelService: ExcelService,
    private post: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
  ) {
    const currentDate = new Date();
    const year = moment(new Date()).subtract(1, 'year').format("YYYY");
    config.minDate = { year: 2020, month: 4, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    // config.outsideDays = 'hidden';
  }
  corporateId: any;
  lr: any = [];
  lrData: any = [];
  lrLength: any = [];
  consignorID: any;
  consigneeID: any;
  consignorData: any = [];
  consigneeData: any = [];
  public combineLrConsinerConsinee: Array<any> = [];
  allLRReportsDetails: any = [];
  byLrStatus: boolean;
  byVehicle: boolean;
  byVehicleDriver: boolean;
  byConsigNorNee: boolean;
  byBranch: boolean;
  byUser: boolean;
  selectId: any;
  modalRef: any;
  closeResult: string;
  submitted: boolean;
  consigDetails: any = [];
  consignId: any;
  acceesGroup: any;
  allBranchdata: any = [];
  vpluscorporateID: any;
  dataDetails: any;
  details: string;
  personKyc: any = [];
  personKycData: any = [];
  corporateKYC: any = [];
  corporateKYCData: any = [];
  personKycDataList: any = [];
  corporateKYCDataList: any = [];
  corporateOnboarded: any = [];
  corporateOnboardedData: any = [];
  corporateOnboardedDataList: any = [];
  vehicle: any = [];
  vehicleData: any = [];
  vehicleDataList: any = [];
  driver: any = [];
  driverData: any = [];
  driverDataList: any = [];
  entityIdData: any = [];
  entityId: any = [];
  entityIdDataList: any = [];
  SQLCorporateId: any;
  fuelDealerId: any;
  allTankList: any;
  productwiseDipsales: any = [];
  brandName: any;
  allProductList: any = [];
  productDecanted: any = [];
  productDecantedList: any = [];
  TankWiseStockVariation: any = [];
  TankWiseStockVariationList: any = [];
  TotalDipSalesTank: any = 0;
  TankStockVariation: any = 0;
  openingStock: any = 0;
  totalopenWater: any = 0;
  refuelQuantity: any = 0;
  totalClosingStockDip: any = 0;
  totalCloseWater: any = 0;
  totalClosingStockMeter: any = 0;
  attendantSalesData: any = [];
  attendantSales: any = [];
  attendantSalesList: any = [];
  TankStockVariationDetails: any;
  tankNo: any;
  productWiseStockVariationDetails: any = [];
  productWiseStockVariationList: any = [];
  product: any;
  tankWisePercentageList: any = [];
  percentage: any = 0;
  tankWisePercentageListDetails: any = [];
  allowableStock: any = 0;
  closingStock: any = 0;
  productWisePercentageList: any = [];
  productWisePercentageListDetails: any = [];
  allExpenseReportsList: any = [];
  allExpenseReportsListDetails: any = [];
  minWeight: number;
  invoiceId: any;
  profitLoss: any;
  allInfraSetUpReportsList: any = [];
  allInfraSetUpReportsListDetails: any = [];
  allPOSSetUpReportsList: any = [];
  allPOSSetUpReportsListDetails: any = [];
  getFuelStaffDetailsList: any = [];
  getFuelStaffDetailsListDetails: any = [];
  fuelDealerSQLId: any;
  FuelVeelsVFId: any;
  oilCompany: any;
  dealerCompanyName: any;
  getFuelCreditDetails: any = [];
  getFuelCreditDetailsListDetails: any = [];
  maxCreditAmount: any;
  allAccountReportsList: any = [];
  allAccountReportsListDetails: any = [];
  fuelInvoiceId: any;
  allDealerPANDetailsReportsList: any = [];
  allDealerPANDetailsReportsListDetails: any = [];
  getFCDetailsOfCorporateByPANreportList: any = [];
  getFCDetailsOfCorporateByPANreportListDetails: any = [];
  getPersonAccByPANreportListDetails: any = [];
  getPersonAccByPANreportList: any = [];
  getPANList: any = [];
  corporateList: any = [];
  dealer: any = [];
  allowableStock1: any = 0;
  TotalDipSalesTank1: any;
  TankStockVariation1: any;
  distance: any;
  otherCharges: any;
  getDailyStockData: any = [];
  getDailyStockDataList: any = [];
  getDecantationData: any = [];
  getDecantationDataList: any = [];
  unitSales: any;
  recoveryAmount: any;

  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    startDateFT: new FormControl(""),
    endDateFT: new FormControl(""),
    startDateFTLQ: new FormControl(""),
    endDateFTLQ: new FormControl(""),
    filter: new FormControl("", Validators.required),
    lrstatus: new FormControl("", Validators.required),
    vehicleNumber: new FormControl(""),
    driverPhone: new FormControl(""),
    panNo: new FormControl(""),
    branchVPId: new FormControl("", [
      Validators.minLength(16),
      Validators.maxLength(16),
    ]),
    userId: new FormControl(""),
    productType: new FormControl("", Validators.required),
    tankList: new FormControl("", Validators.required),
    fuelDealerStaffId: new FormControl("", Validators.required),
    NozzleinframapId: new FormControl("", Validators.required),
    fuelProductId: new FormControl("", Validators.required),
    duNo: new FormControl("", Validators.required),
    fuelDealerVFId: new FormControl(""),
    corporateMapId: new FormControl(""),
    dealerMapId: new FormControl(""),
    month: new FormControl("", Validators.required),
    startMonth: new FormControl("", Validators.required),
    endMonth: new FormControl("", Validators.required),
    year: new FormControl("", Validators.required),
    startYear: new FormControl("", Validators.required),
    endYear: new FormControl("", Validators.required),
    mobileNumber: new FormControl("", Validators.required),
    adminList: new FormControl("", Validators.required),
    entityId: new FormControl(""),
    vehicleNumberFT: new FormControl("", Validators.required),
    entityIdLQ: new FormControl(""),
    vehicleNumberFTLQ: new FormControl("", Validators.required),

  });

  keyword = "name";
  data = [];

  errorMsg: string;
  isLoadingResult: boolean;
  allAttendantList: any;
  allPumpNozList: any = [];
  allPumpList: any;
  allProductsList: any;
  productsalesData: any = [];
  productsales: any = [];
  productDataList: any = [];
  productName: any;
  totalamtcount: any;
  totalsalequant: any;
  totalSales: any;
  TotalSales: any;
  nozzleSalesData: any = [];
  nozzleSales: any = [];
  nozzleSalesList: any = [];
  duNo: any;
  nozNo: any;
  singlenozzleSalesList: any = [];
  fuelDealerVFId: any;
  productWisePriceList: any = [];
  productWisePrice: any = [];
  DuSalesData: any = [];
  DuSales: any = [];
  DuSalesList: any = [];
  singleDuDataList: any = [];
  tankSalesData: any = [];
  tankSales: any = [];
  tankSalesList: any = [];
  TankWisedipsale: any = [];
  TankWisedipsaleList: any = [];
  productWiseDipsaleList: any = [];

  ngOnInit() {
    this.month = moment(new Date()).format("MM")
    this.year = moment(new Date()).format("YYYY")
    this.currentYear = new Date().getFullYear();
    this.lastYear = Number(this.currentYear) - 1;
    this.last2Year = Number(this.currentYear) - 2;
    this.last3Year = Number(this.currentYear) - 3;
    this.last4Year = Number(this.currentYear) - 4;
    this.last5Year = Number(this.currentYear) - 5;
    var element = JSON.parse(localStorage.getItem("element") || '');
    this.corporateId = element.veelsPlusCorporateID;
    this.acceesGroup = element.accessGroupId;

    this.getAllAdminList();
    this.getEntityIdListForFastag();
    this.getAllvehicleList();
    this.getAllLQEntity();
    this.getAllLQVehicle();

    const last4Year = new Date().getFullYear() - 3;
    for (let yr = 2020; yr <= new Date().getFullYear(); yr++) {
      const dataJSON = {
        yrs: 0,
      }
      dataJSON.yrs = yr
      this.years.push(dataJSON);
      console.log(this.years)
    }
  }

  getAllAdminList() {
    let data = {}
    this.post.getAllAdminList(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.allAdminList = res.data;
        } else {
        }
      }
      );
  }

  //getEntityIdListForFastag
  getEntityIdListForFastag() {
    this.post.getEntityIdListForFastagPOST()
      .subscribe(res => {
        if (res) {
          this.entityList = res
          this.entityList.data.map(
            (detail: any) => {
              this.allEntityListData.push(detail)
            }
          )
          this.allEntityListDetails = this.allEntityListData.sort((a: any, b: any) => (a.state < b.state ? -1 : 1))
          this.allEntityList = this.allEntityListDetails
        } else {
        }
      });
  }

  //getAllvehicleList
  getAllvehicleList() {
    this.post.getVehicleListForFastagPOST()
      .subscribe(res => {
        if (res) {
          this.vehicleList = res
          this.vehicleList.data.map(
            (detail: any) => {
              this.allVehicleListData.push(detail)
            }
          )
          this.allVehicleListDetails = this.allVehicleListData.sort((a: any, b: any) => (a.state < b.state ? -1 : 1))
          this.allVehicleList = this.allVehicleListDetails
        } else {
        }
      });
  }

  //getAllLQEntity
  getAllLQEntity() {
    let data = {}
    this.post.getAllLQEntityPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.allEntityListLQ = res.data;
      } else {
      }
    })
  }

  //getAllLQVehicle
  getAllLQVehicle() {
    let data = {}
    this.post.getAllLQVehiclePOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.allVehicleListLQ = res.data;
      } else {

      }
    })
  }

  // Onboarded Corporate Report
  getReportCorporate() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      };

      this.post.getReportCorporate(data).subscribe((res) => {
        if (res.stutus == "OK" && res.data.length) {
          this.corporateOnboarded = res;
          this.corporateOnboardedData = res.data;

          this.corporateOnboardedExcel();
        } else {
          alert("Data Not Found..!");
        }
      });
    } else {
      alert(" Please Select Date!");
    }
  }
  corporateOnboardedExcel() {
    this.corporateOnboardedData.map((result: any) => {
      var json = {
        PersonId: result.veelsPlusId,
        OnboardDate: moment(result.createdAt).format("DD-MM-YYYY"),
        CompanyName: result.companyName,
        PersonName: result.firstName + ' ' + result.lastName,
        Mobile: result.phone1,
        Email: result.email1,
        GST: result.gstNumber,
        PAN: result.individualPancardNumber,
        Address1: result.address1,
        Address2: result.address2,
        City: result.city,
        State: result.state,


      };

      this.corporateOnboardedDataList.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.corporateOnboardedDataList,
      "CorporateOnboardedDataList"
    );
  }

  //dealerAddedCustomerReport
  dealerAddedCustomerReport() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.dealerAddedTransporterData = []
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }
      this.post.dealerAddedCustomerReportPOST(data)
        .subscribe((res) => {
          if (res.status == "OK" && res.data.length) {

            res.data.map((res1: any) => {
              const dataJson = {
                DealerMappedDate: '',
                VFID: '',
                DealerName: '',
                OilCompanyName: '',
                DealerOwnerName: '',
                DealerContact: '',
                DealerAddress1: '',
                DealerAddress2: '',
                DealerCity: '',
                DealerState: '',
                TransporterMappedDate: '',
                TransporterName: '',
                TransporterOwnerName: '',
                TransporterContact: '',
                TransporterAddress1: '',
                TransporterAddress2: '',
                TransporterCity: '',
                TransporterState: '',
                fuelCorporateId: '',
                fuelDealerId: '',
                CreditLimit: 0,
                CreditDaysLimit: 0,
              };

              dataJson.DealerMappedDate = res1.DealerMappedDate;
              dataJson.VFID = res1.FuelVeelsId;
              dataJson.DealerName = res1.DealerName;
              dataJson.OilCompanyName = res1.OilCompanyName;
              dataJson.DealerOwnerName = res1.DealerOwnerName;
              dataJson.DealerAddress1 = res1.DealerAddress1;
              dataJson.DealerAddress2 = res1.DealerAddress2;
              dataJson.DealerCity = res1.DealerCity;
              dataJson.DealerState = res1.DealerState;
              dataJson.TransporterMappedDate = res1.TransporterMappedDate;
              dataJson.TransporterName = res1.TransporterName;
              dataJson.TransporterOwnerName = res1.TransporterOwnerName;
              dataJson.TransporterAddress1 = res1.TransporterAddress1;
              dataJson.TransporterAddress2 = res1.TransporterAddress2;
              dataJson.TransporterCity = res1.TransporterCity;
              dataJson.TransporterState = res1.TransporterState;

              res.data1.map((res2: any) => {
                if (res1.fuelCorporateId == res2.fuelCorporateId && res1.fuelDealerId == res2.fuelDealerId) {
                  dataJson.CreditLimit = Number(res2.maxCreditAmount);
                  dataJson.CreditDaysLimit = Number(res2.creditDayLimit);
                }
              })
              this.dealerAddedTransporterData.push(dataJson);
            })


            this.downloadDealerAddedCustomerReport()
          } else {
            alert("Data Not Found..!")
          }
        });
    } else {
      alert("Please Select Date..");
    }
  }
  downloadDealerAddedCustomerReport() {
    this.dealerAddedTransporterDetails = []
    this.dealerAddedTransporterData.map((res1: any) => {
      let json = {
        DealerMappedDate: moment(res1.DealerMappedDate).format("DD-MM-YYYY"),
        VFID: res1.VFID,
        DealerName: res1.DealerName,
        OilCompanyName: res1.OilCompanyName,
        DealerOwnerName: res1.DealerOwnerName,
        DealerAddress1: res1.DealerAddress1,
        DealerAddress2: res1.DealerAddress2,
        DealerCity: res1.DealerCity,
        DealerState: res1.DealerState,
        TransporterMappedDate: moment(res1.TransporterMappedDate).format("DD-MM-YYYY"),
        TransporterName: res1.TransporterName,
        TransporterOwnerName: res1.TransporterOwnerName,
        TransporterAddress1: res1.TransporterAddress1,
        TransporterAddress2: res1.TransporterAddress2,
        TransporterCity: res1.TransporterCity,
        TransporterState: res1.TransporterState,
        CreditLimit: res1.CreditLimit,
        CreditDaysLimit: res1.CreditDaysLimit,
      };
      this.dealerAddedTransporterDetails.push(json);
    });

    this.excelService.exportAsExcelFile(this.dealerAddedTransporterDetails, "DealerAddedTransporterReport");
  }

  // getDealerOnboardReport
  getDealerOnboardReport() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.DealerOnboardList.length = 0;
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      };

      this.post.onboardFuelDealerReportByAdminPOST(data).subscribe((res) => {
        if (res.data.length) {
          this.DealerOnboardList = res.data;
          this.downloadDealerOnboardReport()
        } else {
          alert("Data Not Found..!")
        }
      });
    }
    else {
      alert(" Please Select Date!");
    }
  }
  downloadDealerOnboardReport() {
    this.DealerOnboardList1.length = 0
    this.DealerOnboardList.map((res: any) => {
      let json = {
        Date: moment(res.userCreatedAt).format("DD-MM-YYYY"),
        CompanyName: res.companyName,
        OilCompany: res.brandName,
        FirstName: res.firstName,
        LastName: res.lastName,
        Phone: res.phone1,
        Email: res.email1,
        GST: res.GSTNumber,
        Address1: res.address1,
        Address2: res.address2,
        City: res.city,
        State: res.state,
      };
      this.DealerOnboardList1.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.DealerOnboardList1,
      "DealerOnboardReport"
    );
  }

  // date format changed 20-01-2022
  getSelfOnboardReportByAdmin() {
    if (this.filterForm.value.adminList) {
      if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
        this.selfOnboardList.length = 0;
        let data = {
          userId: this.filterForm.value.adminList,

          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        };
        this.post.getDealerOnboardReportByAdminPOST(data).subscribe((res) => {
          if (res.data.length) {
            this.selfOnboardList = res.data;
            this.downloadSelfOnboardReport()
          } else {
            alert("Data Not Found..!")
          }
        });
      }
      else {
        alert(" Please Select Date!");
      }
    } else {
      alert("Please select Admin Name")
    }

  }
  downloadSelfOnboardReport() {
    this.selfOnboardList1.length = 0
    this.selfOnboardList.map((res: any) => {
      if(res.userCreatedBy){
        this.createdBy = "Self"
      } else {
        this.createdBy = "Admin"
      }
      let json = {
        Date: moment(res.userCreatedAt).format("DD-MM-YYYY"),
        CompanyName: res.companyName,
        OilCompany: res.brandName,
        FirstName: res.firstName,
        LastName: res.lastName,
        Phone: res.phone1,
        Email: res.email1,
        GST: res.GSTNumber,
        Address1: res.address1,
        Address2: res.address2,
        City: res.city,
        State: res.state,
        OnboardBy: this.createdBy

      };
      this.selfOnboardList1.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.selfOnboardList1,
      "OnboardReport"
    );
  }

  //activeDealerReport()
  activeDealerReport() {
    this.spinner.show();
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post.getReportOfActiveDealerPOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.downloadExcelActiveDealerReport(res.data)
            this.spinner.hide();
            this.filterForm.reset();
          } else {
            alert("Data Not Found!")
            this.spinner.hide();
          }
        });
    } else {
      alert("Please Select Date..!")
      this.spinner.hide();
    }
  }
  downloadExcelActiveDealerReport(data: any) {
    this.activeDealerReportData = [];
    data.map((res: any) => {
      var json = {
        FuelVeelsId: res.FuelVeelsId,
        MappedDate: moment(res.mapDate).format("DD-MM-YYYY"),
        DealerName: res.companyName,
        HostPhone: res.hostPhone,
        HostName: res.hostName,
        OilCompany: res.brandName,
        TotalCrSales: res.totalCrSales,
        TotalCrSalesAmt: res.totalCrSalesAmt,
        TotalCrPayments: res.totalCrPayments,
        TotalShifts: res.totalShifts,
        TotalAccounting: res.totalAccounting,
        TotalNzDSR: res.totalNzDSR,
        TotalTankDSR: res.totalTankDSR,
        DateRange: this.filterForm.value.startDate + ' To ' + this.filterForm.value.endDate
      };
      this.activeDealerReportData.push(json);
    });
    this.excelService.exportAsExcelFile(this.activeDealerReportData, "Active Dealer Report");
  }

  //activeDealerSelectedDateReport()
  activeDealerSelectedDateReport() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.spinner.show();
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post.getReportOfSelectedDateActiveDealerPOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.downloadExcelActiveDealerSelectedDateReport(res.data)
            this.spinner.hide();
            this.filterForm.controls["startDate"].setValue("");
            this.filterForm.controls["endDate"].setValue("");
          } else {
            alert("Data Not Found!")
            this.spinner.hide();
          }
        });
    } else {
      alert("Please Select Date..!")
      this.spinner.hide();
    }
  }
  downloadExcelActiveDealerSelectedDateReport(data: any) {
    this.activeDealerSelectedDateReportData = [];
    data.map((res: any) => {
      var json = {
        FuelVeelsId: res.FuelVeelsId,
        MappedDate: moment(res.mapDate).format("DD-MM-YYYY"),
        DealerName: res.companyName,
        HostPhone: res.hostPhone,
        HostName: res.hostName,
        OilCompany: res.brandName,
        TotalCrSales: res.totalCrSales,
        TotalCrSalesAmt: res.totalCrSalesAmt,
        TotalCrPayments: res.totalCrPayments,
        TotalShifts: res.totalShifts,
        TotalAccounting: res.totalAccounting,
        TotalNzDSR: res.totalNzDSR,
        TotalTankDSR: res.totalTankDSR,
      };
      this.activeDealerSelectedDateReportData.push(json);
    });
    this.excelService.exportAsExcelFile(this.activeDealerSelectedDateReportData, "Selected Date Dealer Report");
  }

  getPurchaseReportByMonthYear() {
    let data = {
      startMonth: this.filterForm.value.startMonth,
      startYear: this.filterForm.value.startYear,
      endMonth: this.filterForm.value.endMonth,
      endYear: this.filterForm.value.endYear
    };
    this.post.getReportOfPurchaseDealerMonthWisePOST(data).subscribe(res => {
      if (res.status == "OK" && res.data.length) {
        this.excelService.exportAsExcelFile(
          res.data,
          "PurchaseReport"
        );
      } else {
        alert("Data Not Found..!")
      }
    })
  }

  //txWiseSalesPayment
  txWiseSalesPayment() {
    if (this.filterForm.value.month && this.filterForm.value.year) {
      this.spinner.show();
      let data = {
        startDate: moment(this.filterForm.value.year + "-" + this.filterForm.value.month).format("YYYY-MM"),
        endDate: moment(this.filterForm.value.year + "-" + this.filterForm.value.month).format("YYYY-MM"),
      }
      this.post.getCrSalesPaymentTxWisePOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.excelService.exportAsExcelFile(
              res.data,
              "Tx-WiseSalesPaymentReport"
            );
            this.filterForm.controls["year"].setValue("");
            this.filterForm.controls["month"].setValue("");
            this.spinner.hide();
          } else {
            alert("Data Not Found!")
            this.spinner.hide();
          }
        });
    } else {
      alert("Please Select Month and Year..!")
      this.spinner.hide();
    }
  }

  //getTotalPurchaseReport   
  getTotalPurchaseReportForAdmin() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.allCreditPaymentExcel.length = 0;
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post.getTotalPurchaseReport(data)
        .subscribe(res => {
          if (res.data.length) {
            this.allCreditPaymentExcel = res.data;
            this.downloadExcelForPurchaseReport()
          } else {
            alert("Data Not Found!")
          }
        });
    }
    else {
      alert("Please Select Date..!")
    }
  }
  // downloadExcelForPurchaseReport
  downloadExcelForPurchaseReport() {
    this.allCreditPaymentExcelDetails.length = 0;
    this.allCreditPaymentExcel.map((res: any) => {
      var json = {
        Date: moment(res.estimatedRefuelDate).format("DD-MM-YYYY"),
        DealerName: res.companyName,
        DealerPhone: res.hostPhone,
        OilCompany: res.brandName,
        City: res.city,
        State: res.state,
        TotalPurchases: res.totalCR,
        Product: res.productCategory + '-' + res.productName,
        TotalPurchaseAmt: Number(res.totalCreditAmt).toFixed(2),
        TotalPurchaseQuantity: Number(res.totalQuantity).toFixed(2),
      };
      this.allCreditPaymentExcelDetails.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.allCreditPaymentExcelDetails,
      "PurchaseReport"
    );
  }

  //getCrReportAsPerCorporate
  getCrReportAsPerCorporate() {
    if (this.filterForm.value.mobileNumber) {
      if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
        this.allCreditPaymentExcel.length = 0;
        let data = {
          mobileNumber: this.filterForm.value.mobileNumber,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        }
        this.post.getReportForCorporateCreditRequestPost(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                this.allCreditPurchaseByTransporterExcel = res.data;
                this.downloadExcelForPurchaseCrTransporterReport()
              } else {
                alert("Data Not Found!")
              }
            } else {
              alert(res.msg)
            }
          });
      }
      else {
        alert("Please Select Date..!")
      }
    } else {
      alert("Please Enter Mobile Number!")
    }
  }
  // downloadExcelForPurchaseReport
  downloadExcelForPurchaseCrTransporterReport() {
    this.allCreditPurchaseByTransporterDetails.length = 0;
    this.allCreditPurchaseByTransporterExcel.map((res: any) => {
      var json = {
        Date: moment(res.estimatedRefuelDate).format("DD-MM-YYYY"),
        DealerName: res.companyName,
        OilCompany: res.brandName,
        City: res.city,
        State: res.state,
        VehicleNumber: res.vehicleNumber,
        Purpose: res.purpose,
        Product: res.productCategory + '-' + res.productName,
        ProductRate: res.productRate,

        PurchaseAmt: Number(res.creditAmount).toFixed(2),
        PurchaseQuantity: Number(res.actualCreditQuantity).toFixed(2),
      };
      this.allCreditPurchaseByTransporterDetails.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.allCreditPurchaseByTransporterDetails,
      "PurchaseCRReport"
    );
  }

  //getTotalPaymentReport   
  getTotalPaymentReportForAdmin() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.allCreditPaymentExcel.length = 0;
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post.getTotalPaymentReport(data)
        .subscribe(res => {
          if (res.data.length) {
            this.allCreditPaymentExcel = res.data;
            this.downloadExcelForPaymentReportForAdmin()
          } else {
            alert("Data Not Found!")
          }
        });
    } else {
      alert("Please Select Date..!")
    }
  }
  // downloadExcelForPaymentReportForAdmin
  downloadExcelForPaymentReportForAdmin() {
    this.allCreditPaymentExcelDetails.length = 0;
    this.allCreditPaymentExcel.map((res: any) => {
      var json = {
        Date: moment(res.transacDate).format("DD-MM-YYYY"),
        DealerName: res.companyName,
        DealerPhone: res.hostPhone,
        OilCompany: res.brandName,
        City: res.city,
        State: res.state,
        TotalPayment: res.totalPayments,
        TotalPaymentAmt: Number(res.totalPaymentAmt),
      };
      this.allCreditPaymentExcelDetails.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.allCreditPaymentExcelDetails,
      "PaymentReport"
    );
  }

  //getFastagVehicleDetailsByDateForAdmin   
  getFastagVehicleDetailsByDateForAdmin() {
    this.spinner.show();
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.allFTvehicleDetailsByDate.length = 0;
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "00:00:01",
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "23:59:59",
      }
      this.post.getFastagVehicleDetailsByDatePOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.allFTvehicleDetailsByDate = res.data;
            this.excelService.exportAsExcelFile(
              this.allFTvehicleDetailsByDate,
              "Fastag Details All Customers"
            );
            this.spinner.hide();
            this.filterForm.reset();
          } else {
            alert("Data Not Found!")
            this.spinner.hide();
          }
        });

    } else {
      alert("Please Select Date..!")
      this.spinner.hide();

    }
  }

  //getFTTransactions   
  getFTTransactions() {
    this.spinner.show();
    if (this.filterForm.value.startDateFT && this.filterForm.value.endDateFT) {
      this.allFTvehicleDetailsByEntityId.length = 0;
      let data = {
        entityId: this.filterForm.value.entityId,
        startDate: moment(this.filterForm.value.startDateFT, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDateFT, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post.getFTTransactionsPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.allFTvehicleDetailsByEntityId = res.data;
            this.excelService.exportAsExcelFile(
              this.allFTvehicleDetailsByEntityId,
              "Fastag Vehicle Details By EntityId"
            );
            this.spinner.hide();
            this.filterForm.reset();

          } else {
            alert("Data Not Found!")
            this.spinner.hide()

          }
        });
    } else {
      alert("Please Select Date..!")
    }
  }

  //getFastagVehicleDetailsByVehicleNumberForAdmin      
  getFastagVehicleDetailsByVehicleNumberForAdmin() {
    this.spinner.show();
    if (this.filterForm.value.vehicleNumberFT && this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.allFTvehicleDetailsByVehicleNumber.length = 0;
      let data = {
        vehicleNumber: this.filterForm.value.vehicleNumberFT,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "00:00:01",
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "23:59:59",
      }
      this.post.getFastagVehicleDetailsByVehicleNumberPOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.allFTvehicleDetailsByVehicleNumber = res.data;
            this.downloadExcelFastagVehicleDetailsByVehicleNumberForAdmin()
            this.spinner.hide();
            this.filterForm.reset();
          } else {
            alert("Data Not Found!")
            this.spinner.hide();

          }
        });
    } else {
      alert("Please Select Date and Vehicle..!")
    }
  }
  downloadExcelFastagVehicleDetailsByVehicleNumberForAdmin() {
    this.allFTvehicleDetailsByVehicleNumberExcel.length = 0;
    this.allFTvehicleDetailsByVehicleNumber.map((res: any) => {
      if (res.fastagConvertedAmount == 'undefined') {
        this.fastagConvertedAmountExcelvehicle = 0
      } else {
        this.fastagConvertedAmountExcelvehicle = Number(res.fastagConvertedAmount)
      }
      var json = {
        Date: moment(res.manualDate, ["YYYY-MM-DD h:mm:ss"]).format("DD-MM-YYYY"),
        Time: moment(res.manualDate).format("h:mm A"),
        fastagTransactionAuthCode: res.fastagTransactionAuthCode,
        fastagTransactionEntityId: res.fastagTransactionEntityId,
        fastagTransactionBusinessId: res.fastagTransactionBusinessId,
        fastagTransactionAmount: res.fastagTransactionAmount,
        fastagTransactionBalance: res.fastagTransactionBalance,
        fastagTransactionType: res.fastagTransactionType,
        fastagTxnOrigin: res.fastagTxnOrigin,
        fastagExternalTransactionId: res.fastagExternalTransactionId,
        fastagtxRef: res.fastagtxRef,
        fastagRetrivalReferenceNo: res.fastagRetrivalReferenceNo,
        fastagOtherPartyId: res.fastagOtherPartyId,
        fastagOtherPartyName: res.fastagOtherPartyName,
        fastagTransactionKitNo: res.fastagTransactionKitNo,


      };
      this.allFTvehicleDetailsByVehicleNumberExcel.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.allFTvehicleDetailsByVehicleNumberExcel,
      "Fastag Vehicle Details By Vehicle"
    );
  }

  //getFastagVehicleDetailsByDateForAdminLQ  
  getFastagVehicleDetailsByDateForAdminLQ() {
    this.spinner.show();
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.allFTvehicleDetailsByDate.length = 0;
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "00:00:01",
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "23:59:59",
      }
      this.post.getFastagVehicleDetailsByDateLQPOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.allFTvehicleDetailsByDate = res.data;
            this.excelService.exportAsExcelFile(
              this.allFTvehicleDetailsByDate,
              "Fastag Details All Customers"
            );
            this.spinner.hide();
            this.filterForm.reset();
          } else {
            alert("Data Not Found!")
            this.spinner.hide();
          }
        });
    } else {
      alert("Please Select Date..!")
      this.spinner.hide();

    }
  }

  //FT Transaction date Limit
  ftSDateLimit() {
    this.filterForm.controls["endDateFT"].setValue("");
    this.filterForm.controls["endDateFT"].setValue(moment(this.filterForm.value.startDateFT, ["DD-MM-YYYY"]).add(15, 'days').format("DD-MM-YYYY"));
    if (moment(this.filterForm.value.endDateFT, ["DD-MM-YYYY"]).format('YYYY-MM-DD') > moment(new Date()).format("YYYY-MM-DD")) {
      this.filterForm.controls["endDateFT"].setValue(moment(new Date()).format("DD-MM-YYYY"));
    }

    this.ftDateLimit();
  }
  ftDateLimit() {
    if (this.filterForm.value.startDateFT && this.filterForm.value.endDateFT) {
      var g1 = new Date(moment(this.filterForm.value.startDateFT, ["DD-MM-YYYY"]).format('YYYY-MM-DD'));
      var g2 = new Date(moment(this.filterForm.value.endDateFT, ["DD-MM-YYYY"]).format('YYYY-MM-DD'));

      const oneDay = 24 * 60 * 60 * 1000
      const diffDays = Math.round(Math.abs((g1.getTime() - g2.getTime()) / oneDay))

      if (diffDays > 16) {
        alert("Please select Date Range between 15 days");
        this.filterForm.controls["endDateFT"].setValue("");
      }
    } else {
    }
  }

  //FT Transaction date Limit
  ftSDateLimitLQ() {
    this.filterForm.controls["endDateFTLQ"].setValue("");
    this.filterForm.controls["endDateFTLQ"].setValue(moment(this.filterForm.value.startDateFTLQ, ["DD-MM-YYYY"]).add(15, 'days').format("DD-MM-YYYY"));
    if (moment(this.filterForm.value.endDateFTLQ, ["DD-MM-YYYY"]).format('YYYY-MM-DD') > moment(new Date()).format("YYYY-MM-DD")) {
      this.filterForm.controls["endDateFTLQ"].setValue(moment(new Date()).format("DD-MM-YYYY"));
    }

    this.ftDateLimitLQ();
  }
  ftDateLimitLQ() {
    if (this.filterForm.value.startDateFTLQ && this.filterForm.value.endDateFTLQ) {
      var g1 = new Date(moment(this.filterForm.value.startDateFTLQ, ["DD-MM-YYYY"]).format('YYYY-MM-DD'));
      var g2 = new Date(moment(this.filterForm.value.endDateFTLQ, ["DD-MM-YYYY"]).format('YYYY-MM-DD'));

      const oneDay = 24 * 60 * 60 * 1000
      const diffDays = Math.round(Math.abs((g1.getTime() - g2.getTime()) / oneDay))

      if (diffDays > 16) {
        alert("Please select Date Range between 15 days");
        this.filterForm.controls["endDateFTLQ"].setValue("");
      }
    } else {
    }
  }

  //getFTTransactionsLQ   
  getFTTransactionsLQ() {
    this.spinner.show();
    if (this.filterForm.value.startDateFTLQ && this.filterForm.value.endDateFTLQ) {
      this.allFTvehicleDetailsByEntityId.length = 0;
      let data = {
        entityId: this.filterForm.value.entityIdLQ,
        startDate: moment(this.filterForm.value.startDateFTLQ, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDateFTLQ, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post.getFTTransactionsLQPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.allFTvehicleDetailsByEntityIdLQ = res.data;
            this.excelService.exportAsExcelFile(
              this.allFTvehicleDetailsByEntityIdLQ,
              "Fastag Vehicle Details By EntityId"
            );
            this.spinner.hide();
            this.filterForm.reset();
          } else {
            alert("Data Not Found!")
            this.spinner.hide();
          }
        });
    } else {
      alert("Please Select Date..!")
    }
  }


  //getFastagVehicleDetailsByVehicleNumberForAdminLQ     
  getFastagVehicleDetailsByVehicleNumberForAdminLQ() {
    this.spinner.show();
    if (this.filterForm.value.vehicleNumberFTLQ && this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.allFTvehicleDetailsByVehicleNumber.length = 0;
      let data = {
        vehicleNumber: this.filterForm.value.vehicleNumberFTLQ,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "00:00:01",
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "23:59:59",
      }
      this.post.getFastagVehicleDetailsByVehicleNumberLQPOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.allFTvehicleDetailsByVehicleNumber = res.data;
            this.downloadExcelFastagVehicleDetailsByVehicleNumberForAdminLQ()
            this.spinner.hide();
            this.filterForm.reset();
          } else {
            alert("Data Not Found!")
            this.spinner.hide();
          }
        });
    } else {
      alert("Please Select Date and Vehicle..!")
    }
  }
  downloadExcelFastagVehicleDetailsByVehicleNumberForAdminLQ() {
    this.allFTvehicleDetailsByVehicleNumberExcel.length = 0;
    this.allFTvehicleDetailsByVehicleNumber.map((res: any) => {
      if (res.fastagConvertedAmount == 'undefined') {
        this.fastagConvertedAmountExcelvehicle = 0
      } else {
        this.fastagConvertedAmountExcelvehicle = Number(res.fastagConvertedAmount)
      }
      var json = {
        Date: moment(res.manualDate, ["YYYY-MM-DD h:mm:ss"]).format("DD-MM-YYYY"),
        Time: moment(res.manualDate).format("h:mm A"),
        fastagTransactionAuthCode: res.fastagTransactionAuthCode,
        fastagTransactionEntityId: res.fastagTransactionEntityId,
        fastagTransactionBusinessId: res.fastagTransactionBusinessId,
        fastagTransactionAmount: res.fastagTransactionAmount,
        fastagTransactionBalance: res.fastagTransactionBalance,
        fastagTransactionType: res.fastagTransactionType,
        fastagTxnOrigin: res.fastagTxnOrigin,
        fastagExternalTransactionId: res.fastagExternalTransactionId,
        fastagtxRef: res.fastagtxRef,
        fastagRetrivalReferenceNo: res.fastagRetrivalReferenceNo,
        fastagOtherPartyId: res.fastagOtherPartyId,
        fastagOtherPartyName: res.fastagOtherPartyName,
        fastagTransactionKitNo: res.fastagTransactionKitNo,
      };
      this.allFTvehicleDetailsByVehicleNumberExcel.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.allFTvehicleDetailsByVehicleNumberExcel,
      "Fastag Vehicle Details By Vehicle"
    );
  }



}
