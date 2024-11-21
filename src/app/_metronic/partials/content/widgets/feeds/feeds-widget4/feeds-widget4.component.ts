import { ChangeDetectorRef, Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbActiveModal, NgbDatepickerConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FeedsService } from '../feeds.services';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ExcelService } from 'src/app/pages/excel.service';
import { Router } from '@angular/router';


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
  selector: 'app-feeds-widget4',
  templateUrl: './feeds-widget4.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class FeedsWidget4Component implements OnInit {
  dealerLoginVPId: any;
  accessGroupId: any;
  userId: any;
  personId: any;
  userName: string;
  ownerName: string;
  loginSQLCorporateId: any;
  petrolPump: any;
  fuelDealerId: any;
  reportData: any = [];


  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  });
  profitReportId: any;
  dailyProfitId: any;
  modalReference: any;
  closeResult: string;
  balance: any = 0;
  date: any;
  page: any = 1;
  pageSize: any = 10;
  isUpdateOpening: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private cd: ChangeDetectorRef,
    private post: FeedsService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    public router: Router,
  ) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.petrolPump = dealerData.companyName;
    this.userName = element.firstName + ' ' + element.lastName;
    this.balance = 0;
    this.date = moment(new Date()).format("DD-MM-YYYY");    
    this.getDailyReports();
  }

  getDailyReports() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      this.spinner.show();
      let data = {
        profitReportDealerId: this.fuelDealerId,
        startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
      }
      this.post.getDailyReportsByDealerIdPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.reportData = res.data;
            this.cd.detectChanges();
            this.spinner.hide()
          } else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    } else {
      this.spinner.show();
      let data = {
        profitReportDealerId: this.fuelDealerId
      }
      this.post.getDailyReportsByDealerIdPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.reportData = res.data;
            this.cd.detectChanges();
            this.spinner.hide()
          } else {
            this.spinner.hide()
            this.cd.detectChanges();
          }
        })
    }
  }

  viewReport(profitReportId: any) {
    this.post.dailyProfit(profitReportId);
    this.spinner.show()
    let data = {
      reportId: profitReportId
    }
    this.post.getDailyProfitReportPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.reportData = res.data;
          this.router.navigate(['/report/viewSummaryReport']);
          this.cd.detectChanges();
          this.spinner.hide()
        } else {
          this.cd.detectChanges();
          this.spinner.hide()
        }
      })
  }

  updateReport(profitReportId: any) {
    this.post.dailyProfit(profitReportId);
    this.spinner.show()
    let data = {
      reportId: profitReportId
    }
    this.post.getDailyProfitReportPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.reportData = res.data;
          this.router.navigate(['/report/updateSummaryReport']);
          this.spinner.hide()
        } else {
          this.spinner.hide()
        }
      })
  }

  // addOpening 
  addOpening(addBal: any) {
    this.getOpening();
    this.modalReference = this.modalService.open(addBal)
    this.modalReference.result.then((result: any) => {
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

  //submitOpening
  submitOpening() {
    this.spinner.show();
    let data = {
      profitReportDealerId: this.fuelDealerId,
      profitReportCreatedBy: this.userName,
      profitReportAmount: this.balance,
      profitReportDate: moment(this.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
    }
    this.post.addReportOpeningBalancePOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert("Opening Balance Added Successfully..!")
          this.balance = Number(res.data[0].profitReportAmount).toFixed(2);
          this.profitReportId = res.data[0].profitReportId;
          this.date = moment(res.data[0].profitReportDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY");
          this.modalReference.close('close')
          this.isUpdateOpening = true;
          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          alert("Error To add opening Balance..!")
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  //getOpening
  getOpening() {
    this.spinner.show();
    let data = {
      profitReportDealerId: this.fuelDealerId,
    }
    this.post.getDailyReportOpeningBalancePOST(data)
      .subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          alert("If You Update the opening Balance, you also need to update all the Reports..! ")
          this.isUpdateOpening = true;
          this.balance = Number(res.data[0].profitReportAmount).toFixed(2);
          this.profitReportId = res.data[0].profitReportId;
          this.date = moment(res.data[0].profitReportDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY");
          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  //updateOpening
  updateOpening() {
    this.spinner.show();
    let data = {
      profitReportDealerId: this.fuelDealerId,
      profitReportId: this.profitReportId,
      profitReportAmount: this.balance,
      profitReportDate: moment(this.date, ["DD-MM-YYYY"]).format("YYYY-MM-DD")
    }
    this.post.addReportOpeningBalancePOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          alert("Opening Balance update Successfully..!")
          this.balance = Number(res.data[0].profitReportAmount).toFixed(2);
          this.profitReportId = res.data[0].profitReportId;
          this.date = moment(res.data[0].profitReportDate, ["YYYY-MM-DD"]).format("DD-MM-YYYY");
          this.modalReference.close('close')
          this.isUpdateOpening = true;
          this.cd.detectChanges();
          this.spinner.hide();
        } else {
          alert("Error To update opening Balance..!")
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  //deleteReport(data.profitReportId)
  deleteReport(profitReportId: any) {
    let data = {
      profitReportId: profitReportId
    }
    if (confirm("Are you sure to delete ? If you delete the Report you have to update All the Reports..! ")) {
      this.post.deleteDailyProfitReportPOST(data)
        .subscribe(res => {
          if (res.status == 'OK') {
            alert("Report deleted successfully..!")
            this.getDailyReports();
          } else {
          }
        })
    }
    else {
    }
  }
}
