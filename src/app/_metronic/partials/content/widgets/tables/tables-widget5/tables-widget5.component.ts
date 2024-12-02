import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalConfig } from 'src/app/_metronic/partials/layout/modals/modal.config';
import { Modal4Component } from 'src/app/_metronic/partials/layout/modals/modal4/modal4.component';
import { WidgetService } from '../../widgets.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';

type Tabs =
  | 'kt_table_widget_5_tab_1'
  | 'kt_table_widget_5_tab_2'
  | 'kt_table_widget_5_tab_3';

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
  selector: 'app-tables-widget5',
  templateUrl: './tables-widget5.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget5Component implements OnInit {

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };

  @ViewChild('modal') private modal4Component: Modal4Component;
  dealerLoginVPId: any;
  vpPersonId: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  fuelTerminalData: any = [];
  fuelTerminalDataList: any = [];
  waive: any;
  modalRef: any;
  fuelTerminalsId: any;
  isOILCOUpdate: boolean  =false;
  closeResult: string;

  updateTerminal = new FormGroup({
    terminalType: new FormControl('',Validators.required),
    terminalName: new FormControl(''),
    bankName: new FormControl(''),
    accountDetails: new FormControl('',Validators.required),
  });
  bankAccList: any = [];
  bankAccList1: any = [];
  dealerCorporateId: any;

  constructor(
    private post: WidgetService,
    private spinner: NgxSpinnerService,
    config: NgbDatepickerConfig,
    public cd: ChangeDetectorRef,
    private modalService: NgbModal,) {
    const currentDate = new Date();
    config.minDate = { year: 2018, month: 1, day: 1 };
    config.maxDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    config.outsideDays = 'hidden';
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = dealerData.fuelDealerId;
    this.dealerCorporateId = dealerData.corporateId;
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.vpPersonId = element.veelsPlusId
    // this.getCorporateById(this.dealerLoginVPId);
    this.getfuelDealerIdByCorporateId(this.dealerCorporateId)
    this.cd.detectChanges()
  }

  getCorporateById(dealerLoginVPId: any) {
    let data = {
      veelsplusCorporateId: dealerLoginVPId
    }
    this.post.getBranchByVeelsplusIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          if (res.data.length) {
            this.loginSQLCorporateId = res.data[0].corporateId;
            this.getfuelDealerIdByCorporateId(this.loginSQLCorporateId);
            this.cd.detectChanges()
          }
          else {
            alert("Getting Error..! Please Logout & Login again..!")
            this.cd.detectChanges()
          }
        }
      })
  }

  // getfuelDealerIdByDealerCorporateId
  getfuelDealerIdByCorporateId(dealerCorporateId: any) {
    let data = {
      corporateId: dealerCorporateId
    }
    this.post.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.getFuelTerminal(this.fuelDealerId);
          this.getBankDetailsByDealerId(this.fuelDealerId)
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
        }
      })
  }

  getFuelTerminal(fuelDealerId: any) {

    let dataTerminal = {
      fuelDealerId: fuelDealerId,
    }

    this.post.getFuelTerminalPOST(dataTerminal)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fuelTerminalData = res
          this.fuelTerminalDataList = res.data;
          this.cd.detectChanges()
        } else {
          this.fuelTerminalDataList = [];
          this.cd.detectChanges()
        }
      })
  }

  updateMappingPOS(status: any, fuelTerminalsId: any, terminalStatus: string) {
    this.spinner.show()
    if (terminalStatus != "MAPPED") {
      if (status.target.checked) {
        terminalStatus = "MAPPED";

        let data = {
          terminalStatus: terminalStatus,
          fuelTerminalsId: fuelTerminalsId,

        }

        this.post.updateFuelTerminalPOSStatusPOST(data)
          .subscribe(res => {
            if (res) {
              alert("Mapping Status Updated to MAPPED!")
              this.spinner.hide();
              this.getFuelTerminal(this.fuelDealerId)
            }
            else {
              alert("Error to Update Mapping!")
              this.spinner.hide();
              this.getFuelTerminal(this.fuelDealerId)
            }

          })
      }
    } else {
      terminalStatus = "UNMAPPED";

      let data = {
        terminalStatus: terminalStatus,
        fuelTerminalsId: fuelTerminalsId,
      }

      this.post.updateFuelTerminalPOSStatusPOST(data)
        .subscribe(res => {
          if (res) {
            alert("Mapping Status Updated to UNMAPPED!")
            this.spinner.hide();
            this.getFuelTerminal(this.fuelDealerId)
          } else {
            alert("Error to Update Mapping!")
            this.spinner.hide();
            this.getFuelTerminal(this.fuelDealerId)
          }

        })
    }
  }

  delete(id: any) {
    let data = {
      fuelTerminalsId: id,
    }

    this.post.deleteFuelTerminalPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          alert("Delete successfully..")
          this.getFuelTerminal(this.fuelDealerId);
        } else {
          alert("Error to Delete..")
        }
      })
  }

  //UpdateModal
  updatePOS(editPOS: any, fuelTerminalsId: any, terminalName: any, attachedAccountId: any, terminalType: string) {
    this.modalRef = this.modalService.open(editPOS);
    this.fuelTerminalsId = fuelTerminalsId;
    if (attachedAccountId == 21 || terminalType == 'OIL COMPANY PROGRAM') {
      this.isOILCOUpdate = true
      this.updateTerminal.controls['accountDetails'].setValue('21')
      this.updateTerminal.controls['bankName'].setValue('OIL COMPANY')
    } else {
      this.isOILCOUpdate = false
      this.updateTerminal.controls['accountDetails'].setValue(attachedAccountId)
    }

    this.updateTerminal.controls["terminalName"].setValue(terminalName);
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }
  
  getBankAcc1(id:any){
    this.spinner.show();
    let data = {
      bankDetailsId: id.target.value,
    }
    this.post.getBankDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.updateTerminal.controls['bankName'].setValue(res.data[0].bankName+'-'+res.data[0].accountNumber)
          this.spinner.hide();
        }
        else{
          this.spinner.hide();
        }
      })
  }

  getBankDetailsByDealerId(fuelDealerId: any){
    this.bankAccList.length = 0;
    this.bankAccList1.length = 0;
    let data = {
        dealerId:fuelDealerId
    }
    this.post.getBankDetailsByDealerIdPOST(data)
        .subscribe(res => {
        if (res.data.length) {
            this.bankAccList = res.data;  
            this.bankAccList1 = res.data1;  
        }}) 
    }
    
    updatePOSName() {
      this.spinner.show()
      if(this.updateTerminal.value.terminalName){  
        if(this.updateTerminal.value.accountDetails && this.updateTerminal.value.bankName){
      let data = {
        fuelTerminalsId:this.fuelTerminalsId,
        terminalName:this.updateTerminal.value.terminalName,    
        attachedAccountId:this.updateTerminal.value.accountDetails,
        attachedBankName:this.updateTerminal.value.bankName,
      }
      this.post.updateFuelTerminalPOSNamePOST(data).subscribe(res=>
        {
          if (res)
          {
            this.getFuelTerminal(this.fuelDealerId);
            this.modalRef.close('close')
            this.spinner.hide();
          }
          else{
            this.spinner.hide();
          }
      }) 
    }else{
      alert("Please Select Account")
      this.spinner.hide();
    } 
    }else{
      alert("Please enter valid name")
      this.spinner.hide();
    }
    }

  posArray = [
    {
      AccountsignzyStatus: "",
      accountHolderName: "ONE",
      accountNumber: "11111111111111110000",
      attachedAccountId: "310",
      attachedBankName: "ONE BANK-11111111111111110000",
      bankDetailsId: 310,
      bankName: "ONE BANK",
      branchCode: "",
      branchName: "ONE",
      cancelStatus: "FALSE",
      corporateId: "382",
      createdAt: "2021-12-24T09:10:53.000Z",
      dealerId: "40",
      deleteStatus: "FALSE",
      fuelDealerId: "40",
      fuelTerminalsId: 440,
      ifsc: "AAAAAA111111",
      micrCode: "",
      personId: "1215",
      phone: "1111111111",
      terminalName: "TEST",
      terminalStatus: "MAPPED",
      terminalType: "BANK CARD",
      type: "SAVING",
      uniqueStatus: "FALSE",
      upiId: "one@one"
    },
    {
      AccountsignzyStatus: "",
      accountHolderName: "TWO",
      accountNumber: "22222222222222220000",
      attachedAccountId: "320",
      attachedBankName: "TWO BANK-22222222222222220000",
      bankDetailsId: 320,
      bankName: "TWO BANK",
      branchCode: "",
      branchName: "TWO",
      cancelStatus: "FALSE",
      corporateId: "383",
      createdAt: "2021-12-25T09:10:53.000Z",
      dealerId: "41",
      deleteStatus: "FALSE",
      fuelDealerId: "41",
      fuelTerminalsId: 441,
      ifsc: "BBBBBB222222",
      micrCode: "",
      personId: "1216",
      phone: "2222222222",
      terminalName: "TEST2",
      terminalStatus: "MAPPED",
      terminalType: "BANK CARD",
      type: "CURRENT",
      uniqueStatus: "FALSE",
      upiId: "two@two"
    },
    {
      AccountsignzyStatus: "",
      accountHolderName: "THREE",
      accountNumber: "33333333333333330000",
      attachedAccountId: "330",
      attachedBankName: "THREE BANK-33333333333333330000",
      bankDetailsId: 330,
      bankName: "THREE BANK",
      branchCode: "",
      branchName: "THREE",
      cancelStatus: "FALSE",
      corporateId: "384",
      createdAt: "2021-12-26T09:10:53.000Z",
      dealerId: "42",
      deleteStatus: "FALSE",
      fuelDealerId: "42",
      fuelTerminalsId: 442,
      ifsc: "CCCCCC333333",
      micrCode: "",
      personId: "1217",
      phone: "3333333333",
      terminalName: "TEST3",
      terminalStatus: "UNMAPPED",
      terminalType: "BANK CARD",
      type: "SAVING",
      uniqueStatus: "FALSE",
      upiId: "three@three"
    },
    {
      AccountsignzyStatus: "",
      accountHolderName: "FOUR",
      accountNumber: "44444444444444440000",
      attachedAccountId: "340",
      attachedBankName: "FOUR BANK-44444444444444440000",
      bankDetailsId: 340,
      bankName: "FOUR BANK",
      branchCode: "",
      branchName: "FOUR",
      cancelStatus: "FALSE",
      corporateId: "385",
      createdAt: "2021-12-27T09:10:53.000Z",
      dealerId: "43",
      deleteStatus: "FALSE",
      fuelDealerId: "43",
      fuelTerminalsId: 443,
      ifsc: "DDDDDD444444",
      micrCode: "",
      personId: "1218",
      phone: "4444444444",
      terminalName: "TEST4",
      terminalStatus: "MAPPED",
      terminalType: "BANK CARD",
      type: "CURRENT",
      uniqueStatus: "FALSE",
      upiId: "four@four"
    },
    {
      AccountsignzyStatus: "",
      accountHolderName: "FIVE",
      accountNumber: "55555555555555550000",
      attachedAccountId: "350",
      attachedBankName: "FIVE BANK-55555555555555550000",
      bankDetailsId: 350,
      bankName: "FIVE BANK",
      branchCode: "",
      branchName: "FIVE",
      cancelStatus: "FALSE",
      corporateId: "386",
      createdAt: "2021-12-28T09:10:53.000Z",
      dealerId: "44",
      deleteStatus: "FALSE",
      fuelDealerId: "44",
      fuelTerminalsId: 444,
      ifsc: "EEEEEE555555",
      micrCode: "",
      personId: "1219",
      phone: "5555555555",
      terminalName: "TEST5",
      terminalStatus: "MAPPED",
      terminalType: "BANK CARD",
      type: "SAVING",
      uniqueStatus: "FALSE",
      upiId: "five@five"
    }
  ];

  async openModal() {
    return await this.modal4Component.open();
  }
}
