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

  constructor(private router: Router,
    private post: StatsService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,) { }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem('isLoggedin') || '{}') == true) {
      var element = JSON.parse(localStorage.getItem("element") || '{}');
      this.veelsplusCorporate = element.veelsPlusCorporateID;
      if (element.accessGroupId == '7') {
        this.isAdmin = true;
        this.isDealer = false;
        this.isTransporter = false;
      } else if (element.accessGroupId == '2') {
        this.isTransporter = true;
        this.isAdmin = false;
        this.isDealer = false;
      } else if (element.accessGroupId == '12' || element.accessGroupId == '14') {
        this.isDealer = true;
        this.isAdmin = false;
        this.isTransporter = false;
        this.dealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
        this.getCustomize(this.dealerId);
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
    this.spinner.show();
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


          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.cd.detectChanges();
        }
      });
  }


}
