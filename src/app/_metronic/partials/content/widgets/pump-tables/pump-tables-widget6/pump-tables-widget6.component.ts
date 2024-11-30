import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbModal, NgbDatepickerConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { StatsService } from '../../stats/stats.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import moment from 'moment';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
import { PumpTablesService } from '../pump-tables.services';
import { Adv_TablesService } from '../../advance-tables/adv_tables.services';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<any> {

  readonly DELIMITER = '-';

  fromModel(value: any | null): NgbDateStruct | null {
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

  toModel(date: NgbDateStruct | null): any | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';

  parse(value: any): NgbDateStruct | null {
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

  format(date: NgbDateStruct | null): any {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-pump-tables-widget6',
  templateUrl: './pump-tables-widget6.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class PumpTablesWidget6Component implements OnInit {

  fuelDealerId: any;
  dealerCorporateId: any;
  userId: any;
  acceesGroup: any;
  dealerMobile: any;
  dealerLoginVPId: any;
  managerVPPersonId: any;
  managerPersonId: any;
  managerName: string;
  userName: string;
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  avlBalance: any;
  balanceLQ: any;
  FT: boolean;
  fastagId: any;
  thrLimit: any;
  bothFT: boolean;
  fastagLQId: any;
  thrLimitLQ: any;
  companyName: any;
  hostPhone: any;
  entityIdForCorp: any;
  startDate: string;
  endDate: string;
  activeVehicleArray: any = [];
  creditSum: number;
  debitSum: number;
  showDateRange: boolean = false;

  constructor(
    private modalService: NgbModal,
    private post: PumpTablesService,
    private post1: Adv_TablesService,
    private post2: StatsService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    var dealerData = JSON.parse(localStorage.getItem("dealerData") || '{}');
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.userId = element.userId;
    this.acceesGroup = element.accessGroupId;
    this.dealerMobile = element.phone1;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.companyName = dealerData.companyName
    this.hostPhone = dealerData.hostPhone
    this.userName = element.firstName + ' ' + element.lastName;
    this.acceesGroup = element.accessGroupId;

    this.activeVehicleArray = this.post.activeVehicleArray;

    if (this.activeVehicleArray.length) {
      this.activeVehicleArray.map((res1: { fastagType: string; fastagTransactionAmount: any; }) => {
        if (res1.fastagType == "CREDIT") {
          this.creditSum = Number(this.creditSum) + Number(res1.fastagTransactionAmount)
        }
        if (res1.fastagType == "DEBIT") {
          this.debitSum = Number(this.debitSum) + Number(res1.fastagTransactionAmount)
        }
      })
    }
    
    this.startDate = this.post.date11;
    this.endDate = this.post.date22;
    if (this.post.date11 == "Invalid date" || this.post.date22 == "Invalid date") {
      this.showDateRange = false;
      // console.log("showDateRange false = ", this.showDateRange)
    } else {
      this.showDateRange = true;
      // console.log("showDateRange true = ", this.showDateRange)
    }
    this.getFastagCorporateByCorpId(this.dealerCorporateId)
    this.cd.detectChanges()
  }

  getFastagCorporateByCorpId(dealerCorporateId: any) {
    const data = {
      corporateId: dealerCorporateId,
    };
    this.post.getFastagCorporateByCorpIdPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        if (res.data.length) {
          this.entityIdForCorp = res.data[0].entityId
          this.thrLimit = res.data[0].thrLimit
        }
      } else {
      }
    });
  }
}

