import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { BaseTablesService } from '../base-tables.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  selector: 'app-base-tables-widget7',
  templateUrl: './base-tables-widget7.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class BaseTablesWidget7Component implements OnInit {
  fuelDealerId: any;
  dealerData: any;
  dealerCorporateId: any;
  accessGroup: any;
  acceesGroup: number;
  dealerView: boolean;
  ownerName: string;
  dealerMobile: any;
  dealerLoginVPId: any;
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: string;
  companyName: any;
  oilCompanyName: any;
  state: any;
  pin: any;
  city: any;
  phone1: any;
  headerName1: any;
  headerName3: string;
  GSTNumber: string;


  filterForm = new FormGroup({
    customerName: new FormControl(''),
    year: new FormControl("", Validators.required),
    month: new FormControl("", Validators.required),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    customerNameDAY: new FormControl(''),
    yearDAY: new FormControl("", Validators.required),
    monthDAY: new FormControl("", Validators.required),
    productNameDAY: new FormControl("", Validators.required),
  });

  fuelDealerCorpMapId: string;
  customerName: any;
  isAccountNameTableShow: boolean = false;
  isSelectedAccountName: boolean = false;
  accountNameList: any;
  allCorporateList: any = [];
  transactionData: any = [];
  quantity: string;
  transactionDataExcel: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  previousYear: number;
  ficMonths: any = [];
  dayWiseQtyData: any = [];

  constructor(
    private modalService: NgbModal,
    private post: BaseTablesService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    this.dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.accessGroup = element.accessGroupId;
    if (this.acceesGroup == 12 || this.acceesGroup == 19) {
      this.dealerView = true;
      this.ownerName = element.firstName + ' ' + element.lastName
    }
    this.dealerMobile = element.phone1;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.managerName = element.firstName + ' ' + element.lastName
    this.acceesGroup = element.accessGroupId;
    this.companyName = this.dealerData.companyName
    this.oilCompanyName = this.dealerData.brandName
    this.state = this.dealerData.state
    this.pin = this.dealerData.pin
    this.city = this.dealerData.city
    this.phone1 = this.dealerData.hostPhone
    this.headerName1 = this.companyName;
    // this.headerName2 = res.data[0].address1+', '+res.data[0].address2+', '+res.data[0].city;
    this.headerName3 = this.state + '-' + this.pin + '  ' + "GST: " + this.GSTNumber;
    this.filterForm.controls["startDate"].setValue("01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear())
    this.filterForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
    this.getFuelCreditCorporateByfuelDealerId(this.fuelDealerId)
    this.getFCYear( )
    this.cd.detectChanges()
  }


  getDetailsByCustomerMapName(id: any) {
    this.fuelDealerCorpMapId = '';
    this.filterForm.controls["customerName"].setValue(id.target.value)
    if (this.filterForm.value.customerName) {
      this.customerName = id.target.value;
      this.getCorporateInfoByfuelDealerCustomerMapId(this.customerName);
    } else {
      this.fuelDealerCorpMapId = '';
      this.filterForm.controls['customerName'].setValue('');
    }
  }

  getCorporateInfoByfuelDealerCustomerMapId(customerName: any) {
    if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {
      let data = {
        fuelDealerId: this.fuelDealerId,
        customerName: customerName,
      }
      this.post.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
        .subscribe(res => {
          if (res.data.length) {
            this.fuelDealerCorpMapId = res.data[0].fuelDealerCustomerMapId;
          } else {
            this.filterForm.controls['customerName'].setValue('');
          }
        });
    } else {
      this.fuelDealerCorpMapId = ''
      this.isAccountNameTableShow = false
      this.isSelectedAccountName = false
      let data = {
        corporateId: this.dealerCorporateId,
        customerName: customerName,
      }
      this.post.getCorporateInfoByCorporateCustomerMapIdPOST(data)
        .subscribe(res => {
          if (res.data.length) {
            // console.log("ARR_LENGTH ",res.data.length)
            if (res.data.length == 1) {
              this.fuelDealerCorpMapId = res.data[0].fuelDealerCustomerMapId;
            } else {
              this.isAccountNameTableShow = true
              this.accountNameList = res.data;
            }
          } else {
            this.filterForm.controls['customerName'].setValue('');
          }
        });
    }

  }


  getFuelCreditCorporateByfuelDealerId(fuelDealerId: any) {
    this.allCorporateList = []
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getFuelCreditRequestCorporateByfuelDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.allCorporateList = res.data;
          this.cd.detectChanges()
        } else {
        }
      });
  }

  getFCYear() {
    // Get the current date
    const currentDate = new Date();

    // Calculate the start date of the current financial year
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentFinancialYearStart = new Date(currentYear, 3, 1); // Assuming the financial year starts on April 1st

    if (Number(moment(currentDate).format("MM")) > 3) {
      // Calculate the start date of the previous financial year
      this.previousYear = currentYear - 1;
    } else {
      this.previousYear = currentYear - 2;
    }
    const previousFinancialYearStart = new Date(this.previousYear, 3, 1);

    // Loop over the months of the previous financial year
    let startDate = previousFinancialYearStart;
    while (startDate < currentDate) {
      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1;
      const dataJSON = {
        month: '',
        year: '',
        monthName: '',
        monthYear: ''
      }
      dataJSON.month = moment(month, ["M"]).format("MM")
      dataJSON.monthName = moment(month, ["M"]).format("MMM")
      dataJSON.year = moment(year, ["YYYY"]).format("YYYY")
      dataJSON.monthYear = dataJSON.month + ' ' + dataJSON.year

      this.ficMonths.push(dataJSON)
      // Increment the month
      startDate.setMonth(startDate.getMonth() + 1);
    }
    console.log(`Previous financial year:`, this.ficMonths);

  }

  getDayWiseQty() {
    if (this.fuelDealerCorpMapId) {

      this.dayWiseQtyData = []
      this.spinner.show()
      let data = {
        fuelDealerCustomerMapId: this.fuelDealerCorpMapId,
        month: moment(this.filterForm.value.monthDAY, ["MM YYYY"]).format("MM"),
        year: moment(this.filterForm.value.monthDAY, ["MM YYYY"]).format("YYYY"),
      }

      this.post.getDayWiseLedgerQtyPOST(data)

        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.dayWiseQtyData = res.data;
            this.spinner.hide();
            this.cd.detectChanges();

          } else {
            alert("Data Not Found..!")
            this.spinner.hide();
            this.cd.detectChanges();
          }
        })
    } else {

      this.dayWiseQtyData = []
      this.spinner.show()
      let data = {
        fuelDealerId: this.fuelDealerId,
        month: moment(this.filterForm.value.monthDAY, ["MM YYYY"]).format("MM"),
        year: moment(this.filterForm.value.monthDAY, ["MM YYYY"]).format("YYYY"),
      }

      this.post.getDayWiseLedgerQtyPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.dayWiseQtyData = res.data;
            this.spinner.hide();
            this.cd.detectChanges();

          } else {
            alert("Data Not Found..!")
            this.spinner.hide();
            this.cd.detectChanges();
          }
        })
    }
  }

  exportToPDFDAYQty() {
    var doc = new jsPDF('l', 'pt');

    doc.setFontSize(12);
    doc.text(this.headerName1, 40, 25);
    doc.setFontSize(8);
    // doc.text(this.headerName2,40, 40 );   
    doc.text(this.headerName3, 40, 55);
    doc.setFontSize(12);
    doc.text("Credit book (day-wise)", 350, 35);

    autoTable(doc, {
      html: '#excel-tableQTY',
      startY: 70,
      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("CreditBook_Daywise.pdf");
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getDayWiseQty();
  }
}