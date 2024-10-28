import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { ModalDismissReasons, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';
import { Adv_TablesService } from '../adv_tables.services';

@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '-';
  fromModel(value: string | null): NgbDateStruct | null {
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
  toModel(date: NgbDateStruct | null): string | null {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : null;
  }
}
/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
  readonly DELIMITER = '/';
  parse(value: string): NgbDateStruct | null {
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
  format(date: NgbDateStruct | null): string {
    return date ? date.day + this.DELIMITER + date.month + this.DELIMITER + date.year : '';
  }
}

@Component({
  selector: 'app-advance-tables-widget7',
  templateUrl: './advance-tables-widget7.component.html',
  styleUrl: './advance-tables-widget7.component.scss',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class AdvanceTablesWidget7Component {
  entityId: any;
  allentityList: any = [];
  modalRef: any;
  closeResult: string;
  selectMonth: any = new Date();
  redeemValue: any;
  suggestion: any;
  redeemAmount: any;
  janRecharge: number = 0;
  febRecharge: number = 0;
  marRecharge: number = 0;
  aprRecharge: number = 0;
  mayRecharge: number = 0;
  juneRecharge: number = 0;
  julyRecharge: number = 0;
  augustRecharge: number = 0;
  sepRecharge: number = 0;
  octRecharge: number = 0;
  novRecharge: number = 0;
  decRecharge: number = 0;
  customerId: any;
  janLoc: number = 0;
  janUnLoc: number = 0;
  febLoc: number = 0;
  febUnLoc: number = 0;
  marLoc: number = 0;
  marUnLoc: number = 0;
  aprLoc: number = 0;
  aprUnLoc: number = 0;
  mayLoc: number = 0;
  mayUnLoc: number = 0;
  juneLoc: number = 0;
  juneUnLoc: number = 0;
  julyLoc: number = 0;
  julyUnLoc: number = 0;
  augustLoc: number = 0;
  augustUnLoc: number = 0;
  sepLoc: number = 0;
  sepUnLoc: number = 0;
  octLoc: number = 0;
  octUnLoc: number = 0;
  novLoc: number = 0;
  novUnLoc: number = 0;
  decLoc: number = 0;
  decUnLoc: number = 0;
  janTrans: number = 0;
  febTrans: number = 0;
  marTrans: number = 0;
  aprTrans: number = 0;
  mayTrans: number = 0;
  juneTrans: number = 0;
  julyTrans: number = 0;
  augustTrans: number = 0;
  sepTrans: number = 0;
  octTrans: number = 0;
  novTrans: number = 0;
  decTrans: number = 0;
  month1: number = 0;
  month2: number = 0;
  month3: number = 0;
  month4: number = 0;
  month5: number = 0;
  month6: number = 0;
  month7: number = 0;
  month8: number = 0;
  month9: number = 0;
  month10: number = 0;
  month11: number = 0;
  month12: number = 0;

  constructor(private excelService: ExcelService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private post: Adv_TablesService,
    private cd: ChangeDetectorRef,) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem("element") || '');
    this.cd.detectChanges();
  }

  getcustomerIdByEntity(id: any) {
    this.entityId = id.target.value
    if(this.entityId){
    this.customerIdByEntity(this.entityId);
  }else{
   
  }
  }

  
  customerIdByEntity(entityId: any){
    let data = {
      entityId:entityId
    }
    this.post.getcustmerIdByEntityIdPOST(data)
    .subscribe(res=>{
      this.customerId = res.data[0].corporateId
      this.getCoinDataMonthWise(this.customerId)
      this.getredeemCoinMonthWise(this.customerId)
      // this.getCoinbyCustomerId(this.customerId)
    })
    this.getRechargeForFastag(entityId)
  
  }
  
  getAllEntity() {
    this.spinner.show();
    let data = {

    }
    this.post.getAllEntityIdPOST(data)
      .subscribe(res => {
        this.allentityList = res.data;
        // this.redeemByCustIs();
      })

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  openRedeemModal(RedeemAdd: any) {

    this.modalRef = this.modalService.open(RedeemAdd);
    this.modalRef.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });
  }
  
  getRechargeForFastag(entityId: any){
    let data = {
      fastagTransactionEntityId:entityId
    }
    this.post.getRechargeForFastagPOST(data)
    .subscribe(res=>{
      this.janRecharge = Number(res.data1[0].allPurchaseTransaction);
      this.febRecharge = Number(res.data2[0].allPurchaseTransaction);
      this.marRecharge = Number(res.data3[0].allPurchaseTransaction);
      this.aprRecharge = Number(res.data4[0].allPurchaseTransaction);
      this.mayRecharge = Number(res.data5[0].allPurchaseTransaction);
      this.juneRecharge = Number(res.data6[0].allPurchaseTransaction);
      this.julyRecharge = Number(res.data7[0].allPurchaseTransaction);
      this.augustRecharge = Number(res.data8[0].allPurchaseTransaction);
      this.sepRecharge = Number(res.data9[0].allPurchaseTransaction);
      this.octRecharge = Number(res.data10[0].allPurchaseTransaction);
      this.novRecharge = Number(res.data11[0].allPurchaseTransaction);
      this.decRecharge = Number(res.data12[0].allPurchaseTransaction);
      
    })
    
    }
    
  getCoinDataMonthWise(customerId: any){
    let data = {
      entityId:customerId
    }
    this.post.getCoinDataMonthWisePOST(data)
    .subscribe(res=>{
      this.janLoc = Number(res.janLoc[0].coinAllConversionAmountValue);
      this.janUnLoc = Number(res.janUnLoc[0].coinAllConversionAmountValue);
      this.febLoc = Number(res.febLoc[0].coinAllConversionAmountValue);
      this.febUnLoc = Number(res.febUnLoc[0].coinAllConversionAmountValue);
      this.marLoc = Number(res.marLoc[0].coinAllConversionAmountValue);
      this.marUnLoc = Number(res.marUnLoc[0].coinAllConversionAmountValue);
      this.aprLoc = Number(res.aprLoc[0].coinAllConversionAmountValue);
      this.aprUnLoc = Number(res.aprUnLoc[0].coinAllConversionAmountValue);
      this.mayLoc = Number(res.mayLoc[0].coinAllConversionAmountValue);
      this.mayUnLoc = Number(res.mayUnLoc[0].coinAllConversionAmountValue);
      this.juneLoc = Number(res.juneLoc[0].coinAllConversionAmountValue);
      this.juneUnLoc = Number(res.juneUnLoc[0].coinAllConversionAmountValue);
      this.julyLoc = Number(res.julyLoc[0].coinAllConversionAmountValue);
      this.julyUnLoc = Number(res.julyUnLoc[0].coinAllConversionAmountValue);
      this.augustLoc = Number(res.augustLoc[0].coinAllConversionAmountValue);
      this.augustUnLoc = Number(res.augustUnLoc[0].coinAllConversionAmountValue);
      this.sepLoc = Number(res.sepLoc[0].coinAllConversionAmountValue);
      this.sepUnLoc = Number(res.sepUnLoc[0].coinAllConversionAmountValue);
      this.octLoc = Number(res.octLoc[0].coinAllConversionAmountValue);
      this.octUnLoc = Number(res.octUnLoc[0].coinAllConversionAmountValue);
      this.novLoc = Number(res.novLoc[0].coinAllConversionAmountValue);
      this.novUnLoc = Number(res.novUnLoc[0].coinAllConversionAmountValue);
      this.decLoc = Number(res.decLoc[0].coinAllConversionAmountValue);
      this.decUnLoc = Number(res.decUnLoc[0].coinAllConversionAmountValue);
    })
  
    this.getTranslogForFastag(customerId)
  }
  
  getTranslogForFastag(customerId: any){
  let data = {
    customerId:customerId
  }
  this.post.getTranslogForFastagPOST(data)
  .subscribe(res=>{
    if(res.status=="OK"){
      this.janTrans = Number(res.data1[0].grandTotalAmount);
      this.febTrans = Number(res.data2[0].grandTotalAmount);
      this.marTrans = Number(res.data3[0].grandTotalAmount);
      this.aprTrans = Number(res.data4[0].grandTotalAmount);
      this.mayTrans = Number(res.data5[0].grandTotalAmount);
      this.juneTrans = Number(res.data6[0].grandTotalAmount);
      this.julyTrans = Number(res.data7[0].grandTotalAmount);
      this.augustTrans = Number(res.data8[0].grandTotalAmount);
      this.sepTrans = Number(res.data9[0].grandTotalAmount);
      this.octTrans = Number(res.data10[0].grandTotalAmount);
      this.novTrans = Number(res.data11[0].grandTotalAmount);
      this.decTrans = Number(res.data12[0].grandTotalAmount);
    }
  })
  
  }
  
  getredeemCoinMonthWise(customerId: any){
    let data = {
      customerId:customerId
    }
    this.post.getredeemCoinMonthWisePOST(data)
    .subscribe(res=>{
      this.month1 = Number(res.month1Data[0].redeemCoincoinConversionAmountValue)
      this.month2 = Number(res.month2Data[0].redeemCoincoinConversionAmountValue)
      this.month3 = Number(res.month3Data[0].redeemCoincoinConversionAmountValue)
      this.month4 = Number(res.month4Data[0].redeemCoincoinConversionAmountValue)
      this.month5 = Number(res.month5Data[0].redeemCoincoinConversionAmountValue)
      this.month6 = Number(res.month6Data[0].redeemCoincoinConversionAmountValue)
      this.month7 = Number(res.month7Data[0].redeemCoincoinConversionAmountValue)
      this.month8 = Number(res.month8Data[0].redeemCoincoinConversionAmountValue)
      this.month9 = Number(res.month9Data[0].redeemCoincoinConversionAmountValue)
      this.month10 = Number(res.month10Data[0].redeemCoincoinConversionAmountValue)
      this.month11 = Number(res.month11Data[0].redeemCoincoinConversionAmountValue)
      this.month12 = Number(res.month12Data[0].redeemCoincoinConversionAmountValue)
  
     
    })
  }
  
  addRedeemCoin(){
    let unlockActualValue = 0;
  if(this.selectMonth == "Jan"){
    unlockActualValue = this.janUnLoc -this.month1
  }else if(this.selectMonth == "Feb"){
    unlockActualValue = this.febUnLoc -this.month2
  }else if(this.selectMonth == "Mar"){
    unlockActualValue =this.marUnLoc - this.month3
  }else if(this.selectMonth == "Apr"){
    unlockActualValue = this.aprUnLoc- this.month4
  }else if(this.selectMonth == "May"){
    unlockActualValue =this.mayUnLoc- this.month5
  }else if(this.selectMonth == "June"){
    unlockActualValue = this.juneUnLoc- this.month6
  }else if(this.selectMonth == "July"){
    unlockActualValue =this.julyUnLoc- this.month7
  }else if(this.selectMonth == "Aug"){
    unlockActualValue = this.augustUnLoc- this.month8
  }else if(this.selectMonth == "Sep"){
    unlockActualValue = this.sepUnLoc- this.month9
  }else if(this.selectMonth == "Oct"){
    unlockActualValue = this.octUnLoc- this.month10
  }else if(this.selectMonth == "Nov"){
    unlockActualValue = this.novUnLoc- this.month11
  }else if(this.selectMonth == "Dec"){
    unlockActualValue = this.decUnLoc- this.month12
  }
  
    let persent = (this.redeemValue /this.redeemAmount)*100
    let data = {
      redeemCoinCorporateId:"",
      redeemCoincoinConversionAmountValue:this.redeemAmount,
      redeemCoinCustomerId:this.customerId,
      suggestion:this.suggestion,
      redeemCoinTransactionMonth:this.selectMonth,
      redeemStatus:'Paid',
      redeemValue:this.redeemValue,
      redeemPersent:persent
    }
    this.post.addRedeemCoinPOST(data)
    .subscribe(res=>{
    if(res.status=="OK"){
  
      alert(res.msg)
      this.modalRef.close('close')
      this.customerIdByEntity(this.entityId)
  
    }
    
    })
  }
}
