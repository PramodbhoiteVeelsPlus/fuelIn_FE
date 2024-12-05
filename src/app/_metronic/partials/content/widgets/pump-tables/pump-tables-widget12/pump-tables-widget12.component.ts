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
import { ListWidgetService } from '../../lists/listWidget.services';

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
  selector: 'app-pump-tables-widget12',
  templateUrl: './pump-tables-widget12.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class PumpTablesWidget12Component implements OnInit {
  filterForm = new FormGroup({
    date: new FormControl(''),
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
  date1: string;
  allShift: any = [];
  meterSalesSum: any;
  tallySalesSum: any;
  meterSalesQuantitySum: any;
  meterSalesDetails: any = [];
  totalMeterSalesDetails: any;
  duNzDetails: any = [];
  tallySalesDetails: any = [];
  totalSalesDetails: any = [];
  p: number = 1;
  p1: number = 1;
  total: number = 0;
  updateNzId: any;
  meterSalesAmount: any;
  meterSalesQuantity: any;
  pumpTesting: any;
  closingReading: any;
  openingReading: any;
  productRate: string;
  pumpNz: string;
  fuelPrice: string;
  modalReference: any;
  closeResult: string;
  reviewtotalCashTally: any;
  reviewpaytmTotalAmount: any;
  reviewtotalCreditTally: any;
  totalAmountTally: any;
  tallyIdForUpdate: any;
  requestEditTally: any;
  reviewtotalCashTallyDiff: number;
  reviewpaytmTotalAmountDiff: number;
  reviewtotalCreditTallyDiff: number;
  routeView: any;
  dateView: any;

  constructor(
    private modalService: NgbModal,
    private post: PumpTablesService,
    private post1: Adv_TablesService,
    private post2: ListWidgetService,
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
    this.routeView =  this.post2.address;
    this.dateView =  this.post2.date;

    // console.log('routeis===>',this.routeView);
    if (this.routeView == "ViewSummary") {
      this.filterForm.controls['date'].setValue(moment(this.dateView).format('DD-MM-YYYY'));
      this.getfuelDealerIdByCorporateId();
      this.date1 = (moment(this.dateView).format('YYYY-MM-DD'))

    } else {
      this.filterForm.controls['date'].setValue(moment(new Date()).format('DD-MM-YYYY'));
      this.getfuelDealerIdByCorporateId();
      this.date1 = (moment(new Date()).format('YYYY-MM-DD'))
  
    }
    this.cd.detectChanges()
  }

  getfuelDealerIdByCorporateId() {
    const data = {
      corporateId: this.dealerCorporateId
    };
    this.post.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.getAllShift(this.fuelDealerId);
          this.getTotalMeterSalesAndTallyEntery(this.fuelDealerId);
          this.getSalesDetailsProductWise(this.fuelDealerId)
          this.getNozzelDetailsByShift(this.fuelDealerId);
          this.getTallyDetails(this.fuelDealerId);
          this.date1 = (moment(this.filterForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'))
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()
        }
      });
  }

  pageChangeEvent(event: number) {
    this.p = event;
    this.getAllShift(this.fuelDealerId);
  }

  getAllShift(fuelDealerId: any) {
    const data = {
      date: moment(this.filterForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
    };
    this.post.getShiftDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.allShift = res.data;
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()

        }
      });
  }


  getTotalMeterSalesAndTallyEntery(fuelDealerId: any) {
    const data = {
      date: moment(this.filterForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
    };
    this.post.getTotalMeterSalesAndTallyEnteryPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.meterSalesSum = res.data[0].meterSaleAmount;
          this.tallySalesSum = res.data1[0].tallySaleAmount;
          this.meterSalesQuantitySum = res.data[0].meterSaleQuantity;
          this.cd.detectChanges()

        } else {
          this.cd.detectChanges()

        }
      });
  }

  getSalesDetailsProductWise(fuelDealerId: any) {
    let data = {
      fuelDealerId: fuelDealerId,
      date: moment(this.filterForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
    };
    this.post2.getMETERSALESTotalDSRPOST(data)
      .subscribe((res) => {
        if (res.status == "OK") {
          this.meterSalesDetails = res.data;
          this.totalMeterSalesDetails = res.data1[0].meterSaleAmount;
          this.cd.detectChanges()
        }
      });
  }


  getNozzelDetailsByShift(fuelDealerId: any) {
    const data = {
      date: moment(this.filterForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
    };
    this.post.getDUNZDetailsByShiftIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {

          this.duNzDetails = res.data;
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()

        }
      });
  }


  getTallyDetails(fuelDealerId: any) {
    const data = {
      date: moment(this.filterForm.value.date, ['DD-MM-YYYY']).format('YYYY-MM-DD'),
      dealerId: fuelDealerId,
    };
    this.post2.getShiftVStallyByDatePOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {

          this.tallySalesDetails = res.data;
          this.totalSalesDetails = res.data1;
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()

        }
      });
  }

  goToDSR(date: any) {
    this.post2.setRoutingWithDate(date, "ViewSummary")
    this.router.navigate(['/shift/shiftReport']);
  }

  nozzleEdit(updateNozzle: any, fuelShiftNozzeInfraId: any, openMeter: any, closingReading: any, meterSaleAmount: any, meterSaleQuantity: any, duNo: string, nozNo: string, fuelPrice: string, productName: string, pumpTesting: any) {
    this.updateNzId = fuelShiftNozzeInfraId,
      this.meterSalesAmount = meterSaleAmount,
      this.meterSalesQuantity = meterSaleQuantity,
      this.pumpTesting = pumpTesting,
      this.closingReading = closingReading,
      this.openingReading = openMeter,
      this.productRate = productName + '-' + fuelPrice,
      this.pumpNz = duNo + '-' + nozNo
    this.fuelPrice = fuelPrice,

      this.modalReference = this.modalService.open(updateNozzle, { size: 'lg' });
    // this.modalService.open(driverContent);
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason == ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason == ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  
  getMeterSales(){
    //if(Number(this.openingReading) > Number(this.closingReading)){
    this.meterSalesQuantity = Number(Number(this.closingReading) - Number(this.openingReading) - Number(this.pumpTesting)).toFixed(2)
    this.meterSalesAmount = Number(Number(this.meterSalesQuantity) * Number(this.fuelPrice)).toFixed(2)
  // }else{
  //   alert("Please Enter Valid Readings...")
  // }
}

updateNozzleEntry(){
  //if(this.meterSalesQuantity <= this.pumpTesting){
    let data = {
      shiftInfraId:this.updateNzId,
      openMeter:this.openingReading,
      closingReading:this.closingReading,
      pumpTesting:this.pumpTesting,
      meterSaleQuantity:this.meterSalesQuantity,
      meterSaleAmount:this.meterSalesAmount,
      rate:this.fuelPrice,
    }
    this.post2.updateShiftInfraDetailsPOST(data)
    .subscribe(res => {
      if (res.status == 'OK') {
        alert("Update Successfully...")
        this.modalReference.close('close');
        this.getNozzelDetailsByShift(this.fuelDealerId);
        this.getTallyDetails(this.fuelDealerId);
        this.getTotalMeterSalesAndTallyEntery(this.fuelDealerId);
        this.getSalesDetailsProductWise(this.fuelDealerId)
        this.cd.detectChanges()

      } else {
        alert("Getting Error...")
        this.cd.detectChanges()
      }
    });
  // }else{
  //   alert("Please Enter Valid Readings...")
  // }
}

closeModalUpdateCr() {
  this.modalReference.close('close');
}

shiftTallyEdit(updateShiftTally: any, tallyIdForUpdate: any, totalAmountTally: any, totalCashTally: any, paytmTotalAmount: any, totalCreditTally: any, expenseAmount: any,shortamount: any) {
  this.reviewtotalCashTally = totalCashTally;
  this.reviewpaytmTotalAmount = paytmTotalAmount;
  this.reviewtotalCreditTally = totalCreditTally;
  this.totalAmountTally = totalAmountTally;

  this.tallyIdForUpdate = tallyIdForUpdate;
  this.requestEditTally.controls['totalCashTally'].setValue(totalCashTally);
  this.requestEditTally.controls['paytmTotalAmount'].setValue(paytmTotalAmount);
  this.requestEditTally.controls['totalCreditTally'].setValue(totalCreditTally);      
  this.requestEditTally.controls['expenseAmount'].setValue(expenseAmount);
  this.requestEditTally.controls['shortamount'].setValue(shortamount);
  this.modalReference = this.modalService.open(updateShiftTally);
  // this.modalService.open(driverContent);
  this.modalReference.result.then((result: any) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason: any) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

updateShiftTallyEDIT() {
  this.reviewtotalCashTallyDiff  = Number(this.requestEditTally.value.totalCashTally) - Number(this.reviewtotalCashTally) ;
  this.reviewpaytmTotalAmountDiff  = Number(this.requestEditTally.value.paytmTotalAmount) - Number(this.reviewpaytmTotalAmount) ;
  this.reviewtotalCreditTallyDiff  = Number(this.requestEditTally.value.totalCreditTally) - Number(this.reviewtotalCreditTally) ;
  // console.log('reviewtotalCashTallyDiff', this.reviewtotalCashTallyDiff);
  // console.log('reviewpaytmTotalAmountDiff', this.reviewpaytmTotalAmountDiff );
  // console.log('reviewtotalCreditTallyDiff', this.reviewtotalCreditTallyDiff);
  // console.log('totalAmountTally', this.totalAmountTally);

  const data = {
    fuelShiftTallySalesId: this.tallyIdForUpdate,
    paytmTotalAmount: this.requestEditTally.value.paytmTotalAmount,
    totalAmountTally: (Number(this.totalAmountTally) + (Number(this.reviewtotalCashTallyDiff) + Number(this.reviewpaytmTotalAmountDiff) +  Number(this.reviewtotalCreditTallyDiff))),
    totalCashTally: this.requestEditTally.value.totalCashTally,
    totalCreditTally: this.requestEditTally.value.totalCreditTally,
    expenseAmount: this.requestEditTally.value.expenseAmount,
    shortamount: this.requestEditTally.value.shortamount,
  };
  this.post.updateTallySalesForPortalPOST(data)
    .subscribe(res => {
      if (res.status == 'OK') {
        alert('Tally Updated successfully!');
        this.modalReference.close('close');
        this.getfuelDealerIdByCorporateId();
        this.cd.detectChanges()
      } else {
        this.cd.detectChanges()

      }
    });
}
}

