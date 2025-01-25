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
  selector: 'app-pump-tables-widget10',
  templateUrl: './pump-tables-widget10.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class PumpTablesWidget10Component implements OnInit {

  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    businessId: new FormControl(""),
  });

  filterFormLQ = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
    businessId: new FormControl(""),
  });

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
  FT: boolean = false;
  entityIdForCorp: any;
  thrLimit: any;
  bothFT: boolean = false;
  LQFT: boolean = false;
  entityIdForCorpLQ: any;
  LQ: boolean = false;
  fastagLength: any = [];
  fastagData: any = [];
  fastagLQData: any = [];
  fastagLQLength: any = [];
  vehicleList: any = [];
  fastagTransaction: any = [];
  FTData: any = [];
  FTDetails: any = [];
  fastagTransactionDetails: any = [];
  totalFT: any = [];
  vehicleLQList: any = [];
  FTLQData: any = [];
  FTLQTransaction: any = [];
  FTLQDetails: any = [];
  FTLQTransactionDetails: any = [];
  totalFTLQ: any = [];
  transporterCorpId: string | null;
  isTable: boolean = false;
  openningBalance: any = 0;
  totalDebit: any = 0;
  totalCredit: any = 0;
  closingBalance: any = 0;
  openningBalanceLq: any = 0;
  totalDebitLq: any = 0;
  totalCreditLq: any = 0;
  closingBalanceLq: any = 0;
  customerId: any;

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
    this.userId = element.userId;
    this.acceesGroup = element.accessGroupId;
    this.dealerMobile = element.phone1;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.userName = element.firstName + ' ' + element.lastName;
    this.acceesGroup = element.accessGroupId;
    let currentDate = moment(new Date()).subtract(1, 'day').format("DD-MM-YYYY")
    let previousDate = moment(new Date()).format("01-MM-YYYY");
    this.filterForm.controls["startDate"].setValue(previousDate);
    this.filterForm.controls["endDate"].setValue(currentDate);
    this.filterFormLQ.controls["startDate"].setValue(previousDate);
    this.filterFormLQ.controls["endDate"].setValue(currentDate);
    if (this.acceesGroup == '12') {
      this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
      var dealerData = JSON.parse(localStorage.getItem("dealerData") || '{}');
      this.customerId = dealerData.customerId;
      this.getFastagCorporateByCorpId(this.customerId)
    }
    if (this.acceesGroup == '2') {
      this.transporterCorpId = localStorage.getItem('transporterCorpId');
      var transporterData = JSON.parse(localStorage.getItem("transporterData") || '{}');
      this.customerId = transporterData.customerId;
      this.getFastagCorporateByCorpId(this.customerId)
    }
    this.getVehicleList()
    this.cd.detectChanges()
  }

  getVehicleList() {
    this.spinner.show()
    let data = {
      entityId: this.entityIdForCorp
    }

    this.post.getFTVehicleListPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.vehicleList = res.data;
        this.spinner.hide()
        this.cd.detectChanges()
      } else {
        this.vehicleList = [];
        this.spinner.hide()
        this.cd.detectChanges()
      }
    })
  }

  getVehicleWiseFT() {
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      if (this.filterForm.value.businessId) {
        this.spinner.show()
        let data = {
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          entityId: this.entityIdForCorp,
          businessId: this.filterForm.value.businessId
        }

        this.post.getVehicleWiseFtTransactionsPOST(data).subscribe(res => {
          if (res.status == "OK") {
            this.FTData = res.data;
            this.fastagTransaction = res.data;
            this.FTDetails = res.data1;
            this.fastagTransactionDetails = res.data1;
            this.totalFT = res.data2;
            this.isTable = false
            this.spinner.hide()
            this.cd.detectChanges()
          } else {
            this.FTData = [];
            this.FTDetails = [];
            this.totalFT = [];
            this.spinner.hide()
            this.cd.detectChanges()
          }
        })
      } else {
        this.spinner.show()
        let data = {
          startDate: moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          entityId: this.entityIdForCorp
        }
        console.log(this.filterForm.value.businessId)

        this.post.getVehicleWiseFtTransactionsPOST(data).subscribe(res => {
          if (res.status == "OK") {
            this.FTData = res.data;
            this.fastagTransaction = res.data;
            this.FTDetails = res.data1;
            this.fastagTransactionDetails = res.data1;
            this.totalFT = res.data2;
            this.isTable = true
            if (res.data3.length) {
              this.openningBalance = Number(res.data3[0].fastagTransactionBalance).toFixed(2)
            } else {
              this.openningBalance = 0
            }
            this.totalDebit = Number(res.data2[0].totalAmount).toFixed(2)
            this.totalCredit = Number(res.data4[0].totalAmount).toFixed(2)
            this.closingBalance = Number(Number(this.openningBalance) + Number(this.totalCredit) - Number(this.totalDebit)).toFixed(2)
            // console.log("openning", this.openningBalance, this.totalDebit, this.totalCredit, this.closingBalance)
            this.spinner.hide()
            this.cd.detectChanges()
          } else {
            this.FTData = [];
            this.FTDetails = [];
            this.totalFT = [];
            this.spinner.hide()
            this.cd.detectChanges()
          }
        })
      }
    }
  }

  getFastagCorporateByCorpId(dealerCorporateId: any) {
    const data = {
      corporateId: dealerCorporateId,
    };
    this.post.getFastagCorporateByCorpIdPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        if (res.data.length) {
          this.FT = true
          // this.LQFT = true  
          this.entityIdForCorp = res.data[0].entityId
          // this.entityIdForCorpLQ = res.data1[0].entityId
          this.thrLimit = res.data[0].thrLimit
          this.getVehicleList();
          this.getVehicleListLQ()
          this.getVehicleWiseFT()
          this.getVehicleTransactionData(this.entityIdForCorp)
          if (res.data1.length) {
            this.bothFT = true
            this.LQFT = true
            this.entityIdForCorpLQ = res.data1[0].entityId
            this.getVehicleList();
            this.getVehicleListLQ()
            this.getVehicleWiseFT()
            this.getVehicleWiseFTLQ()
            this.getVehicleTransactionLQ(this.entityIdForCorpLQ)
          }
        } else {
          if (res.data1.length) {
            this.LQFT = true
            this.LQ = true
            this.entityIdForCorpLQ = res.data1[0].entityId
            this.getVehicleList();
            this.getVehicleListLQ()
            this.getVehicleWiseFTLQ()
            this.getVehicleTransactionLQ(this.entityIdForCorpLQ)
          }
        }
      } else {
        this.LQFT = false;
        this.FT = false;
      }
    });
  }

  goToPDF() {
    this.post.setRoutingWithVehicle(this.FTData, this.FTDetails, this.totalFT, this.openningBalance, this.totalDebit, this.totalCredit, this.closingBalance, this.isTable, moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"), moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"), "FT")
    this.router.navigate(['/pump/vehicleSummaryReport']);
  }

  getVehicleListLQ() {
    this.spinner.show()
    let data = {
      entityId: this.entityIdForCorpLQ
    }

    this.post.getFTVehicleListLQPOST(data).subscribe(res => {
      if (res.status == "OK") {
        this.vehicleLQList = res.data;
        this.spinner.hide()
        this.cd.detectChanges()
      } else {
        this.vehicleLQList = [];
        this.spinner.hide()
        this.cd.detectChanges()
      }
    })
  }

  getVehicleTransactionData(id: any) {
    const data = {
      fastagTransactionEntityId: id,
      startDate: moment(this.filterForm.value.startDate).format('YYYY-MM-DD') + ' 00:00:01',
      endDate: moment(this.filterForm.value.endDate).format('YYYY-MM-DD') + ' 23:59:59',
    };
    this.post.getRechargeFastagByDatePOST(data).subscribe((res) => {
      if (res.status == 'OK') {

        this.fastagData = res.data
        this.fastagLength = res.data

      } else {
      }
    });
  }

  getVehicleWiseFTLQ() {
    if (this.filterFormLQ.value.startDate && this.filterFormLQ.value.endDate) {
      if (this.filterFormLQ.value.businessId) {
        this.spinner.show()
        let data = {
          startDate: moment(this.filterFormLQ.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterFormLQ.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          entityId: this.entityIdForCorpLQ,
          businessId: this.filterFormLQ.value.businessId

        }

        this.post.getVehicleWiseFtTransactionsLQPOST(data).subscribe(res => {
          if (res.status == "OK") {
            this.FTLQData = res.data;
            this.FTLQTransaction = res.data;
            this.FTLQDetails = res.data1;
            this.FTLQTransactionDetails = res.data1;
            this.totalFTLQ = res.data2;
            this.isTable = false
            this.spinner.hide()
            this.cd.detectChanges()
          } else {
            this.FTLQData = [];
            this.FTLQDetails = [];
            this.totalFTLQ = [];
            this.spinner.hide()
            this.cd.detectChanges()
          }
        })
      } else {
        this.spinner.show()
        let data = {
          startDate: moment(this.filterFormLQ.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          endDate: moment(this.filterFormLQ.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"),
          entityId: this.entityIdForCorpLQ
        }

        this.post.getVehicleWiseFtTransactionsLQPOST(data).subscribe(res => {
          if (res.status == "OK") {
            this.FTLQData = res.data;
            this.FTLQTransaction = res.data;
            this.FTLQDetails = res.data1;
            this.FTLQTransactionDetails = res.data1;
            this.totalFTLQ = res.data2;
            this.isTable = true
            if (res.data3.length) {
              this.openningBalanceLq = Number(res.data3[0].fastagTransactionBalance).toFixed(2)
            } else {
              this.openningBalanceLq = 0
            }
            this.totalDebitLq = Number(res.data2[0].totalAmount).toFixed(2)
            this.totalCreditLq = Number(res.data4[0].totalAmount).toFixed(2)
            this.closingBalanceLq = Number(Number(this.openningBalanceLq) + Number(this.totalCreditLq) - Number(this.totalDebitLq)).toFixed(2)
            // console.log("openning", this.isTable,this.openningBalanceLq, this.totalDebitLq, this.totalCreditLq, this.closingBalanceLq)
            this.spinner.hide()
            this.cd.detectChanges()
          } else {
            this.FTLQData = [];
            this.FTLQDetails = [];
            this.totalFTLQ = [];
            this.spinner.hide()
            this.cd.detectChanges()
          }
        })
      }
    }
  }

  getVehicleTransactionLQ(id: any) {
    const data = {
      fastagTransactionEntityId: id,
      startDate: moment(this.filterFormLQ.value.startDate).format('YYYY-MM-DD') + ' 00:00:01',
      endDate: moment(this.filterFormLQ.value.endDate).format('YYYY-MM-DD') + ' 23:59:59',
    };
    this.post.getRechargeFastagByDateLQPOST(data).subscribe((res) => {
      if (res.status == 'OK') {

        this.fastagLQData = res.data
        this.fastagLQLength = res.data

      } else {
      }
    });
  }

  submitRechargeData() {
    const data = {
      fastagTransactionEntityId: this.entityIdForCorp,
      startDate: moment(this.filterForm.value.startDate).format('YYYY-MM-DD') + ' 00:00:01',
      endDate: moment(this.filterForm.value.endDate).format('YYYY-MM-DD') + ' 23:59:59',
    };
    this.post.getRechargeFastagByDatePOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.fastagData = res.data
        this.fastagLength = res.data
      } else {
      }
    });
  }

  goToPDFLQ() {
    this.post.setRoutingWithVehicle(this.FTLQData, this.FTLQDetails, this.totalFTLQ, this.openningBalanceLq, this.totalDebitLq, this.totalCreditLq, this.closingBalanceLq, this.isTable, moment(this.filterFormLQ.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"), moment(this.filterFormLQ.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"), "FT")
    this.router.navigate(['/pump/vehicleSummaryReport']);
  }

  pageChangeEvent(event: number) {
    this.p = event;
    // this.getLubePurchase(this.fuelDealerId)
  }

  submitRechargeLQ() {
    const data = {
      fastagTransactionEntityId: this.entityIdForCorpLQ,
      startDate: moment(this.filterFormLQ.value.startDate).format('YYYY-MM-DD') + ' 00:00:01',
      endDate: moment(this.filterFormLQ.value.endDate).format('YYYY-MM-DD') + ' 23:59:59',
    };
    this.post.getRechargeFastagByDateLQPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.fastagLQData = res.data
        this.fastagLQLength = res.data
      } else {
      }
    });
  }
}

