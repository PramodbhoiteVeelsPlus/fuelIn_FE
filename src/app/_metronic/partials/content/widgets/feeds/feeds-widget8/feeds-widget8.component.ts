import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FeedsService } from '../feeds.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-feeds-widget8',
  templateUrl: './feeds-widget8.component.html',
})
export class FeedsWidget8Component implements OnInit {
  page: any = 1;
  pageSize: any = 10;
  dealerLoginVPId: any;
  accessGroupId: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  allProfitReportDetails: any = [];
  month: any;
  year: any;
  currentYear: any;
  lastYear: any;
  last2Year: any;
  lastFourthYear: number;
  lastFifthYear: number;
  modalRef: any;
  closeResult: string;
  profitReportId: any;
  profitReportExpenseAmt: any;
  profitReportOperationCharges: any;

  constructor(public router: Router,
    private post: FeedsService,
    private spinner: NgxSpinnerService,
    private cd: ChangeDetectorRef,) {
     }

  ngOnInit() {
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.spinner.show();
    this.year = moment(new Date()).format("YYYY");
    this.currentYear = moment(new Date()).format("YYYY");
    this.lastYear = Number(moment(new Date()).format("YYYY")) - 1;
    this.last2Year = Number(moment(new Date()).format("YYYY")) - 2;
    this.lastFourthYear = Number(this.currentYear) - 3;
    this.lastFifthYear = Number(this.currentYear) - 4;
    this.month = moment(new Date()).format("MMM")
    this.getAllProfitReport(this.fuelDealerId);
  }

  //getAllProfitReport
  getAllProfitReport(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId,
    }
    this.post.getAllProfitReportPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.allProfitReportDetails = res.data;
        this.cd.detectChanges();
        this.spinner.hide()
      } else {
        alert(res.msg)
        this.cd.detectChanges();
        this.spinner.hide()
      }
    })
  }

  //getProfitReport()
  getProfitReport() {
    this.spinner.show()
    this.allProfitReportDetails = []
    let data = {
      fuelDealerId: this.fuelDealerId,
      month: this.month,
      year: this.year,
    }
    this.post.getProfitReportDetailsPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.allProfitReportDetails = res.data;
        this.cd.detectChanges();
        this.spinner.hide()
      } else {
        alert(res.msg)
        this.getAllProfitReport(this.fuelDealerId);
        this.spinner.hide()
      }
    })
  }

  //deleteReport(data.profitReportId)
  deleteReport(profitReportId: any) {
    this.spinner.show();
    this.allProfitReportDetails = [];
    let data = {
      fuelDealerId: this.fuelDealerId,
      profitReportId: profitReportId,
    }
    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteProfitReportPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert(res.msg)
            this.allProfitReportDetails = res.data;
            this.cd.detectChanges();
            this.spinner.hide();
          } else {
            alert(res.msg)
            this.cd.detectChanges();
            this.spinner.hide();
          }
        })
    } else {
      this.spinner.hide()
    }
  }

  //viewReport
  viewReport(data: any) {
    this.post.profitReportPOST(data);
    this.router.navigate(['/report/viewProfitReport']);

  }
}