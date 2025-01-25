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
  selector: 'app-pump-tables-widget4',
  templateUrl: './pump-tables-widget4.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class PumpTablesWidget4Component implements OnInit {

  filterForm = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

  filterFormLQ = new FormGroup({
    startDate: new FormControl(),
    endDate: new FormControl(),
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
  FT: boolean;
  fastagId: any;
  thrLimit: any;
  bothFT: boolean;
  fastagLQId: any;
  thrLimitLQ: any;
  LQFT: boolean;
  corpWalletLQId: any;
  corpWalletAccNo: any;
  corpWalletIFSC: any;
  corpWalletUPI: any;
  yesbankltd: any = '@yesbankltd'
  entityIdForCorp: any;
  entityIdForCorpLQ: any;
  LQ: boolean = false;
  fastagTransaction: any = [];
  fastagTransactionData: any = [];
  fastagTransactionDataLength: any = [];
  stausToll: boolean;
  fastagTransactionDataLQ: any = [];
  fastagTransactionLQ: any = [];
  fastagTransactionDataLengthLQ: any = [];
  fastagDataArray: any = [];
  fastagData: any = [];
  fastag: any;
  fastagLength: any;
  searchTerm1: any;
  searchBox1: FormControl = new FormControl();
  searchBox: FormControl = new FormControl();
  searchTerm: any;
  exceldata: any = [];
  searchBoxRange: FormControl = new FormControl();
  searchTermRange: any;
  searchTermRange1: any;
  searchBoxRange1: FormControl = new FormControl();
  exceldata1: any = [];
  avlBalanceLQ: any;
  searchBoxRangeLQ: FormControl = new FormControl();
  searchTermRangeLQ: any = "";
  searchBoxRange1LQ: FormControl = new FormControl();
  searchTermRange1LQ: any = "";
  exceldata1LQ: any = [];
  transporterCorpId: string | null;
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
    this.searchBox1.valueChanges
      .subscribe((term: any) => {
        this.searchTerm1 = term;
        this.search1();
      })


    this.searchBox.valueChanges
      .subscribe((term) => {
        this.searchTerm = term;
        this.search();
      })

    this.searchBoxRange.valueChanges
      .subscribe((term) => {
        this.searchTermRange = term;
        this.search2();
      })

    this.searchBoxRange1.valueChanges
      .subscribe((term) => {
        this.searchTermRange1 = term;
        this.search3();
      })

    this.searchBoxRangeLQ.valueChanges
      .subscribe((term) => {
        this.searchTermRangeLQ = term;
        this.search2LQ();
      })

    this.searchBoxRange1LQ.valueChanges
      .subscribe((term) => {
        this.searchTermRange1LQ = term;
        this.search3LQ();
      })

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
    let currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    let previousDate = moment(new Date()).format("YYYY-MM-01 00:00:01");
    this.filterForm.controls["startDate"].setValue(previousDate);
    this.filterForm.controls["endDate"].setValue(currentDate);
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
          this.getTransactionDetailsByveelsId()
          this.getCorpWalletBalance(this.entityIdForCorp)
          if (res.data1.length) {
            this.bothFT = true
            this.LQFT = true;
            this.entityIdForCorpLQ = res.data1[0].entityId
            this.thrLimitLQ = res.data1[0].thrLimit
            // this.filterLQ();
            this.getFTLQTransactionDetails()
            this.getBalanceByEntityIdLQ(this.entityIdForCorpLQ)
          }
        } else {
          if (res.data1.length) {
            this.LQFT = true;
            this.LQ = true
            this.entityIdForCorpLQ = res.data1[0].entityId
            this.thrLimitLQ = res.data1[0].thrLimit
            // this.filterLQ();
            this.getFTLQTransactionDetails()
            this.getBalanceByEntityIdLQ(this.entityIdForCorpLQ)
          }
        }
      } else {
        this.LQFT = false;
        this.FT = false;
      }
    });
  }


  getTransactionDetailsByveelsId() {

    this.spinner.show();
    let previousDate
    let currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    previousDate = moment(new Date()).format("YYYY-MM-01 00:00:01");

    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      let data = {
        fastagTransactionEntityId: this.entityIdForCorp,
        startDate: moment(this.filterForm.value.startDate).format("YYYY-MM-DD"),
        // endDate: moment(this.filterForm.value.endDate).add(1, 'days').format("YYYY-MM-DD")
        endDate: moment(this.filterForm.value.endDate).format("YYYY-MM-DD"),
        // pagenumber: "0"

      }
      this.post.getTransactionFastagByVeelsIdDatewisePOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.fastagTransactionData = res.data
            this.fastagTransaction = res.data
            this.fastagTransactionDataLength = res.data

            this.spinner.hide();
            this.cd.detectChanges()

          } else {
            this.fastagTransactionData = []
            this.fastagTransaction = []
            this.fastagTransactionDataLength = []
            alert("Data Not Found..!")
            this.spinner.hide();
            this.cd.detectChanges()
          }

        })

    } else {
      this.filterForm.controls["startDate"].setValue(previousDate);
      this.filterForm.controls["endDate"].setValue(currentDate);

      let data = {
        fastagTransactionEntityId: this.entityIdForCorp,
        startDate: this.filterForm.value.startDate,
        endDate: this.filterForm.value.endDate,
        // pagenumber: "0",
      }
      this.post.getTransactionFastagByVeelsIdDatewisePOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.fastagTransactionData = res.data
            this.fastagTransaction = res.data
            this.fastagTransactionDataLength = res.data

            this.stausToll = true
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            this.fastagTransactionData = []
            this.fastagTransaction = []
            this.fastagTransactionDataLength = []
            alert("Data Not Found..!")

            this.stausToll = true
            this.spinner.hide();
            this.cd.detectChanges()

          }

        })
    }

  }

  pageChangeEvent(event: number) {
    this.p = event;
    // this.getLubePurchase(this.fuelDealerId)
  }

  getFTLQTransactionDetails() {
    let previousDate
    let currentDate = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    previousDate = moment(new Date()).format('YYYY-MM-01 00:00:01');

    if (this.filterFormLQ.value.startDate && this.filterFormLQ.value.endDate) {
      this.spinner.show();
      let data = {
        fastagTransactionEntityId: this.entityIdForCorpLQ,
        startDate: moment(this.filterFormLQ.value.startDate).format("YYYY-MM-DD"),
        endDate: moment(this.filterFormLQ.value.endDate).format("YYYY-MM-DD")
      }
      this.post.getTransactionFastagByVeelsIdDatewiseLQPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.fastagTransactionDataLQ = res.data;
            this.fastagTransactionLQ = res.data
            this.fastagTransactionDataLengthLQ = res.data;
            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            this.fastagTransactionDataLQ = [];
            this.fastagTransactionLQ = []
            this.fastagTransactionDataLengthLQ = [];
            alert("Data Not Found..!")
            this.spinner.hide();
            this.cd.detectChanges()

          }
        })
    } else {
      this.spinner.show();
      this.filterFormLQ.controls["startDate"].setValue(previousDate);
      this.filterFormLQ.controls["endDate"].setValue(currentDate);

      let data = {
        fastagTransactionEntityId: this.entityIdForCorpLQ,
        startDate: this.filterForm.value.startDate,
        endDate: this.filterForm.value.endDate
      }
      this.post.getTransactionFastagByVeelsIdDatewiseLQPOST(data)
        .subscribe(res => {
          if (res.status == "OK" && res.data.length) {
            this.fastagTransactionDataLQ = res.data;
            this.fastagTransactionLQ = res.data
            this.fastagTransactionDataLengthLQ = res.data;

            this.spinner.hide();
            this.cd.detectChanges()
          } else {
            this.fastagTransactionDataLQ = [];
            this.fastagTransactionLQ = []
            this.fastagTransactionDataLengthLQ = [];
            alert("Data Not Found..!")

            this.spinner.hide();
            this.cd.detectChanges()

          }

        })
    }

  }

  getCorpWalletBalance(id: any) {
    const data = {
      entityId: id,     //VEELS00003       for Testing
    };
    this.post.getCorpWalletBalPOST(data).subscribe((res) => {
      if (res.status == 'OK') {

        this.avlBalance = res.data.result[0].balance

      } else {
      }
    });
  }

  getTransactionLQDetails(event: any, status: string) {
    if (status == "range") {
      this.stausToll = true;
      this.filterFormLQ.controls['startDate'].setValue('')
      this.filterFormLQ.controls['endDate'].setValue('')
      this.getFTLQTransactionDetails()

    } else {
      this.stausToll = false;
      this.filterLQ();
    }
  }

  filterLQ() {
    this.filterFormLQ.controls['startDate'].setValue(new Date())
    this.filterFormLQ.controls['endDate'].setValue(new Date())
    if (this.filterFormLQ.value.startDate && this.filterFormLQ.value.endDate) {
      let a = moment(this.filterFormLQ.value.startDate);
      let b = moment(this.filterFormLQ.value.endDate);
      let c = b.diff(a, 'days') // 1
      // console.log('Difference :',c);

      if (c <= 30) {
        this.fastagTransactionDataLQ.length = 0
        this.fastagTransactionDataLengthLQ.length = 0
        this.fastagDataArray.length = 0
        this.spinner.show();
        let data = {
          fastagTransactionEntityId: this.entityIdForCorpLQ,
          startDate: moment(this.filterFormLQ.value.startDate).format("YYYY-MM-DD"),
          endDate: moment(this.filterFormLQ.value.endDate).format("YYYY-MM-DD")
        }

        this.post.getFastagTransactionByCurrentDateLQPOST(data)
          .subscribe(res => {
            if (res.status == "OK" && res.data.length) {
              // console.log(res.data)
              this.fastagTransactionDataLQ = res.data
              this.fastagTransactionDataLengthLQ = res.data;
              this.fastagDataArray = res.data
              this.fastag = res.data
              this.fastagLength = res.data
              this.getFTLQTransactionDetails()
              alert(res.msg)
              this.spinner.hide();
              this.cd.detectChanges()
            } else {
              this.spinner.hide();
              alert("No Data Found..!");
              this.cd.detectChanges()
            }
          });
      } else {
        alert("Please select Date range less than 15 days..")
        this.filterFormLQ.controls['startDate'].setValue('')
        this.filterFormLQ.controls['endDate'].setValue('')
        this.spinner.hide();
        this.cd.detectChanges()
      }
    } else {
      alert("Please Select Date..")
    }
  }

  getBalanceByEntityIdLQ(fastagLQId: any) {
    let data = {
      entityId: fastagLQId
    }

    this.post.getCorpWalletBalLQPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.avlBalanceLQ = res.data.result[0].balance
          this.balanceLQ = res.data.result[0].balance
          this.getCorpDetailsByEntity(fastagLQId);
        } else {

        }
      })
  }

  getCorpDetailsByEntity(corpWalletEntityId: any) {
    this.spinner.show();
    let data = {
      entityId: corpWalletEntityId,
    }
    this.post.getCorpWalletDetailsByEntityPOST(data)
      .subscribe(res => {
        if (res.status == "OK" && res.data.length) {
          this.corpWalletLQId = res.data[0].corpWalletLQId;
          this.corpWalletAccNo = res.data[0].corpWalletAccNo;
          this.corpWalletIFSC = res.data[0].corpWalletIFSC;
          this.corpWalletUPI = res.data[0].corpWalletUPI;
          this.spinner.hide();
          this.cd.detectChanges()
        } else {
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  getTransactionDetails(event: any, status: string) {
    // console.log('event is ===>');
    // console.log(event);
    console.log(status);

    if (status == "range") {
      this.stausToll = true;
      this.filterForm.controls['startDate'].setValue('')
      this.filterForm.controls['endDate'].setValue('')
      this.getTransactionDetailsByveelsId();

    } else {
      this.stausToll = false;
      this.filter();

    }

  }

  filter() {
    this.filterForm.controls['startDate'].setValue(new Date())
    this.filterForm.controls['endDate'].setValue(new Date())
    if (this.filterForm.value.startDate && this.filterForm.value.endDate) {
      let a = moment(this.filterForm.value.startDate);
      let b = moment(this.filterForm.value.endDate);
      let c = b.diff(a, 'days') // 1
      // console.log('Difference :',c);

      if (c <= 30) {
        this.fastagData.length = 0
        this.fastagDataArray.length = 0
        this.spinner.show();
        let data = {
          entityId: this.entityIdForCorp,
          pagenumber: "0",
          fromDate: moment(this.filterForm.value.startDate).format("YYYY-MM-DD"),
          toDate: moment(this.filterForm.value.endDate).format("YYYY-MM-DD")
        }

        this.post.getCorpTrans(data)
          .subscribe(res => {
            if (res.status == "OK" && res.data.result !== null) {
              this.fastagData = res.data.result.sort((a: { transaction: { time: number; }; }, b: { transaction: { time: number; }; }) => (a.transaction.time > b.transaction.time ? -1 : 1))
              this.fastagDataArray = res.data.result
              this.fastag = res.data.result
              this.fastagLength = res.data.result
              alert(res.msg)
              this.spinner.hide();
              this.cd.detectChanges()
            } else {
              this.spinner.hide();
              alert("Data Not Found..!");
              this.cd.detectChanges()
            }
          });
      } else {
        alert("Please select Date range less than 15 days..")
        this.filterForm.controls['startDate'].setValue('')
        this.filterForm.controls['endDate'].setValue('')
        this.spinner.hide();
        this.cd.detectChanges()
      }
    } else {
      alert("Please Select Date..")
    }
  }


  goToPDF(status: string) {
    if (status == "current") {
      this.post.setRoutingWithDate('current', this.fastagData, moment(this.filterForm.value.startDate).format("YYYY-MM-DD"), moment(this.filterForm.value.endDate).format("YYYY-MM-DD"), "FT")
      this.router.navigate(['/transporter/fastagRechargeTransactions']);
    } else {
      this.post.setRoutingWithDate('range', this.fastagTransactionData, moment(this.filterForm.value.startDate).format("YYYY-MM-DD"), moment(this.filterForm.value.endDate).format("YYYY-MM-DD"), "FT")
      this.router.navigate(['/transporter/fastagRechargeTransactions']);
    }
  }

  search() {
    let term = this.searchTerm;
    this.fastagData = this.fastag.filter(function (res: { transaction: { businessId: string | any[]; }; }) {
      return res.transaction.businessId.indexOf(term) >= 0;
    });
  }

  search1() {
    let term = this.searchTerm1;
    this.fastagData = this.fastag.filter(function (res: { transaction: { type: string | any[]; }; }) {
      return res.transaction.type.indexOf(term) >= 0;
    });
  }

  search2() {
    let term = this.searchTermRange;
    this.fastagTransactionData = this.fastagTransaction.filter(function (res: { fastagType: string | any[]; }) {
      return res.fastagType.indexOf(term) >= 0;
    });
  }

  search3() {
    let term = this.searchTermRange1;
    this.fastagTransactionData = this.fastagTransaction.filter(function (res: { fastagTransactionBusinessId: string | any[]; }) {
      return res.fastagTransactionBusinessId.indexOf(term) >= 0;
    });
  }

  exportAsXLSX(): void {
    this.exceldata.length = 0
    this.fastagData.map((result: { transaction: { time: moment.MomentInput; businessId: any; kitNo: any; txRef: any; type: any; otherPartyName: any; amount: any; balance: any; }; }) => {
      var json = {
        TransactionDate: moment(result.transaction.time).format("DD MMM YYYY"),
        TransactionTime: moment(result.transaction.time).format("HH:mm:ss"),
        VehicleNo: result.transaction.businessId,
        TagID: result.transaction.kitNo,
        TxnRef: result.transaction.txRef,
        // TransactionType: result.transaction.transactionType,
        DEBIT_CREDIT: result.transaction.type,
        Description: result.transaction.otherPartyName,
        TransactionAmount: Number(result.transaction.amount),
        Balance: Number(result.transaction.balance)

      }
      this.exceldata.push(json)
    })


    this.excelService.exportAsExcelFile(this.exceldata, 'TransactionReport');
  }

  exportAsXLSX1(): void {
    this.exceldata1.length = 0
    this.fastagTransactionData.map((result: { fastagTransactionTime: any; fastagTransactionBusinessId: any; fastagTransactionKitNo: any; fastagtxRef: any; fastagType: any; fastagOtherPartyName: any; fastagTransactionAmount: any; fastagTransactionBalance: any; }) => {
      var json = {
        TransactionDate: moment(Number(result.fastagTransactionTime)).format("DD MMM YYYY"),
        TransactionTime: moment(Number(result.fastagTransactionTime)).format("HH:mm:ss"),
        VehicleNo: result.fastagTransactionBusinessId,
        TagID: result.fastagTransactionKitNo,
        //TransactionType: result.fastagTransactionType,
        TxnRef: result.fastagtxRef,
        DEBIT_CREDIT: result.fastagType,
        Description: result.fastagOtherPartyName,
        TransactionAmount: Number(result.fastagTransactionAmount),
        Balance: Number(result.fastagTransactionBalance)

      }
      this.exceldata1.push(json)
    })


    this.excelService.exportAsExcelFile(this.exceldata1, 'TransactionReport');
  }

  goToPDFLQ(status: string) {
    if (status == "current") {
      this.post.setRoutingWithDate('current', this.fastagTransactionDataLQ, moment(this.filterFormLQ.value.startDate).format("YYYY-MM-DD"), moment(this.filterFormLQ.value.endDate).format("YYYY-MM-DD"), "LQ")
      this.router.navigate(['/transporter/fastagRechargeTransactions']);
    } else {
      this.post.setRoutingWithDate('range', this.fastagTransactionDataLQ, moment(this.filterFormLQ.value.startDate).format("YYYY-MM-DD"), moment(this.filterFormLQ.value.endDate).format("YYYY-MM-DD"), "LQ")
      this.router.navigate(['/transporter/fastagRechargeTransactions']);
    }
  }

  search2LQ() {
    let term = this.searchTermRangeLQ;
    this.fastagTransactionDataLQ = this.fastagTransactionLQ.filter(function (res: { fastagType: string | any[]; }) {
      return res.fastagType.indexOf(term) >= 0;
    });
  }

  search3LQ() {
    let term = this.searchTermRange1LQ;
    this.fastagTransactionDataLQ = this.fastagTransactionLQ.filter(function (res: { fastagTransactionBusinessId: string | any[]; }) {
      return res.fastagTransactionBusinessId.indexOf(term) >= 0;
    });
  }


  exportAsXLSX1LQ(): void {
    this.exceldata1LQ.length = 0
    this.fastagTransactionDataLQ.map((result: { manualDate: moment.MomentInput; fastagTransactionBusinessId: any; fastagTransactionKitNo: any; fastagtxRef: any; fastagType: any; fastagBeneficiaryName: any; fastagTransactionAmount: any; fastagTransactionBalance: any; }) => {
      var json = {
        TransactionDate: moment((result.manualDate)).format("DD MMM YYYY"),
        TransactionTime: moment((result.manualDate)).format("HH:mm:ss"),
        VehicleNo: result.fastagTransactionBusinessId,
        TagID: result.fastagTransactionKitNo,
        TxnRef: result.fastagtxRef,
        DEBIT_CREDIT: result.fastagType,
        Description: result.fastagBeneficiaryName,
        TransactionAmount: Number(result.fastagTransactionAmount),
        Balance: Number(result.fastagTransactionBalance)

      }
      this.exceldata1LQ.push(json)
    })
    this.excelService.exportAsExcelFile(this.exceldata1LQ, 'FTLQTransactionReport');


  }
}

