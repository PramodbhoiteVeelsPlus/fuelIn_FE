import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  selector: 'app-base-tables-widget3',
  templateUrl: './base-tables-widget3.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class BaseTablesWidget3Component implements OnInit {
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

  fuelDealerId: any;
  dealerCorporateId: any;
  acceesGroup: any;
  dealerView: boolean = false;
  ownerName: string;
  dealerMobile: any;
  dealerLoginVPId: any;
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: string;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  fuelDealerCorpMapId: string;
  customerName: any;
  accessGroup: any;
  isAccountNameTableShow: boolean = false;
  isSelectedAccountName: boolean = false;
  accountNameList: any = [];
  allCorporateList: any = [];
  transactionData: any = [];
  quantity: string;
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
  transactionDataExcel: any =[];

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
    this.transactionData = JSON.parse(localStorage.getItem('transactionData') || '{}');
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
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
    this.companyName = dealerData.companyName
    this.oilCompanyName = dealerData.brandName
    this.state = dealerData.state
    this.pin = dealerData.pin
    this.city = dealerData.city
    this.phone1 = dealerData.hostPhone
    this.headerName1 = dealerData.companyName;
    this.headerName2 = dealerData.address1+', '+dealerData.address2+', '+dealerData.city;
    this.headerName3 = dealerData.state + '-' + dealerData.pin + '  ' + "GST: " + dealerData.GSTNumber;
    this.filterForm.controls["startDate"].setValue( "01" + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear() )
    this.filterForm.controls["endDate"].setValue(moment(new Date()).format("DD-MM-YYYY"))
    this.getFuelCreditCorporateByfuelDealerId(this.fuelDealerId)
    if (!this.transactionData.length) {
      this.getTransaction();
    } else {
      this.getTransaction1();
    }
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

  getTransaction() {
    if (this.fuelDealerCorpMapId) {
      this.transactionData.length = 0
      this.spinner.show()
      let data = {
        fuelDealerCustomerMapId: this.fuelDealerCorpMapId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }

      this.post.getTransactionwiseLedgerByMapIdPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.transactionData = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            alert("Data Not Found..!")
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
    } else {
      this.transactionData.length = 0
      this.spinner.show()
      let data = {
        fuelDealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }

      this.post.getTransactionwiseLedgerByMapIdPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.transactionData = res.data;
            localStorage.setItem('transactionData', JSON.stringify(this.transactionData));
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            alert("Data Not Found..!")
            localStorage.setItem('transactionData', JSON.stringify([]));
            this.spinner.hide();
            this.cd.detectChanges()

          }
        })
    }
  }

  getTransaction1() {
    if (this.fuelDealerCorpMapId) {
      this.transactionData.length = 0
      this.spinner.show()
      let data = {
        fuelDealerCustomerMapId: this.fuelDealerCorpMapId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }

      this.post.getTransactionwiseLedgerByMapIdPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.transactionData = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            alert("Data Not Found..!")
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
    } else {
      this.transactionData.length = 0
      let data = {
        fuelDealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }

      this.post.getTransactionwiseLedgerByMapIdPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.transactionData = res.data;
            localStorage.setItem('transactionData', JSON.stringify(this.transactionData));
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            alert("Data Not Found..!")
            localStorage.setItem('transactionData', JSON.stringify([]));
            this.spinner.hide();
            this.cd.detectChanges()

          }
        })
    }
  }

  exportToPDF() {
    if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {

      var cols = [["Date", "Khata name", "Key person name", "Key person mobile", "Description", "Quantity", "Debit (Purchase)", "Credit (Payment)", "Balance (Outstanding)"]];
      var rows = [];
      for (var key in this.transactionData) {

        if (this.transactionData[key].quantity) {
          this.quantity = this.transactionData[key].quantity + ' ' + 'Ltrs'
        } else {
          this.quantity = ' '
        }

        var temp = [
          moment(this.transactionData[key].date).format("DD-MM-YYYY"),
          this.transactionData[key].companyName,
          this.transactionData[key].hostName,
          this.transactionData[key].hostPhone,
          this.transactionData[key].description + ', ' + this.transactionData[key].product,
          this.quantity,
          Number(this.transactionData[key].purchase).toFixed(2),
          Number(this.transactionData[key].payment).toFixed(2),
          this.transactionData[key].balance

        ];
        rows.push(temp);
      }

      var doc = new jsPDF('l', 'pt');

      doc.setFontSize(12);
      doc.text(this.headerName1, 40, 25);
      doc.setFontSize(8);
      doc.text(this.headerName2, 40, 40);
      doc.text(this.headerName3, 40, 55);
      if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
        doc.text("DATE : " + moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("DD MMM YYYY") + ' To ' + moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("DD MMM YYYY"), 40, 70);
      }
      doc.setFontSize(12);
      doc.text("Credit Book (Transaction Wise)", 340, 35);

      autoTable(doc, {
        columnStyles: {
          0: { cellWidth: 70 },      // date
          1: { cellWidth: 110 },     // CustomerName
          2: { cellWidth: 110 },     //KeyPersonName
          3: { cellWidth: 80 },     //KeyPersonMobile
          4: { cellWidth: 90 },     //Description
          5: { cellWidth: 70 },     //Quantity
          6: { cellWidth: 80 },     //Debit_Purchase
          7: { cellWidth: 80 },     //Credit_Payment
          8: { cellWidth: 90 },     //Balance_Outstanding

        },

        margin: { top: 80 },
        head: cols,
        body: rows,
        theme: 'grid',
        didDrawCell: (data) => { },
      });

      doc.save("CreditBook_TransactionWise.pdf");

    }
  }


  exportexcel() {
    if (this.accessGroup == 12 || this.accessGroup == 14 || this.accessGroup == 19 || this.accessGroup == 21) {

      this.transactionDataExcel.length = 0

      this.transactionData.map((res: { quantity: string; date: moment.MomentInput; companyName: any; hostName: any; hostPhone: any; description: string; product: string; purchase: any; payment: any; balance: any; }) => {

        if (res.quantity) {
          this.quantity = res.quantity + ' ' + 'Ltrs'
        } else {
          this.quantity = ' '
        }


        let json = {
          Date: moment(res.date).format("DD-MM-YYYY"),
          KhataName: res.companyName,
          KeyPersonName: res.hostName,
          KeyPersonMobile: res.hostPhone,
          Description: res.description + ', ' + res.product,
          Quantity: this.quantity,
          Debit_Purchase: Number(res.purchase).toFixed(2),
          Credit_Payment: Number(res.payment).toFixed(2),
          Balance_Outstanding: res.balance
        };


        this.transactionDataExcel.push(json);
      });

      this.excelService.exportAsExcelFile(
        this.transactionDataExcel,
        "TransactionWiseReport"
      );

    } else {
      this.transactionDataExcel.length = 0

      this.transactionData.map((res: { quantity: string; date: moment.MomentInput; companyName: any; hostName: any; hostPhone: any; description: string; product: string; purchase: any; payment: any; balance: any; }) => {

        if (res.quantity) {
          this.quantity = res.quantity + ' ' + 'Ltrs'
        } else {
          this.quantity = ' '
        }

        let json = {
          Date: moment(res.date).format("DD-MM-YYYY"),
          PumpName: res.companyName,
          KeyPersonName: res.hostName,
          KeyPersonMobile: res.hostPhone,
          Description: res.description + ', ' + res.product,
          Quantity: this.quantity,
          Debit_Purchase: Number(res.purchase).toFixed(2),
          Credit_Payment: Number(res.payment).toFixed(2),
          Balance_Outstanding: res.balance
        };


        this.transactionDataExcel.push(json);
      });

      this.excelService.exportAsExcelFile(
        this.transactionDataExcel,
        "TransactionWiseReport"
      );

    }
  }
  
  pageChangeEvent(event: number) {
    this.p = event;
    this.getTransaction();
  }
}
