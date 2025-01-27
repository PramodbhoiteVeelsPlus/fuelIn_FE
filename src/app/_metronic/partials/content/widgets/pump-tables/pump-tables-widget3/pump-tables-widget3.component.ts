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
  selector: 'app-pump-tables-widget3',
  templateUrl: './pump-tables-widget3.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class PumpTablesWidget3Component implements OnInit {
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
    private router: Router) { }

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
                this.fastagId = res.data[0].entityId
                this.thrLimit = res.data[0].thrLimit
                this.getCorpWalletBalance(this.fastagId)
                if (res.data1.length) {
                    this.FT = false;
                    this.bothFT = true;
                    this.fastagLQId = res.data1[0].entityId
                    this.thrLimitLQ = res.data1[0].thrLimit
                    this.getBalanceByEntityIdLQ(this.fastagLQId)
                }
            }else{          
                if(res.data1.length){
                    this.LQFT = true;
                    this.fastagLQId = res.data1[0].entityId
                    this.thrLimitLQ = res.data1[0].thrLimit
                    this.getBalanceByEntityIdLQ(this.fastagLQId)
                    }
            }     
        } else {
            this.bothFT = false;
            this.LQFT = false;
            this.FT = false;
        }
    });
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

getBalanceByEntityIdLQ(fastagLQId: any){
  let data = {
      entityId: fastagLQId
  }

  this.post.getCorpWalletBalLQPOST(data)
  .subscribe(res =>{
      if(res.status == "OK"){
          this.balanceLQ = res.data.result[0].balance
          this.getCorpDetailsByEntity(fastagLQId);
      } else {

      }
  })
}

getCorpDetailsByEntity(corpWalletEntityId: any){
  this.spinner.show();
  let data = {
    entityId: corpWalletEntityId,
  }
  this.post.getCorpWalletDetailsByEntityPOST(data)
  .subscribe(res => {
    if(res.status == "OK" && res.data.length){
      this.corpWalletLQId = res.data[0].corpWalletLQId;
      this.corpWalletAccNo = res.data[0].corpWalletAccNo;
      this.corpWalletIFSC = res.data[0].corpWalletIFSC;
      this.corpWalletUPI = res.data[0].corpWalletUPI;
      this.spinner.hide();
      this.cd.detectChanges()
    }else{
      this.spinner.hide();
      this.cd.detectChanges()
    }
  })
}
}

