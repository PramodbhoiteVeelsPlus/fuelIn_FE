import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from './dashboard.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  isDealer: boolean = false;
  isTransporter: boolean = false;
  isAdmin: boolean = true;

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  fuelDealerId: any;
  thisMonthCrPayment: any;
  thisMonthCrSale: any;
  totalOS: any;
  sixMonthData: any = [];
  topFiveData: any = [];
  constructor(private router: Router,
    private spinner: NgxSpinnerService,
    private post: DashboardService,
        private cd: ChangeDetectorRef

  ) { }

  async openModal() {
    return await this.modalComponent.open();
  }

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();

    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);

    if (JSON.parse(localStorage.getItem('isLoggedin') || '{}') == true) {
      var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
      if (element.accessGroupId == '7') {
        this.isAdmin = true;
        this.isDealer = false;
        this.isTransporter = false;
      } else if (element.accessGroupId == '2') {
        this.isTransporter = true;
        this.isAdmin = false;
        this.isDealer = false;
      } else if (element.accessGroupId == '12' || element.accessGroupId == '14' || element.accessGroupId == '19') {
        this.isDealer = true;
        this.isAdmin = false;
        this.isTransporter = false;
        this.getDashboardDetails(this.fuelDealerId)
        this.getDashboardCrDetails(this.fuelDealerId)
      } else {
        this.isAdmin = false;
        this.isDealer = false;
        this.isTransporter = false;
        this.router.navigate(['/auth/home']);
      }
    } else {
      this.router.navigate(['/auth/home'])
    }
  }


  getDashboardDetails(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getDashboardDetailsPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {

          if (res.totalPayment) {
            this.thisMonthCrPayment = res.totalPayment
            localStorage.setItem('thisMonthCrPayment', this.thisMonthCrPayment);
          } else {
            this.thisMonthCrPayment = 0
            localStorage.setItem('thisMonthCrPayment', '');
          }

          if (res.totalPurchase) {
            this.thisMonthCrSale = res.totalPurchase
            localStorage.setItem('thisMonthCrSale', this.thisMonthCrPayment);
          } else {
            this.thisMonthCrSale = 0
            localStorage.setItem('thisMonthCrSale', '');
          }

          if (res.outstanding) {
            this.totalOS = res.outstanding
            localStorage.setItem('totalOS', this.totalOS);
          } else {
            this.totalOS = 0
            localStorage.setItem('totalOS', '');
          }
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()
        }
      })
  }

  getDashboardCrDetails(fuelDealerId: any) {
    this.spinner.show()
    let data = {
      fuelDealerId: fuelDealerId
    }

    this.post.getDealerDashboardCrDataPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.sixMonthData = res.sixMonthData;
          this.topFiveData = res.topFiveData;
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()
        }
      })
  }
}
