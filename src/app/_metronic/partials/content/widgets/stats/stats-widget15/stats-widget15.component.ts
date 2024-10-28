import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { FormGroup, FormControl } from '@angular/forms';
import { StatsService } from '../stats.services';
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

@Component({
  selector: 'app-stats-widget15',
  templateUrl: './stats-widget15.component.html',
  styleUrl: './stats-widget15.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class StatsWidget15Component {

  fastagTransaction = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    startDate1: new FormControl(""),
    endDate1: new FormControl(""),
  })
  entityIdFastag: any;
  allentityList: any = [];
  entityCount: any = [];
  entityCountList: any = [];
  entityIdFastagLQ: any;
  allentityLQList: any = [];

  constructor(private excelService: ExcelService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private post: StatsService,
    private cd: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '');
    this.getAllEntity();
    this.getAllLQEntity();
    this.cd.detectChanges();
  }

  getcustomerIdByEntityFastag(id: any) {
    this.entityIdFastag = id.target.value
  }

  getAllEntity() {
    this.spinner.show();
    let data = {

    }
    this.post.getAllEntityIdPost(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.allentityList = res.data;
          this.spinner.hide()
        } else {
          this.allentityList = [];
          this.spinner.hide()
        }
        // this.redeemByCustIs();
      })

  }

  fetchTransaction() {
    if (this.fastagTransaction.value.startDate && this.fastagTransaction.value.endDate) {
      this.spinner.show();
      let data = {
        startDate: moment(this.fastagTransaction.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.fastagTransaction.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        entityId: this.entityIdFastag
      }
      this.post.getFastagTransactionByDatePOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.spinner.hide()
            this.entityCount = res;
            this.entityCount.data.map(
              (detail: any) => {
                this.entityCountList.push(detail)
              })
          } else {
            this.spinner.hide()
          }
        });
    } else {
      alert("Please Select Start Date,End Date And EntityId")
    }
  }

  getcustomerIdByEntityFastagLQ(id: any) {
    this.entityIdFastagLQ = id.target.value
  }

  getAllLQEntity() {
    this.spinner.show();
    let data = {

    }
    this.post.getEntityIdAllLQPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.allentityLQList = res.data;
          this.spinner.hide()
        } else {
          this.allentityLQList = [];
          this.spinner.hide()
        }
      })

  }


  fetchTransactionLQ() {
    if (this.fastagTransaction.value.startDate1 && this.fastagTransaction.value.endDate1) {
      this.spinner.show();
      let data = {
        startDate: moment(this.fastagTransaction.value.startDate1, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        endDate: moment(this.fastagTransaction.value.endDate1, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
        entityId: this.entityIdFastagLQ
      }
      this.post.getFastagTransactionByDateLQPOST(data)
        .subscribe(res => {
          if (res.status == "OK") {
            this.spinner.hide()
            //  this.getEntityCountLQ()
          } else {
            this.spinner.hide()
          }
        });
    } else {
      alert("Please Select Start Date,End Date And EntityId")
    }
  }
}
