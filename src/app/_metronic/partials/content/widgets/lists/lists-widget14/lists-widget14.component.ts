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
  selector: 'app-lists-widget14',
  templateUrl: './lists-widget14.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget14Component {


  shiftForm = new FormGroup({
    operator: new FormControl(''),
    endDate: new FormControl(''),
    startDate: new FormControl(''),
    shiftTimeId: new FormControl('', Validators.required),
    productName: new FormControl("", Validators.required),
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
  currentYear: number;
  lastYear: number;
  lastThirdYear: number;
  lastFourthYear: number;
  lastFifthYear: number;
  shiftWiseQuantityData: any = [];
  shiftWiseData: any = [];
  shiftDetails: any;
  meterSalesAmount: any;
  fuelShiftTimeDetails: any = [];
  shiftWiseDataList: any = [];
  productsList: any = [];

  constructor(
    private post: ListWidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private excelService: ExcelService,
    private router: Router) {
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
      this.shiftForm.controls["startDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
      this.shiftForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))

      this.getShiftTimeDetails(this.fuelDealerId)
      this.getProductsByDealerId(this.fuelDealerId)
      this.cd.detectChanges()
    }

  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getShiftWiseBookDetailsBYShift();
  }


  getProductsByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getFuelProductIdByDealerIdPOST(data).subscribe(res => {
      if (res.status = 'OK') {
        this.productsList = res.data;
        this.cd.detectChanges()
      }
    })
  }

  getShiftTimeDetails(fuelDealerId: any) {
    this.fuelShiftTimeDetails.length = 0;
    let data = {
      fuelShiftTimeDealerId: fuelDealerId
    }
    this.post.getFuelShiftTimeDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.fuelShiftTimeDetails = res.data;
            this.cd.detectChanges()
          } else {
            this.fuelShiftTimeDetails.length = 0;
            this.cd.detectChanges()
          }
        }
        else {
        }
      })
  }

  getShiftWiseBookDetailsBYShift() {
    if (this.shiftForm.value.endDate || this.shiftForm.value.endDate) {

      if (this.shiftForm.value.shiftTimeId) {
        this.shiftWiseData.length = 0;
        this.shiftWiseQuantityData = [];
        const data = {
          dealerId: this.fuelDealerId,
          startDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          shiftTimeId: this.shiftForm.value.shiftTimeId,
        };
        this.post.getShiftTimeWiseBookDetailsPOST(data).subscribe((res) => {
          if (res.status == 'OK') {
            this.meterSalesAmount = res.data;
            this.shiftDetails = res.data1;
            if (res.data1.length || res.data.length) {

              this.shiftDetails.map((shift: { totalCashTally: string; paytmTotalAmount: string; totalCreditTally: string; expenseAmount: string; shortamount: string; totalAmountTally: string; shiftTimeId: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; }) => {
                const dataPAYJson = {
                  meterSaleAmount: 0,
                  cash: '',
                  digital: '',
                  credit: '',
                  expenses: '',
                  short: '',
                  shiftTally: '',
                  shiftTime: '',
                  shiftTimeId: '',
                };
                dataPAYJson.cash = shift.totalCashTally;
                dataPAYJson.digital = shift.paytmTotalAmount;
                dataPAYJson.credit = shift.totalCreditTally;
                dataPAYJson.expenses = shift.expenseAmount;
                dataPAYJson.short = shift.shortamount;
                dataPAYJson.shiftTally = shift.totalAmountTally;
                dataPAYJson.shiftTimeId = shift.shiftTimeId;
                dataPAYJson.shiftTime = shift.fuelShiftTimeDetails + ' ' + shift.fuelShiftTimeShiftName;

                this.meterSalesAmount.map((sales: { shiftTimeId: string; meterSaleAmount: number; }) => {
                  if (sales.shiftTimeId == shift.shiftTimeId) {
                    dataPAYJson.meterSaleAmount = sales.meterSaleAmount;
                  }
                })

                this.shiftWiseData.push(dataPAYJson);
              })
              this.cd.detectChanges()
            } else {
              alert("Data Not found..")
              this.getShiftWiseBookDetails(this.fuelDealerId);
              this.shiftForm.controls["shiftTimeId"].setValue("")
              this.cd.detectChanges()

            }

          } else {
          }
        });

        this.post.getShiftTimeWiseBookQuantityDetailsPOST(data).subscribe((res) => {
          if (res.status == 'OK') {
            if (res.data.length) {
              if (res.data1.length) {
                res.data.map((res1: { fuelProductId: string; fuelShiftDetailsId: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; meterSaleAmount: string; meterSaleQuantity: string; openDate: string; productName: string; shiftTimeId: any; }) => {
                  const dataJson = {
                    fuelProductId: '',
                    fuelShiftDetailsId: '',
                    fuelShiftTimeShiftName: '',
                    fuelShiftTimeDetails: '',
                    meterSaleAmount: '',
                    meterSaleQuantity: '',
                    openDate: '',
                    productName: '',
                    creditQuantity: '',
                  };
                  dataJson.fuelProductId = res1.fuelProductId;
                  dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
                  dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
                  dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
                  dataJson.meterSaleAmount = res1.meterSaleAmount;
                  dataJson.meterSaleQuantity = res1.meterSaleQuantity;
                  dataJson.openDate = res1.openDate;
                  dataJson.productName = res1.productName;
                  res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; creditQuantity: string; }) => {
                    if (res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId) {
                      dataJson.creditQuantity = res2.creditQuantity;
                    }
                  })


                  this.shiftWiseQuantityData.push(dataJson);

                })
                this.cd.detectChanges()
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
      } else {
        this.getShiftWiseBookDetails(this.fuelDealerId);
        this.cd.detectChanges()
      }

    } else {
      alert("Please Select Date..!")
      this.cd.detectChanges()
    }
  }

  getShiftWiseBookDetails(fuelDealerId: any) {
    this.shiftWiseData.length = 0;
    this.shiftWiseQuantityData = [];
    const data = {
      dealerId: fuelDealerId,
      startDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),  //endDate,
      endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
    };
    this.post.getShiftTimeWiseBookDetailsPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.meterSalesAmount = res.data;
        this.shiftDetails = res.data1;

        this.shiftDetails.map((shift: { totalCashTally: string; paytmTotalAmount: string; totalCreditTally: string; expenseAmount: string; shortamount: string; totalAmountTally: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; shiftTimeId: string; }) => {
          const dataPAYJson = {
            meterSaleAmount: 0,
            cash: '',
            digital: '',
            credit: '',
            expenses: '',
            short: '',
            shiftTally: '',
            shiftTime: '',
            shiftTimeId: '',
          };
          dataPAYJson.cash = shift.totalCashTally;
          dataPAYJson.digital = shift.paytmTotalAmount;
          dataPAYJson.credit = shift.totalCreditTally;
          dataPAYJson.expenses = shift.expenseAmount;
          dataPAYJson.short = shift.shortamount;
          dataPAYJson.shiftTally = shift.totalAmountTally;
          dataPAYJson.shiftTime = shift.fuelShiftTimeDetails + ' ' + shift.fuelShiftTimeShiftName;
          dataPAYJson.shiftTimeId = shift.shiftTimeId;

          this.meterSalesAmount.map((sales: { shiftTimeId: string; meterSaleAmount: number; }) => {
            if (sales.shiftTimeId == shift.shiftTimeId) {
              dataPAYJson.meterSaleAmount = sales.meterSaleAmount;
            }
          })

          this.shiftWiseData.push(dataPAYJson);
        })




      } else {
      }
    });

    this.post.getShiftTimeWiseBookQuantityDetailsPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        if (res.data.length) {
          if (res.data1.length) {
            res.data.map((res1: { fuelProductId: string; fuelShiftDetailsId: string; meterSaleAmount: string; meterSaleQuantity: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; openDate: string; productName: string; shiftTimeId: any; }) => {
              const dataJson = {
                fuelProductId: '',
                fuelShiftDetailsId: '',
                fuelShiftTimeShiftName: '',
                fuelShiftTimeDetails: '',
                meterSaleAmount: '',
                meterSaleQuantity: '',
                openDate: '',
                productName: '',
                creditQuantity: '',
              };
              dataJson.fuelProductId = res1.fuelProductId;
              dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
              dataJson.meterSaleAmount = res1.meterSaleAmount;
              dataJson.meterSaleQuantity = res1.meterSaleQuantity;
              dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
              dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
              dataJson.openDate = res1.openDate;
              dataJson.productName = res1.productName;
              res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; creditQuantity: string; }) => {
                if (res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId) {
                  dataJson.creditQuantity = res2.creditQuantity;
                }
              })


              this.shiftWiseQuantityData.push(dataJson);

            })
          } else {
            this.shiftWiseQuantityData = res.data;
          }
        } else {
          this.shiftWiseQuantityData = []
        }
      }
    })
  }

  exportToPDF() {

    var cols = [["shiftTime", "meter sales", "credit (a)", "digital (b)", "cash (c)", "expenses", "short", "shift tally (a+b+c)"]];
    var rows = [];
    for (var key in this.shiftWiseData) {

      var temp = [
        this.shiftWiseData[key].shiftTime,
        Number(this.shiftWiseData[key].meterSaleAmount).toFixed(2),
        Number(this.shiftWiseData[key].credit).toFixed(2),
        Number(this.shiftWiseData[key].digital).toFixed(2),
        Number(this.shiftWiseData[key].cash).toFixed(2),
        Number(this.shiftWiseData[key].expenses).toFixed(2),
        Number(this.shiftWiseData[key].short).toFixed(2),
        Number(this.shiftWiseData[key].shiftTally).toFixed(2),
      ];
      rows.push(temp);
    }

    var doc = new jsPDF('l', 'pt');

    doc.setFontSize(20);
    doc.text("Shift Book", 350, 35);
    doc.setFontSize(10);

    autoTable(doc, {
      columnStyles: {
        0: { cellWidth: 180 },    // shiftTime
        1: { cellWidth: 80 },     //meter sales
        2: { cellWidth: 80 },     //credit (a)
        3: { cellWidth: 80 },     //digital (b)
        4: { cellWidth: 80 },     //cash (c)
        5: { cellWidth: 80 },     //expenses
        6: { cellWidth: 80 },     //short
        7: { cellWidth: 80 },     //shift tally (a+b+c)
      },

      margin: { top: 50 },
      head: cols,
      body: rows,
      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("shiftBook.pdf");
  }



  exportexcel() {
    this.shiftWiseDataList.length = 0

    this.shiftWiseData.map((res: { shiftTime: any; meterSaleAmount: any; credit: any; digital: any; cash: any; expenses: any; short: any; shiftTally: any; }) => {

      let json = {
        shiftTime: res.shiftTime,
        meterSales: Number(res.meterSaleAmount).toFixed(2),
        credit: Number(res.credit).toFixed(2),
        digital: Number(res.digital).toFixed(2),
        cash: Number(res.cash).toFixed(2),
        expenses: Number(res.expenses).toFixed(2),
        short: Number(res.short).toFixed(2),
        shiftTally: Number(res.shiftTally).toFixed(2),

      };

      this.shiftWiseDataList.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.shiftWiseDataList,
      "shiftBook"
    );

  }

  getByProduct(id: any) {
    if (this.shiftForm.value.shiftTimeId) {
      this.shiftWiseQuantityData = [];
      this.spinner.show()
      const data = {
        dealerId: this.fuelDealerId,
        startDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        shiftTimeId: this.shiftForm.value.shiftTimeId,
        fuelProductId: id.target.value,
      };
      this.post.getShiftTimeWiseBookQuantityDetailsPOST(data).subscribe((res) => {
        if (res.status == 'OK') {
          if (res.data.length) {
            if (res.data1.length) {
              res.data.map((res1: { fuelProductId: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; fuelShiftDetailsId: string; meterSaleAmount: string; meterSaleQuantity: string; openDate: string; productName: string; shiftTimeId: any; }) => {
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
                };
                dataJson.fuelProductId = res1.fuelProductId;
                dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
                dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
                dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
                dataJson.meterSaleAmount = res1.meterSaleAmount;
                dataJson.meterSaleQuantity = res1.meterSaleQuantity;
                dataJson.openDate = res1.openDate;
                dataJson.productName = res1.productName;
                res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; creditQuantity: string; }) => {
                  if (res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId) {
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
    } else {

      this.shiftWiseQuantityData = [];
      this.spinner.show()
      const data = {
        dealerId: this.fuelDealerId,
        startDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),  //endDate,
        endDate: moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        fuelProductId: id.target.value,
      };
      this.post.getShiftTimeWiseBookQuantityDetailsPOST(data).subscribe((res) => {
        if (res.status == 'OK') {
          if (res.data.length) {
            if (res.data1.length) {
              res.data.map((res1: { fuelProductId: string; fuelShiftTimeDetails: string; fuelShiftTimeShiftName: string; fuelShiftDetailsId: string; meterSaleAmount: string; meterSaleQuantity: string; openDate: string; productName: string; shiftTimeId: any; }) => {
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
                };
                dataJson.fuelProductId = res1.fuelProductId;
                dataJson.fuelShiftTimeDetails = res1.fuelShiftTimeDetails;
                dataJson.fuelShiftTimeShiftName = res1.fuelShiftTimeShiftName;
                dataJson.fuelShiftDetailsId = res1.fuelShiftDetailsId;
                dataJson.meterSaleAmount = res1.meterSaleAmount;
                dataJson.meterSaleQuantity = res1.meterSaleQuantity;
                dataJson.openDate = res1.openDate;
                dataJson.productName = res1.productName;
                res.data1.map((res2: { openDate: string; fuelProdId: string; shiftTimeId: any; creditQuantity: string; }) => {
                  if (res1.openDate == res2.openDate && res1.fuelProductId == res2.fuelProdId && res1.shiftTimeId == res2.shiftTimeId) {
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
  }

  exportToPDF1() {

    var doc = new jsPDF('l', 'pt');

    doc.setFontSize(20);
    doc.text("Shift Book ", 350, 35);
    doc.setFontSize(10);

    autoTable(doc, {
      html: '#excel-table',
      startY: 70,

      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("ShiftBook.pdf");
  }


  /*name of the excel-file which will be downloaded. */
  fileName = 'shiftBook.xlsx';


  exportexcel1(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);

  }
  
  goToDSR(shiftTimeId: any){
    this.post.setRoutingWithShiftTimeId(shiftTimeId,"ShiftBook",moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"), moment(this.shiftForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"))
    localStorage.setItem('address', JSON.stringify("ShiftBook"));
    this.router.navigate(['/shift/shiftTimeReport']);     
    }
}
