import { data } from 'jquery';
import { Component, Injectable, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Options } from '@angular-slider/ngx-slider';
import { NgxSpinnerService } from 'ngx-spinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { dsrModel } from './dsrModel.model';
import { TilesService } from '../tiles.services';


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
  selector: 'app-tiles-widget9',
  templateUrl: './tiles-widget9.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})


export class TilesWidget9Component {
  accessGroupId: any;
  dealerLoginVPId: any;
  userId: any;
  personId: any;
  userName: string;
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: string;
  dealerAccess: boolean;
  currentYear: any;
  lastYear: number;
  last2Year: number;
  lastFourthYear: number;
  lastFifthYear: number;

  filterForm = new FormGroup({
    month: new FormControl('', Validators.required),
    year: new FormControl('', Validators.required),
    product: new FormControl('', Validators.required),
    startDate: new FormControl(''),
    startDate1: new FormControl(''),
  });
  productsList: any = [];
  loginSQLCorporateId: any;
  petrolPump: any;
  headerName1: any;
  headerName2: string;
  headerName3: string;
  fuelDealerId: any;
  productWiseMeterSales: any = [];
  productWiseSales: any[];
  productWiseStock: any[];
  DsrDetails: any;
  isAdd: boolean = false;
  isUpdateCol: boolean = false;
  showViewTableMETER: boolean = false;
  nzData: any = [];
  nzDSRDataUpdate: any;
  modalUpdate: any;
  closeResult: string;
  nzDetails1: any = [];
  newRowDSR = new dsrModel();
  countDSR: any = 0;
  addDSRArray: any = [];
  rateSelect: boolean = false;
  readingData: any = [];
  rateData: any = [];
  rate: any;
  rateDetails: any = []
  dateConversion: string;
  startDate: string;
  is31: boolean = false;
  is30: boolean = false;
  isLeap: boolean = false;
  isFeb: boolean = false;
  allNzList: any = [];
  nzDSRList: any = [];
  mapNzList: any = [];
  nzDetails: any = [];
  tkDSRDetails: any = [];
  showViewTableSTOCK: boolean = false;
  isAdd1: boolean = false;
  tkDSRData: any = [];
  isUpdateCol1: boolean = false;
  tkDSRDataUpdate: any = [];
  modalUpdate1: any;
  rateSelect1: boolean = false;
  addDSRArray1: any = [];
  tkDetails: any = [];
  dsrBookData: any = [];
  dsrBookDetails: any = [];
  nxtMonthTankStockDetails: any = [];
  showViewTable: boolean = false;
  headerName4: any;
  month: string;
  i: any;
  dateNotRate: boolean = false;
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

  constructor(private cd: ChangeDetectorRef,
    private post: TilesService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    config: NgbDatepickerConfig,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.userName = element.firstName + ' ' + element.lastName;
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.currentYear = new Date().getFullYear();
    this.filterForm.controls['year'].setValue(this.currentYear);
    this.filterForm.controls['month'].setValue(moment(new Date()).format("MMM"));
    this.filterForm.controls['startDate'].setValue(moment(new Date()).format("DD-MM-YYYY"));
    this.filterForm.controls['startDate1'].setValue(moment(new Date()).format("DD-MM-YYYY"));
    this.lastYear = Number(this.currentYear) - 1;
    this.last2Year = Number(this.currentYear) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
    this.lastFifthYear = Number(this.currentYear) - 4;
    this.addDSRArray.push(this.newRowDSR);
    this.getProductsByDealerId(this.fuelDealerId);
    this.getProductWiseMeterSales(this.fuelDealerId)
  }



  setMonth(tickValue: any) {
    if ((moment(new Date()).format("MM")) >= moment(this.filterForm.value.month, ["MMM"]).format("MM")) {
      if ((moment(new Date()).format("YYYY")) >= moment(this.filterForm.value.year, ["YYYY"]).format("YYYY")) {
        this.filterForm.controls["month"].setValue(moment(tickValue, ["MM"]).format("MMM"))
        this.getDatesMonth()
        this.getProductWiseMeterSales(this.fuelDealerId)
      } else {
      }
    } else {
      this.filterForm.controls["month"].setValue(moment(tickValue, ["MM"]).format("MMM"))
      this.getDatesMonth()
      this.getProductWiseMeterSales(this.fuelDealerId)
    }
  }

