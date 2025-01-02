import { Component, Injectable, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { Options } from '@angular-slider/ngx-slider';
import { NgxSpinnerService } from 'ngx-spinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
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
  selector: 'app-tiles-widget10',
  templateUrl: './tiles-widget10.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TilesWidget10Component {

  filterForm = new FormGroup({
    rate: new FormControl("", Validators.required),
    date: new FormControl("", Validators.required),
    month: new FormControl("", Validators.required),
    year: new FormControl("", Validators.required),
    product: new FormControl("", Validators.required),
    tank: new FormControl("", Validators.required),
    tankId: new FormControl("", Validators.required),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  currentYear: any;
  lastYear: number;
  last2Year: number;
  lastFourthYear: number;
  lastFifthYear: number;
  tankList: any = [];
  loginCorporateId: any;
  accessGroupId: any;
  fuelDealerId: any;
  tankDetails: any = [];
  tankData: any = [];
  tankNo: string;
  selectedDate: string;
  dealerAccess: boolean;
  dealerLoginVPId: any;
  isAdd: boolean;
  rateSelect: boolean;
  addDSRArray1: any = [];
  rateSelect1: boolean;
  purchaseDetails: any;
  purchaseData: any = [];
  productName: any;
  productPurchase: any = "";
  productPurchaseAmt: any = "";
  productId: string;
  productPrice: any;
  rateId: any;
  rateData: any = [];
  rateDetails: any = [];
  rate: any;
  tankDsrDetails: any = [];
  isView: boolean = false;
  userName: string;
  fuelTankDetailsId: any;
  stock: any = "";
  stockAmt: any = "";
  reading: any;
  fuelInfraMapId: any;
  infraMapId: any;
  tankId: any;
  addTankList: any = [];
  allTankDetails: any = [];
  tkDSRData: any[];
  allTankDsrData: any = [];
  allTankDsrArray: any = [];
  modalUpdateReference: any;
  closeResult: string;
  modalUpdate: any;
  tkNzDSRUpdate: any = [];
  tkDSRUpdate: any = [];
  tankDSRId: string;
  updatedStock: string;
  updatedPurchase: string;
  updatedPurchaseAmt: string;
  updatedBy: string;
  tkDSRId: string;
  tank: any;
  isUpdateCol: boolean = false;
  headerName1: string | string[];
  headerName2: string | string[];
  headerName3: string | string[];
  tankDsrBookDetails: any = [];
  headerName4: any;
  shiftReadings: any = [];

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


  constructor(
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private post: TilesService,
    private cd: ChangeDetectorRef,
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
    this.lastYear = Number(this.currentYear) - 1;
    this.last2Year = Number(this.currentYear) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
    this.lastFifthYear = Number(this.currentYear) - 4;
    this.accessGroupId = element.accessGroupId;
    if (this.accessGroupId == '12') {
      var dealerData = JSON.parse(localStorage.getItem('dealerData') || '')
      this.headerName1 = dealerData.companyName;
      this.headerName2 = dealerData.address1 + ', ' + dealerData.address2 + ', ' + dealerData.city;
      this.headerName3 = dealerData.state + '-' + dealerData.pin + '  ' + "GST: " + dealerData.GSTNumber;
    }
    if (this.accessGroupId == '14') {
      var managerData = JSON.parse(localStorage.getItem('managerData') || '');
      this.headerName1 = managerData.companyName;
      this.headerName2 = managerData.address1 + ', ' + managerData.address2 + ', ' + managerData.city;
      this.headerName3 = managerData.state + '-' + managerData.pin + '  ' + "GST: " + managerData.GSTNumber;
    }
    this.filterForm.controls["date"].setValue(moment(new Date()).format("DD-MM-YYYY"))
    this.getTankList(this.fuelDealerId);
  }

  setMonth(tickValue: any) {
    if (moment(tickValue, ["MM"]).format(this.filterForm.value.year + "-MM-01") <= moment(new Date()).format("YYYY-MM-01")) {
      this.filterForm.controls["month"].setValue(moment(tickValue, ["MM"]).format("MMM") + this.filterForm.value.year)
      this.filterForm.controls["date"].setValue(moment(tickValue, ["MM"]).format("01-MM-") + this.filterForm.value.year)
      if (this.tankId) {
        this.getTankDSR();
        this.getRateByDate();
      }
    } else {
      alert("Invalid Month Select");
      this.filterForm.controls['month'].setValue(moment(new Date()).format("MMM"));
      tickValue = moment(new Date()).format("M")
    }
  }

  //getTankList For Select Tank
  getTankList(fuelDealerId: any) {
    const data = {
      fuelDealerId: fuelDealerId,
    };
    this.post.getAllTankByDealerIdPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.tankList = res.data;
        this.cd.detectChanges();
      } else {
        this.cd.detectChanges();
      }
    });
  }

  getTankDetails() {
    if (this.tank) {
      this.spinner.show();
      this.tankData = [];
      this.productName = '';
      this.productId = '';
      const data = {
        fuelDealerId: this.fuelDealerId,
        tankNo: this.tank,
      }
      this.post.getNZByTankNoPOST(data).subscribe((res) => {
        if (res.status == "OK" && res.data.length) {
          this.tankDetails = res.data;
          this.productName = res.data[0].productName;
          this.productId = res.data[0].fuelProductId;
          this.getTankDSR();
          this.headerName4 = res.data[0].tankNo + '  ' + res.data[0].productName;
          if (this.filterForm.value.date) {
            this.getRateByDate();
          } else {
            this.tankData = [];
            this.tankDetails.map((res1: any) => {
              const dataJSON = {
                infraMapId: '',
                tankNo: '',
                duNo: '',
                nozNo: '',
                tankVolume: '',
                productName: '',
                mapstatus: '',
                reading: 0,
                pumpTesting: 0,
                density: 0,
                tkNzDu: '',
              };

              dataJSON.infraMapId = res1.fuelInfraMapId;
              dataJSON.tankNo = res1.tankNo;
              dataJSON.duNo = res1.duNo;
              dataJSON.nozNo = res1.nozNo;
              dataJSON.tankVolume = res1.tankVolume;
              dataJSON.productName = res1.productName;
              dataJSON.mapstatus = res1.mapstatus;
              dataJSON.tkNzDu = res1.duNo + res1.nozNo;

              this.tankData.push(dataJSON);
            })
            this.cd.detectChanges();
            this.spinner.hide();
          }
        } else {
          this.spinner.hide();
        }
      })
    } else {
      this.tankData = [];
      this.productName = '';
      this.productId = '';
    }
  }

  getProductPurchase() {
    this.productPurchase = "";
    this.productPurchaseAmt = "";
    const data = {
      dealerId: this.fuelDealerId,
      startDate: moment(this.filterForm.value.date, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      endDate: moment(this.filterForm.value.date, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      productId: this.productId,
    }
    this.post.getProductPurchasePOST(data).subscribe((res) => {
      if (res.status == "OK") {
        if (res.data.length) {
          this.productPurchase = res.data[0].quantity;
          this.productPurchaseAmt = res.data[0].totalAmount;
          this.cd.detectChanges();
        }
      } else {
        this.cd.detectChanges();
      }
    })
  }


  //showAddTable()
  showAddTable() {
    if (this.isAdd == true) {
      this.isAdd = false;
      this.isView = true;
      this.cd.detectChanges();
    } else {
      if (this.filterForm.value.tankId) {
        this.isAdd = true;
        this.isView = false;
        this.cd.detectChanges();
      } else {
        alert("Please select Tank..")
        this.cd.detectChanges();
      }
    }
  }

  showViewTable() {
    if (this.isView == true) {
      if (this.filterForm.value.tankId) {
        this.isAdd = true;
        this.isView = false;
        this.cd.detectChanges();
      } else {
        this.cd.detectChanges();
        alert("Please select Tank..")
      }
    } else {
      this.isAdd = false;
      this.isView = true;
      this.cd.detectChanges();
    }
  }

  getRateByDate() {
    if (moment(this.filterForm.value.date, ["DD-MM-YYYY"]).format('YYYY-MM-DD') <= this.filterForm.value.year + "-" + moment(this.filterForm.value.month, ["MMM"]).format("MM") + "-31") {
      this.getProductPurchase();
      this.shiftReadings = []
      this.tankData = [];
      this.selectedDate = moment(this.filterForm.value.date, ["DD-MM-YYYY"]).format('YYYY-MM-DD');
      let data = {
        dealerId: this.fuelDealerId,
        fuelProductId: this.productId,
        date: moment(this.filterForm.value.date, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      this.post.getPriceByProductIdDatePOST(data)
        .subscribe(res => {
          if (res.data.length) {
            if (res.data.length == 1) {
              this.rateSelect = false;
              this.rate = res.data[0].productSellingPrice;
              this.rateId = res.data[0].fuelPriceTableId;
              this.shiftReadings = res.data1;
              this.cd.detectChanges();
              this.getNzDetailByTank();
            } else {
              if (res.data.length > 1) {
                this.rateSelect = true;
                this.rateDetails = res.data;
                this.filterForm.controls["rate"].setValue(res.data[0].fuelPriceTableId);
                this.rate = res.data[0].productSellingPrice;
                this.rateId = res.data[0].fuelPriceTableId;
                this.shiftReadings = res.data1;
                this.cd.detectChanges();
                this.getNzDetailByTank();
              }
            }
          } else {
            alert("Please add Rate for the Selected Date");
            this.cd.detectChanges();
          }
        })
    } else {
      alert("Invalid Date Selected");
      this.filterForm.controls["date"].setValue(moment(this.filterForm.value.month, ["MMM"]).format("01-MM-") + this.filterForm.value.year)
      this.cd.detectChanges();
    }
  }

  selectRateDetails(fuelPriceTableId: any, productSellingPrice: any) {
    this.rate = productSellingPrice;
    this.rateId = fuelPriceTableId;
    this.cd.detectChanges();
  }

  //getTankDSR
  getTankDSR() {
    if (this.tankId) {
      if (this.fuelDealerId && this.filterForm.value.month && this.filterForm.value.year && this.tankId) {
        this.spinner.show()
        this.tankDsrDetails = [];
        let data = {
          tkNzDSRDealerId: this.fuelDealerId,
          month: moment(this.filterForm.value.month, ["MMM"]).format("MM"),
          year: this.filterForm.value.year,
          tankId: this.tankId,
        };
        this.post.getTankDSRPOST(data).subscribe(res => {
          if (res.status == "OK") {
            if (res.data.length) {
              this.isView = true;
              this.isAdd = false;
              this.tankDsrDetails = res.data;
              this.getTankDSRBook();
              this.spinner.hide()
              this.cd.detectChanges();
            } else {
              this.isView = false;
              this.spinner.hide()
              this.cd.detectChanges();
            }
          } else {
            alert(res.msg);
            this.spinner.hide();
            this.cd.detectChanges();
          }
        })
      } else {
        alert("Please Select Month, Year");
        this.cd.detectChanges();
      }
    }

  }

  //addDsr
  addDsr() {
    if (this.tankId && this.fuelDealerId && this.productId && this.filterForm.value.date && this.tankData && this.rate && this.rateId) {
      this.spinner.show()
      let data = {
        tkDSRCreatedBy: this.userName,
        tkDSRFuelDealerId: this.fuelDealerId,
        tkDSRTankId: this.tankId,
        tkDSRTank: this.tank,
        tkDSRProductId: this.productId,
        tkDSRDate: moment(this.filterForm.value.date, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        tkDSRStock: this.stock,
        tkDSRStockAmt: this.stockAmt,
        tkDSRPurchase: this.productPurchase,
        tkDSRPurchaseAmt: this.productPurchaseAmt,
        tkDSRRateId: this.rateId,
        tkDSRRate: this.rate,
        nzArray: this.tankData,
      };
      this.post.addTankDSRPOST(data).subscribe(res => {
        if (res.status == "OK") {
          alert("DSR Submitted Successfully!")
          this.getTankDSR();
          this.tankData = [];
          this.stock = "";
          this.stockAmt = "";
          this.productPurchase = "";
          this.productPurchaseAmt = "";
          this.rateId = "";
          this.rate = "";
          this.shiftReadings = [];
          this.getNzDetailByTank();
          if ((moment(new Date()).format("YYYY-MM-DD")) >= (moment(this.selectedDate).add(1, 'day').format('YYYY-MM-DD'))) {
            this.filterForm.controls['date'].setValue(moment(this.selectedDate).add(1, 'day').format("DD-MM-YYYY"));
            if (this.tankId) {
              this.getTankDSR();
              this.getRateByDate();
            }
          } else {
            this.filterForm.controls['date'].setValue(moment(this.selectedDate).format("DD-MM-YYYY"));
            if (this.tankId) {
              this.getTankDSR();
              this.getRateByDate();
            }
          }
          this.cd.detectChanges();
          this.spinner.hide()
        }
        else {
          alert(res.msg);
          this.cd.detectChanges();
          this.spinner.hide()
        }
      })
    } else {
      alert("Required Fields Needed");
    }
  }

  onStockChange(value: any) {
    if (value && this.rate) {
      this.stockAmt = Number(this.rate) * Number(value)
      this.cd.detectChanges();
    }
  }


  //deleteDsr
  deleteTankDSR(tkDSRId: any) {
    this.spinner.show();
    let data = {
      tankDSRId: tkDSRId,
      updateBy: this.userName,
    };
    if (confirm("Are you Sure to Delete?")) {
      this.post.deleteTankDSRPOST(data).subscribe(res => {
        if (res.status == "OK") {
          alert("Deleted SuccessFully!");
          this.getTankDSR();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.cd.detectChanges();
        }
      })
    } else {

    }
  }

  openUpdateModal(updatetkDsr: any, tkNzDSR: any, tkDSRId: any, tkDSRStock: any, tkDSRPurchase: any, tkDSRPurchaseAmt: any) {
    this.tkNzDSRUpdate = tkNzDSR;
    this.tkDSRId = ""
    this.updatedStock = ""
    this.updatedPurchase = ""
    this.updatedPurchaseAmt = ""

    this.tkDSRId = tkDSRId
    this.updatedStock = tkDSRStock
    this.updatedPurchase = tkDSRPurchase
    this.updatedPurchaseAmt = tkDSRPurchaseAmt
    this.modalUpdate = this.modalService.open(updatetkDsr, { size: 'lg' })
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

  updateDsr(tkNzDSRId: any, i: any) {
    this.spinner.show();
    let data = {
      tankDSRNzId: tkNzDSRId,
      updateBy: this.userName,
      meterReading: this.tkNzDSRUpdate[i].tkNzDSRReading,
      pupmTesting: this.tkNzDSRUpdate[i].tkNzDSRDuTesting,
      density: this.tkNzDSRUpdate[i].tkNzDSRDensity,
    };
    this.post.updateTankDSRPOST(data).subscribe(res => {
      if (res.status == "OK") {
        alert("Reading Updated SuccessFully");
        this.getTankDSR();
        this.spinner.hide();
      } else {
        this.spinner.hide();
      }
    })
  }

  updateStockPurchase(tkDSRId: any) {
    this.spinner.show()
    let data = {
      tkDSRId: tkDSRId,
      tkDSRUpdateBy: this.userName,
      tkDSRStock: this.updatedStock,
      tkDSRPurchase: this.updatedPurchase,
      tkDSRPurchaseAmt: this.updatedPurchaseAmt
    }
    this.post.updateStockPurchasePOST(data).subscribe(res => {
      if (res.status == "OK") {
        alert("Updated Successfully!")
        this.getTankDSR()
        this.spinner.hide()
      } else {
        this.spinner.hide()
      }
    })
  }

  getTankDetailsById(tankId: any) {
    if (tankId.target.value) {
      this.spinner.show();
      this.tankId = tankId.target.value;
      let data = {
        tankId: tankId.target.value,
      };
      this.post.getTankDetailsByIdPOST(data).subscribe(res => {
        if (res.status == "OK") {
          this.tank = res.data[0].tankNo;
          this.cd.detectChanges();
          this.getTankDetails();
        } else {
          this.spinner.hide();
          this.cd.detectChanges();
        }
      })
    } else {
      this.tankData = [];
      this.productName = '';
      this.productId = '';
      this.spinner.hide();
      this.cd.detectChanges();
    }

  }

  updateCol() {
    if (this.isUpdateCol == true) {
      this.isUpdateCol = false;
      this.cd.detectChanges();
    } else {
      this.isUpdateCol = true;
      this.cd.detectChanges();
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

  getNzDetailByTank() {
    this.tankDetails.map((res1: any) => {
      const dataJSON = {
        infraMapId: '',
        tankNo: '',
        duNo: '',
        nozNo: '',
        tankVolume: '',
        productName: '',
        mapstatus: '',
        reading: 0,
        pumpTesting: 0,
        density: 0,
        tkNzDu: '',
      };

      dataJSON.infraMapId = res1.fuelInfraMapId;
      dataJSON.tankNo = res1.tankNo;
      dataJSON.duNo = res1.duNo;
      dataJSON.nozNo = res1.nozNo;
      dataJSON.tankVolume = res1.tankVolume;
      dataJSON.productName = res1.productName;
      dataJSON.mapstatus = res1.mapstatus;
      dataJSON.tkNzDu = res1.duNo + res1.nozNo;

      if (this.shiftReadings.length) {
        this.shiftReadings.map((res2: any) => {
          if (res1.fuelInfraMapId == res2.pumpNzId) {
            dataJSON.reading = res2.openMeter
            dataJSON.pumpTesting = res2.pumpTesting
            dataJSON.density = res2.density
          }
        })
      }
      this.tankData.push(dataJSON);
    })
    this.cd.detectChanges();
  }


  //getTankDSRBook
  getTankDSRBook() {
    if (this.fuelDealerId && this.filterForm.value.month && this.filterForm.value.year && this.tankId) {
      this.spinner.show()
      this.tankDsrBookDetails = [];
      let data = {
        tkNzDSRDealerId: this.fuelDealerId,
        month: moment(this.filterForm.value.month, ["MMM"]).format("MM"),
        year: this.filterForm.value.year,
        tankId: this.tankId,
      };
      this.post.getTankDSRBookPOST(data).subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.isView = true;
            this.tankDsrBookDetails = res.data;
            this.cd.detectChanges();
            this.spinner.hide()
          } else {
            this.isView = false;
            this.cd.detectChanges();
            this.spinner.hide()
          }
        } else {
          alert(res.msg);
          this.spinner.hide();
          this.cd.detectChanges();
        }
      })
    } else {
      alert("Please Select Month, Year or Tank");
    }
  }

  //pdf for DSR
  exportToPDF1() {
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
      startY: 80,
      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("DSR.pdf");
  }

  //csv for DSR
  fileName1 = 'DSR.xlsx';
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

}