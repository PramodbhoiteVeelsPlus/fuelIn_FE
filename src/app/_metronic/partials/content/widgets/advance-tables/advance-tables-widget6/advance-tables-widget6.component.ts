import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { Adv_TablesService } from '../adv_tables.services';
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
  selector: 'app-advance-tables-widget6',
  templateUrl: './advance-tables-widget6.component.html',
  styleUrl: './advance-tables-widget6.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class AdvanceTablesWidget6Component {
  closeResult: string;
  fastagDetailsAll: any = [];
  fastagDetails: any;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  idfastagEntityDetail: any;
  fastagEntityDetailStatus: any;
  fastagEntityDetailKey: any;
  fastagEntityName: any;
  fastagEntityDetailKeyAdd: any;
  corporateId: any;

  constructor(private excelService: ExcelService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private post: Adv_TablesService,
    private cd: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '');
    this.corporateId = element.veelsPlusCorporateID;
    this.getEntityAll();
    this.cd.detectChanges();
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getEntityAll();
  }

  addEntity(entity: any) {
    this.modalService.open(entity).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  getEntityAll() {
    let data = {

    }
    this.post.getAllEntityDetailsPOST(data).subscribe((res) => {
      if (res) {
        this.fastagDetailsAll = res.data;
      }
    });
  }

  updateEntity(statusUpdate: any, idfastagEntityDetail: any, fastagEntityDetailStatus: any, fastagEntityDetailKey: any) {
    this.idfastagEntityDetail = idfastagEntityDetail;
    this.fastagEntityDetailStatus = fastagEntityDetailStatus;
    this.fastagEntityDetailKey = fastagEntityDetailKey;
    this.modalService.open(statusUpdate).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  aadFastagEntityDetail() {
    let currentDate = new Date();
    let data = {
      fastagEntityName: this.fastagEntityName,
      fastagEntityDetailKey: this.fastagEntityDetailKeyAdd,
      fastagEntityDetailCreatedAt: moment(currentDate).format("YYYY-MM-DD HH:mm:ss"),
      fastagEntityDetailCreatedBy: this.corporateId,
    };
    this.post.aadFastagEntityDetailPOST(data).subscribe((res) => {
      alert(res.msg);
      this.fastagEntityName = "";
      this.fastagEntityDetailKeyAdd = "";
      this.getEntityAll();
    });
  }

  updateFastagEntityDetail() {
    let currentDate = new Date();

    let data = {
      idfastagEntityDetail: this.idfastagEntityDetail,
      fastagEntityDetailStatus: this.fastagEntityDetailStatus,
      fastagEntityDetailKey: this.fastagEntityDetailKey,
      fastagEntityDetailUpdatedAt: moment(currentDate).format("YYYY-MM-DD HH:mm:ss"),
      fastagEntityDetailUpdatedBy: this.corporateId,
    };
    this.post.updateFastagEntityDetailPOST(data).subscribe((res) => {
      alert(res.msg);
      this.idfastagEntityDetail = "";
      this.fastagEntityDetailStatus = "";
      this.fastagEntityDetailKey = "";
      this.getEntityAll();
    });
  }

}