  getDatesMonth() {
    if ((moment(new Date()).format("MM")) >= moment(this.filterForm.value.month, ["MMM"]).format("MM")) {
      if ((moment(new Date()).format("YYYY")) >= moment(this.filterForm.value.year, ["YYYY"]).format("YYYY")) {
        this.startDate = moment(this.filterForm.value.year + '-' + this.filterForm.value.month + '-' + "01", ["YYYY-MMM-DD"]).format("DD-MM-YYYY")
        this.filterForm.controls["startDate"].setValue(this.startDate)
        this.filterForm.controls["startDate1"].setValue(this.startDate)
        this.getRateReadingByDate()
        this.getRateByDate()
        this.getDSRMeterSales(this.fuelDealerId)
        this.cd.detectChanges();
      } else {
        this.cd.detectChanges();
      }
    } else if ((moment(new Date()).format("YYYY")) == moment(this.filterForm.value.year, ["YYYY"]).format("YYYY")) {
      alert("Invalid Month Selected..!")
      this.month = moment(new Date()).format("MMM")
      this.startDate = moment(this.filterForm.value.year + '-' + this.month + '-' + "01", ["YYYY-MMM-DD"]).format("DD-MM-YYYY")
      this.filterForm.controls["startDate"].setValue(this.startDate)
      this.filterForm.controls["startDate1"].setValue(this.startDate)
      this.filterForm.controls["month"].setValue(moment(new Date()).format("MMM"));
      this.cd.detectChanges();
    } else {
      this.startDate = moment(this.filterForm.value.year + '-' + this.filterForm.value.month + '-' + "01", ["YYYY-MMM-DD"]).format("DD-MM-YYYY")
      
      this.filterForm.controls["startDate"].setValue(this.startDate)
      this.filterForm.controls["startDate1"].setValue(this.startDate)
      this.getRateReadingByDate()
      this.getRateByDate()
      this.getDSRMeterSales(this.fuelDealerId)
      this.cd.detectChanges();
    }
  }

  //For Product DropDown
  getProductsByDealerId(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getFuelProductIdByDealerIdPOST(data).subscribe((res) => {
      if (res.data.length) {
        this.productsList = res.data;
        this.cd.detectChanges();
      }else{
        this.cd.detectChanges();
      }
    });
  }

  getRateByProduct(id: any) {
    if (id.target.value) {
      this.getDSRMeterSales(this.fuelDealerId);
      this.getAllNzByProductId(this.fuelDealerId);
      this.getRateReadingByDate()
      this.getRateByDate()
    }

  }

  //getProductWiseMeterSales
  getProductWiseMeterSales(fuelDealerId: any) {
    this.productWiseMeterSales = []
    this.productWiseSales = []
    this.productWiseStock = []
    this.spinner.show()
    let data = {
      dealerId: fuelDealerId,
      month: this.filterForm.value.month,
      year: this.filterForm.value.year,
    };
    this.post.getProductWiseMeterSalesPOST(data)
      .subscribe((res) => {
        if (res.status == "OK") {
          this.productWiseSales = res.data;
          this.post.getProductWiseStockNEWPOST(data)
            .subscribe((res) => {
              if (res.data.length) {
                this.productWiseStock = res.data;
                this.cd.detectChanges();
                this.getSalesANDstock(this.productWiseSales, this.productWiseStock)
              } else {
                this.productWiseMeterSales = res.data
                this.cd.detectChanges();
                this.spinner.hide()
              }
            });
        } else {
          this.spinner.hide()
        }
      });

  }

