import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { TilesService } from '../tiles.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { PumpTablesService } from '../../pump-tables/pump-tables.services';

@Component({
  selector: 'app-tiles-widget13',
  templateUrl: './tiles-widget13.component.html',
})
export class TilesWidget13Component {
  @Input() cssClass = '';
  @Input() widgetHeight = '225px';
  acceesGroup: any;
  userId: any;
  dealerLoginVPId: any;
  managerName: string;
  FT: boolean;
  LQFT: boolean;
  dataFTArray: any;
  startDate: string;
  endDate: string;
  openningBalance: any;
  totalFT: any;
  dataArray: any;
  debitAmt: any;
  creditAmt: any;
  closingBalance: any;
  isTable: any;
  pumpCity: any;
  loginCorporateId: any;
  customerId: any;
  companyName: any;
  hostName: any;
  hostPhone: any;
  address: string;
  entityIdForCorp: any;
  entityIdForCorpLQ: any;

  constructor(
    private post: TilesService,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private post1: PumpTablesService,) { }

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
      console.log("cust", this.customerId)
    }
    // if(this.acceesGroup == '12'){
    //   this.getFastagCorporateByCorpId(this.dealerCorporateId)
    // } 
    // if(this.acceesGroup == '2'){
    //   this.transporterCorpId = localStorage.getItem('transporterCorpId');
    //   this.getFastagCorporateByCorpId(this.transporterCorpId)
    //   console.log("trans", this.transporterCorpId)
    // }
    this.getFastagCorporateByCorpId(this.customerId)

    if (this.post1.FT == "FT") {
      this.FT = true

    } else {
      if (this.post1.FT == "LQ") {
        this.LQFT = true
      } else {

      }
    }

    this.startDate = this.post1.date1;
    this.endDate = this.post1.date2;
    this.dataArray = this.post1.dataArray;
    this.dataFTArray = this.post1.dataFTArray;
    this.totalFT = this.post1.totalFT;
    this.openningBalance = this.post1.openningBalance
    this.debitAmt = this.post1.debitAmt
    this.creditAmt = this.post1.creditAmt
    this.closingBalance = this.post1.closingBalance
    this.isTable = this.post1.isTable
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
          if (res.data1.length) {
            this.entityIdForCorpLQ = res.data1[0].entityId
          }
        } else {
          if (res.data1.length) {
            this.entityIdForCorpLQ = res.data1[0].entityId
          }
        }
      } else {
      }
    });
  }
}
