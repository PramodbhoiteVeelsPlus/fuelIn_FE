import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatsService } from 'src/app/_metronic/partials/content/widgets/stats/stats.services';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  isDealer: boolean = false;
  isTransporter: boolean = false;
  isAdmin: boolean = false;
  veelsplusCorporate: any;
  dealerId: any;
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
  isLedgerMonthWise: boolean = true;
  pumpData: any = [];
  reportData: any = [];
  isPUMP: boolean = true;
  isInfra: boolean = true;
  isCashBill: boolean = true;
  isFuelPrice: boolean = true;
  isLubricant: boolean = true;
  isAddLubricant: boolean = true;
  isAddLubricantPurchase: boolean = true;
  isViewLubricantPurchase: boolean = true;
  isAddLubeTaxSale: boolean = true;
  isOldAccounting: boolean = true;
  isOilCompany: boolean = true;
  isBank: boolean = true;
  isCash: boolean = true;
  isPOS: boolean = true;
  isStaff: boolean = true;
  isFastag: boolean = true;
  isAccInfo: boolean = true;
  isAllTollTran: boolean = true;
  isActiveVeh: boolean = true;
  isTollPlaza: boolean = true;
  isTotalRecharge: boolean = true;
  isVehSummary: boolean = true;
  isREPORT: boolean = true;
  isDailyReportEntries: boolean = true;
  isDailyReport: boolean = true;
  isMonthlyReport: boolean = true;
  isVatBook: boolean = true;
  isProfitReport: boolean = true;
  isSummaryReport: boolean = true;
  isViswasaTxExcel: boolean = true;
  isSalesPurReport: boolean = true;
  accessGroupId: any;
  customerId: any;
  isFTActive: any = "NO"; 
  ubiData: any = [];
  isUBI: boolean = true;

  constructor(private router: Router,
    private post: StatsService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('isLoggedin') || '{}') == true) {
      var element = JSON.parse(localStorage.getItem("element") || '{}');
      this.veelsplusCorporate = element.veelsPlusCorporateID;
      this.accessGroupId = element.accessGroupId
      if (element.accessGroupId == '7') {
        this.isAdmin = true;
        this.isDealer = false;
        this.isTransporter = false;
      } else if (element.accessGroupId == '2') {
        var transporterData = JSON.parse(localStorage.getItem('transporterData') || '');
        this.isTransporter = true;
        this.isAdmin = false;
        this.isDealer = false;
        this.customerId = transporterData.customerId
        this.getFastagCorporateByCustId(this.customerId)
      } else if (element.accessGroupId == '12' || element.accessGroupId == '14' || element.accessGroupId == '19') {
        this.isDealer = true;
        this.isAdmin = false;
        this.isTransporter = false;
        if(element.accessGroupId == '12'){
          this.dealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
          this.getCustomize(this.dealerId);
          this.cd.detectChanges()
        } else if(element.accessGroupId == '14'){
          var managerData = JSON.parse(localStorage.getItem("managerData") || '{}');
          this.dealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
          this.getCustomize(this.dealerId);
          this.cd.detectChanges()
      }
        // this.dealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
        // this.getCustomize(this.dealerId);
      } else {
        this.isAdmin = false;
        this.isDealer = false;
        this.isTransporter = false;
        this.router.navigate(['/auth/login']);
      }
    } else {
      this.router.navigate(['/auth/login'])
    }
  }

  getCustomize(dealerId: any) {
    this.creditData = [];
    // this.spinner.show();
    const data = {
      customizeDealerId: dealerId,
    };
    this.post.getCustomizePOST(data)
      .subscribe((res) => {
        if ((res.status = "OK")) {
          localStorage.setItem('customizeData', JSON.stringify(res.data));

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
              } else if (res.customizeSubMenu == "dsr") {
                this.isdsr = false;
              } else if (res.customizeSubMenu == "Creditsales") {
                this.isCreditsales = false;
              } else if (res.customizeSubMenu == "Shift") {
                this.isShift = false;
              } else if (res.customizeSubMenu == "LedgerShiftWise") {
                this.isLedgerShiftWise = false;
              } else if (res.customizeSubMenu == "LedgerDayWise") {
                this.isLedgerDayWise = false;
              } else if (res.customizeSubMenu == "LedgerMonthWise") {
                this.isLedgerMonthWise = false;
              } else if (res.customizeSubMenu == "LedgerShiftTimeWise") {
                this.isLedgerShiftTimeWise = false;
              } else {
              }
              this.cd.detectChanges();
            })
          } else {
            this.isLEDGER = true;
          }
          //PUMP MENU
          if (res.data[7].dataPUMP.length) {
            this.pumpData = res.data[7].dataPUMP;
            this.pumpData.map((res: any) => {
              if (res.customizeSubMenu == "PUMP") {
                this.isPUMP = false;
              } else if (res.customizeSubMenu == "Infra") {
                this.isInfra = false;
              } else if (res.customizeSubMenu == "CashBill") {
                this.isCashBill = false;
              } else if (res.customizeSubMenu == "FuelPrice") {
                this.isFuelPrice = false;
              } else if (res.customizeSubMenu == "Lubricant") {
                this.isLubricant = false;
              } else if (res.customizeSubMenu == "Lube-AddLubricant") {
                this.isAddLubricant = false;
              } else if (res.customizeSubMenu == "Lube-AddLubricantPurchase") {
                this.isAddLubricantPurchase = false;
              } else if (res.customizeSubMenu == "Lube-ViewLubricantPurchase") {
                this.isViewLubricantPurchase = false;
              } else if (res.customizeSubMenu == "Lube-AddLubeTaxSale") {
                this.isAddLubeTaxSale = false;
              } else if (res.customizeSubMenu == "OldAccounting") {
                this.isOldAccounting = false;
              } else if (res.customizeSubMenu == "OldAcc-OilCompany") {
                this.isOilCompany = false;
              } else if (res.customizeSubMenu == "OldAcc-Bank") {
                this.isBank = false;
              } else if (res.customizeSubMenu == "OldAcc-Cash") {
                this.isCash = false;
              } else if (res.customizeSubMenu == "OldAcc-Pos") {
                this.isPOS = false;
              } else if (res.customizeSubMenu == "OldAcc-Staff") {
                this.isStaff = false;
              } else if (res.customizeSubMenu == "Fastag") {
                this.isFastag = false;
              } else if (res.customizeSubMenu == "FT-AccInfo") {
                this.isAccInfo = false;
              } else if (res.customizeSubMenu == "FT-AllTollTran") {
                this.isAllTollTran = false;
              } else if (res.customizeSubMenu == "FT-ActiveVeh") {
                this.isActiveVeh = false;
              } else if (res.customizeSubMenu == "FT-TollPlaza") {
                this.isTollPlaza = false;
              } else if (res.customizeSubMenu == "FT-TotalRecharge") {
                this.isTotalRecharge = false;
              } else if (res.customizeSubMenu == "FT-VehSummary") {
                this.isVehSummary = false;
              } else {
              }
              this.cd.detectChanges();
            })
          } else {
            this.isPUMP = true;
          }
          //REPORT MENU
          if (res.data[8].dataREPORT.length) {
            this.reportData = res.data[8].dataREPORT;
            this.reportData.map((res: any) => {
              if (res.customizeSubMenu == "REPORT") {
                this.isREPORT = false;
              } else if (res.customizeSubMenu == "DailyReportEntries") {
                this.isDailyReportEntries = false;
              } else if (res.customizeSubMenu == "DailyReport") {
                this.isDailyReport = false;
              } else if (res.customizeSubMenu == "MonthlyReport") {
                this.isMonthlyReport = false;
              } else if (res.customizeSubMenu == "VatBook") {
                this.isVatBook = false;
              } else if (res.customizeSubMenu == "ProfitReport") {
                this.isProfitReport = false;
              } else if (res.customizeSubMenu == "SummaryReport") {
                this.isSummaryReport = false;
              } else if (res.customizeSubMenu == "ViswasaTxExcel") {
                this.isViswasaTxExcel = false;
              } else if (res.customizeSubMenu == "SalesPurReport") {
                this.isSalesPurReport = false;
              } else {
              }
              this.cd.detectChanges();
            })
          } else {
            this.isREPORT = true;
          }

          //UBI MENU
          if (res.data[10].dataUBI.length) {
            this.ubiData = res.data[10].dataUBI;
            this.ubiData.map((res: any) => {
              if (res.customizeSubMenu == "UBI") {
                this.isUBI = false;
              } 
              this.cd.detectChanges();
            })
          } else {
            this.isUBI = true;
          }


          this.cd.detectChanges();
          // this.spinner.hide();
        } else {
          // this.spinner.hide();
          this.cd.detectChanges();
        }
      });
  }

  alert(){
    alert('To use all petrol pump management modules, upgrade to fuelin prime')
  }

  getFastagCorporateByCustId(customerId: any) {
    let data = {
        customerId: customerId,
    };
    this.post.getFastagCorporateByCustmerIdPOST(data).subscribe((res) => {
        if (res.data.length) {
            this.isFTActive = res.data[0].isActive;
        } else {
          if (res.data1.length) {
            this.isFTActive = res.data1[0].isActive;
        } else {
            this.isFTActive = "NO";
        }
        }
    });
  }
  
  alertFt(){
    alert('Get Fastag and earn on your fuel credit transactions. To apply for Fastag, please contact 9825600424 or write to hello@veels.plus')
  }
}
