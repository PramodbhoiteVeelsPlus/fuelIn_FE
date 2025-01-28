import { ChangeDetectorRef, Component, Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ListWidgetService } from '../listWidget.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { ExcelService } from 'src/app/pages/excel.service';
import * as XLSX from 'xlsx';
import { Options } from '@angular-slider/ngx-slider';

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
  selector: 'app-lists-widget13',
  templateUrl: './lists-widget13.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget13Component {

  filterForm = new FormGroup({
    month: new FormControl("", Validators.required),
    year: new FormControl("", Validators.required),
    product: new FormControl("", Validators.required),
  });

  shiftForm = new FormGroup({
    operator: new FormControl(''),
    operatorStaffId: new FormControl('', Validators.required),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    shiftTimeId: new FormControl('', Validators.required),
    productName: new FormControl('', Validators.required),
  });

  fuelDealerId: any;
  dealerCorporateId: any;
  accessGroup: any;
  managerName: any;
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
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  currentYear: any;
  lastYear: number;
  lastThirdYear: number;
  lastFourthYear: number;
  lastFifthYear: number;
  shiftWiseQuantityData: any = [];
  shiftWiseData: any = [];
  shiftDetails: any;
  meterSalesAmount: any;

  constructor(
    private post: ListWidgetService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private router: Router,
    private spinner: NgxSpinnerService,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
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
      this.currentYear = new Date().getFullYear();
      this.lastYear = Number(this.currentYear) - 1;
      this.lastThirdYear = Number(this.currentYear) - 2;
      this.lastFourthYear = Number(this.currentYear) - 3;
      this.lastFifthYear = Number(this.currentYear) - 4;
      this.filterForm.controls['year'].setValue(this.currentYear);
      this.shiftForm.controls["startDate"].setValue("01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear())
      this.shiftForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
      this.getShiftWiseBookDetails(this.fuelDealerId);
      this.cd.detectChanges()
    }

  }

  tickvalue = 10;
  tickhighValue = 90;
  tickoptions: Options = {
    floor: 0,
    ceil: 100,
    step: 10,
    showTicks: true
  };

  tickValue = Number(moment(new Date()).format("MM"));
  tickValueoptions: Options = {
    showTicksValues: true,
    stepsArray: [
      { value: 1, legend: 'JAN' },
      { value: 2, legend: 'FEB' },
      { value: 3, legend: 'MAR' },
      { value: 4, legend: 'APR' },
      { value: 5, legend: 'MAY' },
      { value: 6, legend: 'JUN' },
      { value: 7, legend: 'JUL' },
      { value: 8, legend: 'AUG' },
      { value: 9, legend: 'SEP' },
      { value: 10, legend: 'OCT' },
      { value: 11, legend: 'NOV' },
      { value: 12, legend: 'DEC' }
    ]
  };

  pageChangeEvent(event: number) {
    this.p = event;
    this.getShiftWiseBookDetails(this.fuelDealerId);
    this.getShiftWiseBookDetailsMonthWise(this.fuelDealerId);
  }

  getShiftWiseBookDetailsMonthWise(tickValue: any) {
    this.filterForm.controls["month"].setValue(moment(tickValue, ["MM"]).format("MM"))
    let startDate = this.filterForm.value.year + '-' + this.filterForm.value.month + '-' + '01'
    let endDate = this.filterForm.value.year + '-' + this.filterForm.value.month + '-' + '31'
    this.shiftWiseData.length = 0;
    this.shiftWiseQuantityData.length = 0;
    const data = {
      dealerId: this.fuelDealerId,
      startDate: startDate,  //startDate,
      endDate: endDate,
    };
    this.post.getShiftWiseBookDetailsPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.meterSalesAmount = res.data;
        this.shiftDetails = res.data1;

        this.shiftDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; totalCashTally: string; paytmTotalAmount: string; totalCreditTally: string; expenseAmount: string; shortamount: string; totalAmountTally: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; idfuelShiftDetails: any; }) => {
          const dataPAYJson = {
            openDate: '',
            name: '',
            meterSaleAmount: 0,
            cash: '',
            digital: '',
            credit: '',
            expenses: '',
            short: '',
            shiftTally: '',
            shiftTime: '',
          };

          dataPAYJson.openDate = moment(shift.openDate).format("YYYY-MM-DD");
          dataPAYJson.name = shift.firstName + ' ' + shift.lastName;
          dataPAYJson.cash = shift.totalCashTally;
          dataPAYJson.digital = shift.paytmTotalAmount;
          dataPAYJson.credit = shift.totalCreditTally;
          dataPAYJson.expenses = shift.expenseAmount;
          dataPAYJson.short = shift.shortamount;
          dataPAYJson.shiftTally = shift.totalAmountTally;
          dataPAYJson.shiftTime = shift.fuelShiftTimeDetails + ' ' + shift.fuelShiftTimeShiftName;

          this.meterSalesAmount.map((sales: { fuelShiftDetailsId: any; meterSaleAmount: number; }) => {
            if (sales.fuelShiftDetailsId == shift.idfuelShiftDetails) {
              dataPAYJson.meterSaleAmount = sales.meterSaleAmount;
            }
          })

          this.shiftWiseData.push(dataPAYJson);
          this.cd.detectChanges()
        })

      } else {
      }
    });

    this.post.getShiftWiseBookQuantityDetailsPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        if (res.data.length) {
          if (res.data1.length) {
            res.data.map((res1: { fuelProductId: string; fuelShiftDetailsId: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; meterSaleAmount: string; meterSaleQuantity: string; openDate: string; productName: string; firstName: string; lastName: string; shiftTimeId: any; }) => {
              const dataJson = {
                fuelProductId: '',
                fuelShiftDetailsId: '',
                meterSaleAmount: '',
                meterSaleQuantity: '',
                openDate: '',
                productName: '',
                creditQuantity: '',
                fuelShiftTimeShiftName: '',
                fuelShiftTimeDetails: '',
                firstName: '',
                lastName: '',
              };
              dataJson.fuelProductId = res1.fuelProductId;
              dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
              dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
              dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
              dataJson.meterSaleAmount = res1.meterSaleAmount;
              dataJson.meterSaleQuantity = res1.meterSaleQuantity;
              dataJson.openDate = res1.openDate;
              dataJson.productName = res1.productName;
              dataJson.firstName = res1.firstName;
              dataJson.lastName = res1.lastName;
              res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; idfuelShiftDetails: string; creditQuantity: string; }) => {
                if (res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId && res1.fuelShiftDetailsId == res2.idfuelShiftDetails) {
                  dataJson.creditQuantity = res2.creditQuantity;
                }
              })

              this.shiftWiseQuantityData.push(dataJson);
              this.cd.detectChanges()

            })
          } else {
            this.shiftWiseQuantityData = res.data;
            this.cd.detectChanges()
          }
        } else {
          this.shiftWiseQuantityData = []
          this.cd.detectChanges()
        }
      }
    })
  }

  getShiftWiseBookDetails(fuelDealerId: any) {
    this.shiftWiseData.length = 0;
    this.shiftWiseQuantityData.length = 0;
    this.spinner.show()
    const data = {
      dealerId: fuelDealerId,
      startDate: moment(this.shiftForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),  //startDate,
      endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    };
    this.post.getShiftWiseBookDetailsPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.meterSalesAmount = res.data;
        this.shiftDetails = res.data1;

        this.shiftDetails.map((shift: { openDate: moment.MomentInput; firstName: string; lastName: string; totalCashTally: string; paytmTotalAmount: string; totalCreditTally: string; expenseAmount: string; shortamount: string; totalAmountTally: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; idfuelShiftDetails: any; }) => {
          const dataPAYJson = {
            openDate: '',
            name: '',
            meterSaleAmount: 0,
            cash: '',
            digital: '',
            credit: '',
            expenses: '',
            short: '',
            shiftTally: '',
            shiftTime: '',
          };

          dataPAYJson.openDate = moment(shift.openDate).format("YYYY-MM-DD");
          dataPAYJson.name = shift.firstName + ' ' + shift.lastName;
          dataPAYJson.cash = shift.totalCashTally;
          dataPAYJson.digital = shift.paytmTotalAmount;
          dataPAYJson.credit = shift.totalCreditTally;
          dataPAYJson.expenses = shift.expenseAmount;
          dataPAYJson.short = shift.shortamount;
          dataPAYJson.shiftTally = shift.totalAmountTally;
          dataPAYJson.shiftTime = shift.fuelShiftTimeDetails + ' ' + shift.fuelShiftTimeShiftName;

          this.meterSalesAmount.map((sales: { fuelShiftDetailsId: any; meterSaleAmount: number; }) => {
            if (sales.fuelShiftDetailsId == shift.idfuelShiftDetails) {
              dataPAYJson.meterSaleAmount = sales.meterSaleAmount;
            }
          })
          this.shiftWiseData.push(dataPAYJson);
        })
        this.spinner.hide()
        this.cd.detectChanges()
      } else {
        this.spinner.hide()
        this.cd.detectChanges()
      }
    });

    this.post.getShiftWiseBookQuantityDetailsPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        if (res.data.length) {
          if (res.data1.length) {
            res.data.map((res1: { fuelProductId: string; fuelShiftDetailsId: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; meterSaleAmount: string; meterSaleQuantity: string; openDate: string; productName: string; firstName: string; lastName: string; shiftTimeId: any; }) => {
              const dataJson = {
                fuelProductId: '',
                fuelShiftDetailsId: '',
                meterSaleAmount: '',
                meterSaleQuantity: '',
                openDate: '',
                productName: '',
                creditQuantity: '',
                fuelShiftTimeShiftName: '',
                fuelShiftTimeDetails: '',
                firstName: '',
                lastName: '',
              };
              dataJson.fuelProductId = res1.fuelProductId;
              dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
              dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
              dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
              dataJson.meterSaleAmount = res1.meterSaleAmount;
              dataJson.meterSaleQuantity = res1.meterSaleQuantity;
              dataJson.openDate = res1.openDate;
              dataJson.productName = res1.productName;
              dataJson.firstName = res1.firstName;
              dataJson.lastName = res1.lastName;
              res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; idfuelShiftDetails: string; creditQuantity: string; }) => {
                if (res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId && res1.fuelShiftDetailsId == res2.idfuelShiftDetails) {
                  dataJson.creditQuantity = res2.creditQuantity;
                }
              })
              this.shiftWiseQuantityData.push(dataJson);
              this.spinner.hide()
              this.cd.detectChanges()
            })
          } else {
            this.shiftWiseQuantityData = res.data;
            this.spinner.hide()
            this.cd.detectChanges()
          }
        } else {
          this.shiftWiseQuantityData = []
          this.spinner.hide()
          this.cd.detectChanges()
        }
      }
    })
  }

  routeShift(date: string) {
    this.post.setNavigate(date, 'Book')
    this.router.navigate(['/shift/addShift']);
  }

  exportPDF(){
    var cols = [["Date", "shift_Sales(Rs)", "A_Credit(Rs)","B-Digital(Rs)", "C-Cash(1+2+3)","Shift_Tally_(A+B+C)","1-Cash_Handover(Rs)","2-Cash_Expenses(Rs)","3-Cash_Short/Diff(Rs)"]];
    var rows = [];
    for (var key in this.shiftWiseData) {
    
      var temp = [
        moment(this.shiftWiseData[key].openDate).format("DD-MM-YYYY"),
        Number(this.shiftWiseData[key].meterSaleAmount).toFixed(2),
        Number(this.shiftWiseData[key].credit).toFixed(2),
        Number(this.shiftWiseData[key].digital).toFixed(2),
        Number(((this.shiftWiseData[key].cash)*1) + ((this.shiftWiseData[key].expenses)*1) + ((this.shiftWiseData[key].short)*1)).toFixed(2),
        Number(this.shiftWiseData[key].shiftTally).toFixed(2),
        Number(this.shiftWiseData[key].cash).toFixed(2),
        Number(this.shiftWiseData[key].expenses).toFixed(2),
        Number(this.shiftWiseData[key].short).toFixed(2),
        
        ];
        rows.push(temp);
    }
  
    var doc = new jsPDF('l', 'pt');
  
    doc.setFontSize(20);  
    doc.text("shiftBook_shiftwise",350, 35 );  
    doc.setFontSize(10);
  
     autoTable(doc, {
      columnStyles: {
        0: {cellWidth: 70},     // OnboardDate
        1: {cellWidth: 70},    // CompanyId
        2: {cellWidth: 70},     //FuelPartnerName
        3: {cellWidth: 80},     //OnboardingStatus
        4: {cellWidth: 90},     //PaymentStatus
        5: {cellWidth: 100},     //WaiveOffAction
        6: {cellWidth: 100},     //SMSReceiveStatus
        7: {cellWidth: 80},     //SMSReceiveStatus
  
      },
      
      margin: {top: 50},
      head: cols,
      body: rows,
      theme: 'grid',
      didDrawCell: (data) => { },
  });
    // doc.output('dataurlnewwindow')
    doc.save("shiftBook_Monthwise.pdf");
          
  }
}
