import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { StatsService } from '../stats.services';
import { FormGroup, FormControl } from '@angular/forms';

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
  selector: 'app-stats-widget13',
  templateUrl: './stats-widget13.component.html',
  styleUrl: './stats-widget13.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class StatsWidget13Component {
  localStoragecorporateId: any;

  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    startDate1: new FormControl(""),
    endDate1: new FormControl(""),
  })

  allentityList: any = [];
  allentityLQList: any = [];
  entityIdFastag: any;
  fastagData: any = [];
  fastagDataExcel: any = [];
  entityIdFastagLQ: any;
  fastagLQData: any = [];
  fastagLQDataExcel: any = [];

  constructor(
    private post: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    const currentDate = new Date();
    const year = moment(new Date()).subtract(1, 'year').format("YYYY");
    config.minDate = { year: 2020, month: 4, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    this.localStoragecorporateId = element.veelsPlusCorporateID
    this.getAllEntity()
    this.getAllLQEntity()
    this.cd.detectChanges();
  }

  getAllEntity() {
    this.spinner.show();
    let data = {

    }
    this.post.getAllEntityIdPost(data)
      .subscribe(res => {
        this.allentityList = res.data;
        this.spinner.hide();
      })
  }

  getAllLQEntity() {
    this.spinner.show();
    let data = {

    }
    this.post.getEntityIdAllLQPOST(data)
      .subscribe(res => {
        this.allentityLQList = res.data;
        this.spinner.hide();
        this.cd.detectChanges();
      })
  }

  getcustomerIdByEntityFastag(id: any) {
    this.entityIdFastag = id.target.value
  }

  fetchTransaction() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      if (this.entityIdFastag == "ALL") {
        this.spinner.show();
        let data = {
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        this.post.getFastagTransactionsByDatePOST(data)
          .subscribe(res => {
            alert("Download the File After 15 mins")
            this.spinner.hide();
            this.cd.detectChanges();
          });
      } else {
        this.spinner.show();
        let data = {
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          entityId: this.entityIdFastag
        }
        this.post.getFastagTransactionsByDatePOST(data)
          .subscribe(res => {
            alert("Download the File After 15 mins")
            this.spinner.hide();
            this.cd.detectChanges();
          });
      }
    } else {
      alert("Please Select Start Date,End Date And EntityId")
    }
  }

  deleteFastag() {
    this.spinner.show()
    let data = {
      fastagData: this.fastagData
    }
    console.log("data", data)

    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteFastagPOST(data).subscribe(res => {
        if (res.status == "OK") {
          alert("Data Will be Deleted after Few minutes..!");
          this.spinner.hide();
          this.cd.detectChanges();
        } else {
          this.spinner.hide();
          this.cd.detectChanges();
        }
      })
    } else {

    }
  }

  getFastagTransaction() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      if (this.entityIdFastag == "ALL") {
        this.spinner.show();
        let data = {
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        this.post.getAllFastagTransactionsByDatePOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              this.fastagData = res.data;
              this.exportExcel()
              this.spinner.hide();
              this.cd.detectChanges();
            } else {
              this.fastagData = [];
              this.spinner.hide();
              this.cd.detectChanges();
            }
          });
      } else {
        this.spinner.show();
        let data = {
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          entityId: this.entityIdFastag
        }
        this.post.getAllFastagTransactionsByDatePOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              this.fastagData = res.data;
              this.exportExcel()
              this.spinner.hide();
              this.cd.detectChanges();
            } else {
              this.fastagData = [];
              this.spinner.hide();
              this.cd.detectChanges();
            }
          });
      }
    } else {
      alert("Please Select Start Date,End Date And EntityId")
    }

  }

  exportExcel() {
    this.fastagDataExcel.length = 0
    this.fastagData.map((res: { idfastagTransaction: any; fastagTransactionAmount: any; fastagTransactionBalance: any; fastagTransactionType: any; fastagType: any; fastagTransactionTime: any; fastagtxRef: any; fastagTransactionBusinessId: any; fastagBeneficiaryName: any; fastagBeneficiaryId: any; fastagOtherPartyName: any; fastagOtherPartyId: any; fastagTxnOrigin: any; fastagTransactionStatus: any; fastagTransactionYourWallet: any; fastagExternalTransactionId: any; fastagRetrivalReferenceNo: any; fastagTransactionAuthCode: any; fastagTransactionBankTid: any; fastagConvertedAmount: any; fastagTransactionNetworkType: any; fastagTransactionKitNo: any; fastagTransactionEntityId: any; manualDate: any; }) => {

      let json = {
        idfastagTransaction: res.idfastagTransaction,
        fastagTransactionAmount: Number(res.fastagTransactionAmount),
        fastagTransactionBalance: res.fastagTransactionBalance,
        fastagTransactionType: res.fastagTransactionType,
        fastagType: res.fastagType,
        fastagTransactionTime: res.fastagTransactionTime,
        fastagtxRef: res.fastagtxRef,
        fastagTransactionBusinessId: res.fastagTransactionBusinessId,
        fastagBeneficiaryName: res.fastagBeneficiaryName,
        fastagBeneficiaryId: res.fastagBeneficiaryId,
        fastagOtherPartyName: res.fastagOtherPartyName,
        fastagOtherPartyId: res.fastagOtherPartyId,
        fastagTxnOrigin: res.fastagTxnOrigin,
        fastagTransactionStatus: res.fastagTransactionStatus,
        fastagTransactionYourWallet: res.fastagTransactionYourWallet,
        fastagExternalTransactionId: res.fastagExternalTransactionId,
        fastagRetrivalReferenceNo: res.fastagRetrivalReferenceNo,
        fastagTransactionAuthCode: res.fastagTransactionAuthCode,
        fastagTransactionBankTid: res.fastagTransactionBankTid,
        fastagConvertedAmount: res.fastagConvertedAmount,
        fastagTransactionNetworkType: res.fastagTransactionNetworkType,
        fastagTransactionKitNo: res.fastagTransactionKitNo,
        fastagTransactionEntityId: res.fastagTransactionEntityId,
        manualDate: res.manualDate,
      };

      this.fastagDataExcel.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.fastagDataExcel,
      "FastagYesBank"
    );

  }

  getcustomerIdByEntityFastagLQ(id: any) {
    this.entityIdFastagLQ = id.target.value
  }

  fetchTransactionLQ() {
    if (this.filterForm.value.startDate1 && this.filterForm.value.endDate1) {
      if (this.entityIdFastagLQ == "ALL") {
        this.spinner.show();
        let data = {
          startDate: moment(this.filterForm.value.startDate1, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate1, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        this.post.getFastagTransactionsByDateLQPOST(data)
          .subscribe(res => {
            alert("Download the File After 15 mins")
            this.spinner.hide();
            this.cd.detectChanges();
          });
      } else {
        this.spinner.show();
        let data = {
          startDate: moment(this.filterForm.value.startDate1, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate1, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          entityId: this.entityIdFastagLQ
        }
        this.post.getFastagTransactionsByDateLQPOST(data)
          .subscribe(res => {
            alert("Download the File After 15 mins")
            this.spinner.hide();
            this.cd.detectChanges();
          });
      }
    } else {
      alert("Please Select Start Date,End Date And EntityId")
    }
  }

  getFastagTransactionLQ() {
    if (this.filterForm.value.startDate1 && this.filterForm.value.endDate1) {
      if (this.entityIdFastagLQ == "ALL") {
        this.spinner.show();
        let data = {
          startDate: moment(this.filterForm.value.startDate1, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate1, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        }
        this.post.getAllFastagTransactionsLQByDatePOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              this.fastagLQData = res.data;
              this.exportExcelLQ()
              this.spinner.hide();
              this.cd.detectChanges();
            } else {
              this.fastagLQData = [res.data];
              this.spinner.hide();
              this.cd.detectChanges();
            }
          });
      } else {
        this.spinner.show();
        let data = {
          startDate: moment(this.filterForm.value.startDate1, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate1, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          entityId: this.entityIdFastagLQ
        }
        this.post.getAllFastagTransactionsLQByDatePOST(data)
          .subscribe(res => {
            if (res.status == "OK") {
              this.fastagLQData = res.data;
              this.exportExcelLQ()
              this.spinner.hide();
              this.cd.detectChanges();
            } else {
              this.fastagLQData = [];
              this.spinner.hide();
              this.cd.detectChanges();
            }
          });
      }
    } else {
      alert("Please Select Start Date,End Date And EntityId")
    }

  }

  exportExcelLQ() {
    this.fastagLQDataExcel.length = 0
    this.fastagLQData.map((res: { idfastagTransaction: any; fastagTransactionAmount: any; fastagTransactionBalance: any; fastagTransactionType: any; fastagType: any; fastagTransactionTime: any; fastagtxRef: any; fastagTransactionBusinessId: any; fastagBeneficiaryName: any; fastagBeneficiaryId: any; fastagOtherPartyName: any; fastagOtherPartyId: any; fastagTxnOrigin: any; fastagTransactionStatus: any; fastagTransactionYourWallet: any; fastagExternalTransactionId: any; fastagRetrivalReferenceNo: any; fastagTransactionAuthCode: any; fastagTransactionBankTid: any; fastagConvertedAmount: any; fastagTransactionNetworkType: any; fastagTransactionKitNo: any; fastagTransactionEntityId: any; manualDate: any; }) => {

      let json = {
        idfastagTransaction: res.idfastagTransaction,
        fastagTransactionAmount: Number(res.fastagTransactionAmount),
        fastagTransactionBalance: res.fastagTransactionBalance,
        fastagTransactionType: res.fastagTransactionType,
        fastagType: res.fastagType,
        fastagTransactionTime: res.fastagTransactionTime,
        fastagtxRef: res.fastagtxRef,
        fastagTransactionBusinessId: res.fastagTransactionBusinessId,
        fastagBeneficiaryName: res.fastagBeneficiaryName,
        fastagBeneficiaryId: res.fastagBeneficiaryId,
        fastagOtherPartyName: res.fastagOtherPartyName,
        fastagOtherPartyId: res.fastagOtherPartyId,
        fastagTxnOrigin: res.fastagTxnOrigin,
        fastagTransactionStatus: res.fastagTransactionStatus,
        fastagTransactionYourWallet: res.fastagTransactionYourWallet,
        fastagExternalTransactionId: res.fastagExternalTransactionId,
        fastagRetrivalReferenceNo: res.fastagRetrivalReferenceNo,
        fastagTransactionAuthCode: res.fastagTransactionAuthCode,
        fastagTransactionBankTid: res.fastagTransactionBankTid,
        fastagConvertedAmount: res.fastagConvertedAmount,
        fastagTransactionNetworkType: res.fastagTransactionNetworkType,
        fastagTransactionKitNo: res.fastagTransactionKitNo,
        fastagTransactionEntityId: res.fastagTransactionEntityId,
        manualDate: res.manualDate,
      };

      this.fastagLQDataExcel.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.fastagLQDataExcel,
      "FastagLQ"
    );

  }

  deleteFastagLQ() {
    this.spinner.show()
    let data = {
      fastagLQData: this.fastagLQData
    }

    if (confirm("Are you sure to delete ? ")) {
      this.post.deleteFastagLQPOST(data).subscribe(res => {
        if (res.status == "OK") {
          alert("Data Will be Deleted after Few minutes..!");
          this.spinner.hide();
          this.cd.detectChanges();
        } else {
          this.spinner.hide();
          this.cd.detectChanges();
        }
      })
    } else {

    }
  }
}
