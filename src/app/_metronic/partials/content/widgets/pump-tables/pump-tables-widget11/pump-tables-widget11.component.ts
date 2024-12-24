import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbModal, NgbDatepickerConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { StatsService } from '../../stats/stats.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { PumpTablesService } from '../pump-tables.services';
import { Adv_TablesService } from '../../advance-tables/adv_tables.services';
import { ListWidgetService } from '../../lists/listWidget.services';

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
  selector: 'app-pump-tables-widget11',
  templateUrl: './pump-tables-widget11.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class PumpTablesWidget11Component implements OnInit {

  addShiftForm = new FormGroup({
    date: new FormControl(''),
    operatorStaffId: new FormControl('', Validators.required),
    startTime: new FormControl(''),
    stopTime: new FormControl(''),
    shiftTimeId: new FormControl('1', Validators.required),
  });
  fuelDealerId: any;
  dealerCorporateId: any;
  userId: any;
  acceesGroup: any;
  dealerMobile: any;
  dealerLoginVPId: any;
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: string;
  userName: string;
  allShift: any = [];
  selectedDate: string;
  todayDate = new Date();
  ongoingShiftList: any = [];
  isOngoingShiftList: boolean = false;
  digitalDetails: any = [];
  digitalTotalSales: number;
  cashHandOverAmount: number;
  digitalLubeData: any = [];
  digitalLubeTotalAmt: any;
  digitalLubeTotalQuantity: any;
  creditPaymentDetails: any = [];
  meterSalesSum: number;
  meterSalesQuantitySum: number;
  tallySalesSum: any;
  tallySalesDetails: any = [];
  totalAmountTally: number;
  totalSalesDetails: any = [];
  cashSales: number;
  digitalSales: number;
  creditSales: number;
  creditDetails: any = [];
  lubeDetails: any = [];
  advAmtDetails: any = [];
  totalLubeAmt: number;
  totalLubeKgQuantity: number;
  totalLubeLtrQuantity: number;
  totalAdvAmt: number;
  lubeCrDetails: any = [];
  lubeCashDetails: any = [];
  lubeCashTotalAmt: any;
  lubeCashTotalQuan: any;
  lubeCashTotalUnit: any;
  totalLubeCashQuantityInPiece: number;
  totalLubeQuantityInPiece: number;
  meterSalesDetails: any = [];
  creditSalesProductwise: any = [];
  totalMeterSalesDetails: number;
  productWiseCreditData: any = [];
  totalCreditSalesAmount: number;
  totalCreditWOCNGQuantity: number;
  totalCreditCNGQuantity: number;
  totalCashLubeDetails: any = [];
  totalCreditLubeDetails: any = [];
  totalDigitalLubeDetails: any = [];
  totalcrSalesDetails: number;
  crSalesDetails: any = [];
  totalcrPaymentDetails: number;
  meterSalesAmount: any = [];
  shiftWiseData: any = [];
  shiftDetails: any = [];
  shiftNzDetails: any = [];
  totalNzDetails: any = [];
  totalLubeCash: any = [];
  totalLubeCredit: any = [];
  totalLubeDigital: any = [];
  totalCreditSales: number;
  totalCreditPayment: number;
  routeView: string;
  dateView: any;
  shiftTimeId: any;
  endDate: string;
  startDate: string;
  companyName: any;
  brandName: any;
  city: any;

  constructor(
    private modalService: NgbModal,
    private post: PumpTablesService,
    private post1: Adv_TablesService,
    private post2: ListWidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    this.routeView = JSON.parse(localStorage.getItem('address') || '{}');
    this.dateView = JSON.parse(localStorage.getItem('reportDate') || '{}');
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    var dealerData = JSON.parse(localStorage.getItem("dealerData") || '{}');
    var managerData = JSON.parse(localStorage.getItem("managerData") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.userId = element.userId;
    this.acceesGroup = element.accessGroupId;
    this.dealerMobile = element.phone1;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.userName = element.firstName + ' ' + element.lastName;
    this.acceesGroup = element.accessGroupId;
    if (this.acceesGroup == '12') {
      this.companyName = dealerData.companyName
      this.brandName = dealerData.brandName
      this.city = dealerData.city
    }

    if (this.acceesGroup == '14') {
      this.companyName = managerData.companyName
      this.brandName = managerData.brandName
      this.city = managerData.city
    }

    this.shiftTimeId = this.post2.shiftTimeId;
    this.endDate = this.post2.endDate;
    this.startDate = this.post2.startDate;
    if (this.post2.setRoute == "Book") {
      this.addShiftForm.controls["date"].setValue(moment(this.post2.setDate).format("DD-MM-YYYY"))
      this.getAllOngoingShift(this.fuelDealerId);
    } else {
      if (this.routeView == "ViewSummary") {
        this.addShiftForm.controls["date"].setValue(moment(this.dateView).format("DD-MM-YYYY"))
        this.getAllOngoingShift(this.fuelDealerId);
      } else if (this.routeView == "ShiftBook") {
        this.shiftTimeId = this.shiftTimeId
      } else {
        this.addShiftForm.controls['date'].setValue(moment(new Date()).format('DD-MM-YYYY'));
        this.getAllOngoingShift(this.fuelDealerId);
      }
    }
    this.cd.detectChanges()
  }

  back() {
    // this.post.setNavigate(moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),'Book')
    this.router.navigate(['/shift/addShift']);

  }

  getAllOngoingShift(fuelDealerId: any) {
    this.spinner.show()

    this.selectedDate = moment(this.addShiftForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
    const data = {
      dealerId: fuelDealerId,    //Need this.fuelDealerId "PRAMOD"
      date: moment(this.addShiftForm.value.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),

    };
    this.post2.getShiftOngoingDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.allShift = res.data;
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });

    this.shiftReport()
  }


  shiftReport() {
    this.getAllOngoingShiftForClose(this.fuelDealerId)
    this.getDigitalTotalByDate(this.dealerCorporateId);
    this.getFuelCreditPaymentByDate(this.dealerCorporateId)
    this.getTotalMeterSalesAndTallyEntery(this.fuelDealerId);
    this.getTallyDetails(this.fuelDealerId);
    this.getFuelCreditByDate(this.fuelDealerId);
    this.getSalesDetailsProductWise(this.fuelDealerId);
    this.getCRDetailsProductWise(this.fuelDealerId);
    this.getShiftWiseDetails(this.fuelDealerId);
    this.getNzWise(this.fuelDealerId);
    this.getTotalCreditSalesPaymentByDay(this.fuelDealerId);
  }

  getAllOngoingShiftForClose(fuelDealerId: any) {
    this.spinner.show()
    this.ongoingShiftList = []
    const data = {
      dealerId: fuelDealerId,
    };
    this.post.getShiftOngoingOPENDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data.length) {
            this.isOngoingShiftList = true;
            this.ongoingShiftList = res.data;
          } else {
            this.isOngoingShiftList = false;
          }
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.isOngoingShiftList = false;
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getDigitalTotalByDate(dealerCorporateId: any) {
    this.spinner.show()
    this.digitalDetails.length = 0
    this.digitalTotalSales = 0
    this.cashHandOverAmount = 0
    const data = {
      corporateId: dealerCorporateId,
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post2.getDigitalTotalByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.digitalDetails = res.data;
          this.digitalTotalSales = res.data1[0].digitalEntry
          this.cashHandOverAmount = res.data2[0].totalAmount
          this.digitalLubeData = res.data3;
          this.digitalLubeTotalAmt = res.data4[0].totalAmount;
          this.digitalLubeTotalQuantity = res.data4[0].totalQuantity;
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getFuelCreditPaymentByDate(dealerCorporateId: any) {
    this.spinner.show()
    this.creditPaymentDetails.length = 0
    const data = {
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      corporateId: dealerCorporateId,
    };
    this.post2.getFuelCreditPaymentByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.creditPaymentDetails = res.data;
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getTotalMeterSalesAndTallyEntery(fuelDealerId: any) {
    this.spinner.show()
    this.meterSalesSum = 0
    this.meterSalesSum = 0
    this.meterSalesQuantitySum = 0
    const data = {
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
    };
    this.post.getTotalMeterSalesAndTallyEnteryPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.meterSalesSum = res.data[0].meterSaleAmount;
          this.tallySalesSum = res.data1[0].tallySaleAmount;
          this.meterSalesQuantitySum = res.data[0].meterSaleQuantity;
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getTallyDetails(fuelDealerId: any) {
    this.spinner.show()
    this.tallySalesDetails = [];
    this.totalSalesDetails = []
    this.cashSales = 0
    this.digitalSales = 0
    this.creditSales = 0
    this.totalAmountTally = 0
    const data = {
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
    };
    this.post2.getShiftVStallyByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.tallySalesDetails = res.data;
          this.totalSalesDetails = res.data1;
          this.cashSales = Number(res.data1[0].cashTallyAmt) - Number(res.data1[0].expenseAmt) - Number(res.data1[0].shortAmt)
          this.digitalSales = res.data1[0].paytmTotal
          this.creditSales = res.data1[0].creditTally
          this.totalAmountTally = res.data1[0].totalAmountTally;
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getFuelCreditByDate(fuelDealerId: any) {
    this.spinner.show()
    this.creditDetails = []
    this.lubeDetails = []
    this.advAmtDetails = []
    this.totalLubeAmt = 0
    this.totalLubeKgQuantity = 0
    this.totalLubeLtrQuantity = 0
    this.totalAdvAmt = 0
    const data = {
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
    };
    this.post2.getFuelCreditByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.creditDetails = res.data2;
          this.lubeDetails = res.data3;
          this.advAmtDetails = res.data4;
          this.lubeCrDetails = res.data11;
          this.lubeCashDetails = res.data9;
          this.lubeCashTotalAmt = res.data10[0].cashBillAmount
          this.lubeCashTotalQuan = res.data10[0].cashBillQuantity
          this.lubeCashTotalUnit = res.data10[0].cashBillUnit
          this.totalLubeCashQuantityInPiece = Number(res.data10[0].quantityInPiece);
          this.totalLubeAmt = Number(res.data5[0].totalLubeAmt) + Number(res.data7[0].totalLubeAmt);
          // this.totalLubeKgQuantity = res.data5[0].totalQuantity  
          this.totalLubeLtrQuantity = res.data7[0].totalQuantity + res.data5[0].totalQuantity
          this.totalAdvAmt = Number(res.data6[0].totalAdvAmt)
          this.totalLubeQuantityInPiece = Number(res.data8[0].quantityInPieces);
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getSalesDetailsProductWise(fuelDealerId: any) {
    this.spinner.show()
    this.meterSalesDetails = [];
    this.creditSalesProductwise = []
    this.totalMeterSalesDetails = 0
    this.productWiseCreditData = []
    this.totalCreditSalesAmount = 0
    this.totalCreditWOCNGQuantity = 0
    this.totalCreditCNGQuantity = 0

    let data = {
      fuelDealerId: fuelDealerId,
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post2.getMETERSALESTotalDSRPOST(data)
      .subscribe((res) => {
        if (res.status == "OK") {
          this.meterSalesDetails = res.data;
          this.totalMeterSalesDetails = res.data1[0].meterSaleAmount + res.data7[0].totalCashAmount + res.data8[0].totalCreditAmount + res.data9[0].totalDigitalSales;
          this.creditSalesProductwise = res.data2
          this.totalCashLubeDetails = res.data5
          this.totalCreditLubeDetails = res.data6
          this.totalDigitalLubeDetails = res.data10

          this.totalCreditSalesAmount = Number(res.data3[0].totalCreditSales) + Number(res.data4[0].totalCreditSales)
          this.totalCreditWOCNGQuantity = Number(res.data3[0].totalCreditQuantity)
          this.totalCreditCNGQuantity = Number(res.data4[0].totalCreditQuantity)

          this.meterSalesDetails.map((shift: { fuelProductId: string; productName: string; meterSaleAmount: number; meterSaleQuantity: number; totalPumpTesting: number; }) => {
            const shiftDataJSON = {
              fuelProductId: '',
              productName: '',
              meterSaleQuantity: 0,
              meterSaleAmount: 0,
              totalCreditSales: 0,
              totalCreditQuantity: 0,
              creditSaleShare: 0,
              creditQuantityShare: 0,
              totalPumpTesting: 0,
            };

            shiftDataJSON.fuelProductId = shift.fuelProductId;
            shiftDataJSON.productName = shift.productName;
            shiftDataJSON.meterSaleAmount = shift.meterSaleAmount;
            shiftDataJSON.meterSaleQuantity = shift.meterSaleQuantity;
            shiftDataJSON.totalPumpTesting = shift.totalPumpTesting;

            this.creditSalesProductwise.map((credit: { fuelProdId: string; totalCreditQuantity: number; totalCreditSales: number; }) => {
              if (credit.fuelProdId == shift.fuelProductId) {
                shiftDataJSON.totalCreditQuantity = credit.totalCreditQuantity;
                shiftDataJSON.totalCreditSales = credit.totalCreditSales;
                shiftDataJSON.creditQuantityShare = Number(credit.totalCreditQuantity) / Number(shift.meterSaleQuantity);
                shiftDataJSON.creditSaleShare = Number(credit.totalCreditSales) / Number(shift.meterSaleAmount);
              }
            })
            this.productWiseCreditData.push(shiftDataJSON);
            this.spinner.hide()
            this.cd.detectChanges()
          })
        }
      });
  }

  getCRDetailsProductWise(fuelDealerId: any) {
    this.spinner.show()
    this.crSalesDetails = [];
    this.totalcrSalesDetails = 0;
    this.totalcrPaymentDetails = 0
    let data = {
      fuelDealerId: fuelDealerId,
      corporateId: this.dealerCorporateId,
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post.getCRSALESProductWiseDSRPOST(data)
      .subscribe((res) => {
        if (res.status == "OK") {
          this.crSalesDetails = res.data;
          this.totalcrSalesDetails = res.data1[0].creditAmountTotal;
          this.totalcrPaymentDetails = res.data2[0].totalcrPayment;
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getShiftWiseDetails(fuelDealerId: any) {
    this.spinner.show()
    this.shiftWiseData.length = 0;
    this.meterSalesAmount = [];
    this.shiftDetails = []
    const data = {
      dealerId: fuelDealerId,
      startDate: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'), //startDate,
      endDate: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post2.getShiftWiseBookDetailsPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.meterSalesAmount = res.data;
        this.shiftDetails = res.data1;

        this.shiftDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; totalCashTally: number; paytmTotalAmount: number; totalCreditTally: number; expenseAmount: number; shortamount: number; totalAmountTally: number; fuelShiftTimeShiftName: string; fuelShiftTimeDetails: string; expenseAmtDetails: string; }) => {
          const dataPAYJson = {
            openDate: '',
            name: '',
            meterSaleAmount: 0,
            cash: 0,
            digital: 0,
            credit: 0,
            expenses: 0,
            short: 0,
            shiftTally: 0,
            shiftTime: '',
            differnece: 0,
            cashHandOver: 0,
            expenseAmtDetails: ''
          };

          dataPAYJson.openDate = moment(shift.openDate).format("YYYY-MM-DD");
          dataPAYJson.name = shift.firstName + ' ' + shift.lastName;
          dataPAYJson.cash = shift.totalCashTally;
          dataPAYJson.digital = shift.paytmTotalAmount;
          dataPAYJson.credit = shift.totalCreditTally;
          dataPAYJson.expenses = shift.expenseAmount;
          dataPAYJson.short = shift.shortamount;
          dataPAYJson.shiftTally = shift.totalAmountTally;
          if (shift.fuelShiftTimeShiftName != '') {
            dataPAYJson.shiftTime = shift.fuelShiftTimeShiftName;
          } else {
            dataPAYJson.shiftTime = shift.fuelShiftTimeDetails;
          }//shift.fuelShiftTimeDetails+' '+shift.fuelShiftTimeShiftName
          dataPAYJson.cashHandOver = Number(shift.totalCashTally) - Number(shift.shortamount) - Number(shift.expenseAmount);
          dataPAYJson.meterSaleAmount = shift.totalAmountTally;
          dataPAYJson.differnece = dataPAYJson.shiftTally - dataPAYJson.meterSaleAmount;
          dataPAYJson.expenseAmtDetails = shift.expenseAmtDetails

          //   this.meterSalesAmount.map(sales => {
          //     if (sales.fuelShiftDetailsId == shift.idfuelShiftDetails) {
          //         dataPAYJson.meterSaleAmount = sales.meterSaleAmount;
          //         dataPAYJson.differnece = Number(shift.totalAmountTally) - Number(sales.meterSaleAmount);
          //     }
          // })

          this.shiftWiseData.push(dataPAYJson);
          this.spinner.hide()
          this.cd.detectChanges()
        })
      } else {
        this.spinner.hide()
        this.cd.detectChanges()
      }
    });

  }

  getNzWise(fuelDealerId: any) {
    this.spinner.show()
    this.shiftNzDetails = []
    this.totalNzDetails = []
    const data = {
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      fuelDealerId: fuelDealerId,
      corporateId: this.dealerCorporateId,
    };
    this.post2.getProductWiseDSRPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.shiftNzDetails = res.data
          this.totalNzDetails = res.data1
          this.totalLubeCash = res.data3
          this.totalLubeCredit = res.data4
          this.totalLubeDigital = res.data5
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()

        }
      });
  }

  getTotalCreditSalesPaymentByDay(fuelDealerId: any) {
    this.spinner.show()
    this.totalCreditSales = 0
    this.totalCreditPayment = 0
    const data = {
      fuelDealerId: fuelDealerId,
      corporateId: this.dealerCorporateId,
      date: moment(this.addShiftForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post2.getTotalCreditSalesPaymentByDayPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.totalCreditSales = res.data[0].totalCreditSales
          this.totalCreditPayment = res.data1[0].totalCreditPayment
          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()

        }
      });
  }
}

