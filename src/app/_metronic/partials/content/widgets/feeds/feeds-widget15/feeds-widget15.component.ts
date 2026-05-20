import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeedsService } from '../feeds.services';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseTablesService } from '../../base-tables/base-tables.services';
import { WidgetService } from '../../widgets.services';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ExcelService } from 'src/app/pages/excel.service';


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
  selector: 'app-feeds-widget15',
  templateUrl: './feeds-widget15.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FeedsWidget15Component implements OnInit {
  fuelDealerId: any;
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
  headerName2: any;
  headerName3: string;
  GSTNumber: string;


  filterForm = new FormGroup({
    customerName: new FormControl(''),
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    customerNameDAY: new FormControl(''),
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
  currentYear: string;
  productsData: any = [];
  products = [
    { fuelProductsId: 25, productName: 'LUBRICANTS' },
    // Add more products as needed
  ];
  productId: any;
  customerId: any;
  headerName4: string;
  dayWiseQtyDataExcel: any = [];

  constructor(private post: FeedsService,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    public router: Router,
    private cd: ChangeDetectorRef,
    private post1: BaseTablesService,
    private post2: WidgetService,
    private excelService: ExcelService,
  ) { }


  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.accessGroup = element.accessGroupId;
    if (this.accessGroup == 12 || this.accessGroup == 19) {
      this.dealerView = true;
      this.ownerName = element.firstName + ' ' + element.lastName
      this.companyName = dealerData.companyName
      this.oilCompanyName = dealerData.brandName
      this.state = dealerData.state
      this.pin = dealerData.pin
      this.city = dealerData.city
      this.phone1 = dealerData.hostPhone
      this.headerName1 = dealerData.companyName;
      this.headerName2 = dealerData.address1 + ', ' + dealerData.address2 + ', ' + dealerData.city;
      this.headerName3 = dealerData.state + '-' + dealerData.pin + '  ' + "GST: " + dealerData.GSTNumber;
    }
    this.dealerMobile = element.phone1;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.managerName = element.firstName + ' ' + element.lastName
    this.acceesGroup = element.accessGroupId;
    this.currentYear = moment(new Date()).format("MM YYYY");
    this.filterForm.controls["startDate"].setValue("01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear())
    this.filterForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
    this.filterForm.controls["productNameDAY"].setValue("")
    this.getFuelCreditCorporateByfuelDealerId(this.fuelDealerId)
    this.getFCYear()
    this.getProductsByDealerId(this.fuelDealerId)
    this.getCustDayWiseQty();

    if (element.accessGroupId == '14') {
      var managerData = JSON.parse(localStorage.getItem('managerData') || '{}');
      this.customerId = managerData.customerId;
      this.searchDealerBycustomerId(this.customerId)
    }
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
      this.post1.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
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
      this.post1.getCorporateInfoByCorporateCustomerMapIdPOST(data)
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
    this.spinner.show()
    this.allCorporateList = []
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getFuelCreditRequestCorporateByfuelDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.allCorporateList = res.data;
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.spinner.hide();
          this.cd.detectChanges()
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

  getCustDayWiseQty() {
    this.headerName4 = moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('DD/MM/YYYY') + ' - ' + moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('DD/MM/YYYY')
    if (this.fuelDealerCorpMapId && this.productId) {

      this.dayWiseQtyData = []
      this.spinner.show()
      let data = {
        fuelDealerCustomerMapId: this.fuelDealerCorpMapId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        prodId: this.productId
      }

      this.post1.getDayWiseCustLedgerQtyNewPOST(data)

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
    } else if (this.fuelDealerCorpMapId) {

      this.dayWiseQtyData = []
      this.spinner.show()
      let data = {
        fuelDealerCustomerMapId: this.fuelDealerCorpMapId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }

      this.post1.getDayWiseCustLedgerQtyNewPOST(data)

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
    } else if (this.productId) {

      this.dayWiseQtyData = []
      this.spinner.show()
      let data = {
        prodId: this.productId,
        fuelDealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }
      //getDayWiseLedgerQtyPOST
      this.post1.getDayWiseCustLedgerQtyNewPOST(data)

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
      this.spinner.show()
      this.dayWiseQtyData = []
      let data = {
        fuelDealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD'),
      }

      this.post1.getDayWiseCustLedgerQtyNewPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.dayWiseQtyData = res.data;
            localStorage.setItem('dayWiseQtyData', JSON.stringify(this.dayWiseQtyData));
            this.spinner.hide();
            this.cd.detectChanges();

          } else {
            alert("Data Not Found..!")
            localStorage.setItem('dayWiseQtyData', JSON.stringify([]));
            this.spinner.hide();
            this.cd.detectChanges();
          }
        })
    }
  }

