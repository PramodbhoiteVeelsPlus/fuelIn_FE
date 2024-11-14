import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { StatsService } from '../stats.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import moment from 'moment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-stats-widget10',
  templateUrl: './stats-widget10.component.html',
  styleUrl: './stats-widget10.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class StatsWidget10Component {
  localStoragecorporateId: any;
  acceesGroup: any;
  editCustDetails: boolean = false;
  editAddressDetails: boolean = false;
  editOtherDetails: boolean = false;

  customerForm = new FormGroup({
    businessType: new FormControl('', Validators.required),
    companyName: new FormControl('', Validators.required),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    mobile: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email, Validators.required]),
    fullName: new FormControl('', Validators.required)
  });

  corporateForm = new FormGroup({
    GSTNumber: new FormControl('', Validators.required),
    numberOfBranches: new FormControl(''),
    website: new FormControl(''),
    numberOfEmployee: new FormControl(''),
    hostName: new FormControl(''),
    hostPhone: new FormControl(''),
    logo: new FormControl(''),
  });

  infoForm = new FormGroup({
    address1: new FormControl(''),
    address2: new FormControl(''),
    state: new FormControl(''),
    email2: new FormControl(''),
    pinCode: new FormControl(''),
    country: new FormControl(''),
    phone2: new FormControl(''),
    city: new FormControl(''),
    cityArea: new FormControl(''),
  });

  kycForm = new FormGroup({
    transporterBusinessType: new FormControl(""),
    identityDocName: new FormControl("PAN CARD"),
    businessDocType: new FormControl("GST Certificate"),
    identityAddressType: new FormControl(""),
    otherDocType: new FormControl(""),
    file1: new FormControl(""),
    file2: new FormControl(""),
    file3: new FormControl(""),
    file4: new FormControl(""),
  })

  veelsPlusBranchID: any;
  reqDescription: any;
  createdBy: string;
  details: string;
  dataDetails: any;
  vpcorporateId: any;
  logoLinkDoc: any;
  corporateSqlId: any;
  corpId: any;
  branchCodeForAddNewCode: any;
  addressSQLId: any;
  corporateLogoLink: any;
  fstKycStatus: any;
  kycId: any;
  emailId: any;
  personSQLId: any;
  firstName: any;
  hostName: any;
  address1: any;
  lastName: any;
  address2: any;
  companyName: any;
  city: any;
  GSTNumber: any;
  phone1: any;
  email1: any;
  state: any;
  country: any;
  pin: any;
  allBranch: any;
  corporateId: any;
  allBranchdata: any;
  branchDetilsData: any;
  GSTNumberBranch: any;
  branchNameBranch: any;
  hostNameBranch: any;
  hostPhoneBranch: any;
  customerId: any;
  modalRef: any;
  personId: any;
  createdDate: any;
  businessType: any;
  fuelDealerSQLId: any;
  waive: any;
  isCREDIT: boolean = true;
  isAddAcc: boolean = true;
  creditData: any = [];
  isViewAcc: boolean = true;
  isAddSale: boolean = true;
  isViewSale: boolean = true;
  isAddPayment: boolean = true;
  isViewPayment: boolean = true;
  isCreateStatement: boolean = true;
  isBookLedger: boolean = true;
  isSavedInv: boolean = true;
  isAddLubeTax: boolean = true;
  isSHIFT: boolean = true;
  shiftData: any = [];
  isAddShift: boolean = true;
  isViewShift: boolean = true;
  isBook: boolean = true;
  isAddShiftTime: boolean = true;
  isStaffManage: boolean = true;
  isPosDetails: boolean = true;
  isBookShiftWise: boolean = true;
  isBookDayWise: boolean = true;
  isBookMonthWise: boolean = true;
  isBookShiftTimeWise: boolean = true;
  isBookOperatorWise: boolean = true;
  isStaffAddStaff: boolean = true;
  isStaffAttendance: boolean = true;
  isStaffSalary: boolean = true;
  inventoryData: any = []
  isINVENTORY: boolean = true;
  isAddOilPurchase: boolean = true;
  isViewOilPurchase: boolean = true;
  isAddVarPercentage: boolean = true;
  accountingData: any = [];
  isACCOUNTING: boolean = true;
  isAddAccounting: boolean = true;
  isViewAccounting: boolean = true;
  isAccBookLedger: boolean = true;
  isAddBank: boolean = true;
  isViewBank: boolean = true;
  isPos: boolean = true;
  expenseData: any = [];
  isEXPENSE: boolean = true;
  isExpenseAccounting: boolean = true;
  isDailyReportExpense: boolean = true;
  dsrData: any = [];
  isDSR: boolean = true;
  isDsr: boolean = true;
  isTankDsr: boolean = true;
  LEDGERData: any = [];
  isLEDGER: boolean = true;
  isCredit: boolean = true;
  isAccounting: boolean = true;
  isdsr: boolean = true;
  isCreditsales: boolean = true;
  isShift: boolean = true;
  isLedgerShiftWise: boolean = true;
  isLedgerDayWise: boolean = true;
  isLedgerShiftTimeWise: boolean = true;

  constructor(
    private post: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const currentDate = new Date();
    const year = moment(new Date()).subtract(1, 'year').format("YYYY");
    config.minDate = { year: 2020, month: 4, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    // config.outsideDays = 'hidden';
  }
  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.localStoragecorporateId = element.veelsPlusCorporateID
    this.acceesGroup = element.accessGroupId
    this.createdBy = element.firstName + ' ' + element.lastName

    let id = this.route.snapshot.paramMap.get('id');
    console.log(id)
    let data = {
      customerId: id
    };

    this.customerId = id
    this.getCustomerAllDataById(this.customerId);
    this.cd.detectChanges();

  }

  getCustomerAllDataById(customerId: any) {
    let data = {
      customerId: customerId
    }

    this.post.getCustomerByCustomerIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.details = JSON.stringify(res.data);
          this.dataDetails = JSON.parse(this.details);
          this.vpcorporateId = res.data[0].veelsPlusCorporateID;
          this.corporateSqlId = res.data[0].corporateId;
          this.logoLinkDoc = res.data[0].companyLogoLink
          this.corpId = res.data[0].corporateId;
          this.branchCodeForAddNewCode = res.data[0].veelsPlusBranchID;
          this.addressSQLId = res.data[0].addressId;
          this.personSQLId = res.data[0].personId;
          this.kycId = res.data[0].kycId;
          this.emailId = res.data[0].email1;
          this.fstKycStatus = res.data[0].fstKycStatus;
          this.corporateLogoLink = res.data[0].companyLogoLink;
          this.firstName = res.data[0].firstName;
          this.lastName = res.data[0].lastName;
          this.hostName = res.data[0].hostName;
          this.address1 = res.data[0].address1;
          this.address2 = res.data[0].address2;
          this.city = res.data[0].city;
          this.GSTNumber = res.data[0].GSTNumber;
          this.companyName = res.data[0].companyName;
          this.phone1 = res.data[0].phone1;
          this.email1 = res.data[0].email1;
          this.state = res.data[0].state;
          this.country = res.data[0].country;
          this.pin = res.data[0].pin;
          this.businessType = res.data[0].businessType
          this.getDealerIdByPhone(this.phone1)
          localStorage.setItem('kycId', this.kycId);
          this.kycForm.controls["transporterBusinessType"].setValue(res.data[0].businessType)
          this.getBranchByCorporateVeelsplusId(this.vpcorporateId);
          this.cd.detectChanges();
        }
      })
  }

  getDealerIdByPhone(phoneNumber: any) {
    const data = {
      mobileNumber: phoneNumber,
    };
    this.post.searchDealerByMobilePOST(data).subscribe((res) => {
      if ((res.status = "OK")) {
        this.fuelDealerSQLId = res.data[0].fuelDealerId;
        this.getCustomize(this.fuelDealerSQLId);
        this.cd.detectChanges();
      } else {
      }
    });
  }

  getBranchByCorporateVeelsplusId(corporateId: string) {
    let data = {
      veelsplusCorporateId: "00" + corporateId
    }
    this.post.getBranchVeelsplusId(data)
      .subscribe(result => {
        if (result.status) {
          this.allBranch = result.data[0];
          this.corporateId = result.data[0].veelsPlusCorporateID
          this.veelsPlusBranchID = result.data[0].veelsPlusBranchID

          this.getAllBranchByCorporateVeelsplusId(result.data[0].veelsPlusCorporateID);
          this.cd.detectChanges();
        } else {
          alert("Seesion TimeOut Please Login Again..!")
          this.router.navigate(['/auth/login'])
        }

      })

  }

  getAllBranchByCorporateVeelsplusId(corporateId: any) {
    let data = {
      veelsplusCorporateId: corporateId
    }
    this.post.getAllBranchVeelsplusId(data)
      .subscribe(result => {
        this.allBranchdata = result;
        this.getBranchDetailByPhone(result.data[0].hostPhone);
        this.cd.detectChanges();
        // this.dropdownBranchForUser();


      })

  }

  getBranchDetailByPhone(branchPhone: any) {
    let branchPhonedata = {
      "phone1": branchPhone
    };

    this.post.getBranchByphoneNumberPOST(branchPhonedata)
      .subscribe(res => {
        this.branchDetilsData = res.data[0];
        this.GSTNumberBranch = res.data[0].GSTNumber;
        this.branchNameBranch = res.data[0].branchName;
        this.hostNameBranch = res.data[0].hostName;
        this.hostPhoneBranch = res.data[0].hostPhone;
        var corpId = localStorage.getItem('corpId');
        this.customerId = res.data[0].customerId;
        this.cd.detectChanges();
        // this.AllUserByVeelsplus(corpId)

      })

    let data = {
      customerId: this.customerId
    }
  }

  updateCustomerData() {
    this.customerId = localStorage.getItem('customerId');
    //Customer Update
    let data = {
      businessType: this.businessType,
      companyName: this.companyName,
      customerId: this.customerId,
      customerCreatedBy: this.localStoragecorporateId
    }
    this.post.updateCustomerPOST(data)
      .subscribe(res => {
        if (res) {
          alert(res.msg);
          this.cd.detectChanges();

        } else {
          alert(res.msg);
          this.cd.detectChanges();
        }
      })

    //Person Update
    let datap = {
      personId: this.personSQLId,
      email: this.email1,
    }

    this.post.updatePerson(datap)
      .subscribe(res => {
        if (res) {
          this.cd.detectChanges();
        } else {
          alert(res.msg);
          this.cd.detectChanges();
        }
      })
  }

  editCustDetail() {
    this.editCustDetails = true;
  }

  updateCorporate() {
    let data = {
      hostName: this.hostName,
      GSTNumber: this.GSTNumber,
      corporateId: this.corporateSqlId,
    }

    this.post.updateCorporatePOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert("Update Successfully..")
          this.cd.detectChanges();
        }
        else {
          alert(res.msg)
          this.cd.detectChanges();
        }
      })

  }

  editAddressDetail() {
    this.editAddressDetails = true;
  }

  onSubmitInfoAddress() {

    if (this.address1 && this.address2 && this.pin && this.city) {

      let data = {
        country: this.country,
        address1: this.address1,
        address2: this.address2,
        pin: this.pin,
        city: this.city,
        state: this.state,
        addressId: this.addressSQLId,
        cityArea: this.city,

      }
      this.post.postUpdateAddressPOST(data)
        .subscribe(res => {
          if (res) {
            alert(res.msg);
            this.cd.detectChanges();
          } else {
            alert(res.msg);
            this.cd.detectChanges();
          }
        })
    }
    else {
      alert("Please Fill all Fields!")
    }
  }

  editOtherDetail() {
    this.editOtherDetails = true;
  }

  requestDetail() {

    if (this.reqDescription) {

      let data =
      {
        ticketSource: "2",
        ticketDescription: this.reqDescription,
        ticketStatus: "Created",
        ticketRaisedByPersonId: this.personId,
        ticketCreatedDate: this.createdDate,

      }

      this.post.addNewTicketPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            alert("Request Send Successfully!")
            this.modalRef.close('close')
            this.cd.detectChanges();
          }
        })

    }
    else {
      alert("Please Enter Description!")
    }
  }

  getCustomize(dealerId: any) {
    this.creditData = [];
    this.spinner.show();
    const data = {
      customizeDealerId: dealerId,
    };
    this.post.getCustomizePOST(data)
      .subscribe((res) => {
        if ((res.status = "OK") && (res.data.length)) {
          //CREDIT MENU
          if (res.data[0].dataCREDIT.length) {
            this.creditData = res.data[0].dataCREDIT;
            this.creditData.map((res: any) => {
              if (res.customizeSubMenu == "CREDIT") {
                this.isCREDIT = false;
              } else if (res.customizeSubMenu == "AddAccount") {
                this.isAddAcc = false;
              } else if (res.customizeSubMenu == "ViewAccount") {
                this.isViewAcc = false;
              } else if (res.customizeSubMenu == "AddSales") {
                this.isAddSale = false;
              } else if (res.customizeSubMenu == "ViewSales") {
                this.isViewSale = false;
              } else if (res.customizeSubMenu == "AddPayments") {
                this.isAddPayment = false;
              } else if (res.customizeSubMenu == "ViewPayments") {
                this.isViewPayment = false;
              } else if (res.customizeSubMenu == "CreateStatement") {
                this.isCreateStatement = false;
              } else if (res.customizeSubMenu == "Book/Ledger") {
                this.isBookLedger = false;
              } else if (res.customizeSubMenu == "SavedInvoice") {
                this.isSavedInv = false;
              } else if (res.customizeSubMenu == "AddLubeTaxGSTSale") {
                this.isAddLubeTax = false;
              } else {
              }
              this.cd.detectChanges();
            })
          } else {
            this.isCREDIT = true;
          }
          //SHIFT MENU
          if (res.data[1].dataSHIFT.length) {
            this.shiftData = res.data[1].dataSHIFT;
            this.shiftData.map((res: any) => {
              if (res.customizeSubMenu == "SHIFT") {
                this.isSHIFT = false;
              } else if (res.customizeSubMenu == "AddShift") {
                this.isAddShift = false;
              } else if (res.customizeSubMenu == "ViewShift") {
                this.isViewShift = false;
              } else if (res.customizeSubMenu == "BookLedger") {
                this.isBook = false;
              } else if (res.customizeSubMenu == "AddShiftTime") {
                this.isAddShiftTime = false;
              } else if (res.customizeSubMenu == "StaffManagement") {
                this.isStaffManage = false;
              } else if (res.customizeSubMenu == "PosDetails") {
                this.isPosDetails = false;
              } else if (res.customizeSubMenu == "Book-ShiftWise") {
                this.isBookShiftWise = false;
              } else if (res.customizeSubMenu == "Book-DayWise") {
                this.isBookDayWise = false;
              } else if (res.customizeSubMenu == "Book-MonthWise") {
                this.isBookMonthWise = false;
              } else if (res.customizeSubMenu == "Book-ShiftTimeWise") {
                this.isBookShiftTimeWise = false;
              } else if (res.customizeSubMenu == "Book-OperatorWise") {
                this.isBookOperatorWise = false;
              } else if (res.customizeSubMenu == "Staff-AddStaff") {
                this.isStaffAddStaff = false;
              } else if (res.customizeSubMenu == "Staff-Attendance") {
                this.isStaffAttendance = false;
              } else if (res.customizeSubMenu == "Staff-Salary") {
                this.isStaffSalary = false;
              } else {

              }
              this.cd.detectChanges();
            })
          } else {
            this.isSHIFT = true;
          }
          //INVENTORY MENU
          if (res.data[2].dataINVENTORY.length) {
            this.inventoryData = res.data[2].dataINVENTORY;
            this.inventoryData.map((res: any) => {
              if (res.customizeSubMenu == "INVENTORY") {
                this.isINVENTORY = false;
              } else if (res.customizeSubMenu == "AddOilCompanyPurchase") {
                this.isAddOilPurchase = false;
              } else if (res.customizeSubMenu == "ViewOilCompanyPurchase") {
                this.isViewOilPurchase = false;
              } else if (res.customizeSubMenu == "AddVariationPercentage") {
                this.isAddVarPercentage = false;
              } else {

              }
              this.cd.detectChanges();
            })
          } else {
            this.isINVENTORY = true;
          }
          //ACCOUNTING MENU
          if (res.data[3].dataACCOUNTING.length) {
            this.accountingData = res.data[3].dataACCOUNTING;
            this.accountingData.map((res: any) => {
              if (res.customizeSubMenu == "ACCOUNTING") {
                this.isACCOUNTING = false;
              } else if (res.customizeSubMenu == "AddAccounting") {
                this.isAddAccounting = false;
              } else if (res.customizeSubMenu == "ViewAccounting") {
                this.isViewAccounting = false;
              } else if (res.customizeSubMenu == "BookLedger") {
                this.isAccBookLedger = false;
              } else if (res.customizeSubMenu == "AddBankAccount") {
                this.isAddBank = false;
              } else if (res.customizeSubMenu == "ViewBankAccount") {
                this.isViewBank = false;
              } else if (res.customizeSubMenu == "POS") {
                this.isPos = false;
              } else {
              }
              this.cd.detectChanges();
            })
          } else {
            this.isACCOUNTING = true;
          }
          //EXPENSE MENU
          if (res.data[4].dataEXPENSE.length) {
            this.expenseData = res.data[4].dataEXPENSE;
            this.expenseData.map((res: any) => {
              if (res.customizeSubMenu == "EXPENSE") {
                this.isEXPENSE = false;
              } else if (res.customizeSubMenu == "ExpenseAccounting") {
                this.isExpenseAccounting = false;
              } else if (res.customizeSubMenu == "DailyReportExpense") {
                this.isDailyReportExpense = false;
              } else {
              }
              this.cd.detectChanges();
            })
          } else {
            this.isEXPENSE = true;
          }
          //DSR MENU
          if (res.data[5].dataDSR.length) {
            this.dsrData = res.data[5].dataDSR;
            this.dsrData.map((res: any) => {
              if (res.customizeSubMenu == "DSR") {
                this.isDSR = false;
              } else if (res.customizeSubMenu == "Dsr") {
                this.isDsr = false;
              } else if (res.customizeSubMenu == "TankDsr") {
                this.isTankDsr = false;
              } else {
              }
              this.cd.detectChanges();
            })
          } else {
            this.isDSR = true;
          }
          //LEDGER MENU
          if (res.data[6].dataLEDGER.length) {
            this.LEDGERData = res.data[6].dataLEDGER;
            this.LEDGERData.map((res: any) => {
              if (res.customizeSubMenu == "LEDGER") {
                this.isLEDGER = false;
              } else if (res.customizeSubMenu == "Credit") {
                this.isCredit = false;
              } else if (res.customizeSubMenu == "Accounting") {
                this.isAccounting = false;
              }else if (res.customizeSubMenu == "dsr") {
                this.isdsr = false;
              } else if (res.customizeSubMenu == "Creditsales") {
                this.isCreditsales = false;
              }else if (res.customizeSubMenu == "Shift") {
                this.isShift = false;
              } else if (res.customizeSubMenu == "LedgerShiftWise") {
                this.isLedgerShiftWise = false;
              }  else if (res.customizeSubMenu == "LedgerDayWise") {
                this.isLedgerDayWise = false;
              }  else if (res.customizeSubMenu == "LedgerMonthWise") {
                this.isAccounting = false;
              }  else if (res.customizeSubMenu == "LedgerShiftTimeWise") {
                this.isLedgerShiftTimeWise = false;
              } else {
              }
              this.cd.detectChanges();
            })
          } else {
            this.isLEDGER = true;
          }

          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.cd.detectChanges();
        }
      });
  }

  changeCustomizeStatus(menu: any, subMenu: any, status: any) {
    this.spinner.show();
    const data = {
      customizeDealerId: this.fuelDealerSQLId,
      customizeMenu: menu,
      customizeSubMenu: subMenu,
      customizeStatus: status,
      createdBy: "ADMIN",
    }
    this.post.addCustomizePOST(data)
      .subscribe((res) => {
        if (res.status == "OK") {
          this.getCustomize(this.fuelDealerSQLId);
          alert("Status Updated..!");
        } else {
          alert("Error to Update..!");
          this.spinner.hide();
        }
      })

  }
}
