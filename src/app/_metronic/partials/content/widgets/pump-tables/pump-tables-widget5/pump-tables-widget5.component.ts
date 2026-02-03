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
  selector: 'app-pump-tables-widget5',
  templateUrl: './pump-tables-widget5.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class PumpTablesWidget5Component implements OnInit {

  filterForm = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
  });

  filterFormLQ = new FormGroup({
    startDate: new FormControl(""),
    endDate: new FormControl(""),
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
  avlBalance: any;
  balanceLQ: any;
  FT: boolean = false;
  fastagId: any;
  thrLimit: any;
  bothFT: boolean = false;
  fastagLQId: any;
  thrLimitLQ: any;
  LQFT: boolean = false;
  corpWalletLQId: any;
  corpWalletAccNo: any;
  corpWalletIFSC: any;
  corpWalletUPI: any;
  active = 1;
  LQ: boolean = false;
  entityIdForCorp: any = [];
  entityIdForCorpLQ: any = [];
  PreviousShow: any;
  CurrentShow: any;
  fastagMonthWiseData: any = [];
  fastagMonthWiseDataCurrentData: any = [];
  fastagMonthWiseDatavehicleData: any = [];
  combineVehicleData: any = [];
  fastagData: any = [];
  fastagLength: any = [];
  dropVehicleNumber: any;
  vehicleList: any = [];
  fastagMonthWiseLQData: any = [];
  fastagMonthWiseDataCurrentLQData: any = [];
  fastagMonthWiseDatavehicleLQData: any = [];
  combineVehicleLQData: any = [];
  fastagLQData: any = [];
  fastagLQLength: any = [];
  transporterCorpId: string | null;
  vehicleLQList: any;
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
    this.fuelDealerId = JSON.parse(localStorage.getItem("dealerId") || '{}');
    this.dealerCorporateId = JSON.parse(localStorage.getItem("dealerCorporateId") || '{}');
    this.userId = element.userId;
    this.acceesGroup = element.accessGroupId;
    this.dealerMobile = element.phone1;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerVPPersonId = element.veelsPlusId
    this.managerPersonId = element.personId
    this.userName = element.firstName + ' ' + element.lastName;
    this.acceesGroup = element.accessGroupId;
    if(this.acceesGroup == '12'){
      var dealerData = JSON.parse(localStorage.getItem("dealerData") || '{}');
      this.customerId = dealerData.customerId;
      this.getFastagCorporateByCorpId(this.customerId)
    } 
    if(this.acceesGroup == '2'){
      this.transporterCorpId = localStorage.getItem('transporterCorpId');
      var transporterData = JSON.parse(localStorage.getItem("transporterData") || '{}');
      this.customerId = transporterData.customerId;
      this.getFastagCorporateByCorpId(this.customerId)
    }
    this.cd.detectChanges()
  }

  changeActiveTabNo() {
    this.active = 1
  }

  getFastagCorporateByCorpId(id: any) {
    const data = {
      corporateId: id,
    };
    this.post.getFastagCorporateByCorpIdPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        if (res.data.length) {
          this.FT = true;
          this.entityIdForCorp = res.data[0].entityId
          this.thrLimit = res.data[0].thrLimit
          // this.filter()
        this.getVehicleTransactionData(this.entityIdForCorp)
        this.getVehiclAllData(this.entityIdForCorp)
          if (res.data1.length) {
            this.bothFT = true
            this.LQFT = true;
            this.entityIdForCorpLQ = res.data1[0].entityId
            this.thrLimitLQ = res.data1[0].thrLimit
            this.getVehicleTransactionLQData(this.entityIdForCorpLQ)
            this.getVehicleLQAllData(this.entityIdForCorpLQ)
            this.cd.detectChanges()
          }
        } else {
          if (res.data1.length) {
            this.LQFT = true;
            this.LQ = true
            this.entityIdForCorpLQ = res.data1[0].entityId
            this.thrLimitLQ = res.data1[0].thrLimit
            this.getVehicleTransactionLQData(this.entityIdForCorpLQ)
            this.getVehicleLQAllData(this.entityIdForCorpLQ)
            this.cd.detectChanges()
          }
        }
      } else {
        this.LQFT = false;
        this.FT = false;
      }
    });
  }

  pageChangeEvent(event: number) {
    this.p = event;
    // this.getLubePurchase(this.fuelDealerId)
  }

  getVehicleTransactionData(id: any) {
    this.PreviousShow = moment(new Date()).subtract(1, 'months').format('MMM YY');
    this.CurrentShow = moment(new Date()).format('MMM YY');
    const data = {
      fastagTransactionEntityId: id,
    };
    this.post.getFastagVehicleMonthWisePOST(data).subscribe((res) => {
      if (res.status == 'OK') {

        this.fastagMonthWiseData = res.previousData
        this.fastagMonthWiseDataCurrentData = res.currentData
        this.fastagMonthWiseDatavehicleData = res.vehicleData

        this.getCombine();
        this.cd.detectChanges()

      } else {
      }
    });
  }

  getCombine() {
    this.combineVehicleData = []

    this.fastagMonthWiseDatavehicleData.map((data: { fastagTransactionBusinessId: string; }) => {
      let previousJson = {
        fastagTransactionBusinessId: "",
        transactionAmountPrevious: 0,
        transactionAmountCurrent: 0

      }
      previousJson.fastagTransactionBusinessId = data.fastagTransactionBusinessId
      this.fastagMonthWiseData.map((res: { fastagTransactionBusinessId: string; transactionAmountPrevious: number; }) => {
        if (data.fastagTransactionBusinessId == res.fastagTransactionBusinessId) {
          previousJson.transactionAmountPrevious = res.transactionAmountPrevious

        }
      })

      this.fastagMonthWiseDataCurrentData.map((res1: { fastagTransactionBusinessId: string; transactionAmountCurrent: number; }) => {
        if (data.fastagTransactionBusinessId == res1.fastagTransactionBusinessId) {
          previousJson.transactionAmountCurrent = res1.transactionAmountCurrent
        }

      })
      this.combineVehicleData.push(previousJson)
      //  console.log("2323211111===>",this.combineVehicleData);
        this.cd.detectChanges()

    })

  }

  changeTab(vehicleNumber: any) {
    // this.tabset.select('vehicleDetails');
    this.active = 2

    let data = {
      fastagTransactionEntityId: this.entityIdForCorp,
      vehicleNumber: vehicleNumber
    }

    this.post.geTransactionFastagByVehicleNumberPOST(data)
      .subscribe(res => {
        this.fastagData = res.data
        this.fastagLength = res.data
        this.cd.detectChanges()
      })

  }

  getVehiclAllData(id: any) {
    const data = {
      fastagTransactionEntityId: id,
    };
    this.post.getAllVehicleNumberPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.vehicleList = res.data
        this.cd.detectChanges()
      } else {
        this.cd.detectChanges()
      }
    });
  }

  submitVehicleTransactionData() {
    const data = {
      fastagTransactionEntityId: this.entityIdForCorp,
      vehicleNumber: this.dropVehicleNumber,
      startDate: moment(this.filterForm.value.startDate).format('YYYY-MM-DD') + ' 00:00:01',
      endDate: moment(this.filterForm.value.endDate).format('YYYY-MM-DD') + ' 23:59:59',
    };
    this.post.getTransactionFastagByVehicleNumberDatewisePOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.fastagData = res.data
        this.fastagLength = res.data
        this.cd.detectChanges()
      } else {
        this.cd.detectChanges()
      }
    });
  }

  goToPDF() {
    this.post.setRoutingActiveVehicleList(this.fastagData, moment(this.filterForm.value.startDate).format("YYYY-MM-DD"), moment(this.filterForm.value.endDate).format("YYYY-MM-DD"))
    this.router.navigate(['/pump/activeVehiclePdf']);
  }

  changeActiveTabNoLQ() {
    this.active = 1
  }

  getVehicleTransactionLQData(id: any) {
    this.PreviousShow = moment(new Date()).subtract(1, 'months').format('MMM YY');
    this.CurrentShow = moment(new Date()).format('MMM YY');
    const data = {
      fastagTransactionEntityId: id,
    };
    this.post.getFastagVehicleMonthWiseLQPOST(data).subscribe((res) => {
      if (res.status == 'OK' && res.vehicleData.length) {
        this.fastagMonthWiseLQData = res.previousData
        this.fastagMonthWiseDataCurrentLQData = res.currentData
        this.fastagMonthWiseDatavehicleLQData = res.vehicleData

        this.getCombineLQ();
        this.cd.detectChanges()

      } else {
        this.cd.detectChanges()
      }
    });
  }


  getCombineLQ() {
    this.combineVehicleLQData = []

    this.fastagMonthWiseDatavehicleLQData.map((data: { fastagTransactionBusinessId: string; }) => {
      let previousJson = {
        fastagTransactionBusinessId: "",
        transactionAmountPrevious: 0,
        transactionAmountCurrent: 0

      }
      previousJson.fastagTransactionBusinessId = data.fastagTransactionBusinessId
      this.fastagMonthWiseLQData.map((res: { fastagTransactionBusinessId: string; transactionAmountPrevious: number; }) => {
        if (data.fastagTransactionBusinessId == res.fastagTransactionBusinessId) {
          previousJson.transactionAmountPrevious = res.transactionAmountPrevious

        }
      })

      this.fastagMonthWiseDataCurrentLQData.map((res1: { fastagTransactionBusinessId: string; transactionAmountCurrent: number; }) => {
        if (data.fastagTransactionBusinessId == res1.fastagTransactionBusinessId) {
          previousJson.transactionAmountCurrent = res1.transactionAmountCurrent
        }

      })
      this.combineVehicleLQData.push(previousJson)
      this.cd.detectChanges()

    })

  }

  changeTabLQ(vehicleNumber: any) {
    // this.tabset.select('vehicleDetails');
    this.active = 2

    let data = {
      fastagTransactionEntityId: this.entityIdForCorpLQ,
      vehicleNumber: vehicleNumber
    }
    console.log(data)

    this.post.geTransactionFastagByVehicleNumberLQPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fastagLQData = res.data
          this.fastagLQLength = res.data
          this.cd.detectChanges()
        } else {
          this.fastagLQData = []
          this.fastagLQLength = []
          this.cd.detectChanges()

        }
      })

  }

  submitVehicleTransactionLQData() {
    const data = {
      fastagTransactionEntityId: this.entityIdForCorpLQ,
      vehicleNumber: this.dropVehicleNumber,
      startDate: moment(this.filterFormLQ.value.startDate, "DD-MM-YYYY").format('YYYY-MM-DD') + ' 00:00:01',
      endDate: moment(this.filterFormLQ.value.endDate, "DD-MM-YYYY").format('YYYY-MM-DD') + ' 23:59:59',
    };
    this.post.getTransactionFastagByVehicleNumberDatewiseLQPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.fastagLQData = res.data
        this.fastagLQLength = res.data
        this.cd.detectChanges()
      } else {
        this.cd.detectChanges()
      }
    });
  }

  goToPDFLQ() {
    this.post.setRoutingActiveVehicleLQList(this.fastagLQData, moment(this.filterFormLQ.value.startDate).format("YYYY-MM-DD"), moment(this.filterFormLQ.value.endDate).format("YYYY-MM-DD"))
    this.router.navigate(['/pump/activeVehicleLQPdf']);
  }
      
  getVehicleLQAllData(id: any) {
    const data = {
      fastagTransactionEntityId: id,  
    };
    this.post.getAllVehicleNumberLQPOST(data).subscribe((res) => {
    if (res.status == 'OK') {
      this.vehicleLQList = res.data
      this.cd.detectChanges()
    } else {
      this.cd.detectChanges()
    }
    });
    }
}

