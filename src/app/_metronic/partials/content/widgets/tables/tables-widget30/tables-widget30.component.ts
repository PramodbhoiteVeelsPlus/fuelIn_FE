import { ChangeDetectorRef, Component, Injectable, ViewChild } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { WidgetService } from '../../widgets.services';
import moment from 'moment';
import jsPDF from 'jspdf';
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
  selector: 'app-tables-widget30',
  templateUrl: './tables-widget30.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget30Component {
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  dealerLoginVPId: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  productsList: any = [];
  allProductPriceList: any = [];
  isProduct2: boolean = false;
  isProduct3: boolean = false;
  isProduct6: boolean = false;
  isProduct5: boolean = false;
  isProduct4: boolean = false;
  product111: any;
  product11: any;
  product22: any;
  product33: any;
  product1Id: any;
  product2Id: any;
  product3Id: any;
  product444: any;
  product44: any;
  product55: any;
  product66: any;
  product4Id: any;
  product5Id: any;
  product6Id: any;
  todayDate = new Date();
  isNoRate: boolean = false;
  rate1Details: any = [];
  product1: any;
  product2: any;
  product1Rate1: any;
  product2Rate1: any;
  product3: any;
  product3Rate1: any;
  product4: any;
  product4Rate1: any;
  product5: any;
  product5Rate1: any;
  product6: any;
  product6Rate1: any;
  product1Rate2: any;
  product2Rate2: any;
  product3Rate2: any;
  product4Rate2: any;
  product5Rate2: any;
  product6Rate2: any;
  dealerAccess: boolean = false;
  liteAccess: boolean = false;
  mappingAccData: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  gst: any;
  mappingAccDataExcel: any = [];
  email: any;
  headerName2: any;
  headerName1: any;
  headerName3: any;
  mappingAccSearchData: any = [];
  searchData: any;

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private excelService: ExcelService,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    if (element.accessGroupId == 12 || element.accessGroupId == 14 || element.accessGroupId == 19 || element.accessGroupId == 21) {
      this.dealerAccess = true
      if (element.accessGroupId == 19 || element.accessGroupId == 21) {
        this.liteAccess = true
      }
    }
    this.getCorporateById(this.dealerLoginVPId);
    this.cd.detectChanges()
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  // get Corporate DetailsBy VP-Id
  getCorporateById(dealerLoginVPId: any) {
    let data = {
      veelsplusCorporateId: dealerLoginVPId
    }
    this.post.getBranchByVeelsplusIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.headerName1 = res.data[0].companyName;
            this.headerName2 = res.data[0].address1 + ', ' + res.data[0].address2 + ', ' + res.data[0].city;
            this.headerName3 = res.data[0].state + '-' + res.data[0].pin + '  ' + "GST: " + res.data[0].GSTNumber;
            this.loginSQLCorporateId = res.data[0].corporateId;
            this.getfuelDealerIdByCorporateId(this.loginSQLCorporateId);
            this.cd.detectChanges()
          }
          else {
            alert("Getting Error..! Please Logout & Login again..!")
            this.cd.detectChanges()
          }
        }
      })
  }

  // getfuelDealerIdByDealerCorporateId
  getfuelDealerIdByCorporateId(loginSQLCorporateId: any) {
    let data = {
      corporateId: loginSQLCorporateId
    }
    this.post.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.getMappingAccount(this.fuelDealerId);
          // this.getFuelPriceByProductDateDealer(this.fuelDealerId);
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
        }
      })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getMappingAccount(this.fuelDealerId);
  }

  getMappingAccount(fuelDealerId: any) {
    this.spinner.show();
    this.mappingAccData = []
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getMappingAccByFuelDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.mappingAccData = res.data;
          this.mappingAccSearchData = res.data;
          console.log("data", this.mappingAccData)
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.mappingAccData = [];
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  allCustomerPDFDownload() {

    // "Pending days",
    var cols = [["Mapped date", "Customer name", "Key person Name", "Key person mobile", "GST", "CRLimit", "CRDayLimit"]];
    var rows = [];
    for (var key in this.mappingAccData) {

      if (this.mappingAccData[key].mappingGST != 'undefined') {
        this.gst = this.mappingAccData[key].mappingGST
      } else {
        this.gst = ''
      }
      var temp = [
        moment(this.mappingAccData[key].mappingCreatedDate).format("DD-MM-YYYY"),
        this.mappingAccData[key].companyName,
        this.mappingAccData[key].hostName,
        this.mappingAccData[key].hostPhone,
        this.gst,
        this.mappingAccData[key].maxCreditAmount,
        this.mappingAccData[key].creditDayLimit,

      ];
      rows.push(temp);
    }

    var doc = new jsPDF('l', 'pt');


    doc.setFontSize(12);
    doc.text(this.headerName1, 40, 25);
    doc.setFontSize(8);
    doc.text(this.headerName2, 40, 40);
    doc.text(this.headerName3, 40, 55);
    doc.setFontSize(12);
    doc.text("All Credit Customers", 350, 35);

    autoTable(doc, {
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 150 },
        2: { cellWidth: 150 },
        3: { cellWidth: 100 },
        4: { cellWidth: 110 },
        5: { cellWidth: 90 },
        6: { cellWidth: 70 },
      },

      margin: { top: 80 },
      head: cols,
      body: rows,
      theme: 'grid',
      didDrawCell: (data) => { },
    });

    doc.save("AllCustomers.pdf");


  }


  allCustomerExcelDownload() {
    this.mappingAccDataExcel = []
    this.mappingAccData.map((res: { mappingEmail: string; mappingGST: string; mappingCreatedDate: moment.MomentInput; companyName: any; hostName: any; hostPhone: any; maxCreditAmount: any; creditDayLimit: any; }) => {
      if (res.mappingEmail != 'undefined') {
        this.email = res.mappingEmail
      } else {
        this.email = ''
      }
      if (res.mappingGST != 'undefined') {
        this.gst = res.mappingGST
      } else {
        this.gst = ''
      }
      let json = {
        mappedDate: moment(res.mappingCreatedDate).format("DD-MM-YYYY"),
        CustomerName: res.companyName,
        KeyPersonName: res.hostName,
        KeyPersonMobile: res.hostPhone,
        Email: this.email,
        GST: this.gst,
        CrLimit: res.maxCreditAmount,
        CrDayLimit: res.creditDayLimit,
      };
      this.mappingAccDataExcel.push(json);
    });
    this.excelService.exportAsExcelFile(this.mappingAccDataExcel, "All Customers");
  }
  
onSearch() {
  // Trim the query and convert it to lowercase for case-insensitive search
  let query = this.searchData
  query = query.trim().toLowerCase();

  // Filter the data based on the search query    
  this.mappingAccData = this.mappingAccSearchData.filter((item: { companyName: any; }) =>
    item.companyName.toLowerCase().includes(query)
  );
}
}