exportToPDF() {

  var cols = [["Khata Name", "Product", "Quantity", "Sales Amount"]];
  var rows: any[] = [];

  for (var key in this.dayWiseQtyData) {

    var temp = [
      this.dayWiseQtyData[key].companyName,
      this.dayWiseQtyData[key].productName,
      Number(this.dayWiseQtyData[key].totalQuantity).toFixed(2),
      Number(this.dayWiseQtyData[key].totalPurchase).toFixed(2),
    ];

    rows.push(temp);
  }

  var doc = new jsPDF('l', 'pt');

  doc.setFontSize(12);
  doc.text(this.headerName1, 40, 25);

  doc.setFontSize(8);
  doc.text(this.headerName2, 40, 40);
  doc.text(this.headerName3, 40, 55);
  doc.text(this.headerName4, 40, 65);

  doc.setFontSize(12);
  doc.text("Credit book (Customer-wise)", 350, 35);

  autoTable(doc, {
    head: cols,
    body: rows,
    startY: 80,
    theme: 'grid',

    styles: {
      fontSize: 8
    },

    headStyles: {
      fillColor: [198, 239, 206],
    textColor: [0, 0, 0]        // black text
    },

    margin: { top: 70 },

    pageBreak: 'auto'
  });

  doc.save("CreditBook_Customerwise.pdf");
}


  pageChangeEvent(event: number) {
    this.p = event;
    this.getCustDayWiseQty();
    this.cd.detectChanges();
  }

  getProductsByDealerId(fuelDealerId: any) {
    this.spinner.show()
    this.productsData = [];
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getFuelProductIdByDealerIdPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.productsData = res.data;
        this.spinner.hide();
        this.cd.detectChanges()
      } else {
        this.spinner.hide();
        this.cd.detectChanges()
      }
    })
  }

  getPrice(id: any) {
    this.productId = id.target.value;
  }

  searchDealerBycustomerId(customerId: any) {
    this.spinner.show()
    let data = {
      customerId: customerId,
    };
    this.post2.getCustomerByCustomerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.headerName1 = res.data[0].companyName;
          this.headerName2 = res.data[0].address1 + ', ' + res.data[0].address2 + ', ' + res.data[0].city;
          this.headerName3 = res.data[0].state + '-' + res.data[0].pin + '  ' + "GST: " + res.data[0].GSTNumber;
          this.spinner.hide();
          this.cd.detectChanges();

        } else {
          this.spinner.hide();
          this.cd.detectChanges();
        }
      });
  }

  exportexcel() {
      this.dayWiseQtyDataExcel.length = 0

      this.dayWiseQtyData.map((res: { companyName: any; productName: any; totalQuantity: any; totalPurchase: any; }) => {

        var json = {
          Khata_Name: res.companyName,
          Product: res.productName,
          Quantity: Number(res.totalQuantity).toFixed(2),
          Sales_Amount: Number(res.totalPurchase).toFixed(2)
        };
        this.dayWiseQtyDataExcel.push(json);
      });

      this.excelService.exportAsExcelFile(
        this.dayWiseQtyDataExcel,
        "Customer-wise ledger"
      );
    }
  
    clear(){
    this.filterForm.reset()
    this.filterForm.controls['customerNameDAY'].setValue("")
    this.filterForm.controls['productNameDAY'].setValue("")
    this.fuelDealerCorpMapId = '';
    this.productId = '';
    this.filterForm.controls["startDate"].setValue("01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear())
    this.filterForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
    this.getCustDayWiseQty();
    }
}