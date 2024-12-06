import { ChangeDetectorRef, Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalConfig } from 'src/app/_metronic/partials/layout/modals/modal.config';
import { Modal4Component } from 'src/app/_metronic/partials/layout/modals/modal4/modal4.component';
import { WidgetService } from '../../widgets.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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
  isOILCOUpdate: boolean = false;
  closeResult: string;

  updateTerminal = new FormGroup({
    terminalType: new FormControl('', Validators.required),
    terminalName: new FormControl(''),
    bankName: new FormControl(''),
    accountDetails: new FormControl('', Validators.required),
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
    this.getfuelDealerIdByCorporateId(this.dealerCorporateId)
    this.cd.detectChanges()
  }

  refreshData() {
    this.getFuelTerminal(this.fuelDealerId);
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

  getBankAcc1(id: any) {
    this.spinner.show();
    let data = {
      bankDetailsId: id.target.value,
    }
    this.post.getBankAccByBankIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.updateTerminal.controls['bankName'].setValue(res.data[0].bankName + '-' + res.data[0].accountNumber)
          this.spinner.hide();
          this.cd.detectChanges()
        }
        else {
          this.spinner.hide();
          this.cd.detectChanges()
        }
      })
  }

  getBankDetailsByDealerId(fuelDealerId: any) {
    this.bankAccList.length = 0;
    this.bankAccList1.length = 0;
    let data = {
      dealerId: fuelDealerId
    }
    this.post.getBankDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.bankAccList = res.data;
          this.bankAccList1 = res.data1;
        }
      })
  }

  updatePOSName() {
    this.spinner.show()
    if (this.updateTerminal.value.terminalName) {
      if (this.updateTerminal.value.accountDetails && this.updateTerminal.value.bankName) {
        let data = {
          fuelTerminalsId: this.fuelTerminalsId,
          terminalName: this.updateTerminal.value.terminalName,
          attachedAccountId: this.updateTerminal.value.accountDetails,
          attachedBankName: this.updateTerminal.value.bankName,
        }
        this.post.updateFuelTerminalPOSNamePOST(data).subscribe(res => {
          if (res) {
            this.getFuelTerminal(this.fuelDealerId);
            this.modalRef.close('close')
            this.spinner.hide();
            this.cd.detectChanges()
          }
          else {
            this.spinner.hide();
            this.cd.detectChanges()
          }
        })
      } else {
        alert("Please Select Account")
        console.log("11", this.updateTerminal.value.terminalName, this.updateTerminal.value.accountDetails, this.updateTerminal.value.bankName)
        this.spinner.hide();
        this.cd.detectChanges()
      }
    } else {
      alert("Please enter valid name")
      this.spinner.hide();
      this.cd.detectChanges()
    }
  }

  async openModal() {
    return await this.modal4Component.open();
  }
}
