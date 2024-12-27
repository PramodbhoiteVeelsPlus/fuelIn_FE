import { ChangeDetectorRef, Component, Injectable, Input, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbActiveModal, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { WidgetService } from '../../widgets.services';
import { ExcelService } from 'src/app/pages/excel.service';
import { StatsService } from '../stats.services';
import * as XLSX from 'xlsx';


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
  selector: 'app-stats-widget2',
  templateUrl: './stats-widget2.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class StatsWidget2Component {
  page: any = 1;
  pageSize: any = 10;
  page1: any = 1;
  pageSize1: any = 10;
  page2: any = 1;
  pageSize2: any = 10;
  page3: any = 1;
  pageSize3: any = 10;
  page4: any = 1;
  pageSize4: any = 10;

  filterForm = new FormGroup({
    selecteReport: new FormControl(""),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    selectedCorp: new FormControl("")

  });
  corporateList: any = [];
  allCreditAccByDealerList1: any = [];
  allCreditAccByDealer: any = [];
  allCreditAccByDealerList: any = [];
  allCreditAccByDealerLength: any = [];
  allCorporateFlagJson: any = [];
  allCorporateFlag: any = [];
  allCreditAccByDealerList2: any = [];
  allSumCrANDdiscount: any = [];
  dateToday: any;
  allActiveCreditAccByDealer: any = [];
  allActiveCreditAccByDealer1: any = [];
  thisMonthCrSale: any;
  thisMonthCrPayment: any;
  totalPurchase: number;
  totalPayment: number;
  fuelDealerId: any;
  previousOutstanding: any;
  totalOutstanding: number;
  loginCorporateId: any;
  allPaymentSum: any;
  last5PaymentSum: any;
  allcorpClapSumData: any = [];
  finalCalculation: any = [];
  isAllCreditAccount: any = false;
  companyName: any;
  brandName: any;
  isActiveCreditAccount: any = false;
  allCreditAccByDealerListDetails: any = [];
  netOutstanding1: number;
  netOutstanding: string;
  isTxnwiseCreditSales: any = false;
  allCreditSalesDetails: any = [];
  allCreditReq: any = [];
  allCreditReqDataa: any = [];
  productWiseCRAmt: any = [];
  allCreditReqData: any = [];
  pageLength: any = 1;
  allCreditReqExcel: any = [];
  allCreditReqExcelListDetails: any = [];
  vehicle: string;
  productName: any;
  actualCreditQuantity: any;
  createdBy: string;
  isTxnWiseCreditPayments: any = false;
  crPaymentDetails: any = [];
  paymentDetails: any = [];
  ownerName: string;


  firstSixMonthsPetrolPumpList1: any;
  firstSixMonthsPetrolPumpList1length: any;
  firstSixMonthsPetrolPumpList2: any;
  firstSixMonthsPetrolPumpList2length: any;
  firstSixMonthsPetrolPumpList3: any;
  firstSixMonthsPetrolPumpList3length: any;
  firstSixMonthsPetrolPumpList4: any;
  firstSixMonthsPetrolPumpList4length: any;
  firstSixMonthsPetrolPumpList5: any;
  firstSixMonthsPetrolPumpList5length: any;
  firstSixMonthsPetrolPumpList6: any;
  firstSixMonthsPetrolPumpList6length: any;
  firstSixMonthsPetrolPumpList7: any;
  firstSixMonthsPetrolPumpList7length: any;
  firstSixMonthsPetrolPumpList8: any;
  firstSixMonthsPetrolPumpList8length: any;
  firstSixMonthsPetrolPumpList9: any;
  firstSixMonthsPetrolPumpList9length: any;
  firstSixMonthsPetrolPumpList10: any;
  firstSixMonthsPetrolPumpList10length: any;
  firstSixMonthsPetrolPumpList11: any;
  firstSixMonthsPetrolPumpList11length: any;
  firstSixMonthsPetrolPumpList12: any;
  firstSixMonthsPetrolPumpList12length: any;
  firstSixMonthsCustomerList1: any;
  firstSixMonthsCustomerList1length: any;
  firstSixMonthsCustomerList2: any;
  firstSixMonthsCustomerList2length: any;
  firstSixMonthsCustomerList3: any;
  firstSixMonthsCustomerList3length: any;
  firstSixMonthsCustomerList4: any;
  firstSixMonthsCustomerList4length: any;
  firstSixMonthsCustomerList5: any;
  firstSixMonthsCustomerList5length: any;
  firstSixMonthsCustomerList6: any;
  firstSixMonthsCustomerList6length: any;
  firstSixMonthsCustomerList7: any;
  firstSixMonthsCustomerList7length: any;
  firstSixMonthsCustomerList8: any;
  firstSixMonthsCustomerList8length: any;
  firstSixMonthsCustomerList9: any;
  firstSixMonthsCustomerList9length: any;
  firstSixMonthsCustomerList10: any;
  firstSixMonthsCustomerList10length: any;
  firstSixMonthsCustomerList11: any;
  firstSixMonthsCustomerList11length: any;
  firstSixMonthsCustomerList12: any;
  firstSixMonthsCustomerList12length: any;
  allDealerCount: any;
  allCustomerCount: any;
  allActiveDealer1: any;
  allActiveDealer2: any;
  allActiveDealer3: any;
  allActiveDealer4: any;
  allActiveDealer5: any;
  allActiveDealer6: any;
  allActiveDealer7: any;
  allActiveDealer8: any;
  allActiveDealer9: any;
  allActiveDealer10: any;
  allActiveDealer11: any;
  allActiveDealer12: any;
  allActiveCustomer1: any = [];
  allActiveCustomer2: any = [];
  allActiveCustomer3: any = [];
  allActiveCustomer4: any = [];
  allActiveCustomer5: any = [];
  allActiveCustomer6: any = [];
  allActiveCustomer7: any = [];
  allActiveCustomer8: any = [];
  allActiveCustomer9: any = [];
  allActiveCustomer10: any = [];
  allActiveCustomer11: any = [];
  allActiveCustomer12: any = [];
  uniqueCustomer1: any = [];
  allActiveCustomer1Length: number;
  allActiveCustomer2Length: number;
  allActiveCustomer3Length: number;
  allActiveCustomer4Length: number;
  allActiveCustomer5Length: number;
  allActiveCustomer6Length: number;
  allActiveCustomer12Length: number;
  allActiveCustomer11Length: number;
  allActiveCustomer10Length: number;
  allActiveCustomer9Length: number;
  allActiveCustomer8Length: number;
  allActiveCustomer7Length: number;
  modalRefpass: any;
  closeResult: string;
  pumpName: any = [];
  custName: any = [];
  activeCustomer: any = [];
  activeCustomerDatewise: any = [];
  pumpNameDetails: any = [];
  customerNameDetails: any = [];
  activePumpDetails: any = [];
  activeCustomerDatewiseDetails: any = [];
  IsDealerId: any = false;
  crPaymentDetailsData: any = [];
  isCreditPayment: any = false;
  FuelVeelsId: any;
  VeelsID: any;
  isActiveCredit: boolean;
  allActiveCreditAccByDealerData: any;


  constructor(private post: StatsService,
    private excelService: ExcelService,
    private modalService: NgbModal,
    config: NgbDatepickerConfig,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    this.getAllDealer()
    this.getFirstSixMonthPetrolPumpName();
    this.getLastSixMonthPetrolPumpName();
    this.getFirstSixMonthCustomerName();
    this.getLastSixMonthCustomerName();
    this.getAllDealerAndCustumerCount();
    this.getFirstSixMonthActivePumpCount();
    this.getLastSixMonthActivePumpCount();
    this.getFirstSixMonthActiveCustomer();
    this.getLastSixMonthActiveCustomer()
  }

  getAllDealer() {
    this.spinner.show()
    let data = {
    }
    this.post.getFuelVendorsList(data)
      .subscribe(res => {
        this.corporateList = res.data
        this.spinner.hide()
        this.cd.detectChanges();
      })
  }

  getDetailsByDealerId(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelVendorId: fuelDealerId
    }
    this.post.getFuelVendorsDetailsById(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.loginCorporateId = res.data[0].corporateId;
          this.companyName = res.data[0].companyName;
          this.brandName = res.data[0].brandName;
          this.FuelVeelsId = res.data[0].FuelVeelsId;
          this.getAllCreditAccByDealerId(fuelDealerId)
          this.creditTxnPayment1(this.loginCorporateId)
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  getDetailsByfuelDealerCustomerMapIdId() {
    if (this.filterForm.value.selecteReport == "allCreditAccount") {
      this.fuelDealerId = this.filterForm.value.selectedCorp
      this.isAllCreditAccount = true;
      this.isActiveCreditAccount = false
      this.isTxnwiseCreditSales = false;
      this.isTxnWiseCreditPayments = false;
      if (this.filterForm.value.selectedCorp == '') {
        alert("please Select Dealer");
      } else {
        this.getDetailsByDealerId(this.filterForm.value.selectedCorp)
      }
    }
    else if (this.filterForm.value.selecteReport == "activeCreditAccount") {
      this.fuelDealerId = this.filterForm.value.selectedCorp
      this.isAllCreditAccount = false;
      this.isActiveCreditAccount = true
      this.isTxnwiseCreditSales = false;
      this.isTxnWiseCreditPayments = false;
      if (this.filterForm.value.selectedCorp == '') {
        alert("please Select Dealer");
      } else {
        this.getDetailsByDealerId(this.filterForm.value.selectedCorp)
      }
    } else if (this.filterForm.value.selecteReport == "txnwiseCreditSales") {
      this.fuelDealerId = this.filterForm.value.selectedCorp
      this.isAllCreditAccount = false;
      this.isActiveCreditAccount = false;
      this.isTxnwiseCreditSales = true;
      this.isTxnWiseCreditPayments = false;
      if (this.filterForm.value.selectedCorp == '') {
        this.creditSales();
      } else {
        this.getDetailsByDealerId(this.filterForm.value.selectedCorp)
        this.creditSales();
      }
    } else if (this.filterForm.value.selecteReport == "txnWiseCreditPayments") {
      this.fuelDealerId = this.filterForm.value.selectedCorp
      this.isAllCreditAccount = false;
      this.isActiveCreditAccount = false;
      this.isTxnwiseCreditSales = false;
      this.isTxnWiseCreditPayments = true;
      if (this.filterForm.value.selectedCorp == '') {
        this.creditTxnPayment(this.filterForm.value.selectedCorp);
      } else {
        this.getDetailsByDealerId(this.filterForm.value.selectedCorp)
      }
    }
    else {
      alert("please select report")
    }
  }

  exportexcelForAllCredit(): void {
    let fileName = 'FuelVendorList.xlsx';
    /* table id is passed over here */
    let element = document.getElementById('excel-tableAllCredit');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);

  }

  getAllCreditAccByDealerId(fuelDealerId: any) {
    this.spinner.show()
    this.allCreditAccByDealer.length = 0;
    this.allCreditAccByDealerList.length = 0;
    this.allCreditAccByDealerList1.length = 0;
    this.allCreditAccByDealerLength.length = 0;
    this.allCorporateFlagJson.length = 0;
    this.allCorporateFlag.length = 0;
    let data = {
      fuelDealerId: fuelDealerId,
    }
    this.post.getAllCreditAccByDealerId(data)
      .subscribe(res => {
        if (res) {
          this.allCreditAccByDealerList = res.data;
          this.allCreditAccByDealerList2 = res.data5;
          this.allCreditAccByDealerLength = res.data;
          this.allCorporateFlagJson = res.data1;
          this.allCorporateFlag = res.data2;
          this.allSumCrANDdiscount = res.CRSum;
          this.getCombineActive();
          this.getThisMonthCrDetail(this.fuelDealerId, this.loginCorporateId)
          this.getAllClapsAndStarsCalculation(this.fuelDealerId)
          this.spinner.hide()
          this.cd.detectChanges();
        }
        else {
          alert("Error to Show Account List!")
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  getAllClapsAndStarsCalculation(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getAllclapsCalculationByDealerIdPost(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.allPaymentSum = res.allData;
          this.last5PaymentSum = res.lastData;
          this.getAllclapsCalculationByCorpId(fuelDealerId)
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  getAllclapsCalculationByCorpId(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getAllclapsCalculationByCorpIdPost(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.allcorpClapSumData = res.allcorpClapSumData;
          this.getAllcal(this.allPaymentSum, this.last5PaymentSum, this.allcorpClapSumData)
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  getAllcal(allPaymentSum: any, last5PaymentSum: any, allcorpClapSumData: any) {
    allPaymentSum.map((all: any) => {
      let sum = 0;
      let crJson = {
        mappingCreatedDate: all.mappingCreatedDate,
        companyName: all.companyName,
        fuelDealerCustomerMapId: all.fuelDealerCustomerMapId,
        previousOutstand: all.previousOutstand,
        maxCreditAmount: all.maxCreditAmount,
        totalCRAmt: all.totalCRAmt,
        totalDiscount: all.totalDiscount,
        mappingStatus: all.mappingStatus,
        hostPhone: all.hostPhone,
        hostName: all.hostName,
        city: all.city,
        mappingPreviousStatus: all.mappingPreviousStatus,
        mappingCustomerName: all.mappingCustomerName,
        mappingCompanyName: all.mappingCompanyName,
        isMappingEmail: all.isMappingEmail,
        isMappingSMS: all.isMappingSMS,
        paymentAvgAmount: all.paymentAvgAmount,
        paymentCount: all.paymentCount,
        paymentAllAvgAmount: "",
        paymentAllCount: "",
        lastFiveSum: 0,
        fuelCorporateId: "",
        corphostPhone: "",
        corpFuelDealerCustomerMapId: "",
        FuelVeelsId: "",

      }
      last5PaymentSum.map((limited: any) => {
        if (all.fuelDealerCustomerMapId == limited.fuelDealerCustomerMapId) {
          sum = sum + Number(limited.avgPayment)
        }
      })

      allcorpClapSumData.map((corpTransaction: any) => {
        if (all.hostPhone == corpTransaction.hostPhone) {
          crJson.fuelCorporateId = corpTransaction.fuelCorporateId
          crJson.paymentAllAvgAmount = corpTransaction.paymentAllAvgAmount
          crJson.paymentAllCount = corpTransaction.paymentAllCount
          crJson.corphostPhone = corpTransaction.hostPhone
          crJson.corpFuelDealerCustomerMapId = corpTransaction.corpFuelDealerCustomerMapId

        }
      })

      crJson.lastFiveSum = sum;
      this.finalCalculation.push(crJson)
    })
    this.getCombineJson();
  }

  getCombineActive() {
    this.allActiveCreditAccByDealer = [];
    this.allActiveCreditAccByDealer1 = [];
    this.allCreditAccByDealerList.map((shift: any) => {
      const dataPAYJson = {
        corporateReviewFlag: "",
        mappingCreatedDate: "",
        mappingPreviousStatus: "",
        companyName: "",
        mappingCustomerName: "",
        hostPhone: "",
        hostName: "",
        previousOutstand: "",
        maxCreditAmount: "",
        totalCRAmt: "",
        mappingStatus: "",
        totalInvPaidAmt: 0,
        totalDiscount: "",
        fuelDealerCustomerMapId: "",
        smsStatus: "",
        isMappingEmail: "",
        isMappingSMS: "",
        pendingDays: 0,
        creditDayLimit: "",
        FuelVeelsId: "",

      };
      dataPAYJson.corporateReviewFlag = shift.corporateReviewFlag;
      dataPAYJson.mappingCreatedDate = shift.mappingCreatedDate;
      dataPAYJson.mappingPreviousStatus = shift.mappingPreviousStatus;
      dataPAYJson.hostPhone = shift.hostPhone;
      dataPAYJson.companyName = shift.companyName;
      dataPAYJson.mappingCustomerName = shift.mappingCustomerName;
      dataPAYJson.hostName = shift.hostName;
      dataPAYJson.previousOutstand = shift.previousOutstand;
      dataPAYJson.maxCreditAmount = shift.maxCreditAmount;
      dataPAYJson.totalCRAmt = shift.totalCRAmt;
      dataPAYJson.mappingStatus = shift.mappingStatus;
      dataPAYJson.totalDiscount = shift.totalDiscount;
      dataPAYJson.fuelDealerCustomerMapId = shift.fuelDealerCustomerMapId;
      dataPAYJson.smsStatus = shift.smsStatus;
      dataPAYJson.isMappingEmail = shift.isMappingEmail;
      dataPAYJson.isMappingSMS = shift.isMappingSMS;
      dataPAYJson.creditDayLimit = shift.creditDayLimit;
      dataPAYJson.FuelVeelsId = shift.FuelVeelsId;
      if (shift.lastCRDate) {
        var g1 = new Date(moment(this.dateToday).format('YYYY-MM-DD'));
        var g2 = new Date(shift.lastCRDate);

        const oneDay = 24 * 60 * 60 * 1000
        const diffDays = Math.round(Math.abs((g1.getTime() - g2.getTime()) / oneDay))

        dataPAYJson.pendingDays = diffDays;
      }
      this.allCreditAccByDealerList2.map((sales: any) => {
        if (sales.fuelDealerCustomerMapId == shift.fuelDealerCustomerMapId) {
          dataPAYJson.totalInvPaidAmt = sales.totalInvPaidAmt;
        }
      })
      this.allActiveCreditAccByDealer.push(dataPAYJson);
      this.allActiveCreditAccByDealer1.push(dataPAYJson);
    })
    if (this.allCreditAccByDealerList.length == this.allActiveCreditAccByDealer.length) {
    }
    this.cd.detectChanges();
  }

  getThisMonthCrDetail(fuelDealerId: any, corporateId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId,
      corporateId: corporateId,
    }
    this.post.getThisMonthCrDetails(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.thisMonthCrSale = res.data[0].totalCrSale;
          this.thisMonthCrPayment = res.data1[0].totalCrPayment;
          this.totalPurchase = Number(res.data2[0].totalCrSale) - Number(res.data2[0].totalDiscount);
          this.totalPayment = Number(res.data4[0].totalCrPayment)
          this.getPreviousOutstandingByfuelDealerId(this.fuelDealerId, this.totalPurchase, this.totalPayment);
          this.spinner.hide()
          this.cd.detectChanges();

        }
      })
  }

  getPreviousOutstandingByfuelDealerId(fuelDealerId: any, totalPurchase: any, totalPayment: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getPreviousOutstanding(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.previousOutstanding = res.data[0].previousOutstanding;
          this.totalOutstanding = Number(totalPurchase) - Number(totalPayment) + Number(this.previousOutstanding);
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }


  getCombineJson() {
    this.allCorporateFlagJson.map((res: any) => {
      this.allCreditAccByDealerList1.push(res)
      this.allCorporateFlag.map((res1: any) => {
        if (res.fuelCorporateId == res1.corporateIdForFlag) {
          var combinedJson = {
            corporateReviewFlag: "",
            mappingCreatedDate: "",
            companyName: "",
            mappingPreviousStatus: "",
            mappingCustomerName: "",
            hostName: "",
            hostPhone: "",
            fuelDealerCustomerMapId: "",
            previousOutstand: "",
            mappingStatus: "",
            idcorporateFlag: "",
            corporateFlagPurpose: "",
            corporateFlagDealerId: "",
            fuelDealerId: "",
            corporateIdForFlag: "",
            corporateBlockedStatus: "",
            creditDayLimit: "",
            corporateId: "",
            FuelVeelsId: "",
          }
          combinedJson.corporateId = res.corporateId,
            combinedJson.corporateReviewFlag = res.corporateReviewFlag,
            combinedJson.mappingCreatedDate = res.mappingCreatedDate,
            combinedJson.companyName = res.companyName,
            combinedJson.mappingPreviousStatus = res.mappingPreviousStatus,
            combinedJson.mappingCustomerName = res.mappingCustomerName,
            combinedJson.hostName = res.hostName,
            combinedJson.hostPhone = res.hostPhone,
            combinedJson.fuelDealerCustomerMapId = res.fuelDealerCustomerMapId,
            combinedJson.previousOutstand = res.previousOutstand,
            combinedJson.mappingStatus = res.mappingStatus,
            combinedJson.idcorporateFlag = res1.idcorporateFlag,
            combinedJson.corporateFlagPurpose = res1.corporateFlagPurpose,
            combinedJson.corporateFlagDealerId = res1.corporateFlagDealerId,
            combinedJson.fuelDealerId = res.fuelDealerId,
            combinedJson.corporateIdForFlag = res1.corporateIdForFlag,
            combinedJson.creditDayLimit = res.creditDayLimit,
            combinedJson.corporateBlockedStatus = "TRUE",
            combinedJson.FuelVeelsId = res.FuelVeelsId,

            this.allCreditAccByDealerList1.push(combinedJson)
        }
      })

      this.allActiveCreditAccByDealer.map((res2: any) => {
        if (res.fuelDealerCustomerMapId == res2.fuelDealerCustomerMapId) {
          const dataPAYJson = {
            corporateId: "",
            corporateReviewFlag: "",
            mappingCreatedDate: "",
            mappingPreviousStatus: "",
            companyName: "",
            mappingCustomerName: "",
            hostPhone: "",
            hostName: "",
            previousOutstand: "",
            maxCreditAmount: "",
            totalCRAmt: "",
            mappingStatus: "",
            totalInvPaidAmt: 0,
            totalDiscount: "",
            fuelDealerCustomerMapId: "",
            smsStatus: "",
            isMappingEmail: "",
            isMappingSMS: "",
            pendingDays: 0,
            creditDayLimit: "",
            idcorporateFlag: "",
            corporateFlagPurpose: "",
            corporateFlagDealerId: "",
            corporateIdForFlag: "",
            corporateBlockedStatus: "",
            fuelCorporateId: "",
            FuelVeelsId: "",

          };
          dataPAYJson.fuelCorporateId = res.fuelCorporateId;
          dataPAYJson.corporateId = res.corporateId;
          dataPAYJson.corporateReviewFlag = res.corporateReviewFlag;
          dataPAYJson.mappingCreatedDate = res2.mappingCreatedDate;
          dataPAYJson.mappingPreviousStatus = res2.mappingPreviousStatus;
          dataPAYJson.hostPhone = res2.hostPhone;
          dataPAYJson.companyName = res2.companyName;
          dataPAYJson.mappingCustomerName = res2.mappingCustomerName;
          dataPAYJson.hostName = res2.hostName;
          dataPAYJson.previousOutstand = res2.previousOutstand;
          dataPAYJson.maxCreditAmount = res2.maxCreditAmount;
          dataPAYJson.totalCRAmt = res2.totalCRAmt;
          dataPAYJson.mappingStatus = res2.mappingStatus;
          dataPAYJson.totalDiscount = res2.totalDiscount;
          dataPAYJson.fuelDealerCustomerMapId = res2.fuelDealerCustomerMapId;
          dataPAYJson.smsStatus = res2.smsStatus;
          dataPAYJson.isMappingEmail = res2.isMappingEmail;
          dataPAYJson.isMappingSMS = res2.isMappingSMS;
          dataPAYJson.creditDayLimit = res2.creditDayLimit;
          dataPAYJson.pendingDays = res2.pendingDays;
          dataPAYJson.totalInvPaidAmt = res2.totalInvPaidAmt;
          dataPAYJson.FuelVeelsId = res2.FuelVeelsId;
          dataPAYJson.corporateBlockedStatus = res.corporateBlockedStatus

          this.allCreditAccByDealerList1 = this.allCreditAccByDealerList1.filter(function (jsonObject: any) {
            return jsonObject.fuelDealerCustomerMapId != res2.fuelDealerCustomerMapId;
          });
          this.allCreditAccByDealerList1.push(dataPAYJson)

        }
      })
    })



    this.allCreditAccByDealerList1.map((res: any) => {
      this.finalCalculation.map((rating: any) => {
        if (res.fuelDealerCustomerMapId == rating.fuelDealerCustomerMapId) {
          this.allCreditAccByDealerList1.push(rating)
          const dataRating = {
            fuelCorporateId: "",
            corporateReviewFlag: "",
            mappingCreatedDate: "",
            mappingPreviousStatus: "",
            companyName: "",
            mappingCustomerName: "",
            hostPhone: "",
            hostName: "",
            previousOutstand: "",
            maxCreditAmount: "",
            totalCRAmt: "",
            mappingStatus: "",
            totalInvPaidAmt: 0,
            totalDiscount: "",
            fuelDealerCustomerMapId: "",
            smsStatus: "",
            isMappingEmail: "",
            isMappingSMS: "",
            pendingDays: 0,
            creditDayLimit: "",
            idcorporateFlag: "",
            corporateFlagPurpose: "",
            corporateFlagDealerId: "",
            corporateIdForFlag: "",
            corporateBlockedStatus: "",
            paymentAvgAmount: "",
            paymentAllAvgAmount: "",
            paymentAllCount: "",
            lastFiveSum: "",
            paymentCount: "",
            corporateId: "",
            FuelVeelsId: "",

          };
          dataRating.corporateId = res.corporateId;
          dataRating.corporateReviewFlag = res.corporateReviewFlag;
          dataRating.mappingCreatedDate = res.mappingCreatedDate;
          dataRating.mappingPreviousStatus = res.mappingPreviousStatus;
          dataRating.hostPhone = res.hostPhone;
          dataRating.companyName = res.companyName;
          dataRating.mappingCustomerName = res.mappingCustomerName;
          dataRating.hostName = res.hostName;
          dataRating.previousOutstand = res.previousOutstand;
          dataRating.maxCreditAmount = res.maxCreditAmount;
          dataRating.totalCRAmt = res.totalCRAmt;
          dataRating.mappingStatus = res.mappingStatus;
          dataRating.totalDiscount = res.totalDiscount;
          dataRating.fuelDealerCustomerMapId = res.fuelDealerCustomerMapId;
          dataRating.smsStatus = res.smsStatus;
          dataRating.isMappingEmail = res.isMappingEmail;
          dataRating.isMappingSMS = res.isMappingSMS;
          dataRating.creditDayLimit = res.creditDayLimit;
          dataRating.pendingDays = res.pendingDays;
          dataRating.totalInvPaidAmt = res.totalInvPaidAmt
          dataRating.idcorporateFlag = res.idcorporateFlag,

            dataRating.corporateFlagPurpose = res.corporateFlagPurpose,
            dataRating.corporateFlagDealerId = res.corporateFlagDealerId,
            dataRating.corporateIdForFlag = res.corporateIdForFlag,
            dataRating.corporateBlockedStatus = res.corporateBlockedStatus,
            dataRating.paymentAvgAmount = rating.paymentAvgAmount
          dataRating.paymentAllAvgAmount = rating.paymentAllAvgAmount
          dataRating.paymentAllCount = rating.paymentAllCount
          dataRating.lastFiveSum = rating.lastFiveSum
          dataRating.paymentCount = rating.paymentCount
          dataRating.fuelCorporateId = rating.fuelCorporateId
          dataRating.FuelVeelsId = rating.FuelVeelsId;

          this.allCreditAccByDealerList1 = this.allCreditAccByDealerList1.filter(function (jsonObject1: any) {
            return jsonObject1.fuelDealerCustomerMapId != rating.fuelDealerCustomerMapId;
          });
          this.allCreditAccByDealerList1.push(dataRating)
        }
      })
    })
    this.paymentScoreByMobileNumber()
  }

  paymentScoreByMobileNumber() {

    let DealerList1: any = []
    this.allCreditAccByDealerList1.map((score: any) => {
      this.finalCalculation.map((score1: any) => {

        const datascore = {
          corporateId: "",

          fuelCorporateId: "",
          corporateReviewFlag: "",
          mappingCreatedDate: "",
          mappingPreviousStatus: "",
          companyName: "",
          mappingCustomerName: "",
          hostPhone: "",
          corphostPhone: "",
          hostName: "",
          previousOutstand: "",
          maxCreditAmount: "",
          totalCRAmt: "",
          mappingStatus: "",
          totalInvPaidAmt: 0,
          totalDiscount: "",
          fuelDealerCustomerMapId: "",
          smsStatus: "",
          isMappingEmail: "",
          isMappingSMS: "",
          pendingDays: 0,
          creditDayLimit: "",
          idcorporateFlag: "",
          corporateFlagPurpose: "",
          corporateFlagDealerId: "",
          corporateIdForFlag: "",
          corporateBlockedStatus: "",
          paymentAvgAmount: "",
          paymentAllAvgAmount: "",
          paymentAllCount: "",
          lastFiveSum: "",
          paymentCount: "",
          FuelVeelsId: "",
        };
        if (score.hostPhone == score1.corphostPhone) {
          datascore.corporateId = score.corporateId;
          datascore.corporateReviewFlag = score.corporateReviewFlag;
          datascore.mappingCreatedDate = score.mappingCreatedDate;
          datascore.mappingPreviousStatus = score.mappingPreviousStatus;
          datascore.hostPhone = score.hostPhone;
          datascore.companyName = score.companyName;
          datascore.mappingCustomerName = score.mappingCustomerName;
          datascore.hostName = score.hostName;
          datascore.previousOutstand = score.previousOutstand;
          datascore.maxCreditAmount = score.maxCreditAmount;
          datascore.totalCRAmt = score.totalCRAmt;
          datascore.mappingStatus = score.mappingStatus;
          datascore.totalDiscount = score.totalDiscount;
          datascore.fuelDealerCustomerMapId = score.fuelDealerCustomerMapId;
          datascore.smsStatus = score.smsStatus;
          datascore.isMappingEmail = score.isMappingEmail;
          datascore.isMappingSMS = score.isMappingSMS;
          datascore.creditDayLimit = score.creditDayLimit;
          datascore.pendingDays = score.pendingDays;
          datascore.totalInvPaidAmt = score.totalInvPaidAmt
          datascore.idcorporateFlag = score.idcorporateFlag,
            datascore.corporateFlagPurpose = score.corporateFlagPurpose,
            datascore.corporateFlagDealerId = score.corporateFlagDealerId,
            datascore.corporateIdForFlag = score.corporateIdForFlag,
            datascore.corporateBlockedStatus = score.corporateBlockedStatus,
            datascore.paymentAvgAmount = score.paymentAvgAmount
          datascore.paymentAllAvgAmount = score1.paymentAllAvgAmount
          datascore.paymentAllCount = score1.paymentAllCount
          datascore.lastFiveSum = score.lastFiveSum
          datascore.paymentCount = score.paymentCount
          datascore.fuelCorporateId = score.fuelCorporateId
          datascore.corphostPhone = score1.corphostPhone;
          datascore.FuelVeelsId = score1.FuelVeelsId;

          DealerList1.push(datascore)
        }
      })
    })

    this.allCreditAccByDealerList1.map((score: any) => {
      DealerList1.map((score1: any) => {
        const datascore = {
          corporateId: "",
          fuelCorporateId: "",
          corporateReviewFlag: "",
          mappingCreatedDate: "",
          mappingPreviousStatus: "",
          companyName: "",
          mappingCustomerName: "",
          hostPhone: "",
          corphostPhone: "",
          hostName: "",
          previousOutstand: "",
          maxCreditAmount: "",
          totalCRAmt: "",
          mappingStatus: "",
          totalInvPaidAmt: 0,
          totalDiscount: "",
          fuelDealerCustomerMapId: "",
          smsStatus: "",
          isMappingEmail: "",
          isMappingSMS: "",
          pendingDays: 0,
          creditDayLimit: "",
          idcorporateFlag: "",
          corporateFlagPurpose: "",
          corporateFlagDealerId: "",
          corporateIdForFlag: "",
          corporateBlockedStatus: "",
          paymentAvgAmount: "",
          paymentAllAvgAmount: "",
          paymentAllCount: "",
          lastFiveSum: "",
          paymentCount: "",
          FuelVeelsId: "",
        };
        if (score.fuelDealerCustomerMapId == score1.fuelDealerCustomerMapId) {
          datascore.corporateId = score.corporateId;
          datascore.corporateReviewFlag = score.corporateReviewFlag;
          datascore.mappingCreatedDate = score.mappingCreatedDate;
          datascore.mappingPreviousStatus = score.mappingPreviousStatus;
          datascore.hostPhone = score.hostPhone;
          datascore.companyName = score.companyName;
          datascore.mappingCustomerName = score.mappingCustomerName;
          datascore.hostName = score.hostName;
          datascore.previousOutstand = score.previousOutstand;
          datascore.maxCreditAmount = score.maxCreditAmount;
          datascore.totalCRAmt = score.totalCRAmt;
          datascore.mappingStatus = score.mappingStatus;
          datascore.totalDiscount = score.totalDiscount;
          datascore.fuelDealerCustomerMapId = score.fuelDealerCustomerMapId;
          datascore.smsStatus = score.smsStatus;
          datascore.isMappingEmail = score.isMappingEmail;
          datascore.isMappingSMS = score.isMappingSMS;
          datascore.creditDayLimit = score.creditDayLimit;
          datascore.pendingDays = score.pendingDays;
          datascore.totalInvPaidAmt = score.totalInvPaidAmt
          datascore.idcorporateFlag = score.idcorporateFlag,
            datascore.corporateFlagPurpose = score.corporateFlagPurpose,
            datascore.corporateFlagDealerId = score.corporateFlagDealerId,
            datascore.corporateIdForFlag = score.corporateIdForFlag,
            datascore.corporateBlockedStatus = score.corporateBlockedStatus,
            datascore.paymentAvgAmount = score.paymentAvgAmount
          datascore.paymentAllAvgAmount = score1.paymentAllAvgAmount
          datascore.paymentAllCount = score1.paymentAllCount
          datascore.lastFiveSum = score.lastFiveSum
          datascore.paymentCount = score.paymentCount
          datascore.fuelCorporateId = score.fuelCorporateId
          datascore.corphostPhone = score1.corphostPhone;
          datascore.FuelVeelsId = score1.FuelVeelsId;

          this.allCreditAccByDealerList1 = this.allCreditAccByDealerList1.filter(function (jsonObject1: any) {
            return jsonObject1.fuelDealerCustomerMapId != score1.fuelDealerCustomerMapId;
          });
          this.allCreditAccByDealerList1.push(datascore)
        }
      })
    })

    this.allCreditAccByDealerList1.map((score: any) => {
      this.allCorporateFlag.map((res12: any) => {
        if (score.corporateId == res12.corporateIdForFlag || score.fuelCorporateId == res12.corporateIdForFlag) {
          var datascore1 = {
            corporateId: "",
            fuelCorporateId: "",
            corporateReviewFlag: "",
            mappingCreatedDate: "",
            mappingPreviousStatus: "",
            companyName: "",
            mappingCustomerName: "",
            hostPhone: "",
            corphostPhone: "",
            hostName: "",
            previousOutstand: "",
            maxCreditAmount: "",
            totalCRAmt: "",
            mappingStatus: "",
            totalInvPaidAmt: 0,
            totalDiscount: "",
            fuelDealerCustomerMapId: "",
            smsStatus: "",
            isMappingEmail: "",
            isMappingSMS: "",
            pendingDays: 0,
            creditDayLimit: "",
            idcorporateFlag: "",
            corporateFlagPurpose: "",
            corporateFlagDealerId: "",
            corporateIdForFlag: "",
            corporateBlockedStatus: "",
            paymentAvgAmount: "",
            paymentAllAvgAmount: "",
            paymentAllCount: "",
            lastFiveSum: "",
            paymentCount: "",
            isDealerIDForFlag: "ADD",
            FuelVeelsId: "",
          }

          datascore1.corporateId = score.corporateId;
          datascore1.corporateReviewFlag = score.corporateReviewFlag;
          datascore1.mappingCreatedDate = score.mappingCreatedDate;
          datascore1.mappingPreviousStatus = score.mappingPreviousStatus;
          datascore1.hostPhone = score.hostPhone;
          datascore1.companyName = score.companyName;
          datascore1.mappingCustomerName = score.mappingCustomerName;
          datascore1.hostName = score.hostName;
          datascore1.previousOutstand = score.previousOutstand;
          datascore1.maxCreditAmount = score.maxCreditAmount;
          datascore1.totalCRAmt = score.totalCRAmt;
          datascore1.mappingStatus = score.mappingStatus;
          datascore1.totalDiscount = score.totalDiscount;
          datascore1.fuelDealerCustomerMapId = score.fuelDealerCustomerMapId;
          datascore1.smsStatus = score.smsStatus;
          datascore1.isMappingEmail = score.isMappingEmail;
          datascore1.isMappingSMS = score.isMappingSMS;
          datascore1.creditDayLimit = score.creditDayLimit;
          datascore1.pendingDays = score.pendingDays;
          datascore1.totalInvPaidAmt = score.totalInvPaidAmt
          datascore1.paymentAvgAmount = score.paymentAvgAmount
          datascore1.paymentAllAvgAmount = score.paymentAllAvgAmount
          datascore1.paymentAllCount = score.paymentAllCount
          datascore1.lastFiveSum = score.lastFiveSum
          datascore1.paymentCount = score.paymentCount
          datascore1.fuelCorporateId = score.fuelCorporateId
          datascore1.corphostPhone = score.corphostPho
          datascore1.idcorporateFlag = res12.idcorporateFlag,
            datascore1.corporateFlagPurpose = res12.corporateFlagPurpose,
            datascore1.corporateFlagDealerId = res12.corporateFlagDealerId,
            datascore1.corporateIdForFlag = res12.corporateIdForFlag,
            datascore1.corporateBlockedStatus = "TRUE",
            datascore1.isDealerIDForFlag = "REMOVE",
            datascore1.FuelVeelsId = res12.FuelVeelsId;

          this.allCreditAccByDealerList1 = this.allCreditAccByDealerList1.filter(function (jsonObject1: any) {
            return jsonObject1.idcorporateFlag != res12.idcorporateFlag;
          });
          this.allCreditAccByDealerList1 = this.allCreditAccByDealerList1.filter(function (jsonObject1: any) {
            return jsonObject1.corporateIdForFlag != res12.corporateIdForFlag;
          });
          this.allCreditAccByDealerList1.push(datascore1)
        }
      })
    })
    this.allCreditAccByDealerList1 = this.allCreditAccByDealerList1.sort((a: any, b: any) => (a.companyName < b.companyName ? -1 : 1))
    this.allCreditAccByDealer = this.allCreditAccByDealerList1
  }

  creditSales() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.allCreditReq = [];
      this.allCreditReqDataa = [];
      this.allCreditReqExcel = []
      if (this.fuelDealerId) {
        this.spinner.show()
        this.IsDealerId = true;
        let creditArr = []
        let data = {
          fuelDealerId: this.fuelDealerId,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        }
        this.post.getFuelCreditRequestByfuelDealerId(data)
          .subscribe(res => {
            if (res.data.length) {
              creditArr = []
              creditArr = Object.values(res.data.reduce((acc: any, cur: any) => Object.assign(acc, { [cur.fuelCreditId]: cur }), {}))
              this.allCreditSalesDetails = creditArr.sort((a: any, b: any) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
              this.allCreditReq = this.allCreditSalesDetails.sort((a: any, b: any) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
              this.allCreditReqDataa = this.allCreditReq;
              this.productWiseCRAmt = res.data1;
              this.allCreditReqData = this.allCreditReq;
              this.pageLength = this.allCreditReq.length;
              this.allCreditReqExcel = this.allCreditReq;
              this.spinner.hide()
              this.cd.detectChanges();
            } else {
              alert("Data not found!")
              this.spinner.hide()
              this.cd.detectChanges();
            }
          });
      } else {
        this.spinner.show()
        this.IsDealerId = false;
        let creditArr = []
        let data = {
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        }
        this.post.getAllCrwithoutDealerIdPOST(data)
          .subscribe(res => {
            if (res.data.length) {
              creditArr = []
              creditArr = Object.values(res.data.reduce((acc: any, cur: any) => Object.assign(acc, { [cur.fuelCreditId]: cur }), {}))
              this.allCreditSalesDetails = creditArr.sort((a: any, b: any) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
              this.allCreditReq = this.allCreditSalesDetails.sort((a: any, b: any) => (a.estimatedRefuelDate > b.estimatedRefuelDate ? -1 : 1 && a.fuelCreditId > b.fuelCreditId ? -1 : 1));
              this.allCreditReqDataa = this.allCreditReq;
              this.productWiseCRAmt = res.data1;
              this.allCreditReqData = this.allCreditReq;
              this.pageLength = this.allCreditReq.length;
              this.allCreditReqExcel = this.allCreditReq;
              this.dealerIdCombine()
              this.spinner.hide()
              this.cd.detectChanges();
            } else {
              alert("Data not found!")
              this.spinner.hide()
              this.cd.detectChanges();
            }
          });
      }
    } else {
      alert('startDate and End Date Required');
    }
  }

  dealerIdCombine() {
    this.spinner.show()
    this.allCreditReq = []
    this.allCreditReqExcel = [];
    this.allCreditReqDataa.map((res: any) => {
      this.corporateList.map((res1: any) => {
        if (res.fuelDealerId == res1.fuelDealerId) {
          let crJson = {
            FuelVeelsId: res1.FuelVeelsId,
            veelsId: res1.FuelVeelsId,
            dealerCompany: res1.companyName,
            actualCreditQuantity: res.actualCreditQuantity,
            advMobile: res.advMobile,
            advName: res.advName,
            brandName: res.brandName,
            byManager: res.byManager,
            companyName: res.companyName,
            dealerPerson: res.dealerPerson,
            dealerPersonPhone: res.dealerPersonPhone,
            corporateReviewFlag: res.corporateReviewFlag,
            creditAmount: res.creditAmount,
            discountAmount: res.discountAmount,
            discountPrice: res.discountPrice,
            estimatedRefuelDate: res.estimatedRefuelDate,
            firstName: res.firstName,
            fleetNoFleetStatus: res.fleetNoFleetStatus,
            fuelCorporateId: res.fuelCorporateId,
            fuelCreditId: res.fuelCreditId,
            fuelDealerCustomerMapId: res.fuelDealerCustomerMapId,
            fuelDealerId: res.fuelDealerId,
            fuelProdId: res.fuelProdId,
            hostName: res.hostName,
            hostPhone: res.hostPhone,
            idcorporateFlag: res.idcorporateFlag,
            invoiceStatus: res.invoiceStatus,
            lastName: res.lastName,
            lubeName: res.lubeName,
            lubeUnit: res.lubeUnit,
            managerName: res.managerName,
            managerPersonId: res.managerPersonId,
            managerVPPersonId: res.managerVPPersonId,
            manualCrNumber: res.manualCrNumber,
            mappingCompanyName: res.mappingCompanyName,
            mappingCustomerName: res.mappingCustomerName,
            mappingPreviousStatus: res.mappingPreviousStatus,
            payByMethod: res.payByMethod,
            payStatus: res.payStatus,
            paymentDate: res.paymentDate,
            paymentTransactionNo: res.paymentTransactionNo,
            phone1: res.phone1,
            productCategory: res.productCategory,
            productCode: res.productCode,
            productName: res.productName,
            productRate: res.productRate,
            purpose: res.purpose,
            refuelForDriver: res.refuelForDriver,
            reqCreditAmount: res.reqCreditAmount,
            reqQuantity: res.reqQuantity,
            transDateTime: res.transDateTime,
            transactionStatus: res.transactionStatus,
            vehicleId: res.vehicleId,
            vehicleNumber: res.vehicleNumber,
            vehicleVPStatus: res.vehicleVPStatus
          }
          this.allCreditReq.push(crJson)
          this.allCreditReqExcel.push(crJson)
        }
        this.spinner.hide()
        this.cd.detectChanges();
      })
    })
  }

  creditTxnPayment(loginCorporateId: any) {
    if (loginCorporateId) {
      this.spinner.show()
      this.isCreditPayment = true;
      let data = {
        corporateId: loginCorporateId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }
      this.post.getAllCRPaymentByDealer(data)
        .subscribe(res => {
          if (res.status == "OK") {
            if (res.data.length) {
              this.crPaymentDetails = res.data;
            }
            else {
              alert("Don't have any Credit Payment in this Month!")
            }
            this.spinner.hide()
            this.cd.detectChanges();
          }
          else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else {
      this.spinner.show()
      this.isCreditPayment = false;
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }
      this.post.getAllCRPaymentByDealer(data)
        .subscribe(res => {
          if (res.status == "OK") {
            if (res.data.length) {
              this.crPaymentDetailsData = res.data;
              this.creditPaymentJson(this.crPaymentDetailsData)
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
  }

  creditTxnPayment1(loginCorporateId: any) {
    if (loginCorporateId) {
      this.spinner.show()
      this.isCreditPayment = true;
      let data = {
        corporateId: loginCorporateId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }
      this.post.getAllCRPaymentByDealer(data)
        .subscribe(res => {
          if (res.status == "OK") {
            if (res.data.length) {
              this.crPaymentDetails = res.data;
            }
            else {
            }
            this.spinner.hide()
            this.cd.detectChanges();
          }
          else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else {
      this.spinner.show()
      this.isCreditPayment = false;
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }
      this.post.getAllCRPaymentByDealer(data)
        .subscribe(res => {
          if (res.status == "OK") {
            if (res.data.length) {
              this.crPaymentDetailsData = res.data;
              this.creditPaymentJson(this.crPaymentDetailsData)
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
  }

  creditPaymentJson(crPaymentDetails: any) {
    crPaymentDetails.map((res: any) => {
      this.corporateList.map((res1: any) => {
        if (res.fuelDealerId == res1.fuelDealerId) {
          let paymentJson = {
            FuelVeelsId: res1.FuelVeelsId,
            veelsId: res1.FuelVeelsId,
            dealerCompany: res1.companyName,
            brandName: res1.brandName,
            accountNumber: res.accountNumber,
            accountTransacLogId: res.accountTransacLogId,
            avgPayment: res.avgPayment,
            bankDetailsId: res.bankDetailsId,
            bankName: res.bankName,
            byManager: res.byManager,
            chequeDate: res.chequeDate,
            chequeNO: res.chequeNO,
            dealerPerson: res.dealerPerson,
            dealerPersonPhone: res.dealerPersonPhone,
            companyName: res.companyName,
            fuelDealerCustomerMapId: res.fuelDealerCustomerMapId,
            fuelDealerId: res.fuelDealerId,
            grandTotalAmount: res.grandTotalAmount,
            hostName: res.hostName,
            hostPhone: res.hostPhone,
            managerName: res.managerName,
            managerPersonId: res.managerPersonId,
            managerVPPersonId: res.managerVPPersonId,
            mappingCompanyName: res.mappingCompanyName,
            mappingCustomerName: res.mappingCustomerName,
            mappingPreviousStatus: res.mappingPreviousStatus,
            paymentMethod: res.paymentMethod,
            pendingDays: res.pendingDays,
            transacDate: res.transacDate,
            transactionPurpose: res.transactionPurpose
          }
          this.crPaymentDetails.push(paymentJson)
        }
      })
    })
  }

  downloadExcel() {
    this.allCreditAccByDealerListDetails.length = 0;
    this.allActiveCreditAccByDealer.map((res: any) => {
      if ((Number(res.totalCRAmt) - Number(res.totalDiscount) - Number(res.totalInvPaidAmt) + Number(res.previousOutstand)) < 0) {
        this.netOutstanding1 = ((Number(res.totalCRAmt) - Number(res.totalDiscount) - Number(res.totalInvPaidAmt) + Number(res.previousOutstand)) * (-1));
        this.netOutstanding = Number(this.netOutstanding1).toFixed(2) + 'CR'
      } else {
        this.netOutstanding1 = (Number(res.totalCRAmt) - Number(res.totalDiscount) - Number(res.totalInvPaidAmt) + Number(res.previousOutstand));
        this.netOutstanding = Number(this.netOutstanding1).toFixed(2)
      }

      var json = {
        VeelsID: this.FuelVeelsId,
        petrolPumpName: this.companyName,
        oilCompany: this.brandName,
        MappedDate: moment(res.mappingCreatedDate).format("DD-MM-YYYY"),
        CustomerName: res.companyName,
        CustPersonName: res.hostName,
        CustPersonMobile: res.hostPhone,
        CreditLimit: res.maxCreditAmount,
        creditDayLimit: res.creditDayLimit,
        TotalPurchase: res.totalCRAmt,
        TotalPayment: res.totalInvPaidAmt,
        TotalDiscount: res.totalDiscount,
        NetOutstanding: this.netOutstanding,
        pendingDays: res.pendingDays
      };
      this.allCreditAccByDealerListDetails.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.allCreditAccByDealerListDetails,
      "ActiveCustomersReport"
    );
  }
  downloadExcelForTxnCredit() {
    this.allCreditReqExcelListDetails = []
    if (this.filterForm.value.selectedCorp == '') {
      this.allCreditReqExcel.map((res: any) => {
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
            this.vehicle = res.advName + ' ' + res.advMobile
            this.productName = 'ADVANCE'
            this.actualCreditQuantity = '-'
          }
        }

        if (res.byManager == 'FALSE') {
          this.createdBy = res.firstName + ' ' + res.lastName
        } else {
          this.createdBy = res.managerName
        }
        var json = {
          VeelsID: res.FuelVeelsId,
          petrolPumpName: res.dealerCompany,
          oilCompany: res.brandName,
          DealerPersonName: res.dealerPerson,
          DealerPersonMobile: res.dealerPersonPhone,
          Date: moment(res.estimatedRefuelDate).format('DD-MM-YYYY'),
          CustomerName: res.companyName,
          CustPersonName: res.hostName,
          CustPersonMobile: res.hostPhone,
          Ref_Bill_No: res.manualCrNumber,
          VehicleNo_OtherDetails: this.vehicle,
          Product: this.productName,
          CreditQuantity: this.actualCreditQuantity,
          CreditAmount: res.creditAmount,
          CreatedBy: this.createdBy,
        };
        this.allCreditReqExcelListDetails.push(json);
      });
    } else {
      this.allCreditReqExcel.map((res: any) => {
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
            this.vehicle = res.advName + ' ' + res.advMobile
            this.productName = 'ADVANCE'
            this.actualCreditQuantity = '-'
          }
        }
        if (res.byManager == 'FALSE') {
          this.createdBy = res.firstName + ' ' + res.lastName
        } else {
          this.createdBy = res.managerName
        }
        var json = {
          VeelsID: this.FuelVeelsId,
          petrolPumpName: this.companyName,
          oilCompany: this.brandName,
          DealerPersonName: res.dealerPerson,
          DealerPersonMobile: res.dealerPersonPhone,
          Date: moment(res.estimatedRefuelDate).format('DD-MM-YYYY'),
          CustomerName: res.companyName,
          CustPersonName: res.hostName,
          CustPersonMobile: res.hostPhone,
          Ref_Bill_No: res.manualCrNumber,
          VehicleNo_OtherDetails: this.vehicle,
          Product: this.productName,
          CreditQuantity: this.actualCreditQuantity,
          CreditAmount: res.creditAmount,
          CreatedBy: this.createdBy,
        };
        this.allCreditReqExcelListDetails.push(json);
      });
    }
    this.excelService.exportAsExcelFile(
      this.allCreditReqExcelListDetails,
      "txn-wiseCreditSalesReport"
    );
  }

  excelDownload() {
    this.paymentDetails.length = 0
    if (this.filterForm.value.selectedCorp == '') {
      this.crPaymentDetails.map((res: any) => {
        if (res.byManager == 'FALSE') {
          this.createdBy = res.hostName
        } else {
          this.createdBy = res.managerName
        }
        let json = {
          VeelsID: res.FuelVeelsId,
          petrolPumpName: res.dealerCompany,
          oilCompany: res.brandName,
          DealerPersonName: res.dealerPerson,
          DealerPersonMobile: res.dealerPersonPhone,
          Date: moment(res.transacDate).format("DD-MM-YYYY"),
          CustomerName: res.companyName,
          CustPersonName: res.hostName,
          CustPersonMobile: res.hostPhone,
          PaymentMode: res.paymentMethod,
          Amount: Number(res.grandTotalAmount),
          PendingDays: res.pendingDays,
          CreatedBy: this.createdBy,
          Account: res.bankName + ' ' + res.accountNumber,
          PaymentScore: Number(res.avgPayment).toFixed(0),
        };
        this.paymentDetails.push(json);
      });
    } else {
      this.crPaymentDetails.map((res: any) => {
        if (res.byManager == 'FALSE') {
          this.createdBy = res.hostName
        } else {
          this.createdBy = res.managerName
        }
        let json = {
          VeelsID: this.FuelVeelsId,
          petrolPumpName: this.companyName,
          oilCompany: this.brandName,
          DealerPersonName: res.dealerPerson,
          DealerPersonMobile: res.dealerPersonPhone,
          Date: moment(res.transacDate).format("DD-MM-YYYY"),
          CustomerName: res.companyName,
          CustPersonName: res.hostName,
          CustPersonMobile: res.hostPhone,
          PaymentMode: res.paymentMethod,
          Amount: Number(res.grandTotalAmount),
          PendingDays: res.pendingDays,
          CreatedBy: this.createdBy,
          Account: res.bankName + ' ' + res.accountNumber,
          PaymentScore: Number(res.avgPayment).toFixed(0),
        };
        this.paymentDetails.push(json);
      });
    }
    this.excelService.exportAsExcelFile(
      this.paymentDetails,
      "CreditPaymentReport"
    );
  }

  getFirstSixMonthPetrolPumpName() {
    this.spinner.show()
    let data = {};
    this.post.getFirstSixMonthPetrolPumpNamePOST(data)
      .subscribe((res) => {
        if (res.status == 'OK') {
          this.firstSixMonthsPetrolPumpList1 = res.data1[0].NumberOfDealerInMonth
          this.firstSixMonthsPetrolPumpList2 = res.data2[0].NumberOfDealerInMonth
          this.firstSixMonthsPetrolPumpList3 = res.data3[0].NumberOfDealerInMonth
          this.firstSixMonthsPetrolPumpList4 = res.data4[0].NumberOfDealerInMonth
          this.firstSixMonthsPetrolPumpList5 = res.data5[0].NumberOfDealerInMonth
          this.firstSixMonthsPetrolPumpList6 = res.data6[0].NumberOfDealerInMonth
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
         }
      });
  }

  getLastSixMonthPetrolPumpName() {
    this.spinner.show()
    let data = {};
    this.post.getLastSixMonthPetrolPumpNamePOST(data)
      .subscribe((res) => {
        if (res.status == 'OK') {
          this.firstSixMonthsPetrolPumpList7 = res.data1[0].NumberOfDealerInMonth
          this.firstSixMonthsPetrolPumpList8 = res.data2[0].NumberOfDealerInMonth
          this.firstSixMonthsPetrolPumpList9 = res.data3[0].NumberOfDealerInMonth
          this.firstSixMonthsPetrolPumpList10 = res.data4[0].NumberOfDealerInMonth
          this.firstSixMonthsPetrolPumpList11 = res.data5[0].NumberOfDealerInMonth
          this.firstSixMonthsPetrolPumpList12 = res.data6[0].NumberOfDealerInMonth
          this.spinner.hide()
          this.cd.detectChanges();
        } else { 
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  getFirstSixMonthCustomerName() {
    this.spinner.show()
    let data = {};
    this.post.getFirstSixMonthCustomerNamePOST(data)
      .subscribe((res) => {
        if (res.status == 'OK') {
          this.firstSixMonthsCustomerList1 = res.data1[0].NumberOfCustomerInMonth
          this.firstSixMonthsCustomerList2 = res.data2[0].NumberOfCustomerInMonth
          this.firstSixMonthsCustomerList3 = res.data3[0].NumberOfCustomerInMonth
          this.firstSixMonthsCustomerList4 = res.data4[0].NumberOfCustomerInMonth
          this.firstSixMonthsCustomerList5 = res.data5[0].NumberOfCustomerInMonth
          this.firstSixMonthsCustomerList6 = res.data6[0].NumberOfCustomerInMonth
          this.spinner.hide()
          this.cd.detectChanges();
        } else { 
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  getLastSixMonthCustomerName() {
    this.spinner.show()
    let data = {
    };
    this.post.getLastSixMonthCustomerNamePOST(data)
      .subscribe((res) => {
        if (res.status == 'OK') {
          this.firstSixMonthsCustomerList7 = res.data1[0].NumberOfCustomerInMonth
          this.firstSixMonthsCustomerList8 = res.data2[0].NumberOfCustomerInMonth
          this.firstSixMonthsCustomerList9 = res.data3[0].NumberOfCustomerInMonth
          this.firstSixMonthsCustomerList10 = res.data4[0].NumberOfCustomerInMonth
          this.firstSixMonthsCustomerList11 = res.data5[0].NumberOfCustomerInMonth
          this.firstSixMonthsCustomerList12 = res.data6[0].NumberOfCustomerInMonth
          this.spinner.hide()
          this.cd.detectChanges();
        } else { 
          this.spinner.hide()
          this.cd.detectChanges();
        }
      });
  }

  getAllDealerAndCustumerCount() {
    this.spinner.show()
    let data = {}
    this.post.getDealerAndCustomerPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.allDealerCount = res.data[0].NumberOfDealerInAll
          this.allCustomerCount = res.data1[0].NumberOfCustomerInAll
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  getFirstSixMonthActivePumpCount() {
    this.spinner.show()
    let data = {}
    this.post.getFirstSixMonthActivePumpNamePOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.allActiveDealer1 = res.data1.length
          this.allActiveDealer2 = res.data2.length
          this.allActiveDealer3 = res.data3.length
          this.allActiveDealer4 = res.data4.length
          this.allActiveDealer5 = res.data5.length
          this.allActiveDealer6 = res.data6.length
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  getLastSixMonthActivePumpCount() {
    this.spinner.show()
    let data = {
    }
    this.post.getLastSixMonthActivePumpNamePost(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.allActiveDealer7 = res.data1.length
          this.allActiveDealer8 = res.data2.length
          this.allActiveDealer9 = res.data3.length
          this.allActiveDealer10 = res.data4.length
          this.allActiveDealer11 = res.data5.length
          this.allActiveDealer12 = res.data6.length
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }


  getFirstSixMonthActiveCustomer() {
    this.spinner.show()
    let data1 = []
    let data2 = []
    let data3 = []
    let data4 = []
    let data5 = []
    let data6 = []

    let data = {
    }
    this.post.getFirstSixMonthActiveCustomerNamePost(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.allActiveCustomer1 = res.data1
          data1 = Object.values(this.allActiveCustomer1.reduce((acc:any, cur:any) => Object.assign(acc, { [cur.fuelCorporateId]: cur }), {}))
          this.allActiveCustomer1Length = data1.length
          this.allActiveCustomer2 = res.data2
          data2 = Object.values(this.allActiveCustomer2.reduce((acc:any, cur:any) => Object.assign(acc, { [cur.fuelCorporateId]: cur }), {}))
          this.allActiveCustomer2Length = data2.length
          this.allActiveCustomer3 = res.data3
          data3 = Object.values(this.allActiveCustomer3.reduce((acc:any, cur:any) => Object.assign(acc, { [cur.fuelCorporateId]: cur }), {}))
          this.allActiveCustomer3Length = data3.length
          this.allActiveCustomer4 = res.data4
          data4 = Object.values(this.allActiveCustomer4.reduce((acc:any, cur:any) => Object.assign(acc, { [cur.fuelCorporateId]: cur }), {}))
          this.allActiveCustomer4Length = data4.length
          this.allActiveCustomer5 = res.data5
          data5 = Object.values(this.allActiveCustomer5.reduce((acc:any, cur:any) => Object.assign(acc, { [cur.fuelCorporateId]: cur }), {}))
          this.allActiveCustomer5Length = data5.length
          this.allActiveCustomer6 = res.data6
          data6 = Object.values(this.allActiveCustomer6.reduce((acc:any, cur:any) => Object.assign(acc, { [cur.fuelCorporateId]: cur }), {}))
          this.allActiveCustomer6Length = data6.length
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  getLastSixMonthActiveCustomer() {
    this.spinner.show()
    let data7 = []
    let data8 = []
    let data9 = []
    let data10 = []
    let data11 = []
    let data12 = []
    let data = {
    }
    this.post.getLastSixMonthActiveCustomerNamePost(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.allActiveCustomer7 = res.data1
          data7 = Object.values(this.allActiveCustomer7.reduce((acc:any, cur:any) => Object.assign(acc, { [cur.fuelCorporateId]: cur }), {}))
          this.allActiveCustomer7Length = data7.length

          this.allActiveCustomer8 = res.data2
          data8 = Object.values(this.allActiveCustomer8.reduce((acc:any, cur:any) => Object.assign(acc, { [cur.fuelCorporateId]: cur }), {}))
          this.allActiveCustomer8Length = data8.length

          this.allActiveCustomer9 = res.data3
          data9 = Object.values(this.allActiveCustomer9.reduce((acc:any, cur:any) => Object.assign(acc, { [cur.fuelCorporateId]: cur }), {}))
          this.allActiveCustomer9Length = data9.length

          this.allActiveCustomer10 = res.data4
          data10 = Object.values(this.allActiveCustomer10.reduce((acc:any, cur:any) => Object.assign(acc, { [cur.fuelCorporateId]: cur }), {}))
          this.allActiveCustomer10Length = data10.length

          this.allActiveCustomer11 = res.data5
          data11 = Object.values(this.allActiveCustomer11.reduce((acc:any, cur:any) => Object.assign(acc, { [cur.fuelCorporateId]: cur }), {}))
          this.allActiveCustomer11Length = data11.length

          this.allActiveCustomer12 = res.data6
          data12 = Object.values(this.allActiveCustomer12.reduce((acc:any, cur:any) => Object.assign(acc, { [cur.fuelCorporateId]: cur }), {}))
          this.allActiveCustomer12Length = data12.length
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }


}