  //getSalesANDstock
  getSalesANDstock(productWiseSales: any, productWiseStock: any) {
    productWiseSales.map((res1: any) => {
      const dataJson = {
        productName: '',
        productId: '',
        totalMeterSalesQty: 0,
        totalMeterSalesAmt: 0,
        totalStock: 0,
      };
      dataJson.productId = res1.productId;
      dataJson.productName = res1.productName;
      dataJson.totalMeterSalesQty = res1.totalMeterSalesQty;
      dataJson.totalMeterSalesAmt = res1.totalMeterSalesAmt;

      productWiseStock.map((res2: any) => {
        if (res1.productId == res2.productId) {
          dataJson.totalStock = res2.totalStock
        }
      })
      this.productWiseMeterSales.push(dataJson);
    })
    this.cd.detectChanges();
    this.spinner.hide()
  }

  getDSRMeterSales(fuelDealerId: any) {
    this.DsrDetails = []
    this.spinner.show()
    let data = {
      dealerId: fuelDealerId,
      month: this.filterForm.value.month,
      year: this.filterForm.value.year,
      fuelProductId: this.filterForm.value.product
    }
    this.post.getDsrMeterSalesPOST(data)
      .subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.showViewTableMETER = true
          this.DsrDetails = res.data;
          this.nzData = res.data[0].nzDSRData
          this.headerName4 = res.data[0].productName;
          this.getTankDSRDetails(this.fuelDealerId);
          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          this.showViewTableMETER = false;
          this.getTankDSRDetails(this.fuelDealerId);
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  showAddTable() {
    if (this.isAdd == true) {
      this.isAdd = false;
    } else {
      if (this.filterForm.value.product) {
        this.isAdd = true;
      } else {
        alert("Please select Product..")
      }
    }
  }


  updateCol() {
    if (this.isUpdateCol == true) {
      this.isUpdateCol = false;
    } else {
      this.isUpdateCol = true;
    }
  }

  openUpdateModal(updateModal: any, nzDSRData: any) {
    this.nzDSRDataUpdate = nzDSRData
    this.modalUpdate = this.modalService.open(updateModal, { size: 'lg' })
    this.modalUpdate.result.then((result: any) => {
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

  updateDSRDetails(id: any, i: any) {
    this.spinner.show();
    let data = {
      nzDetailsDSRId: id,
      nzDetailsDSRMeterReading: this.nzDSRDataUpdate[i].nzDetailsDSRMeterReading,
      nzDetailsDSRPumpTesting: this.nzDSRDataUpdate[i].nzDetailsDSRPumpTesting,
      nzDetailsDSRDensity: this.nzDSRDataUpdate[i].nzDetailsDSRDensity,

    }
    this.post.updateDSRDetailsPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          alert("readings updated successfully..!")
          this.getDSRMeterSales(this.fuelDealerId);
          this.getProductWiseMeterSales(this.fuelDealerId)
          this.spinner.hide()
        } else {
          alert("error to delete..!")
          this.spinner.hide()
        }
      })
  }

  // deleteEntry
  deleteEntry(id: any) {
    this.spinner.show()
    let data = {
      dsrDetailsId: id,
    }
    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteDSRDetailsPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("deleted successfully..!")
            this.getDSRMeterSales(this.fuelDealerId);
            this.getProductWiseMeterSales(this.fuelDealerId)
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


  exportToPDF() {
    var doc = new jsPDF('l', 'pt');
    doc.setFontSize(12);
    doc.text(this.headerName1, 40, 25);
    doc.setFontSize(8);
    doc.text(this.headerName2, 40, 40);
    doc.text(this.headerName3, 40, 55);
    doc.setFontSize(12);
    doc.text("MeterSales", 350, 35);
    autoTable(doc, {
      html: '#excel-table',
      startY: 80,
      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("MeterSales.pdf");
  }

  /*name of the excel-file which will be downloaded. */
  fileName = 'MeterSales.xlsx';

  exportexcel(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName);
  }


  getAllNzByProductId(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      dealerId: fuelDealerId,
      fuelProductId: this.filterForm.value.product,
      month: this.filterForm.value.month,
      year: this.filterForm.value.year,
    }
    this.post.getAllNzListByProductPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.nzDetails1 = res.data;
          this.spinner.hide()
        } else {
          this.nzDetails1 = [];
          this.spinner.hide()
        }
      })
  }


  getRateReadingByDate() {
    this.spinner.show()
    let data = {
      dealerId: this.fuelDealerId,
      fuelProductId: this.filterForm.value.product,
      date: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
    }
    this.post.getRateReadingByDatePOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.dateNotRate = false;
            if (res.data[0].rateDetails.length == 1) {
              this.rateSelect = false;
              this.addDSRArray = res.data;
              this.readingData = res.data1;
              this.addDSRArray[0].date = moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("DD-MM-YYYY")
            } else if (res.data[0].rateDetails.length != 1) {
              this.rateSelect = true;
              this.addDSRArray = res.data;
              this.addDSRArray[0].rateId = res.data[0].fuelPriceTableId
              this.readingData = res.data1;
              this.addDSRArray[0].date = moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("DD-MM-YYYY")
            }
            this.spinner.hide()
          } else {
            alert("You don't have rate for Selected date/Months's 1st day..! Please add Rate..!")
            this.dateNotRate = true;
            this.readingData = res.data1;
            this.addDSRArray[0].date = moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("DD-MM-YYYY");
            this.addDSRArray[0].rateId = "";
            this.addDSRArray[0].rate = "";
            this.spinner.hide()
          }
        }
      })
  }

  //submitDSRDetails
  submitDSRDetails() {
    if (this.readingData.length) {
      if (this.filterForm.value.month) {
        if (this.filterForm.value.year) {
          if (this.filterForm.value.product) {
            if (moment(this.addDSRArray[0].date, ["DD-MM-YYYY"]).format("MM") == moment(this.filterForm.value.month, ["MMM"]).format("MM")) {
              if (this.addDSRArray[0].rateId) {
                this.spinner.show()
                let data = {
                  addDSRArray: this.addDSRArray,
                  nzDetails: this.readingData,
                  dsrDetailsDealerId: this.fuelDealerId,
                  dsrDetailsCreatedBy: this.userName,
                  dsrDetailsMonth: this.filterForm.value.month,
                  dsrDetailsYear: this.filterForm.value.year,
                  dsrDetailsProductId: this.filterForm.value.product,
                  dsrDetailsEntryFrom: 'PORTAL-Shift',
                }
                this.post.addDSRDetailsPOST(data).subscribe(res => {
                  if (res.status == 'OK') {
                    alert("Details submited successfully")
                    this.readingData.length = 0;
                    this.addDSRArray[0].rate = '';
                    this.addDSRArray[0].rateId = '';
                    this.addDSRArray[0].rateDetails = []
                    this.getProductWiseMeterSales(this.fuelDealerId)
                    this.getDSRMeterSales(this.fuelDealerId)
                    this.spinner.hide()
                  } else {
                    alert("Readings Already Added for this Date..!")
                    this.spinner.hide()
                  }
                })
              }
              else {
                alert("please get rate")
              }
            } else {
              alert("Please select date of selected month")
            }
          }
          else {
            alert("Please select product")
          }
        } else {
          alert("Please select year")
        }
      } else {
        alert("Please select month")
      }
    } else {
      alert("Please Re-select Date and get All Nozzle.. or Set Infra to get Tank Nozzle")
    }
  }

  //getTankDSRDetails
  getTankDSRDetails(fuelDealerId: any) {
    this.tkDSRDetails = []
    this.spinner.show();
    let data = {
      dealerId: fuelDealerId,
      month: moment(this.filterForm.value.month, ["MMM"]).format("MM"),
      year: this.filterForm.value.year,
      fuelProductId: this.filterForm.value.product
    }
    this.post.getTankDSRDetailPOST(data)
      .subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.showViewTableSTOCK = true
          this.showViewTable = true
          this.tkDSRDetails = res.data;
          this.nxtMonthTankStockDetails = res.data1
          this.tkDSRData = res.data[0].tkDSRData
          this.cd.detectChanges();
          this.getCombine()
          this.spinner.hide();
        } else {
          this.showViewTableSTOCK = false
          this.tkDSRDetails = [];
          this.cd.detectChanges();
          this.getCombine()
          this.spinner.hide();
        }
      })
  }

  //showAddTable1()
  showAddTable1() {
    if (this.isAdd1 == true) {
      this.isAdd1 = false;
    } else {
      if (this.filterForm.value.product) {
        this.isAdd1 = true;
      } else {
        alert("Please select Product..")
      }
    }
  }

  updateCol1() {
    if (this.isUpdateCol1 == true) {
      this.isUpdateCol1 = false;
    } else {
      this.isUpdateCol1 = true;
    }
  }

  // openUpdateModal 
  openUpdateModal1(updateModal1: any, tkDSRData: any) {
    this.tkDSRDataUpdate = tkDSRData
    this.modalUpdate1 = this.modalService.open(updateModal1)
    this.modalUpdate1.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  updateDSRDetails1(id: any, i: any) {
    this.spinner.show();
    let data = {
      tankStockDetailsDSRId: id,
      tankStockDetailsDSRStock: this.tkDSRDataUpdate[i].tankStockDetailsDSRStock,
    }
    this.post.updateTankDSRDetailsPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          alert("readings updated successfully..!")
          this.getTankDSRDetails(this.fuelDealerId);
          this.spinner.hide()
        } else {
          alert("error to update..!")
          this.spinner.hide()
        }
      })
  }

  // deleteEntry
  deleteEntry1(id: any) {
    this.spinner.show()
    let data = {
      dsrDetailsId: id,
    }
    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteTankDSRDetailsPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("deleted successfully..!")
            this.getTankDSRDetails(this.fuelDealerId);
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

  exportToPDF1() {
    var doc = new jsPDF('l', 'pt');
    doc.setFontSize(12);
    doc.text(this.headerName1, 40, 25);
    doc.setFontSize(8);
    doc.text(this.headerName2, 40, 40);
    doc.text(this.headerName3, 40, 55);
    doc.setFontSize(12);
    doc.text("Stock", 350, 35);
    autoTable(doc, {
      html: '#excel-table',
      startY: 70,
      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("Stock.pdf");
  }
  /*name of the excel-file which will be downloaded. */
  fileName1 = 'stock.xlsx';
  exportexcel1(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName1);
  }

  getRateByDate() {
    if (this.filterForm.value.product) {
      this.spinner.show()
      let data = {
        dealerId: this.fuelDealerId,
        fuelProductId: this.filterForm.value.product,
        date: moment(this.filterForm.value.startDate1, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        month: this.filterForm.value.month,
        year: this.filterForm.value.year
      }
      this.post.getRateByDatePOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            if (res.data.length) {
              if (res.data[0].rateDetails.length == 1) {
                this.rateSelect1 = false;
                this.addDSRArray1 = res.data;
                this.tkDetails = res.data1;
                this.addDSRArray1[0].date = moment(this.filterForm.value.startDate1, ["DD-MM-YYYY"]).format("DD-MM-YYYY");
                this.cd.detectChanges();
              } else if (res.data[0].rateDetails.length != 1) {
                this.rateSelect1 = true;
                this.addDSRArray1 = res.data;
                this.tkDetails = res.data1;
                this.addDSRArray1[0].rateId = res.data[0].fuelPriceTableId
                this.addDSRArray1[0].date = moment(this.filterForm.value.startDate1, ["DD-MM-YYYY"]).format("DD-MM-YYYY")
                this.cd.detectChanges();
              }
              this.spinner.hide()
              this.cd.detectChanges();
            } else {
              this.spinner.hide()
              this.cd.detectChanges();
            }
          }
        })
    }
  }

  submitTKDSRDetails() {
    if (this.tkDetails.length) {
      if (this.filterForm.value.month) {
        if (this.filterForm.value.year) {
          if (this.filterForm.value.product) {
            if (moment(this.addDSRArray1[0].date, ["DD-MM-YYYY"]).format("MM") == moment(this.filterForm.value.month, ["MMM"]).format("MM")) {
              if (this.addDSRArray1[0].rateId) {
                this.spinner.show()
                let data = {
                  addDSRArray: this.addDSRArray1,
                  tkDetails: this.tkDetails,
                  dsrDetailsDealerId: this.fuelDealerId,
                  dsrDetailsCreatedBy: this.userName,
                  dsrDetailsMonth: this.filterForm.value.month,
                  dsrDetailsYear: this.filterForm.value.year,
                  dsrDetailsProductId: this.filterForm.value.product,
                  dsrDetailsEntryFrom: 'PORTAL',
                }
                this.post.addTankDSRDetailsPOST(data).subscribe(res => {
                  if (res.status == 'OK') {
                    alert("Details submited successfully")
                    this.tkDetails.length = 0;
                    this.addDSRArray1[0].rate = '';
                    this.addDSRArray1[0].rateId = '';
                    this.addDSRArray1[0].rateDetails = []
                    this.cd.detectChanges();
                    this.getTankDSRDetails(this.fuelDealerId);
                    this.spinner.hide()
                  } else {
                    alert("Readings Already Added for this Date..!")
                    this.spinner.hide()
                  }
                })
              }
              else {
                alert("Please set rate")
              }
            } else {
              alert("Please select date of selected month")
            }
          }
          else {
            alert("Please select product")
          }
        } else {
          alert("Please select year")
        }
      } else {
        alert("Please select month")
      }
    } else {
      alert("Please Re-select product or Set Infra to get Tank")
    }
  }



  //getCombine()
  getCombine() {
    this.dsrBookDetails.length = 0
    this.dsrBookData.length = 0
    let j = 1;
    this.DsrDetails.map((res: any) => {
      const dataJson = {
        dsrDetailsId: '',
        date: '',
        openingStock: 0,
        productPurchase: 0,
        totalStock: 0,
        meterSales: 0,
        meterSalesRs: 0,
        totalMeterSales: 0,
        pumpTesting: 0,
        rate: 0,
      };
      this.tkDSRDetails.map((res1: any) => {
        if (res.dsrDetailsEntryDate == res1.tankDSRDetailsDate && res.rateId == res1.rateId) {
          dataJson.dsrDetailsId = res.dsrDetailsId;
          dataJson.date = res.dsrDetailsEntryDate;
          dataJson.openingStock = Number(res1.totalStockQuantity);
          dataJson.productPurchase = Number(res1.productPurchase);
          if (this.tkDSRDetails.length > 1 && this.tkDSRDetails.length > j) {
            dataJson.totalStock = Number(res1.stockQuantity);
          } else {
            if (this.nxtMonthTankStockDetails.length) {
              dataJson.totalStock = Number(res1.stockQuantity) + this.tkDSRDetails[j - 1].productPurchase
            }
          }
          dataJson.meterSales = Number(res.meterSalesQuantity)
          dataJson.totalMeterSales = Number(res.totalMeterSales)
          dataJson.pumpTesting = Number(res.pumpTesting)
          dataJson.rate = Number(res.rate)
          j = j + 1
          this.dsrBookData.push(dataJson);
        }
      })
    })
    this.cd.detectChanges();
    this.getFinalCombination()
  }

  //getFinalCombination()
  getFinalCombination() {
    let i = 1;
    let cumlMeterSale = 0;
    let cumlDipSale = 0;
    let cumlVariation = 0;

    this.dsrBookData.map((res1: any) => {
      const dataJson = {
        dsrDetailsId: '',
        date: '',
        openingStock: 0,
        productPurchase: 0,
        totalStock: 0,
        meterSales: 0,
        meterSalesRs: 0,
        totalMeterSales: 0,
        pumpTesting: 0,
        dipSales: 0,
        dailyVariation: 0,
        cummMeterSales: 0,
        cummDipSales: 0,
        cummVariation: 0,
        rate: 0,
      };
      dataJson.dsrDetailsId = res1.dsrDetailsId;
      dataJson.date = res1.date;
      dataJson.rate = Number(res1.rate)
      dataJson.openingStock = Number(res1.openingStock);
      dataJson.productPurchase = Number(res1.productPurchase);
      dataJson.dipSales = Number(res1.totalStock);
      dataJson.meterSales = Number(res1.meterSales)
      dataJson.totalMeterSales = Number(res1.totalMeterSales)
      dataJson.pumpTesting = Number(res1.pumpTesting)
      if (this.dsrBookData.length > 1 && this.dsrBookData.length > i) {
        dataJson.dailyVariation = Number(res1.meterSales) - Number(res1.totalStock)
        cumlMeterSale = Number(cumlMeterSale) + Number(res1.meterSales)
        cumlDipSale = Number(cumlDipSale) + Number(res1.totalStock)
        cumlVariation = Number(cumlVariation) + (Number(dataJson.dailyVariation))
        dataJson.cummMeterSales = Number(cumlMeterSale)
        dataJson.cummDipSales = Number(cumlDipSale)
        dataJson.cummVariation = Number(cumlVariation)
      } else {
        if (this.nxtMonthTankStockDetails.length) {
          dataJson.dailyVariation = Number(res1.meterSales) - Number(res1.totalStock)
          cumlMeterSale = Number(cumlMeterSale) + Number(res1.meterSales)
          cumlDipSale = Number(cumlDipSale) + Number(res1.totalStock)
          cumlVariation = Number(cumlVariation) + (Number(dataJson.dailyVariation))
          dataJson.cummMeterSales = Number(cumlMeterSale)
          dataJson.cummDipSales = Number(cumlDipSale)
          dataJson.cummVariation = Number(cumlVariation)
        } else {
          dataJson.cummMeterSales = Number(cumlMeterSale)
          dataJson.cummDipSales = Number(cumlDipSale)
          dataJson.cummVariation = Number(cumlVariation)
        }
      }
      i = i + 1
      this.dsrBookDetails.push(dataJson);
    })
    this.cd.detectChanges();
    this.updateDSRDetailsByBook(this.dsrBookDetails);
    this.spinner.hide()
  }

  //updateDSRDetailsByBook(this.dsrBookDetails)
  updateDSRDetailsByBook(dsrBookDetails: any) {
    if (dsrBookDetails.length) {
      let data = {
        dsrBookDetails: dsrBookDetails,
      }
      this.post.updateDSRDetailsByBookPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.cd.detectChanges();
          } else {
            this.cd.detectChanges();
          }
        })
    } else {
      this.cd.detectChanges();
    }
  }

  exportToPDF2() {
    var doc = new jsPDF('l', 'pt');
    doc.setFontSize(12);
    doc.text(this.headerName1, 40, 25);
    doc.setFontSize(8);
    doc.text(this.headerName2, 40, 40);
    doc.text(this.headerName3, 40, 55);
    doc.text(this.headerName4, 40, 65);
    doc.setFontSize(12);
    doc.text("DSR", 350, 35);
    autoTable(doc, {
      html: '#excel-table',
      startY: 70,
      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("DSR.pdf");
  }
  /*name of the excel-file which will be downloaded. */
  fileName2 = 'DSR.xlsx';
  exportexcel2(): void {
    /* table id is passed over here */
    let element = document.getElementById('excel-table');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, this.fileName2);
  }

  selectYear(id: any) {
    this.startDate = moment(id.target.value + '-' + this.filterForm.value.month + '-' + "01", ["YYYY-MMM-DD"]).format("DD-MM-YYYY")
    this.filterForm.controls["startDate"].setValue(this.startDate)
    this.filterForm.controls["startDate1"].setValue(this.startDate)
    this.getProductWiseMeterSales(this.fuelDealerId)
    this.getRateReadingByDate()
    this.getRateByDate()
    this.getDSRMeterSales(this.fuelDealerId)

  }
}
