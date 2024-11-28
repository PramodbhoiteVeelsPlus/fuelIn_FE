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
  selector: 'app-lists-widget15',
  templateUrl: './lists-widget15.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ListsWidget15Component {

  filterForm = new FormGroup({
    operator: new FormControl(''),
    operatorStaffId: new FormControl('', Validators.required),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    productName: new FormControl(''),
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
  operatorWiseData: any = [];
  operatorQuantityData: any = [];
  staffDetails: any = [];
  operatorWiseDataExcel: any = [];
  pdfHeader: string | string[];
  operatorQuantityDataExcel: any = [];

  constructor(
    private post: ListWidgetService,
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

      this.getAllAttendantsByDid(this.fuelDealerId)
      this.getProductsByDealerId(this.fuelDealerId)
      this.cd.detectChanges()
    }

  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getOperatorWiseDetails();
  }


  getAllAttendantsByDid(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getAllAttendantsByDidPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.staffDetails = res.data;
      } else {
      }
    });
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


  getByProduct(id: any) {
    if (this.filterForm.value.operatorStaffId) {
      this.spinner.show()
      let data = {
        dealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        staffId: this.filterForm.value.operatorStaffId,
        productId: id.target.value
      }

      this.post.getOperatorWiseQuantityDetailsPOST(data).subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.operatorQuantityData = res.data;
          this.spinner.hide()
        } else {
          alert("Data Not Found..!")
          this.operatorQuantityData = [];
          this.spinner.hide()
        }
      })
    } else {
      this.spinner.show()
      let data = {
        dealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        productId: id.target.value
      }

      this.post.getOperatorWiseQuantityDetailsPOST(data).subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.operatorQuantityData = res.data;
          this.spinner.hide()
        } else {
          alert("Data Not Found..!")
          this.operatorQuantityData = []
          this.spinner.hide()
        }
      })
    }
  }


  getOperatorWiseDetails() {
    if (this.filterForm.value.operatorStaffId) {
      this.spinner.show()
      let data = {
        dealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        staffId: this.filterForm.value.operatorStaffId
      }

      this.post.getOperatorWiseDetailsPOST(data).subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.operatorWiseData = res.data;
          this.getOperatorWiseQuantityDetails()
          this.spinner.hide()
        } else {
          alert("Data Not Found..!")
          this.operatorQuantityData = [];
          this.getOperatorWiseQuantityDetails()
          this.spinner.hide()
        }
      })
    } else {
      this.spinner.show()
      let data = {
        dealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }

      this.post.getOperatorWiseDetailsPOST(data).subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.operatorWiseData = res.data;
          this.getOperatorWiseQuantityDetails()
          this.spinner.hide()
        } else {
          alert("Data Not Found..!")
          this.operatorQuantityData = [];
          this.getOperatorWiseQuantityDetails()
          this.spinner.hide()
        }
      })
    }
  }


  getOperatorWiseQuantityDetails() {
    if (this.filterForm.value.operatorStaffId) {
      this.spinner.show()
      let data = {
        dealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        staffId: this.filterForm.value.operatorStaffId
      }

      this.post.getOperatorWiseQuantityDetailsPOST(data).subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.operatorQuantityData = res.data;
          this.spinner.hide()
        } else {
          alert("Data Not Found..!")
          this.operatorQuantityData = [];
          this.spinner.hide()
        }
      })
    } else {
      this.spinner.show()
      let data = {
        dealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }

      this.post.getOperatorWiseQuantityDetailsPOST(data).subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.operatorQuantityData = res.data;
          this.spinner.hide()
        } else {
          alert("Data Not Found..!")
          this.operatorQuantityData = [];
          this.spinner.hide()
        }
      })
    }
  }

  exportPDFamount() {

    var cols = [["operatorName", "meterSales", "credit_A", "digital_B", "cash_c", "expenses", "short", "shiftTally_ABC"]];
    var rows = [];
    for (var key in this.operatorWiseData) {

      var temp = [
        this.operatorWiseData[key].name,
        Number(this.operatorWiseData[key].totalMeterSales).toFixed(2),
        Number(this.operatorWiseData[key].totalCreditTally).toFixed(2),
        Number(this.operatorWiseData[key].paytmTotalAmount).toFixed(2),
        Number(this.operatorWiseData[key].totalCashTally).toFixed(2),
        Number(this.operatorWiseData[key].expenseAmount).toFixed(2),
        Number(this.operatorWiseData[key].shortAmount).toFixed(2),
        Number(this.operatorWiseData[key].totalAmountTally).toFixed(2),

      ];
      rows.push(temp);
    }

    var doc = new jsPDF('l', 'pt');

    this.pdfHeader = "Operator-Wise" + " " + moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("DD-MMM-YYYY") + " " + "To" + " " + moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("DD-MMM-YYYY")
    doc.setFontSize(10);
    doc.text(this.pdfHeader, 350, 35);

    autoTable(doc, {
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 90 },
        2: { cellWidth: 90 },
        3: { cellWidth: 90 },
        4: { cellWidth: 90 },
        5: { cellWidth: 90 },
        6: { cellWidth: 90 },
        7: { cellWidth: 90 },

      },

      margin: { top: 50 },
      head: cols,
      body: rows,
      theme: 'grid',
      didDrawCell: (data) => { },
    });
    // doc.output('dataurlnewwindow')
    doc.save("operatorwise.pdf");

  }

  exportExcelamount() {
    this.operatorWiseDataExcel.length = 0

    this.operatorWiseData.map((res: { name: any; totalMeterSales: any; totalCreditTally: any; paytmTotalAmount: any; totalCashTally: any; expenseAmount: any; shortAmount: any; totalAmountTally: any; }) => {

      let json = {
        operatorName: res.name,
        meterSales: Number(res.totalMeterSales).toFixed(2),
        credit_A: Number(res.totalCreditTally).toFixed(2),
        digital_B: Number(res.paytmTotalAmount).toFixed(2),
        cash_c: Number(res.totalCashTally).toFixed(2),
        expenses: Number(res.expenseAmount).toFixed(2),
        short: Number(res.shortAmount).toFixed(2),
        shiftTally_ABC: Number(res.totalAmountTally).toFixed(2),
      };

      this.operatorWiseDataExcel.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.operatorWiseDataExcel,
      "operatorwise"
    );

  }

  exportPDFQuantity() {

    var cols = [["operatorName", "product", "credit_(Quantity)_Ltr/Kg", "meter_Sales_(Quantity)_Ltr/Kg", "meter_Sales_(Amount)_Rs"]];
    var rows = [];
    for (var key in this.operatorQuantityData) {

      var temp = [
        this.operatorQuantityData[key].name,
        this.operatorQuantityData[key].product,
        Number(this.operatorQuantityData[key].crQuantity).toFixed(2),
        Number(this.operatorQuantityData[key].meterSalesQuantity).toFixed(2),
        Number(this.operatorQuantityData[key].materSalesAmt).toFixed(2),
      ];
      rows.push(temp);
    }

    var doc = new jsPDF('l', 'pt');

    this.pdfHeader = "Operator-Wise" + " " + moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("DD-MMM-YYYY") + " " + "To" + " " + moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("DD-MMM-YYYY")
    doc.setFontSize(10);
    doc.text(this.pdfHeader, 350, 35);


    autoTable(doc, {
      columnStyles: {
        0: { cellWidth: 160 },
        1: { cellWidth: 140 },
        2: { cellWidth: 150 },
        3: { cellWidth: 160 },
        4: { cellWidth: 150 },

      },

      margin: { top: 50 },
      head: cols,
      body: rows,
      theme: 'grid',
      didDrawCell: (data) => { },
    });
    // doc.output('dataurlnewwindow')
    doc.save("operatorwise_Quantity.pdf");

  }

  exportExcelQuantity() {
    this.operatorQuantityDataExcel.length = 0

    this.operatorQuantityData.map((res: { name: any; product: any; crQuantity: any; meterSalesQuantity: any; materSalesAmt: any; }) => {

      let json = {
        operatorName: res.name,
        product: res.product,
        credit_Quantity: Number(res.crQuantity).toFixed(2),
        meterSales_Quantity: Number(res.meterSalesQuantity).toFixed(2),
        meterSales_Amount: Number(res.materSalesAmt).toFixed(2)
      };

      this.operatorQuantityDataExcel.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.operatorQuantityDataExcel,
      "operatorwise_Quantity"
    );

  }
}
