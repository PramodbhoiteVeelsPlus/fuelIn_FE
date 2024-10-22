import { Component, OnInit, Injectable, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { NgbModal, NgbActiveModal, ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbDatepickerConfig, NgbDate } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Adv_TablesService } from '../adv_tables.services';
import { ExcelService } from 'src/app/pages/excel.service';

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
  selector: 'app-advance-tables-widget2',
  templateUrl: './advance-tables-widget2.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class AdvanceTablesWidget2Component implements OnInit {
  filterFastagCustomerList = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  searchBoxCustomerList: FormControl = new FormControl();
  searchTermCustomerList: any = "";
  getAllFastagUserList1: any = [];
  getAllFastagUserList2: any = [];
  selectedCList: string;
  getAllFastagUserList: any = [];
  getAllFastagUserList1Excel: any = [];



  constructor(private post: Adv_TablesService, private excelService: ExcelService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.getAllFastagCustomerList();
  }

  getAllFastagCustomerList() {
    this.getAllFastagUserList1 = [];
    this.post.getFastagCustomerList()
      .subscribe((res: any) => {
        this.getAllFastagUserList = res;
        this.getAllFastagUserList.data.map(
          (detail: any) => {
            this.getAllFastagUserList1.push(detail)
            this.getAllFastagUserList2.push(detail)
          })
        this.cd.detectChanges();
      })
  }

  searchCustomerList1() {
    this.searchBoxCustomerList.valueChanges
      // .distinctUntilChanged()
      .subscribe((termCustomerList) => {
        this.searchTermCustomerList = termCustomerList;
        this.searchCustomerList();
      })
  }

  //  Free Search Fastag Customer
  searchCustomerList() {
    let term = this.searchTermCustomerList;
    this.getAllFastagUserList1 = this.getAllFastagUserList2.filter(function (res: any) {
      return res.entityId.indexOf(term) >= 0;
    });
    if (this.getAllFastagUserList1.length == 0) {
      term = this.searchTermCustomerList;
      this.getAllFastagUserList1 = this.getAllFastagUserList2.filter(function (res: any) {
        return res.entityId.indexOf(term) >= 0;
      });
    }
    if (this.getAllFastagUserList1.length == 0) {
      term = this.searchTermCustomerList;
      this.getAllFastagUserList1 = this.getAllFastagUserList2.filter(function (res: any) {
        return res.vishUserFirstName.indexOf(term) >= 0;
      });
    }
    if (this.getAllFastagUserList1.length == 0) {
      term = this.searchTermCustomerList;
      this.getAllFastagUserList1 = this.getAllFastagUserList2.filter(function (res: any) {
        return res.vishUserLastName.indexOf(term) >= 0;
      });
    }
    if (this.getAllFastagUserList1.length == 0) {
      term = this.searchTermCustomerList;
      this.getAllFastagUserList1 = this.getAllFastagUserList2.filter(function (res: any) {
        return res.vishUserMobile.indexOf(term) >= 0;
      });
    }
    if (this.getAllFastagUserList1.length == 0) {
      term = this.searchTermCustomerList;
      this.getAllFastagUserList1 = this.getAllFastagUserList2.filter(function (res: any) {
        return res.vishUserMail.indexOf(term) >= 0;
      });
    }
    if (this.getAllFastagUserList1.length == 0) {
      term = this.searchTermCustomerList;
      this.getAllFastagUserList1 = this.getAllFastagUserList2.filter(function (res: any) {
        return res.vishUserVehicleCount.indexOf(term) >= 0;
      });
    }
  }

  // FILTER FT LIST CUSTOMER
  getFastagCustomerListByDateRange() {
    this.getAllFastagUserList1 = [];
    let data = {
      startDate: moment(this.filterFastagCustomerList.value.startDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "00:00:01",
      endDate: moment(this.filterFastagCustomerList.value.endDate, ["DD-MM-YYYY"]).format('YYYY-MM-DD') + " " + "23:59:59",
    }
    this.post.getFTCustomerListByDateRangePost(data)
      .subscribe(res => {
        if (res.data.length) {
          this.getAllFastagUserList1 = res.data;
          this.cd.detectChanges();
        } else {
          alert("Data not found..")
          this.cd.detectChanges();
        }
      })
  }

  clearFilterCustomerList() {
    this.selectedCList = '';
    this.filterFastagCustomerList.reset();
    this.getAllFastagCustomerList();
  }

  exportToExcelCustomerList() {
    this.getAllFastagUserList1Excel.length = 0
    this.getAllFastagUserList1.map((res:any) => {
      let json = {
        VeelsID: res.entityId,
        MappedDate: moment(res.vishUserCreatedAt).format("DD-MM-YYYY"),
        OwnerName: res.vishUserFirstName + ' ' + res.vishUserLastName,
        ContactNumber: res.vishUserMobile,
        EmailId: res.vishUserMail,
        OwnedVehicleCount: res.vishUserVehicleCount,
      };
      this.getAllFastagUserList1Excel.push(json);
    });
    this.excelService.exportAsExcelFile(
      this.getAllFastagUserList1Excel,
      "Fastag Customer List"
    );

  }

}
