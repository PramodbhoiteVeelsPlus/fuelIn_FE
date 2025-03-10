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
import { ListWidgetService } from '../../lists/listWidget.services';
import { WidgetService } from '../../widgets.services';

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
  selector: 'app-base-tables-widget8',
  templateUrl: './base-tables-widget8.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class BaseTablesWidget8Component implements OnInit {
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
  headerName3: string;
  GSTNumber: string;
  productsData: any = [];
  products = [
    { fuelProductsId: 25, productName: 'LUBRICANTS' },
    // Add more products as needed
  ];
  productId: any;


  filterForm = new FormGroup({
    customerName: new FormControl(''),
    fiscalyear: new FormControl([], Validators.required),
    productNameDAY: new FormControl(''),
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
  year: string;
  month: string;
  financialYear: any;
  financialYear2: any;
  fiscalyear1: any;
  fiscalyear2: any;
  currentMonth: number;
  yearWiseQtyData: any = [];
  startDate: number;
  endDate: number;
  headerName2: string;
  customerId: any;

  constructor(
    private modalService: NgbModal,
    private post: BaseTablesService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private post1: ListWidgetService,
    private router: Router,
    private post2: WidgetService,) {
  }

  ngOnInit(): void {
    this.yearWiseQtyData = JSON.parse(localStorage.getItem('yearWiseQtyData') || '{}');
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
      this.headerName2 = dealerData.address1+', '+dealerData.address2+', '+dealerData.city;
      this.headerName3 = dealerData.state + '-' + dealerData.pin + '  ' + "GST: " + dealerData.GSTNumber;
    }
    this.dealerMobile = element.phone1;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.managerName = element.firstName + ' ' + element.lastName
    this.acceesGroup = element.accessGroupId;
    this.year = moment(new Date()).format("YYYY");
    this.month = moment(new Date()).format("MMM");

    this.financialYear = "Apr " + (new Date().getFullYear())
    this.financialYear2 = "Apr " + (new Date().getFullYear())
    if (Number(moment(this.financialYear).format("MM")) > Number(moment(this.month).format("MM"))) {
      this.fiscalyear1 = "Apr " + (new Date().getFullYear() - 1) + " - " + "Mar " + (new Date().getFullYear())
      this.fiscalyear2 = "Apr " + (new Date().getFullYear()) + " - " + "Mar " + (new Date().getFullYear() + 1)
      console.log(" ,", this.fiscalyear1, this.fiscalyear2)
    } else {
      this.fiscalyear1 = "Apr " + (new Date().getFullYear() - 1) + " - " + "Mar " + (new Date().getFullYear())
      this.fiscalyear2 = "Apr " + (new Date().getFullYear()) + " - " + "Mar " + (new Date().getFullYear() + 1)
      console.log("11 ,", this.fiscalyear1, this.fiscalyear2)
    }
    this.currentMonth = new Date().getMonth() + 1
    this.filterForm.controls['fiscalyear'].setValue(this.fiscalyear1);
    this.filterForm.controls["productNameDAY"].setValue("")
    this.getFuelCreditCorporateByfuelDealerId(this.fuelDealerId)
    this.getProductsByDealerId(this.fuelDealerId)
    if (!this.yearWiseQtyData.length) {
      this.getYearQtyWise();
    } else {
      this.getYearQtyWise1();
    }
    
    if(element.accessGroupId == '14'){
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

  getYearQtyWise() {
    if (this.filterForm.value.fiscalyear == this.fiscalyear1) {
      this.startDate = new Date().getFullYear() - 1
      this.endDate = new Date().getFullYear()
    } else if (this.filterForm.value.fiscalyear == this.fiscalyear2) {
      this.startDate = new Date().getFullYear()
      this.endDate = new Date().getFullYear() + 1
    } else {

    }

    if(this.fuelDealerCorpMapId && this.productId){
      this.yearWiseQtyData = []
      this.spinner.show()
      let data = {
        fuelDealerCustomerMapId: this.fuelDealerCorpMapId,
        startDate: moment(this.startDate, ["YYYY"]).format("YYYY-04-01"),
        endDate: moment(this.endDate, ["YYYY"]).format("YYYY-03-31"),
        prodId: this.productId
      }

      this.post.getMonthlyCrDetailsQtyNewPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.yearWiseQtyData = res.data;
            this.spinner.hide();
            this.cd.detectChanges()

          } else {
            alert("Data Not Found..!")
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
    } else if (this.fuelDealerCorpMapId) {
      this.yearWiseQtyData = []
      this.spinner.show()
      let data = {
        fuelDealerCustomerMapId: this.fuelDealerCorpMapId,
        startDate: moment(this.startDate, ["YYYY"]).format("YYYY-04-01"),
        endDate: moment(this.endDate, ["YYYY"]).format("YYYY-03-31")
      }

      this.post.getMonthlyCrDetailsQtyNewPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.yearWiseQtyData = res.data;
            this.spinner.hide();
            this.cd.detectChanges()

          } else {
            alert("Data Not Found..!")
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
    } else if(this.productId){
      this.yearWiseQtyData = []
      this.spinner.show()
      let data = {
        fuelDealerId: this.fuelDealerId,
        prodId: this.productId,
        startDate: moment(this.startDate, ["YYYY"]).format("YYYY-04-01"),
        endDate: moment(this.endDate, ["YYYY"]).format("YYYY-03-31")
      }

      //getMonthlyCrDetailsQtyPOST OLd api
      this.post.getMonthlyCrDetailsQtyNewPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.yearWiseQtyData = res.data;
            this.spinner.hide();
            this.cd.detectChanges()

          } else {
            alert("Data Not Found..!")
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })

    } else {
      this.spinner.show()
      this.yearWiseQtyData = []
      let data = {
        fuelDealerId: this.fuelDealerId,
        startDate: moment(this.startDate, ["YYYY"]).format("YYYY-04-01"),
        endDate: moment(this.endDate, ["YYYY"]).format("YYYY-03-31")
      }

      this.post.getMonthlyCrDetailsQtyNewPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.yearWiseQtyData = res.data;
            localStorage.setItem('yearWiseQtyData', JSON.stringify(this.yearWiseQtyData));
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            alert("Data Not Found..!")
            localStorage.setItem('yearWiseQtyData', JSON.stringify([]));
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
    }
  }

  getYearQtyWise1() {
    if (this.filterForm.value.fiscalyear == this.fiscalyear1) {
      this.startDate = new Date().getFullYear() - 1
      this.endDate = new Date().getFullYear()
    } else if (this.filterForm.value.fiscalyear == this.fiscalyear2) {
      this.startDate = new Date().getFullYear()
      this.endDate = new Date().getFullYear() + 1
    } else {

    }

    if (this.fuelDealerCorpMapId) {
      this.yearWiseQtyData = []
      this.spinner.show()
      let data = {
        fuelDealerCustomerMapId: this.fuelDealerCorpMapId,
        startDate: moment(this.startDate, ["YYYY"]).format("YYYY-04-01"),
        endDate: moment(this.endDate, ["YYYY"]).format("YYYY-03-31")
      }

      this.post.getMonthlyCrDetailsQtyPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.yearWiseQtyData = res.data;
            this.spinner.hide();
            this.cd.detectChanges()

          } else {
            alert("Data Not Found..!")
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
    } else {
      this.spinner.show()
      this.yearWiseQtyData = []
      let data = {
        fuelDealerId: this.fuelDealerId,
        startDate: moment(this.startDate, ["YYYY"]).format("YYYY-04-01"),
        endDate: moment(this.endDate, ["YYYY"]).format("YYYY-03-31")
      }

      this.post.getMonthlyCrDetailsQtyPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.yearWiseQtyData = res.data;
            localStorage.setItem('yearWiseQtyData', JSON.stringify(this.yearWiseQtyData));
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            alert("Data Not Found..!")
            localStorage.setItem('yearWiseQtyData', JSON.stringify([]));
            this.spinner.hide();
            this.cd.detectChanges()
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

  exportToPDFMONTHQty() {
    var doc = new jsPDF('l', 'pt');
    doc.setFontSize(12);
    doc.text(this.headerName1, 40, 25);
    doc.setFontSize(8);
    doc.text(this.headerName2,40, 40 );   
    doc.text(this.headerName3, 40, 55);
    doc.setFontSize(12);
    doc.text("Credit Book (month-wise)", 350, 35);

    autoTable(doc, {
      html: '#excel-table2',
      startY: 70,

      theme: 'grid',
      didDrawCell: (data) => { },
    });
    doc.save("CreditBook_MonthWise.pdf");
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getYearQtyWise();
    this.cd.detectChanges();
  }

  getProductsByDealerId(fuelDealerId: any) {
    this.spinner.show()
    this.productsData = [];
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post1.getFuelProductIdByDealerIdPOST(data).subscribe(res => {
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

  getPrice(id: any){
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
          this.cd.detectChanges()        
          
        } else {
          this.spinner.hide();
          this.cd.detectChanges()
        }
      });
}
}
