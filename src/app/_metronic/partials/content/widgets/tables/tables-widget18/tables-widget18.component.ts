import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WidgetService } from '../../widgets.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';

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

type Tabs =
  | 'kt_table_widget_18_tab_1'
  | 'kt_table_widget_18_tab_2'
  | 'kt_table_widget_18_tab_3';

@Component({
  selector: 'app-tables-widget18',
  templateUrl: './tables-widget18.component.html',
  styleUrl: './tables-widget18.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TablesWidget18Component {
  veelsPlusPersonId: any;
  filterForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
    demoDealer: new FormControl(),
  });

  paymentForm = new FormGroup({
    paymentMethod: new FormControl('', Validators.required),
    paymentTransactionNo: new FormControl('', Validators.required),
    paymentDate: new FormControl('', Validators.required),
    paymentAmount: new FormControl('', Validators.required),
    paymentType: new FormControl('', Validators.required),
  });

  searchData: any;
  primeDealerData: any = [];
  primeDealerDataSearch: any = [];
  primeDealerDataExcel: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  show: boolean = false;
  rowNumber: any;
  GSTNumber: string;
  onBoardingStatus: string;
  payCorpStatus: string;
  corporateId: string;
  userId: string;
  personId: string;
  accessGroupId: string;
  isSMS: string;
  isEmail: string;
  demoDealer: string;
  fuelDealerId: string;
  fueldealerCreditSMS: string;
  email: string;
  pin: string;
  city: string;
  state: string;
  offlinePaymentCorporateId: any;
  offlinePaymentUserId: any;
  offlinePaymentPersonId: any;
  offlinePaymentAccessGroupId: any;
  modalRef: any;
  closeResult: string;
  remainingTotalAmt: any;
  waive: any;

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private excelService: ExcelService,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  activeTab: Tabs = 'kt_table_widget_18_tab_1';

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.primeDealerData = JSON.parse(localStorage.getItem('primeDealerData') || '{}');
    this.veelsPlusPersonId = element.veelsPlusId;
    this.filterForm.controls['demoDealer'].setValue('');
    if(!this.primeDealerData.length){
      this.getPrimeDealerDetails();
    }else{
      this.getPrimeDealerDetails1();
    }
    this.getPayInfo()
    this.cd.detectChanges();
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getPrimeDealerDetails();
  }

  getPrimeDealerDetails() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate && this.filterForm.value.demoDealer) {
      this.primeDealerData = []
      this.spinner.show()
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        demoDealer: this.filterForm.value.demoDealer
      }

      this.post.getPrimeDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.primeDealerData = res.data;
            this.primeDealerDataSearch = res.data
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.primeDealerData = []
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.primeDealerData = []
      this.spinner.show()
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      }

      this.post.getPrimeDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.primeDealerData = res.data;
            this.primeDealerDataSearch = res.data
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.primeDealerData = []
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else if (this.filterForm.value.demoDealer) {
      this.primeDealerData = []
      this.spinner.show()
      let data = {
        demoDealer: this.filterForm.value.demoDealer
      }

      this.post.getPrimeDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.primeDealerData = res.data;
            this.primeDealerDataSearch = res.data
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.primeDealerData = []
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else {
      this.primeDealerData = []
      this.spinner.show()
      let data = {

      }

      this.post.getPrimeDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.primeDealerData = res.data;
            this.primeDealerDataSearch = res.data
            localStorage.setItem('primeDealerData', JSON.stringify(res.data));
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.primeDealerData = []
            localStorage.setItem('primeDealerData', JSON.stringify(''));
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    }
  }
  
  getPrimeDealerDetails1() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate && this.filterForm.value.demoDealer) {
      this.primeDealerData = []
      this.spinner.show()
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        demoDealer: this.filterForm.value.demoDealer
      }

      this.post.getPrimeDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.primeDealerData = res.data;
            this.primeDealerDataSearch = res.data
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.primeDealerData = []
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.primeDealerData = []
      this.spinner.show()
      let data = {
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
      }

      this.post.getPrimeDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.primeDealerData = res.data;
            this.primeDealerDataSearch = res.data
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.primeDealerData = []
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else if (this.filterForm.value.demoDealer) {
      this.primeDealerData = []
      this.spinner.show()
      let data = {
        demoDealer: this.filterForm.value.demoDealer
      }

      this.post.getPrimeDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.primeDealerData = res.data;
            this.primeDealerDataSearch = res.data
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            this.primeDealerData = []
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else {
      this.primeDealerData = []
      let data = {

      }

      this.post.getPrimeDealerDetailsPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.primeDealerData = res.data;
            this.primeDealerDataSearch = res.data
            localStorage.setItem('primeDealerData', JSON.stringify(res.data));
            this.spinner.hide()
            this.cd.detectChanges();
          } else {
            localStorage.setItem('primeDealerData', JSON.stringify(''));
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    }
  }

  exportExcel() {
    this.primeDealerDataExcel.length = 0

    this.primeDealerData.map((res: { FuelVeelsId: any; customerCreatedAt: moment.MomentInput; companyName: any; brandName: any; hostName: any; hostPhone: any; email1: any; GSTNumber: any; address1: any; address2: any; city: any; state: any; pin: any; }) => {
      let json = {
        VeelsID: res.FuelVeelsId,
        MappedDate: moment(res.customerCreatedAt).format("DD-MM-YYYY"),
        CompanyName: res.companyName,
        OilCompany: res.brandName,
        HostName: res.hostName,
        ContactNumber: res.hostPhone,
        EmailId: res.email1,
        GST: res.GSTNumber,
        AddressLine1: res.address1,
        AddressLine2: res.address2,
        City: res.city,
        State: res.state,
        PINCode: res.pin,
      };

      this.primeDealerDataExcel.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.primeDealerDataExcel,
      "PrimeDealerList"
    );
  }

  clearPrimeDealerDetails() {
    this.filterForm.reset();
    this.getPrimeDealerDetails();
  }

  changeValue(i: any, GSTNumber: any, onBoardingStatus: any, payCorpStatus: any, corporateId: any, userId: any, personId: any, accessGroupId: any, isSMS: any, isEmail: any, demoDealer: any, fuelDealerId: any, fueldealerCreditSMS: any, email1: any, pin: any, city: any, state: any) {

    this.GSTNumber = ''
    this.onBoardingStatus = ''
    this.payCorpStatus = ''
    this.corporateId = ''
    this.userId = ''
    this.personId = ''
    this.accessGroupId = ''
    this.isSMS = ''
    this.isEmail = ''
    this.demoDealer = ''
    this.fuelDealerId = ''
    this.fueldealerCreditSMS = ''
    this.email = ''
    this.pin = '';
    this.city = '';
    this.state = '';

    if (i == this.rowNumber) {
      this.rowNumber = ''
      if (this.show == true) {
        this.show = false;
      } else {
        this.show = true;
        this.rowNumber = i
        this.GSTNumber = GSTNumber
        this.onBoardingStatus = onBoardingStatus
        this.payCorpStatus = payCorpStatus
        this.corporateId = corporateId
        this.userId = userId
        this.personId = personId
        this.accessGroupId = accessGroupId
        this.isSMS = isSMS
        this.isEmail = isEmail
        this.demoDealer = demoDealer
        this.fuelDealerId = fuelDealerId
        this.fueldealerCreditSMS = fueldealerCreditSMS
        this.email = email1
        this.pin = pin
        this.city = city
        this.state = state

      }
    } else {
      this.rowNumber = i
      this.show = true;
      this.GSTNumber = GSTNumber
      this.onBoardingStatus = onBoardingStatus
      this.payCorpStatus = payCorpStatus
      this.corporateId = corporateId
      this.userId = userId
      this.personId = personId
      this.accessGroupId = accessGroupId
      this.isSMS = isSMS
      this.isEmail = isEmail
      this.demoDealer = demoDealer
      this.fuelDealerId = fuelDealerId
      this.fueldealerCreditSMS = fueldealerCreditSMS
      this.email = email1
      this.pin = pin
      this.city = city
      this.state = state
    }
  }

  taxInvoiceEnable(status: any, fuelDealerId: any, invoiceStatus: any) {
    if (status.target.checked) {
      invoiceStatus = "TRUE";

      let data = {
        invoiceStatus: invoiceStatus,
        dealerId: fuelDealerId
      };
      this.post.updateTaxInvoiceStatusPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            alert("Tax Invoice Status Updated..!!")
            this.cd.detectChanges();
          }
          else {
            alert("error to update")
            this.cd.detectChanges();
          }
        })
    } else {
      invoiceStatus = "FALSE";

      let data = {
        invoiceStatus: invoiceStatus,
        dealerId: fuelDealerId
      };
      this.post.updateTaxInvoiceStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Tax Invoice Status Updated..!")
            this.cd.detectChanges();
          }
          else {
            alert("error to update")
            this.cd.detectChanges();
          }
        })
    }
  }

  updatePayment(update: any, corporateId: any, userId: any, personId: any, accessGroupId: any) {
    this.offlinePaymentCorporateId = corporateId
    this.offlinePaymentUserId = userId
    this.offlinePaymentPersonId = personId
    this.offlinePaymentAccessGroupId = accessGroupId
    this.modalRef = this.modalService.open(update);
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

  getPayInfo() {
    let data = {

    }
    this.post.getPayInfoPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.remainingTotalAmt = res.data.fuelDealerPrice;
        }
      })
  }

  addOffLinePayment() {
    let createdDate = new Date();
    let data = {
      offlinePaymentMethod: this.paymentForm.value.paymentMethod,
      offlineCheckNumber: this.paymentForm.value.paymentTransactionNo,
      offlineTransactionDate: this.paymentForm.value.paymentDate,
      offlinePaymentAmount: this.remainingTotalAmt,
      offlinePaymentStatus: 'PAID',
      offlinePayReason: "",
      pesonId: this.offlinePaymentPersonId,
      corporateId: this.offlinePaymentCorporateId,
      offlinePaymentTimestamp: createdDate,
      offlineValidity: "",
      offlineValidFrom: "",
      offlineValidTo: "",
      accessGroupId: this.offlinePaymentAccessGroupId,
      offlinePaymentCreatedBy: this.veelsPlusPersonId
    }
    this.post.addOffLinePaymentPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert(res.msg)
          this.getPrimeDealerDetails();
          this.modalRef.close('close')
          this.cd.detectChanges();
        } else {
          this.getPrimeDealerDetails();
          this.cd.detectChanges();
        }
      })
  }


  waiveOffPaymentEnable(status: any, corporateId: any, userId: any, paymentuserstatus: string) {
    var paymentStatus = "";
    if (paymentuserstatus == "unpaid") {
      if (status.target.checked) {
        paymentStatus = "waiveOff";

        let data = {
          paymentStatus: paymentStatus,
          userId: userId,
          corporateId: corporateId
        }

        this.post.waiveoffPaymentUpdatePOST(data)
          .subscribe(res => {
            if (res) {
              alert(res.msg)
              this.getPrimeDealerDetails();
            }
          })
      }
    } else if (paymentuserstatus == "waiveOff") {
      paymentStatus = "unpaid";

      let data = {
        paymentStatus: paymentStatus,
        userId: userId,
        corporateId: corporateId
      }

      this.post.waiveoffPaymentUpdatePOST(data)
        .subscribe(res => {
          if (res) {
            alert(res.msg)
            this.getPrimeDealerDetails();
          }
        })
    } else {
      alert("Please Select unpaid or WaiveOff Status");
      this.getPrimeDealerDetails();
    }
  }

  smsEnable(status: any, corporateId: any, userId: any, smsStatus: string) {
    if (smsStatus == "TRUE") {
      if (status.target.checked) {
        smsStatus = "FALSE";

        let data = {
          smsStatus: smsStatus,
          userId: userId,
          corporateId: corporateId,
          fueldealerSmsSend: "FALSE",
          accessGroup: "12"
        }

        this.post.updateSmsStatusPOST(data)
          .subscribe(res => {
            if (res) {
              alert(res.msg)
              this.getPrimeDealerDetails();
            }
          })
      }
    } else if (smsStatus == "FALSE") {
      smsStatus = "TRUE";

      let data = {
        smsStatus: smsStatus,
        userId: userId,
        corporateId: corporateId,
        accessGroup: "12"
      }

      this.post.updateSmsStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert(res.msg)
            this.getPrimeDealerDetails();
          }
        })
    } else {
      this.getPrimeDealerDetails();
    }
  }

  emailEnable(status: any, corporateId: any, userId: any, emailStatus: string, accessGroupId: any) {
    if (emailStatus == "TRUE") {
      if (status.target.checked) {
        emailStatus = "FALSE";
        let data = {
          emailStatus: emailStatus,
          userId: userId,
          corporateId: corporateId,
          accessGroup: accessGroupId

        }
        this.post.updateemailStatusPOST(data)
          .subscribe(res => {
            if (res) {
              alert(res.msg)
              this.getPrimeDealerDetails();
            }
          })
      }
    } else if (emailStatus == "FALSE") {
      emailStatus = "TRUE";

      let data = {
        emailStatus: emailStatus,
        userId: userId,
        corporateId: corporateId,
        accessGroup: accessGroupId
      }

      this.post.updateemailStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert(res.msg)
            this.getPrimeDealerDetails();
          }
        })
    } else {
      this.getPrimeDealerDetails();
    }
  }

  demoDealerActive(status: any, fuelDealerId: any, demoDealer: string) {
    if (demoDealer == "TRUE") {
      if (status.target.checked) {
        demoDealer = "FALSE";
        let data = {
          demoDealer: demoDealer,
          fuelDealerId: fuelDealerId,
        }
        this.post.updateDealerDemoStatusPOST(data)
          .subscribe(res => {
            if (res) {
              alert("Updated..")
            }
          })
      }
    } else if (demoDealer == "FALSE") {
      demoDealer = "TRUE";

      let data = {
        demoDealer: demoDealer,
        fuelDealerId: fuelDealerId,
      }

      this.post.updateDealerDemoStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Updated..")
          }
        })
    } else {
      alert("Please Select");
    }
  }

  crSMSActive(status: any, fuelDealerId: any, crUserSMS: string) {
    var crSMS = "";
    if (crUserSMS == "TRUE") {
      if (status.target.checked) {
        crSMS = "FALSE";
        let data = {
          crSMS: crSMS,
          fuelDealerId: fuelDealerId,
        }
        this.post.updateDealerCRSMSStatusPOST(data)
          .subscribe(res => {
            if (res) {
              alert("Updated..")
              this.getPrimeDealerDetails();
            }
          })
      }
    } else if (crUserSMS == "FALSE") {

      crSMS = "TRUE";
      let data = {
        crSMS: crSMS,
        fuelDealerId: fuelDealerId,
      }

      this.post.updateDealerCRSMSStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Updated..")
            this.getPrimeDealerDetails();
          }

        })
    } else {
      this.getPrimeDealerDetails();
    }
  }
  
  onSearch() {
    // Trim the query and convert it to lowercase for case-insensitive search
    let query = this.searchData
    query = query.trim().toLowerCase();

    // Filter the data based on the search query    
    this.primeDealerData = this.primeDealerDataSearch.filter((item: { companyName: any; }) =>
      item.companyName.toLowerCase().includes(query)
    );
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { veelsPlusBranchID: any; }) =>
        item.veelsPlusBranchID.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { FuelVeelsId: any; }) =>
        item.FuelVeelsId.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { hostName: any; }) =>
        item.hostName.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { hostPhone: any; }) =>
        item.hostPhone.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { GSTNumber: any; }) =>
        item.GSTNumber.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { brandName: any; }) =>
        item.brandName.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { email1: any; }) =>
        item.email1.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { city: any; }) =>
        item.city.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { state: any; }) =>
        item.state.toLowerCase().includes(query)
      );
    }
    if (!this.primeDealerData.length) {
      this.primeDealerData = this.primeDealerDataSearch.filter((item: { pin: any; }) =>
        item.pin.toLowerCase().includes(query)
      );
    }
  }
}
