import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { MixedService } from '../../mixed/mixed.services';
import { StatsService } from '../../stats/stats.services';
import { ListWidgetService } from '../listWidget.services';
import moment from 'moment';

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
  selector: 'app-lists-widget6',
  templateUrl: './lists-widget6.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget6Component {
  managerName: string;
  fuelDealerId: any;
  dealerCorporateId: any;
  dealerData: any = [];
  accessGroup: any;
  pumpCity: any;
  userId: any;
  selectedDate: any;
  todayDate = new Date();
  meterSalesDetails: any = [];
  creditSalesProductwise: any = [];
  totalMeterSalesDetails: number;
  productWiseCreditData: any = [];
  totalCreditSalesAmount: number;
  totalCreditWOCNGQuantity: number;
  totalCreditCNGQuantity: number;
  totalCashAmount: any;
  totalCreditAmount: any;
  totalCashLubeDetails: any;
  totalCreditLubeDetails: any;
  totalDigitalLubeDetails: any;
  totalSalesDetails: any = [];
  tallySalesDetails: any = [];
  cashSales: number;
  digitalSales: number;
  creditSales: number;
  totalAmountTally: number;
  shiftWiseData: any;
  meterSalesAmount: any = [];
  shiftDetails: any = [];
  cashHandover: any;
  shiftNzDetails: any = [];
  totalNzDetails: any = [];
  totalLubeCash: any;
  totalLubeCredit: any;
  totalLubeDigital: any;
  cashHandOverAmount: number;
  digitalTotalSales: number;
  digitalDetails: any = [];
  digitalLubeData: any = [];
  digitalLubeTotalAmt: any;
  digitalLubeTotalQuantity: any;
  totalCreditSales: number;
  totalCreditPayment: number;
  creditDetails: any = [];
  lubeDetails: any = [];
  advAmtDetails: any = [];
  lubeCashDetails: any = [];
  totalLubeAmt: number;
  totalLubeKgQuantity: number;
  totalLubeLtrQuantity: number;
  totalAdvAmt: number;
  lubeCrDetails: any;
  lubeCashTotalAmt: any;
  lubeCashTotalQuan: any;
  lubeCashTotalUnit: any;
  totalLubeQuantityInPiece: number;
  totalLubeCashQuantityInPiece: number;
  creditPaymentDetails: any;
  keyPerson: string;
  companyName: any;
  oilCompanyName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  brandName: any;

  constructor(
    private post: ListWidgetService,
    private post1: StatsService,
    private post2: MixedService,
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

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem('dealerId') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem('dealerCorporateId') || '{}');
    this.dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.accessGroup = element.accessGroupId;
    this.managerName = element.firstName + ' ' + element.lastName;
    this.pumpCity = this.dealerData.city
    this.userId = element.userId;
    this.keyPerson = element.firstName + ' ' + element.lastName;
    this.companyName = this.dealerData.companyName
    this.oilCompanyName = this.dealerData.brandName
    this.brandName = this.dealerData.brandName
    this.state = this.dealerData.state
    this.pin = this.dealerData.pin
    this.city = this.dealerData.city
    this.phone1 = this.dealerData.hostPhone
    console.log("date", 
      this.selectedDate, this.post.date)
    // this.addShiftForm.controls['date'].setValue(moment(new Date()).format('DD-MM-YYYY'));
    // this.getAllAttendantsByDid(this.fuelDealerId)
    // this.getShiftDetails(this.fuelDealerId)

    this.shiftReport()
    this.cd.detectChanges()
  }

  shiftReport() {
    // this.getAllOngoingShiftForClose(this.fuelDealerId)
    this.getDigitalTotalByDate(this.dealerCorporateId);
    this.getFuelCreditPaymentByDate(this.dealerCorporateId)
    // this.getTotalMeterSalesAndTallyEntery(this.fuelDealerId);
    this.getTallyDetails(this.fuelDealerId);
    this.getFuelCreditByDate(this.fuelDealerId);
    this.getSalesDetailsProductWise(this.fuelDealerId);
    // this.getCRDetailsProductWise(this.fuelDealerId);
    this.getShiftWiseDetails(this.fuelDealerId);
    this.getNzWise(this.fuelDealerId);
    this.getTotalCreditSalesPaymentByDay(this.fuelDealerId);
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
      date: moment(this.selectedDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      corporateId: this.dealerCorporateId,
      date1: moment(this.selectedDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post.getMETERSALESTotalDSRPOST(data)
      .subscribe((res) => {
        if (res.status == "OK") {
          this.meterSalesDetails = res.data;
          // this.totalMeterSalesDetails = res.data1 [0].meterSaleAmount;
          this.totalMeterSalesDetails = res.data1[0].meterSaleAmount + res.data7[0].totalCashAmount + res.data8[0].totalCreditAmount + res.data9[0].totalDigitalSales;
          this.creditSalesProductwise = res.data2
          if (res.data5.length) {
            this.totalCashAmount = res.data5[0].totalCashAmount
          }
          if (res.data6.length) {
            this.totalCreditAmount = res.data6[0].totalCreditAmount
          }
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
          })
          this.cd.detectChanges()
          this.spinner.hide()
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
      date: moment(this.selectedDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      date1: moment(this.selectedDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
      corporateId: this.dealerCorporateId,
    };
    this.post.getShiftVStallyByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {

          this.tallySalesDetails = res.data;
          this.totalSalesDetails = res.data1;
          this.totalAmountTally = res.data1[0].totalAmountTally;
          this.cashSales = Number(res.data1[0].cashTallyAmt) - Number(res.data1[0].expenseAmt) - Number(res.data1[0].shortAmt)
          this.digitalSales = res.data1[0].paytmTotal
          this.creditSales = res.data1[0].creditTally

          this.spinner.hide()
          this.cd.detectChanges()
        } else {
          this.spinner.hide()
          this.cd.detectChanges()
        }
      });
  }

  getShiftWiseDetails(fuelDealerId: any) {
    this.spinner.show()
    // this.shiftWiseData.length = 0;
    this.meterSalesAmount = [];
    this.shiftDetails = []
    const data = {
      dealerId: fuelDealerId,
      startDate: moment(this.selectedDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'), //startDate,
      endDate: moment(this.selectedDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post.getShiftWiseBookDetailsPOST(data).subscribe((res) => {
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
          dataPAYJson.meterSaleAmount = shift.totalAmountTally;
          dataPAYJson.differnece = dataPAYJson.shiftTally - dataPAYJson.meterSaleAmount;
          if (shift.fuelShiftTimeShiftName != '') {
            dataPAYJson.shiftTime = shift.fuelShiftTimeShiftName;
          } else {
            dataPAYJson.shiftTime = shift.fuelShiftTimeDetails;
          }
          dataPAYJson.cashHandOver = Number(shift.totalCashTally) - Number(shift.shortamount) - Number(shift.expenseAmount);
          dataPAYJson.expenseAmtDetails = shift.expenseAmtDetails

          //   this.meterSalesAmount.map(sales => {
          //     if (sales.fuelShiftDetailsId == shift.idfuelShiftDetails) {
          //         dataPAYJson.meterSaleAmount = sales.meterSaleAmount;
          //         dataPAYJson.differnece = Number(shift.totalAmountTally);
          //     }
          // })

          this.shiftWiseData.push(dataPAYJson);
        })

        this.cashHandover = this.shiftWiseData.cashHandOver
        this.spinner.hide()
        this.cd.detectChanges()
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
      date: moment(this.selectedDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      fuelDealerId: fuelDealerId,
      corporateId: this.dealerCorporateId,
    };
    this.post.getProductWiseDSRPOST(data)
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

  getDigitalTotalByDate(dealerCorporateId: any) {
    this.spinner.show()
    // this.digitalDetails.length = 0
    this.digitalTotalSales = 0
    this.cashHandOverAmount = 0
    const data = {
      corporateId: dealerCorporateId,
      date: moment(this.selectedDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post.getDigitalTotalByDatePOST(data)
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

  getTotalCreditSalesPaymentByDay(fuelDealerId: any) {
    this.spinner.show()
    this.totalCreditSales = 0
    this.totalCreditPayment = 0
    const data = {
      fuelDealerId: fuelDealerId,
      corporateId: this.dealerCorporateId,
      date: moment(this.selectedDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post.getTotalCreditSalesPaymentByDayPOST(data)
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

  getFuelCreditByDate(fuelDealerId: any) {
    this.spinner.hide()
    this.creditDetails = []
    this.lubeDetails = []
    this.advAmtDetails = []
    this.lubeCashDetails = []
    this.totalLubeAmt = 0
    this.totalLubeKgQuantity = 0
    this.totalLubeLtrQuantity = 0
    this.totalAdvAmt = 0
    const data = {
      date: moment(this.selectedDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
    };
    this.post.getFuelCreditByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.creditDetails = res.data2;
          this.lubeDetails = res.data3;
          this.advAmtDetails = res.data4;
          this.lubeCashDetails = res.data9;
          this.lubeCrDetails = res.data11;
          this.lubeCashTotalAmt = res.data10[0].cashBillAmount
          this.lubeCashTotalQuan = res.data10[0].cashBillQuantity
          this.lubeCashTotalUnit = res.data10[0].cashBillUnit
          this.totalLubeAmt = Number(res.data5[0].totalLubeAmt) + Number(res.data7[0].totalLubeAmt);
          this.totalLubeQuantityInPiece = Number(res.data8[0].quantityInPieces);
          this.totalLubeKgQuantity = res.data5[0].totalQuantity
          this.totalLubeLtrQuantity = res.data7[0].totalQuantity
          this.totalAdvAmt = Number(res.data6[0].totalAdvAmt)
          this.totalLubeCashQuantityInPiece = Number(res.data10[0].quantityInPiece);
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
    // this.creditPaymentDetails.length = 0
    const data = {
      date: moment(this.selectedDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      corporateId: dealerCorporateId,
    };
    this.post.getFuelCreditPaymentByDatePOST(data)
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

  shiftReportPage() {
    // this.post.setNavigate(moment(this.selectedDate, ['DD-MM-YYYY']).format('YYYY-MM-DD'), 'Book')
    this.router.navigate(['/shift/shiftReport']);

  }
}
