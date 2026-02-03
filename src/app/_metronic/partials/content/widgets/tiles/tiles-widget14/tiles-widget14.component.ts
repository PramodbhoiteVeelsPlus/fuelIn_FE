import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PumpTablesService } from '../../pump-tables/pump-tables.services';
import { TilesService } from '../tiles.services';

@Component({
  selector: 'app-tiles-widget14',
  templateUrl: './tiles-widget14.component.html',
})
export class TilesWidget14Component {
  @Input() cssClass = '';
  userId: any;
  acceesGroup: any;
  dealerLoginVPId: any;
  managerName: string;
  pumpCity: any;
  loginCorporateId: any;
  customerId: any;
  companyName: any;
  hostName: any;
  hostPhone: any;
  address: string;
  FT: boolean = false;
  LQFT: boolean = false;
  startDate: string;
  endDate: string;
  dataArray: any = [];
  dataFTArray: any = [];
  totalFT: any;
  openningBalance: any;
  debitAmt: any;
  creditAmt: any;
  closingBalance: any;
  isTable: any;
  viewStatus: boolean = false;
  creditSum: any = 0;
  debitSum: any = 0;
  entityIdForCorp: any;
  thrLimit: any;
  entityIdForCorpLQ: any;
  thrLimitLQ: any;

  constructor(
      private post: TilesService,
      private cd: ChangeDetectorRef,
      private spinner: NgxSpinnerService,
      private post1: PumpTablesService,
    ) {}

    
  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '{}');
    this.userId = element.userId;
    this.acceesGroup = element.accessGroupId;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.managerName = element.firstName + ' ' + element.lastName;
    this.acceesGroup = element.accessGroupId;

    if (this.acceesGroup == '2') {
      var transporterData = JSON.parse(localStorage.getItem("transporterData") || '{}');
      this.pumpCity = transporterData.headQuarterName;
      this.loginCorporateId = transporterData.corporateId;
      this.customerId = transporterData.customerId;
      this.companyName = transporterData.companyName;
      this.hostName = transporterData.hostName;
      this.hostPhone = transporterData.hostPhone;
      this.address = transporterData.address1 + ',' + transporterData.address2 + ',' + transporterData.city + ',' + transporterData.state + ',' + transporterData.pin;
      
    }
    this.getFastagCorporateByCorpId(this.customerId)

   
    if(this.post1.FT == "FT"){
      this.FT = true
      if (this.post1.status == "current") {
        this.dataArray = this.post1.dataArray.sort((a: { transaction: { time: number; }; }, b: { transaction: { time: number; }; }) => (a.transaction.time < b.transaction.time ? -1 : 1));
        this.viewStatus = true;
        //   console.log('11111111111',this.post.status);
         console.log("hisi", this.dataArray)
        if (this.dataArray.length) {
          this.dataArray.map((res1: { transaction: { type: string; amount: any; }; }) => {
            if (res1.transaction.type == "CREDIT") {
              this.creditSum = Number(this.creditSum) + Number(res1.transaction.amount)
  
            }
            if (res1.transaction.type == "DEBIT") {
              this.debitSum = Number(this.debitSum) + Number(res1.transaction.amount)
  
            }
            console.log("this.creditSum", this.creditSum, this.debitSum)
          })
        }
  
      } else {
        this.dataArray = this.post1.dataArray.sort((a: { fastagTransactionTime: number; }, b: { fastagTransactionTime: number; }) => (a.fastagTransactionTime < b.fastagTransactionTime ? -1 : 1));
        //  console.log('22222222',this.post.status);
        //  console.log(this.dataArray)
  
        this.viewStatus = false;
      }

    }else{
      if(this.post1.FT == "LQ"){
        this.LQFT = true
          this.dataArray = this.post1.dataArray.sort((a: { fastagTransactionTime: number; }, b: { fastagTransactionTime: number; }) => (a.fastagTransactionTime < b.fastagTransactionTime ? -1 : 1));
          this.viewStatus = false;
      }else{
        
      }
    }
  if (this.dataArray.length) {
      this.dataArray.map((res1: { fastagType: string; fastagTransactionAmount: any; }) => {
        if (res1.fastagType == "CREDIT") {
          this.creditSum = Number(this.creditSum) + Number(res1.fastagTransactionAmount)
        }
        if (res1.fastagType == "DEBIT") {
          this.debitSum = Number(this.debitSum) + Number(res1.fastagTransactionAmount)
        }
      })
    }
    this.startDate = this.post1.date1;
    this.endDate = this.post1.date2;
    this.dataArray = this.post1.dataArray;
    this.dataFTArray = this.post1.dataFTArray;
    // this.totalFT = this.post1.totalFT;
    // this.openningBalance = this.post1.openningBalance
    this.debitAmt = this.post1.debitAmt
    this.creditAmt = this.post1.creditAmt
    // this.closingBalance = this.post1.closingBalance
    // this.isTable = this.post1.isTable
    this.cd.detectChanges()

  }

  
  //getFastagCorporateByCorpId
  getFastagCorporateByCorpId(id: any) {
    const data = {
      corporateId: id,
    };
    this.post1.getFastagCorporateByCorpIdPOST(data).subscribe((res) => {
      if (res.status == 'OK') {
        if (res.data.length) {
          this.entityIdForCorp = res.data[0].entityId
          this.thrLimit = res.data[0].thrLimit
          if (res.data1.length) {
            this.entityIdForCorpLQ = res.data1[0].entityId
            this.thrLimitLQ = res.data1[0].thrLimit
            this.cd.detectChanges()
          }
        } else {
          if (res.data1.length) {
            this.entityIdForCorpLQ = res.data1[0].entityId
            this.thrLimitLQ = res.data1[0].thrLimit
            this.cd.detectChanges()
          }
        }
      } else {
      }
    });
  }
}
