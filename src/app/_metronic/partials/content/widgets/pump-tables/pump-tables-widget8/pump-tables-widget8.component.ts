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
  selector: 'app-pump-tables-widget8',
  templateUrl: './pump-tables-widget8.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class PumpTablesWidget8Component implements OnInit {

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
  FT: boolean;
  fastagId: any;
  thrLimit: any;
  bothFT: boolean;
  fastagLQId: any;
  thrLimitLQ: any;
  companyName: any;
  hostPhone: any;
  entityIdForCorp: any;
  entityIdForCorpLQ: any;
  LQFT: boolean = false;
  LQ: boolean = false;
  active = 1;
  PreviousShow: string;
  CurrentShow: string;
  fastagMonthWiseData: any = [];
  fastagMonthWiseDataCurrentData: any = [];
  fastagMonthWiseDatavehicleData: any = [];
  combineVehicleData: any = [];
  fastagData: any = [];
  fastagLength: any = [];
  locationFromLat: any = [];
  dropTollName: any;
  PreviousShow1: string;
  CurrentShow1: string;
  fastagMonthWiseLQData: any = [];
  fastagMonthWiseDataCurrentLQData: any = [];
  fastagMonthWiseDatavehicleLQData: any = [];
  combineVehicleLQData: any = [];
  fastagLQData: any = [];
  fastagLQLength: any = [];
  dropTollNameLQ: any;
  transporterCorpId: string | null;
  tollPaymentMonthWiseLQDetails: any;
  resultLQArray: { beneficiaryName: string; totalAmount: any; }[];
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

  getTollTransactionData(id: any) {
    this.PreviousShow = moment(new Date()).subtract(1, 'months').format('MMM YY');
    this.CurrentShow = moment(new Date()).format('MMM YY');
    const data = {
      fastagTransactionEntityId: id,
    };
    this.post.getFastagTollMonthWisePOST(data).subscribe((res) => {
      if (res.status == 'OK') {

        this.fastagMonthWiseData = res.previousData
        this.fastagMonthWiseDataCurrentData = res.currentData
        this.fastagMonthWiseDatavehicleData = res.tollData

        this.getCombine();

      } else {
      }
    });
  }

  getCombine() {
    this.combineVehicleData = []

    this.fastagMonthWiseDatavehicleData.map((data: { fastagBeneficiaryName: string; fastagBeneficiaryId: string; }) => {
      let previousJson = {
        fastagBeneficiaryName: "",
        transactionAmountPrevious: 0,
        transactionAmountCurrent: 0,
        fastagBeneficiaryId: '',
        location: ''

      }
      previousJson.fastagBeneficiaryName = data.fastagBeneficiaryName
      previousJson.fastagBeneficiaryId = data.fastagBeneficiaryId

      this.fastagMonthWiseData.map((res: { fastagBeneficiaryName: string; transactionAmountPrevious: number; }) => {
        if (data.fastagBeneficiaryName == res.fastagBeneficiaryName) {
          previousJson.transactionAmountPrevious = res.transactionAmountPrevious

        }
      })

      this.fastagMonthWiseDataCurrentData.map((res1: { fastagBeneficiaryName: string; transactionAmountCurrent: number; }) => {
        if (data.fastagBeneficiaryName == res1.fastagBeneficiaryName) {
          previousJson.transactionAmountCurrent = res1.transactionAmountCurrent
        }

      })

      this.combineVehicleData.push(previousJson)
      // console.log("2323211111===>",this.combineVehicleData);

    })
  }

  //getFastagCorporateByCorpId
  getFastagCorporateByCorpId(dealerCorporateId: any) {
    const data = {
      corporateId: dealerCorporateId,
    };
    this.post.getFastagCorporateByCorpIdPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        if (res.data.length) {
          this.FT = true;
          this.entityIdForCorp = res.data[0].entityId
          this.thrLimit = res.data[0].thrLimit
          this.getTollTransactionData(this.entityIdForCorp)
          if (res.data1.length) {
            this.bothFT = true
            this.LQFT = true;
            this.entityIdForCorpLQ = res.data1[0].entityId
            this.thrLimitLQ = res.data1[0].thrLimit
            this.getFastagTollPaymentMonthWiseLQ(this.entityIdForCorpLQ)
          }
        } else {
          if (res.data1.length) {
            this.LQFT = true;
            this.LQ = true
            this.entityIdForCorpLQ = res.data1[0].entityId
            this.getFastagTollPaymentMonthWiseLQ(this.entityIdForCorpLQ)
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

  changeTab(tollName: any, fastagBeneficiaryId: any) {
    // this.tabset.select('tollDetails');
    this.active = 2

    console.log(this.active)
    let data = {
      fastagTransactionEntityId: this.entityIdForCorp,
      tollName: tollName
    }

    this.post.geTransactionFastagByTollNamePOST(data)
      .subscribe(res => {

        this.callLoc(fastagBeneficiaryId)
        //  this.getLocation()
        this.fastagData = res.data
        this.fastagLength = res.data
      })
  }

  callLoc(fastagBeneficiaryId: string) {
    var res = fastagBeneficiaryId.split(",");
    let lat = res[0];
    let lngReview = res[1].split("|");
    let lng = lngReview[0]
    let latlng = {
      lat: Number(lat),
      lng: Number(lng)
    };
    this.post.getLocationByLatlngPOST(latlng).subscribe((res) => {
      if (latlng) {
        this.locationFromLat = res.data
      } else {

      }
    })


  }

  submitTollTransactionData() {
    if (this.dropTollName && this.filterForm.value.startDate && this.filterForm.value.endDate) {
      const data = {
        fastagTransactionEntityId: this.entityIdForCorp,
        tollName: this.dropTollName,
        startDate: moment(this.filterForm.value.startDate).format('YYYY-MM-DD') + ' 00:00:01',
        endDate: moment(this.filterForm.value.endDate).format('YYYY-MM-DD') + ' 23:59:59',
      };
      this.post.getTransactionFastagByTollNameDatewisePOST(data).subscribe((res) => {
        if (res.status == 'OK') {
          this.fastagData = res.data
          this.fastagLength = res.data
          this.callLoc(res.data[0].fastagBeneficiaryId)
          // this.getLocation();
        } else {
        }
      });
    } else {
      alert("Select Toll & Date..!")
    }

  }

  changeActiveTabNoLQ() {
    this.active = 1
  }

  getTollTransactionLQ(id: any) {
    this.PreviousShow1 = moment(new Date()).subtract(1, 'months').format('MMM YY');
    this.CurrentShow1 = moment(new Date()).format('MMM YY');
    const data = {
      fastagTransactionEntityId: id,
    };
    this.post.getFastagTollMonthWiseLQPOST(data).subscribe((res) => {
      if (res.status == 'OK') {

        this.fastagMonthWiseLQData = res.previousData
        this.fastagMonthWiseDataCurrentLQData = res.currentData
        this.fastagMonthWiseDatavehicleLQData = res.tollData

        this.getCombineLQ();

      } else {
      }
    });
  }

  getCombineLQ() {
    this.combineVehicleLQData = []

    this.fastagMonthWiseDatavehicleLQData.map((data: { fastagBeneficiaryName: string; fastagBeneficiaryId: string; }) => {
      let previousJson = {
        fastagBeneficiaryName: "",
        transactionAmountPrevious: 0,
        transactionAmountCurrent: 0,
        fastagBeneficiaryIdLQ: '',
        location: ''

      }
      previousJson.fastagBeneficiaryName = data.fastagBeneficiaryName
      previousJson.fastagBeneficiaryIdLQ = data.fastagBeneficiaryId

      this.fastagMonthWiseLQData.map((res: { fastagBeneficiaryName: string; transactionAmountPrevious: number; }) => {
        if (data.fastagBeneficiaryName == res.fastagBeneficiaryName) {
          previousJson.transactionAmountPrevious = res.transactionAmountPrevious

        }
      })

      this.fastagMonthWiseDataCurrentLQData.map((res1: { fastagBeneficiaryName: string; transactionAmountCurrent: number; }) => {
        if (data.fastagBeneficiaryName == res1.fastagBeneficiaryName) {
          previousJson.transactionAmountCurrent = res1.transactionAmountCurrent
        }

      })

      this.combineVehicleLQData.push(previousJson)

    })
  }

  changeTabLQ(tollName: any, fastagBeneficiaryIdLQ: any) {
    // this.tabset.select('tollDetails');
    this.active = 2

    let data = {
      fastagTransactionEntityId: this.entityIdForCorpLQ,
      tollName: tollName
    }

    this.post.geTransactionFastagByTollNameLQPOST(data)
      .subscribe(res => {

        this.callLocLQ(fastagBeneficiaryIdLQ)
        //  this.getLocation()
        this.fastagLQData = res.data
        this.fastagLQLength = res.data
      })


  }

  callLocLQ(fastagBeneficiaryIdLQ: string) {
    var res = fastagBeneficiaryIdLQ.split(",");
    let lat = res[0];
    let lngReview = res[1].split("|");
    let lng = lngReview[0]
    let latlng = {
      lat: Number(lat),
      lng: Number(lng)
    };
    console.log(lat, lng)
    this.post.getLocationByLatlngPOST(latlng).subscribe((res) => {
      if (latlng) {
        this.locationFromLat = res.data
      } else {

      }
    })


  }


  viewTollTransactionLQ() {
    if (this.dropTollNameLQ && this.filterFormLQ.value.startDate && this.filterFormLQ.value.endDate) {
      const data = {
        fastagTransactionEntityId: this.entityIdForCorpLQ,
        tollName: this.dropTollNameLQ,
        startDate: moment(this.filterFormLQ.value.startDate).format('YYYY-MM-DD') + ' 00:00:01',
        endDate: moment(this.filterFormLQ.value.endDate).format('YYYY-MM-DD') + ' 23:59:59',
      };
      this.post.geTransactionFastagByTollNameLQPOST(data).subscribe((res) => {
        if (res.status == 'OK') {
          this.fastagLQData = res.data
          this.fastagLQLength = res.data
          this.callLocLQ(res.data[0].fastagBeneficiaryIdLQ)
          // this.getLocation();
        } else {
        }
      });
    } else {
      alert("Select Toll & Date..!")
    }

  }

  getFastagTollPaymentMonthWiseLQ(id: any) {
    const data = {
      entityId: id,
      startDate: moment(new Date()).format('YYYY-MM-01 00:00:01'),
      endDate: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    };
    this.post.getTransactionFastagByVeelsIdDatewiseLQPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        this.tollPaymentMonthWiseLQDetails = res.data.result
        let totalsLQByTransactionType: any = {};

        this.tollPaymentMonthWiseLQDetails.forEach((obj: any) => {
          if (obj.transaction && obj.transaction.type === 'DEBIT') {
            let beneficiaryName = obj.transaction.beneficiaryName;
            let amount = parseFloat(obj.transaction.amount);

            // Initialize or accumulate the total amount for each transactionType
            if (!totalsLQByTransactionType[beneficiaryName]) {
              totalsLQByTransactionType[beneficiaryName] = 0;
            }
            totalsLQByTransactionType[beneficiaryName] += amount;
          }
        });

        // Convert the totalsByTransactionType object to an array of results
        this.resultLQArray = Object.keys(totalsLQByTransactionType).map(beneficiaryName => ({
          beneficiaryName: beneficiaryName,
          totalAmount: totalsLQByTransactionType[beneficiaryName]
        }));

        console.log("Toll Plaza", this.tollPaymentMonthWiseLQDetails, this.resultLQArray)
      } else {
      }
    });
  }
}

