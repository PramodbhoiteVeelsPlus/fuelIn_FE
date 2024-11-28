import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { getCSSVariableValue } from '../../../../../kt/_utils';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { ListWidgetService } from '../../lists/listWidget.services';
import { ChartsService } from '../charts.services';
import { FormGroup, FormControl } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

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
  selector: 'app-charts-widget3',
  templateUrl: './charts-widget3.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class ChartsWidget3Component implements OnInit {
  viewOilCompanyForm = new FormGroup({
    paidFrom: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
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
  ownerName: any;
  dealerAccess: boolean;
  oilCompanyDetails: any = [];
  oilCompanyTotalQuantity: any = [];
  allAmtTotal: number;
  showPriceTable: boolean = false;
  isOilCompanyDetails: boolean = false;
  selected: any;
  quantityDetails: any;
  createdByName: any;
  headerName1: any;
  headerName3: any;
  headerName2: any;
  oilCompanyDetailsList: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  invoiceDate1: any;
  vehicleNumber1: any;
  invoiceNumber1: any;
  receivedDate1: any;
  productName1: any;
  quantity1: any;
  basicAmt1: any;
  vatAmt1: any;
  vatPercent1: any;
  cessAmt1: any;
  totalTax1: any;
  components1: any;
  totalAmount1: any;
  createdBy1: any;
  rowNumber: any;
  show: boolean = false;

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

      this.headerName1 = this.companyName;
      // this.headerName2 = res.data[0].address1+', '+res.data[0].address2+', '+ this.city;
      // this.headerName3 = this.state+'-'+ this.pin+'  '+"GST: "+ this.GSTNumber;

    }
    this.cd.detectChanges()
  }

  getOILCOMPANYDataInFuelExpenseFilter() {
    if (this.viewOilCompanyForm.value.startDate) {
      if (this.viewOilCompanyForm.value.endDate) {
        this.spinner.show()
        this.oilCompanyDetails.length = 0;
        this.oilCompanyTotalQuantity.length = 0;
        this.allAmtTotal = 0
        let data = {
          dealerId: this.fuelDealerId,
          startDate: moment(this.viewOilCompanyForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
          endDate: moment(this.viewOilCompanyForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        }
        this.post.getOILCOMPANYDataInFuelExpensePOST(data)
          .subscribe(res => {
            if (res.data.length) {
              this.oilCompanyDetails = res.data;
              this.oilCompanyTotalQuantity = res.data2;

              this.allAmtTotal = 0;

              this.showPriceTable = true;
              for (let i = 0; i < this.oilCompanyTotalQuantity.length; i++) {
                this.allAmtTotal = this.allAmtTotal + res.data2[i].totalAmount
              }
              this.isOilCompanyDetails = true;
              this.spinner.hide()
              this.cd.detectChanges()
            } else {
              this.isOilCompanyDetails = false;
              this.spinner.hide();
              alert("Don't have Data in Selectede Date Range..!")
              this.cd.detectChanges()
            }
          })
      } else {
        alert("please select end date")
        this.cd.detectChanges()
      }
    } else {
      alert("please select start date")
      this.cd.detectChanges()
    }

  }

  clearForm() {
    this.selected = '';
    this.showPriceTable = false;
    this.getOILCOMPANYDataInFuelExpense(this.fuelDealerId)

  }

  getOILCOMPANYDataInFuelExpense(fuelDealerId: any) {
    this.spinner.show();
    this.oilCompanyDetails.length = 0;
    this.oilCompanyTotalQuantity.length = 0;
    this.allAmtTotal = 0

    let data = {
      dealerId: fuelDealerId
    }
    this.post.getOILCOMPANYDataInFuelExpensePOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.oilCompanyDetails = res.data;
          this.isOilCompanyDetails = true;
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.isOilCompanyDetails = false;
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }


  exportToPDF() {
    var cols = [["Invoice Date", "Vehicle Number", "Invoice Number", "Received Date", "Product", "Quantity", "Basic Amount", "Vat Amount", "Vat Percent", "Cess Amount", "Total Tax", "Other Components", "Total Amount", "Created By"]];
    var rows = [];

    for (var key in this.oilCompanyDetails) {

      // quantity
      if (this.oilCompanyDetails[key].productName == 'CNG') {
        this.quantityDetails = this.oilCompanyDetails[key].quantity + ' ' + 'Kg';
      } else {
        if (this.oilCompanyDetails[key].productName != 'CNG') {
          this.quantityDetails = this.oilCompanyDetails[key].quantity + ' ' + 'Ltr';
        }
      }

      // created By
      if (this.oilCompanyDetails[key].createdBy == '') {
        this.createdByName = this.ownerName;
      } else {
        if (this.oilCompanyDetails[key].createdBy != '') {
          this.createdByName = this.oilCompanyDetails[key].createdBy;
        }
      }

      var temp = [
        moment(this.oilCompanyDetails[key].invoiceDate).format("DD-MM-YYYY"),
        this.oilCompanyDetails[key].vehicleNumber,
        this.oilCompanyDetails[key].invoiceNumber,
        moment(this.oilCompanyDetails[key].receivedDate).format("DD-MM-YYYY"),
        this.oilCompanyDetails[key].productName,
        this.quantityDetails,
        this.oilCompanyDetails[key].basicAmt,
        this.oilCompanyDetails[key].vatAmt,
        this.oilCompanyDetails[key].vatPercent,
        this.oilCompanyDetails[key].cessAmt,
        this.oilCompanyDetails[key].totalTax,
        this.oilCompanyDetails[key].components,
        this.oilCompanyDetails[key].totalAmount,
        this.createdByName,

      ];
      rows.push(temp);

    }
    var doc = new jsPDF('l', 'pt');
    doc.setFontSize(12);
    doc.text(this.headerName1, 40, 25);
    doc.setFontSize(8);
    doc.text(this.headerName2, 40, 40);
    doc.text(this.headerName3, 40, 55);
    if (this.viewOilCompanyForm.value.startDate && this.viewOilCompanyForm.value.endDate) {
      doc.text("DATE : " + moment(this.viewOilCompanyForm.value.startDate, ["DD-MM-YYYY"]).format("DD MMM YYYY") + ' To ' + moment(this.viewOilCompanyForm.value.endDate, ["DD-MM-YYYY"]).format("DD MMM YYYY"), 40, 70);
    }
    doc.setFontSize(12);
    doc.text("Oil company purchase", 350, 35);
    doc.setFontSize(10);


    autoTable(doc, {
      columnStyles: {
        0: { cellWidth: 60 },     // Invoice Date
        1: { cellWidth: 50 },    // Vehicle Number
        2: { cellWidth: 45 },     //Invoice Number
        3: { cellWidth: 60 },     // Received Date
        4: { cellWidth: 80 },     // Product
        5: { cellWidth: 50 },     // Quantity
        6: { cellWidth: 50 },     //  Basic Amount
        7: { cellWidth: 50 },     // Vat Amount
        8: { cellWidth: 50 },     // Vat Percent
        9: { cellWidth: 50 },     // Cess Amount
        10: { cellWidth: 50 },     // Total Tax
        11: { cellWidth: 50 },     // Other Components
        12: { cellWidth: 60 },     // Total Amount
        13: { cellWidth: 60 },     // Created By

      },
      margin: { top: 80 },
      head: cols,
      body: rows,
      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("OilCompanyPurchase.pdf");
  }

  oilCompanyExcelDownload() {
    this.oilCompanyDetailsList.length = 0
    this.oilCompanyDetails.map((res: { productName: any; quantity: any; createdBy: any; invoiceDate: moment.MomentInput; vehicleNumber: any; invoiceNumber: any; receivedDate: moment.MomentInput; basicAmt: any; vatAmt: any; vatPercent: any; cessAmt: any; totalTax: any; components: any; totalAmount: any; }) => {

      // quantity
      if (res.productName == 'CNG') {
        this.quantityDetails = res.quantity + ' ' + 'Kg';
      } else {
        if (res.productName != 'CNG') {
          this.quantityDetails = res.quantity + ' ' + 'Ltr';
        }
      }

      // created By
      if (res.createdBy == '') {
        this.createdByName = this.ownerName;
      } else {
        if (res.createdBy != '') {
          this.createdByName = res.createdBy;
        }
      }

      let json = {
        invoiceDate: moment(res.invoiceDate).format("DD-MM-YYYY"),
        vehicleNumber: res.vehicleNumber,
        invoiceNumber: res.invoiceNumber,
        receivedDate: moment(res.receivedDate).format("DD-MM-YYYY"),
        product: res.productName,
        quantity: this.quantityDetails,
        basicAmount: res.basicAmt,
        vatAmount: res.vatAmt,
        vatPercent: res.vatPercent,
        cessAmount: res.cessAmt,
        totalTax: res.totalTax,
        otherComponents: res.components,
        totalAmount: res.totalAmount,
        createdBy: this.createdByName,

      };

      this.oilCompanyDetailsList.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.oilCompanyDetailsList,
      "oil company purchase"
    );

  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getOILCOMPANYDataInFuelExpenseFilter();
  }

  changeValue(i: any, invoiceDate1: any, vehicleNumber1: any, invoiceNumber1: any, receivedDate1: any, productName1: any, quantity1: any, basicAmt1: any, vatAmt1: any, vatPercent1: any, cessAmt1: any, totalTax1: any, components1: any, totalAmount1: any, createdBy1: any) {
    this.invoiceDate1 = ''
    this.vehicleNumber1 = ''
    this.invoiceNumber1 = ''
    this.receivedDate1 = ''
    this.productName1 = ''
    this.quantity1 = ''
    this.basicAmt1 = ''
    this.vatAmt1 = ''
    this.vatPercent1 = ''
    this.cessAmt1 = ''
    this.totalTax1 = ''
    this.components1 = ''
    this.totalAmount1 = ''
    this.createdBy1 = ''

    if (i == this.rowNumber) {
      this.rowNumber = ''
      if (this.show == true) {
        this.show = false;
      } else {
        this.show = true;
        this.rowNumber = i
        this.invoiceDate1 = invoiceDate1
        this.vehicleNumber1 = vehicleNumber1
        this.invoiceNumber1 = invoiceNumber1
        this.receivedDate1 = receivedDate1
        this.productName1 = productName1
        this.quantity1 = quantity1
        this.basicAmt1 = basicAmt1
        this.vatAmt1 = vatAmt1
        this.vatPercent1 = vatPercent1
        this.cessAmt1 = cessAmt1
        this.totalTax1 = totalTax1
        this.components1 = components1
        this.totalAmount1 = totalAmount1
        this.createdBy1 = createdBy1

      }
    } else {
      this.rowNumber = i
      this.show = true;

      this.invoiceDate1 = invoiceDate1
      this.vehicleNumber1 = vehicleNumber1
      this.invoiceNumber1 = invoiceNumber1
      this.receivedDate1 = receivedDate1
      this.productName1 = productName1
      this.quantity1 = quantity1
      this.basicAmt1 = basicAmt1
      this.vatAmt1 = vatAmt1
      this.vatPercent1 = vatPercent1
      this.cessAmt1 = cessAmt1
      this.totalTax1 = totalTax1
      this.components1 = components1
      this.totalAmount1 = totalAmount1
      this.createdBy1 = createdBy1
    }

  }

  calculateOilCoTotalAmountUpdate(i: any) {
    this.oilCompanyDetails[i].totalAmount = Number(this.oilCompanyDetails[i].vatAmt) + Number(this.oilCompanyDetails[i].basicAmt) + Number(this.oilCompanyDetails[i].cessAmt) + Number(this.oilCompanyDetails[i].components)
    this.calculateOilCoTotalTaxUpdate(i);
  }

  calculateOilCoTotalTaxUpdate(i: string | number) {
    this.oilCompanyDetails[i].totalTax = Number(this.oilCompanyDetails[i].vatAmt) + Number(this.oilCompanyDetails[i].cessAmt)
  }

  calculateVATPercentUpdate(i: string | number) {
    (this.oilCompanyDetails[i].vatPercent) = (Number(this.oilCompanyDetails[i].vatAmt) * 100) / Number(this.oilCompanyDetails[i].basicAmt)
    this.calculateOilCoTotalAmountUpdate(i);
  }

  oilCompanyUpdate(fuelExpenseId: any, i: any) {

    this.spinner.show()
    let data = {
      expenseId: fuelExpenseId,
      bankAccountId: this.oilCompanyDetails[i].bankAccountId,
      basicAmt: this.oilCompanyDetails[i].basicAmt,
      vatPercent: this.oilCompanyDetails[i].vatPercent,
      vatAmt: this.oilCompanyDetails[i].vatAmt,
      cessAmt: this.oilCompanyDetails[i].cessAmt,
      totalTax: this.oilCompanyDetails[i].totalTax,
      components: this.oilCompanyDetails[i].components,
      totalAmount: this.oilCompanyDetails[i].totalAmount,
    }
    this.post.updateOilCompanyPOST(data)
      .subscribe((res: { status: string; }) => {
        if (res.status == 'OK') {
          alert("details update successfully..!")
          this.getOILCOMPANYDataInFuelExpense(this.fuelDealerId);
          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      })
  }

  deleteOilCompanyPurchase(fuelExpenseId: any) {
    this.spinner.show()
    let data = {
      expenseId: fuelExpenseId
    }
    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteExpensePOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("details deleted successfully..!")
            this.getOILCOMPANYDataInFuelExpense(this.fuelDealerId);
            this.spinner.hide()
          } else {
            this.spinner.hide()
          }
        })
    }
    else {
      this.spinner.hide()
    }
  }

}
