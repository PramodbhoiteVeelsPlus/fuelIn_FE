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
  vehicleLQList: any  =[];
  FTLQData: any = [];
  FTLQTransaction: any = [];
  FTLQDetails: any = [];
  FTLQTransactionDetails: any = [];
  totalFTLQ: any = [];
  transporterCorpId: string | null;

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
    this.userName = element.firstName + ' ' + element.lastName;
    this.acceesGroup = element.accessGroupId;
    if(this.acceesGroup == '12'){
      this.getFastagCorporateByCorpId(this.dealerCorporateId)
    } 
    if(this.acceesGroup == '2'){
      this.transporterCorpId = localStorage.getItem('transporterCorpId');
      this.getFastagCorporateByCorpId(this.transporterCorpId)
    }
    this.getVehicleList()
    this.cd.detectChanges()
  }

  getVehicleList(){
    this.spinner.show()
  let data = {
    entityId: this.entityIdForCorp
  } 

  this.post.getFTVehicleListPOST(data).subscribe(res =>{
    if(res.status == "OK"){
      this.vehicleList = res.data;
      this.spinner.hide()
    } else {
      this.vehicleList = [];
      this.spinner.hide()
    }
  })
  } 
  
  getVehicleWiseFT() {
    if(this.filterForm.value.startDate && this.filterForm.value.endDate){
      if(this.filterForm.value.businessId){
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
            this.spinner.hide()
          } else {
            this.FTData = [];
            this.FTDetails = [];
            this.totalFT = [];
            this.spinner.hide()
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
          this.spinner.hide()
        } else {
          this.FTData = [];
          this.FTDetails = [];
          this.totalFT = [];
          this.spinner.hide()
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
        if(res.data.length){
        this.FT = true 
        // this.LQFT = true  
        this.entityIdForCorp = res.data[0].entityId
        // this.entityIdForCorpLQ = res.data1[0].entityId
        this.thrLimit = res.data[0].thrLimit
        this.getVehicleList();
        this.getVehicleListLQ()
        this.getVehicleWiseFT()
        this.getVehicleTransactionData(this.entityIdForCorp)
        if(res.data1.length){
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
          if(res.data1.length){
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
    this.post.setRoutingWithVehicle(this.FTData, this.FTDetails, this.totalFT, moment(this.filterForm.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"), moment(this.filterForm.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"), "FT")
    this.router.navigate(['/pump/vehicleSummaryReport']);
  }

  getVehicleListLQ(){
    this.spinner.show()
    let data = {
      entityId: this.entityIdForCorpLQ
    } 

    this.post.getFTVehicleListLQPOST(data).subscribe(res =>{
      if(res.status == "OK"){
        this.vehicleLQList = res.data;
        this.spinner.hide()
      } else {
        this.vehicleLQList = [];
        this.spinner.hide()
      }
    })
  }
  
  getVehicleTransactionData(id: any) {
    const data = {
      fastagTransactionEntityId: id, 
      startDate:moment(this.filterForm.value.startDate).format('YYYY-MM-DD') + ' 00:00:01',
      endDate:moment(this.filterForm.value.endDate).format('YYYY-MM-DD') + ' 23:59:59',     
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
            this.spinner.hide()
          } else {
            this.FTLQData = [];
            this.FTLQDetails = [];
            this.totalFTLQ = [];
            this.spinner.hide()
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
            this.spinner.hide()
          } else {
            this.FTLQData = [];
            this.FTLQDetails = [];
            this.totalFTLQ = [];
            this.spinner.hide()
          }
        })
      }
    }
  }

  getVehicleTransactionLQ(id: any) {
    const data = {
      fastagTransactionEntityId: id, 
      startDate:moment(this.filterFormLQ.value.startDate).format('YYYY-MM-DD') + ' 00:00:01',
      endDate:moment(this.filterFormLQ.value.endDate).format('YYYY-MM-DD') + ' 23:59:59',     
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
      startDate:moment(this.filterForm.value.startDate).format('YYYY-MM-DD') + ' 00:00:01',
      endDate:moment(this.filterForm.value.endDate).format('YYYY-MM-DD') + ' 23:59:59',   
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
    this.post.setRoutingWithVehicle(this.FTLQData, this.FTLQDetails, this.totalFTLQ, moment(this.filterFormLQ.value.startDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"), moment(this.filterFormLQ.value.endDate, ["DD-MM-YYYY"]).format("YYYY-MM-DD"), "FT")
    this.router.navigate(['/pump/vehicleSummaryReport']);
  }

  pageChangeEvent(event: number) {
    this.p = event;
    // this.getLubePurchase(this.fuelDealerId)
  }
  
  submitRechargeLQ() {
    const data = {
      fastagTransactionEntityId: this.entityIdForCorpLQ,  
      startDate:moment(this.filterFormLQ.value.startDate).format('YYYY-MM-DD') + ' 00:00:01',
      endDate:moment(this.filterFormLQ.value.endDate).format('YYYY-MM-DD') + ' 23:59:59',   
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

