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
  selector: 'app-base-tables-widget2',
  templateUrl: './base-tables-widget2.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class BaseTablesWidget2Component implements OnInit {
  TABS: string[] = ['Month', 'Week', 'Day'];
  currentTab: string;
  @Input() cssClass: string;
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

  filterForm = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    selectCorporateName: new FormControl(''),
  });
  
  editPaymentForm = new FormGroup({
    editpaymentMethod: new FormControl('', Validators.required),
    editpaymentTransactionNo: new FormControl('', Validators.required),
    editpaymentDate: new FormControl('', Validators.required),
    editpaymentAmount: new FormControl('', Validators.required),
    editpaymentType: new FormControl('', Validators.required),
    accountTransacLogId: new FormControl('', Validators.required),
    mapID: new FormControl('', Validators.required),
  });

  fuelDealerCorpMapIdNew: any;
  crPaymentDetails: any = [];
  crPaymentDetailsData: any = [];
  showHeading: boolean = false;
  crPaymentDetails1: any = [];
  paymentDetails: any = [];
  createdBy: string;
  searchData: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  mappingPreviousStatus: string;
  mappingCustomerName: string;
  hostName: string;
  hostPhone: string;
  byManager: string;
  chequeNO: string;
  rowNumber: any;
  show: boolean = false;
  modalRefpass: any;
  closeResult: string;
  password: any;
  userId: any;
  modalRefCancel: any;
  allCorporateList: any = [];
  headerName1: any;
  headerName2: string;
  headerName3: string;
  customerId: any;

  constructor(
    private modalService: NgbModal,
    private post: BaseTablesService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private post1: WidgetService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.crPaymentDetails = JSON.parse(localStorage.getItem('crPaymentDetails') || '{}');
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.acceesGroup = element.accessGroupId;
    this.userId = element.userId;
    if (this.acceesGroup == 12 || this.acceesGroup == 19) {
      this.dealerView = true;
      this.ownerName = element.firstName + ' ' + element.lastName
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
    if (!this.crPaymentDetails.length) {
      this.getCRPayment(this.dealerCorporateId);
    } else {
      this.getCRPayment1(this.dealerCorporateId);
    }
    if(element.accessGroupId == '14'){
      var managerData = JSON.parse(localStorage.getItem('managerData') || '{}');
      this.customerId = managerData.customerId;
      this.searchDealerBycustomerId(this.customerId)
    }
    this.getFuelCreditRequestCorporateByfuelDealerId(this.fuelDealerId)
    this.cd.detectChanges()
  }


  getFuelCreditRequestCorporateByfuelDealerId(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId
    }
    this.post.getFuelCreditRequestCorporateByfuelDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.allCorporateList = res.data;
          // this.allCorporateListData = res;
          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      });
  }

  getCorporateInfoByfuelDealerCustomerMapId(id: any) {
    let data = {
      fuelDealerId: this.fuelDealerId,
      customerName: id.target.value,
    }
    this.post.getCorporateInfoByfuelDealerCustomerMapIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.fuelDealerCorpMapIdNew = res.data[0].fuelDealerCustomerMapId;
          this.getFilterCRPaymentFORDealer();
        } else {
          this.getCRPayment(this.dealerCorporateId);
        }
      });
  }

  getFilterCRPaymentFORDealer() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      if (this.filterForm.value.selectCorporateName) {
        let data = {
          fuelDealerId: this.fuelDealerId,
          corporateId: this.dealerCorporateId,
          mapId: this.fuelDealerCorpMapIdNew,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
          this.post.getAllCRPaymentByCustNameDealerPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                if (res.data.length) {
                  this.crPaymentDetails = res.data;
                  this.crPaymentDetailsData = res.data;
                  this.showHeading = true;
                  this.cd.detectChanges();
                }
                else {
                  alert("Don't have any Credit Payment in this Month!")
                  this.cd.detectChanges();
                }
              }
              else {
              }
            })
        }
      }
      else {
        let data = {
          corporateId: this.dealerCorporateId,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
          this.post.getAllCRPaymentByDealerPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                if (res.data.length) {
                  this.crPaymentDetails = res.data;
                  this.crPaymentDetailsData = res.data;
                  this.showHeading = true;
                  this.cd.detectChanges();
                }
                else {
                  alert("Don't have any Credit Payment in this Month!")
                  this.cd.detectChanges();
                }
              }
              else {
              }
            })
        }
      }
    }
    else {
      if (this.filterForm.value.selectCorporateName) {
        let data = {
          fuelDealerId: this.fuelDealerId,
          corporateId: this.dealerCorporateId,
          mapId: this.fuelDealerCorpMapIdNew,
          startDate: moment(new Date()).subtract(15, 'day').format("YYYY-MM-DD"),
          endDate: moment(new Date()).format("YYYY-MM-DD"),
        }
        if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
          this.post.getAllCRPaymentByCustNameDealerPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                if (res.data.length) {
                  this.crPaymentDetails = res.data;
                  this.crPaymentDetailsData = res.data;
                  this.showHeading = true;
                  this.cd.detectChanges();
                }
                else {
                  alert("Don't have any Credit Payment in this Month for selected Customer!")
                  this.cd.detectChanges();
                }
              }
              else {
              }
            })
        }
      }
      else {
        this.getCRPayment(this.dealerCorporateId);
      }
    }
  }

  getCRPayment(dealerCorporateId: any) {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      if (this.filterForm.value.selectCorporateName) {
        this.spinner.show()
        let data = {
          fuelDealerId: this.fuelDealerId,
          corporateId: this.dealerCorporateId,
          mapId: this.fuelDealerCorpMapIdNew,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
          this.post.getAllCRPaymentByCustNameDealerPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                if (res.data.length) {
                  this.crPaymentDetails = res.data;
                  this.crPaymentDetailsData = res.data;
                  this.showHeading = true;
                  this.cd.detectChanges();
                  this.spinner.hide()
                }
                else {
                  alert("Don't have any Credit Payment in this Month!")
                  this.showHeading = false;
                  this.cd.detectChanges();
                  this.spinner.hide()
                }
              }
              else {
              }
            })
        }
      }
      else {
        this.spinner.show()
        let data = {
          corporateId: this.dealerCorporateId,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
          this.post.getAllCRPaymentByDealerPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                if (res.data.length) {
                  this.crPaymentDetails = res.data;
                  this.crPaymentDetailsData = res.data;
                  this.showHeading = true;
                  this.cd.detectChanges();
                  this.spinner.hide()
                }
                else {
                  alert("Don't have any Credit Payment in this Month!")
                  this.showHeading = false;
                  this.cd.detectChanges();
                  this.spinner.hide()
                }
              }
              else {
              }
            })
        }
      }
    } else {
      this.spinner.show()
      let data = {
        corporateId: dealerCorporateId,
        startDate: moment(new Date()).subtract(15, 'day').format("YYYY-MM-DD"),
        endDate: moment(new Date()).format("YYYY-MM-DD"),
      }

      if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
        this.post.getAllCRPaymentByDealerPOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                this.crPaymentDetails = res.data;
                this.crPaymentDetailsData = res.data;
                // this.crPaymentDetails1 = res.data1;
                this.showHeading = true;
                localStorage.setItem('crPaymentDetails', JSON.stringify(this.crPaymentDetails));
                this.cd.detectChanges();
                this.spinner.hide()
              }
              else {
                // this.crPaymentDetails1 = res.data1;
                this.crPaymentDetails.length = 0;
                localStorage.setItem('crPaymentDetails', JSON.stringify([]));
                this.cd.detectChanges();
                this.spinner.hide()
              }
            }
            else {
            }
          })
      } else {
        this.spinner.show()
        this.post.getAllCRPaymentByCorporatePOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                this.crPaymentDetails = res.data;
                this.crPaymentDetailsData = res.data;
                // this.crPaymentDetails1 = res.data1;
                localStorage.setItem('crPaymentDetails', JSON.stringify(this.crPaymentDetails));
                this.showHeading = true;
                this.cd.detectChanges();
                this.spinner.hide()
              }
              else {
                // this.crPaymentDetails1 = res.data1;
                this.crPaymentDetails.length = 0;
                localStorage.setItem('crPaymentDetails', JSON.stringify([]));
                this.cd.detectChanges();
                this.spinner.hide()
              }
            }
            else {
            }
          })
      }
    }
  }

  getCRPayment1(dealerCorporateId: any) {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      if (this.filterForm.value.selectCorporateName) {
        let data = {
          fuelDealerId: this.fuelDealerId,
          corporateId: this.dealerCorporateId,
          mapId: this.fuelDealerCorpMapIdNew,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
          this.post.getAllCRPaymentByCustNameDealerPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                if (res.data.length) {
                  this.crPaymentDetails = res.data;
                  this.crPaymentDetailsData = res.data;
                  this.showHeading = true;
                  this.cd.detectChanges();
                  this.spinner.hide()
                }
                else {
                  alert("Don't have any Credit Payment in this Month!")
                  this.showHeading = false;
                  this.cd.detectChanges();
                  this.spinner.hide()
                }
              }
              else {
              }
            })
        }
      }
      else {
        let data = {
          corporateId: this.dealerCorporateId,
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
          this.post.getAllCRPaymentByDealerPOST(data)
            .subscribe(res => {
              if (res.status == "OK") {
                if (res.data.length) {
                  this.crPaymentDetails = res.data;
                  this.crPaymentDetailsData = res.data;
                  this.showHeading = true;
                  this.cd.detectChanges();
                  this.spinner.hide()
                }
                else {
                  alert("Don't have any Credit Payment in this Month!")
                  this.showHeading = false;
                  this.cd.detectChanges();
                  this.spinner.hide()
                }
              }
              else {
              }
            })
        }
      }
    } else {
      let data = {
        corporateId: dealerCorporateId,
        startDate: moment(new Date()).subtract(15, 'day').format("YYYY-MM-DD"),
        endDate: moment(new Date()).format("YYYY-MM-DD"),
      }

      if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
        this.post.getAllCRPaymentByDealerPOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                this.crPaymentDetails = res.data;
                this.crPaymentDetailsData = res.data;
                // this.crPaymentDetails1 = res.data1;
                this.showHeading = true;
                localStorage.setItem('crPaymentDetails', JSON.stringify(this.crPaymentDetails));
                this.cd.detectChanges();
                this.spinner.hide()
              }
              else {
                // this.crPaymentDetails1 = res.data1;
                this.crPaymentDetails.length = 0;
                localStorage.setItem('crPaymentDetails', JSON.stringify([]));
                this.cd.detectChanges();
                this.spinner.hide()
              }
            }
            else {
            }
          })
      } else {
        this.post.getAllCRPaymentByCorporatePOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              if (res.data.length) {
                this.crPaymentDetails = res.data;
                this.crPaymentDetailsData = res.data;
                // this.crPaymentDetails1 = res.data1;
                this.showHeading = true;
                this.cd.detectChanges();
                this.spinner.hide()
              }
              else {
                // this.crPaymentDetails1 = res.data1;
                this.crPaymentDetails.length = 0;
                this.cd.detectChanges();
                this.spinner.hide()
              }
            }
            else {
            }
          })
      }
    }
  }

  exportToPDF() {
    if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
      this.paymentDetails.length = 0

      var cols = [["Date", "Khata Name", "Key Person Name", "Key Person Mobile", "Payment Mode", "Amount", "Pending Days", "Account", "Payment Score", "Created By"]];
      var rows = [];
      for (var key in this.crPaymentDetails) {
        if (this.crPaymentDetails[key].byManager == 'FALSE') {
          this.createdBy = this.ownerName
        } else {
          this.createdBy = this.crPaymentDetails[key].managerName
        }
        var temp = [
          moment(this.crPaymentDetails[key].transacDate).format("DD-MM-YYYY"),
          this.crPaymentDetails[key].companyName,
          this.crPaymentDetails[key].hostName,
          this.crPaymentDetails[key].hostPhone,
          this.crPaymentDetails[key].paymentMethod + ' ' + this.crPaymentDetails[key].chequeNO,
          Number(this.crPaymentDetails[key].grandTotalAmount).toFixed(2),
          this.crPaymentDetails[key].pendingDays,
          this.crPaymentDetails[key].bankName + ' ' + this.crPaymentDetails[key].accountNumber,
          Math.round(this.crPaymentDetails[key].avgPayment),
          this.createdBy,
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
      doc.text("Credit Payment", 350, 35);

      autoTable(doc, {
        columnStyles: {
          0: { cellWidth: 60 },     // Date
          1: { cellWidth: 110 },    // CustomerName
          2: { cellWidth: 100 },     //KeyPersonName
          3: { cellWidth: 80 },     //KeyPersonMobile
          4: { cellWidth: 100 },     //PaymentMode
          5: { cellWidth: 60 },     //Amount
          6: { cellWidth: 50 },     //PendingDays
          7: { cellWidth: 80 },     //Account
          8: { cellWidth: 60 },     //PaymentScore
          9: { cellWidth: 90 },     //CreatedBy
        },

        margin: { top: 80 },
        head: cols,
        body: rows,
        theme: 'grid',
        didDrawCell: (data) => { },
      });
      doc.save("CreditPaymentReport.pdf");
    }
  }

  excelDownload() {
    if (this.acceesGroup == 12 || this.acceesGroup == 14 || this.acceesGroup == 19 || this.acceesGroup == 21) {
      this.paymentDetails.length = 0
      this.crPaymentDetails.map((res: { byManager: string; managerName: string; transacDate: moment.MomentInput; companyName: any; hostName: any; hostPhone: any; paymentMethod: string; chequeNO: string; grandTotalAmount: any; pendingDays: any; bankName: string; accountNumber: string; avgPayment: any; }) => {

        if (res.byManager == 'FALSE') {
          this.createdBy = this.ownerName
        } else {
          this.createdBy = res.managerName
        }

        let json = {
          Date: moment(res.transacDate).format("DD-MM-YYYY"),
          KhataName: res.companyName,
          KeyPersonName: res.hostName,
          KeyPersonMobile: res.hostPhone,
          PaymentMode: res.paymentMethod + ' ' + res.chequeNO,
          Amount: Number(res.grandTotalAmount),
          PendingDays: res.pendingDays,
          Account: res.bankName + ' ' + res.accountNumber,
          PaymentScore: Number(res.avgPayment).toFixed(0),
          CreatedBy: this.createdBy,
        };

        this.paymentDetails.push(json);
      });

      this.excelService.exportAsExcelFile(
        this.paymentDetails,
        "CreditPaymentReport"
      );
    }
    else {
      this.paymentDetails.length = 0
      this.crPaymentDetails.map((res: { transacDate: moment.MomentInput; companyName: any; hostName: any; hostPhone: any; paymentMethod: string; chequeNO: string; grandTotalAmount: any; }) => {

        let json = {
          Date: moment(res.transacDate).format("DD-MM-YYYY"),
          PumpName: res.companyName,
          KeyPersonName: res.hostName,
          KeyPersonMobile: res.hostPhone,
          PaymentMode: res.paymentMethod + ' ' + res.chequeNO,
          Amount: res.grandTotalAmount,
        };

        this.paymentDetails.push(json);
      });

      this.excelService.exportAsExcelFile(
        this.paymentDetails,
        "PaymentReport"
      );
    }
  }

  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query     
    this.crPaymentDetails = this.crPaymentDetailsData.filter((item: { paymentMethod: any; }) =>
      item.paymentMethod.toLowerCase().includes(query)
    );
    if (!this.crPaymentDetails.length) {
      this.crPaymentDetails = this.crPaymentDetailsData.filter((item: { pendingDays: any; }) =>
        item.pendingDays.toLowerCase().includes(query)
      );
    }
    if (!this.crPaymentDetails.length) {
      this.crPaymentDetails = this.crPaymentDetailsData.filter((item: { bankName: any; }) =>
        item.bankName.toLowerCase().includes(query)
      );
    }
    if (!this.crPaymentDetails.length) {
      this.crPaymentDetails = this.crPaymentDetailsData.filter((item: { accountNumber: any; }) =>
        item.accountNumber.toLowerCase().includes(query)
      );
    }
    if (!this.crPaymentDetails.length) {
      this.crPaymentDetails = this.crPaymentDetailsData.filter((item: { grandTotalAmount: any; }) =>
        item.grandTotalAmount.toLowerCase().includes(query)
      );
    }
    if (!this.crPaymentDetails.length) {
      this.crPaymentDetails = this.crPaymentDetailsData.filter((item: { hostPhone: any; }) =>
        item.hostPhone.toLowerCase().includes(query)
      );
    }
    if (!this.crPaymentDetails.length) {
      this.crPaymentDetails = this.crPaymentDetailsData.filter((item: { mappingCustomerName: any; }) =>
        item.mappingCustomerName.toLowerCase().includes(query)
      );
    }
    if (!this.crPaymentDetails.length) {
      this.crPaymentDetails = this.crPaymentDetailsData.filter((item: { hostName: any; }) =>
        item.hostName.toLowerCase().includes(query)
      );
    }
    if (!this.crPaymentDetails.length) {
      this.crPaymentDetails = this.crPaymentDetailsData.filter((item: { hostPhone: any; }) =>
        item.hostPhone.toLowerCase().includes(query)
      );
    }
  }

  changeValue(i: any, mappingPreviousStatus: any, mappingCustomerName: any, hostName: any, hostPhone: any, byManager: any, managerName: string, chequeNO: any) {
    this.mappingPreviousStatus = ''
    this.mappingCustomerName = ''
    this.hostName = ''
    this.hostPhone = ''
    this.byManager = ''
    this.managerName = ''
    this.chequeNO = ''
    if (i == this.rowNumber) {
      this.rowNumber = ''
      if (this.show == true) {
        this.show = false;
      } else {
        this.show = true;
        this.rowNumber = i
        this.mappingPreviousStatus = mappingPreviousStatus
        this.mappingCustomerName = mappingCustomerName
        this.hostName = hostName
        this.hostPhone = hostPhone
        this.byManager = byManager
        this.managerName = managerName
        this.chequeNO = chequeNO
      }
    } else {
      this.rowNumber = i
      this.show = true;
      this.mappingPreviousStatus = mappingPreviousStatus
      this.mappingCustomerName = mappingCustomerName
      this.hostName = hostName
      this.hostPhone = hostPhone
      this.byManager = byManager
      this.managerName = managerName
      this.chequeNO = chequeNO
    }
  }

  askForPass(PasswordTemplate: any, accountTransacLogId: any, mapID: any, amount: any) {
    this.editPaymentForm.controls['accountTransacLogId'].setValue(accountTransacLogId);
    this.editPaymentForm.controls['editpaymentAmount'].setValue(amount);
    this.editPaymentForm.controls['mapID'].setValue(mapID);

    this.modalRefpass = this.modalService.open(PasswordTemplate)
    this.modalRefpass.result.then((result: any) => {
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

  dontDelete() {
    alert("Dear Customer, You added this transaction entry to saved statement, first you have to delete that saved statement then you can edit/delete this entry.")
  }

  comparePasswordForDelete(cancelReq: any) {
    // var cancelReq
    const data = {
      password: this.password,
      userId: this.userId
    };
    this.post.comparePasswordPOST(data)
      .subscribe(result => {
        if (result.status == 'OK') {
          this.closeResult
          this.modalRefpass.close('close')
          this.password = "";
          this.cancelRequest(cancelReq)
        } else {
          alert(result.msg)
          this.password = "";
        }
      });
  }

  cancelRequest(cancelReq: any) {
    this.modalRefCancel = this.modalService.open(cancelReq)
    this.modalRefCancel.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  removeTransLog() {
    let fuelDealerCustomMapId = this.editPaymentForm.value.mapID;
    this.spinner.show();

    let data = {
      accountTransacLogId: this.editPaymentForm.value.accountTransacLogId,
    }
    this.post.removeTransactionLogPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert("Delete Successfully!");
          this.modalRefCancel.close('close');
          this.updateAmountStatusByTranslogId(this.editPaymentForm.value.accountTransacLogId)
          this.getCRPayment(this.dealerCorporateId);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.modalRefCancel.close('close');
          this.getCRPayment(this.dealerCorporateId);
        }
      })
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getCRPayment(this.dealerCorporateId);
  }

  updateAmountStatusByTranslogId(translogId: any) {
    let data = {
      translogId: translogId
    }
    this.post.updateAmountStatusByTranslogIdPOST(data)
      .subscribe(res => { })
  }
  
  searchDealerBycustomerId(customerId: any) {    
    let data = {
      customerId: customerId,
    };
    this.post1.getCustomerByCustomerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {         
          this.headerName1 = res.data[0].companyName;
          this.headerName2 = res.data[0].address1 + ', ' + res.data[0].address2 + ', ' + res.data[0].city;
          this.headerName3 = res.data[0].state + '-' + res.data[0].pin + '  ' + "GST: " + res.data[0].GSTNumber;         
          
        } else {
          this.spinner.hide();
        }
      });
}

}
