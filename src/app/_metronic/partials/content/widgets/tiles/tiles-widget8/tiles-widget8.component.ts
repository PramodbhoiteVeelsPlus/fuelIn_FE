import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TilesService } from '../tiles.services';
import { NgxSpinnerService } from 'ngx-spinner';
import { ExcelService } from 'src/app/pages/excel.service';


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
  selector: 'app-tiles-widget8',
  templateUrl: './tiles-widget8.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class TilesWidget8Component {


  terminal = new FormGroup({
    terminalType: new FormControl('', Validators.required),
    terminalName: new FormControl(''),
    bankName: new FormControl(''),
    accountDetails: new FormControl('', Validators.required),
  });

  updateTerminal = new FormGroup({
    terminalType: new FormControl('', Validators.required),
    terminalName: new FormControl(''),
    bankName: new FormControl(''),
    accountDetails: new FormControl('', Validators.required),
  });
  fuelDealerId: any;
  modalRef: any;
  closeResult: string;
  fuelTerminalsId: any;
  isOILCOUpdate: boolean = false;
  fuelTerminalDataList: any = [];
  getTerminalsListDetails: any = [];
  bankAccList: any = [];
  isOilCo: boolean = false;
  off: any;
  corporateIdForVendor: any;
  accessGroup: string;

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private post: TilesService,
    private spinner: NgxSpinnerService,
    private excelService: ExcelService,
    private cd: ChangeDetectorRef
  ) { }


  ngOnInit() {
    var element = JSON.parse(localStorage.getItem('element') || '');
    this.fuelTerminalDataList = JSON.parse(localStorage.getItem('fuelTerminalDataList') || '{}');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.accessGroup = element.accessGroupId;
    if (this.accessGroup == '12') {
      var dealerData = JSON.parse(localStorage.getItem('dealerData') || '');
      this.corporateIdForVendor = dealerData.corporateId;
    }
    if (this.accessGroup == '14') {
      var managerData = JSON.parse(localStorage.getItem('managerData') || '');
      this.corporateIdForVendor = managerData.corporateId;
    }

    if (!this.fuelTerminalDataList.length) {
      this.getFuelTerminal(this.fuelDealerId);
    } else {
      this.getFuelTerminal1(this.fuelDealerId);
    }
    this.getBankDetailsByDealerId(this.fuelDealerId);
  }

  openPOS(addPOS: any) {
    this.modalRef = this.modalService.open(addPOS);
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      () => {
        this.closeResult = `Dismissed`;
      });
  }

  submitTerminal() {
    if (this.terminal.value.terminalType) {
      if (this.terminal.value.terminalName) {
        if (this.terminal.value.accountDetails && this.terminal.value.bankName) {
          this.spinner.show()
          let data = {
            terminalType: this.terminal.value.terminalType,
            terminalName: this.terminal.value.terminalName,
            fuelDealerId: this.fuelDealerId,
            corporateId: this.corporateIdForVendor,
            attachedAccountId: this.terminal.value.accountDetails,
            attachedBankName: this.terminal.value.bankName,
          }
          this.post.submitTerminalPOST(data).subscribe(result => {
            if (result.status == "OK") {
              alert("Terminal Added Successfully")
              this.terminal.reset();
              this.getFuelTerminal(this.fuelDealerId);
              this.terminal.controls['accountDetails'].setValue("")
              this.terminal.controls['terminalType'].setValue("")
              this.modalRef.close('close')
              this.spinner.hide();
            } else {
              alert("Error to Add Terminal")
              this.modalRef.close('close')
              this.spinner.hide();
            }
          })
        } else {
          alert("Please Select Account")
          this.spinner.hide();
        }
      } else {
        alert("Please Enter Terminal Name")
        this.spinner.hide();
      }

    } else {
      alert("Please Select Terminal Type")
      this.spinner.hide();
    }

  }

  getFuelTerminal(fuelDealerId: any) {
    this.spinner.show()
    let dataTerminal = {
      fuelDealerId: fuelDealerId,
    }
    this.post.getFuelTerminalPOST(dataTerminal)
      .subscribe(res => {
        if (res) {
          this.fuelTerminalDataList = res.data;
          localStorage.setItem('fuelTerminalDataList', JSON.stringify(this.fuelTerminalDataList));
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          localStorage.setItem('fuelTerminalDataList', JSON.stringify([]));
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  getFuelTerminal1(fuelDealerId: any) {
    let dataTerminal = {
      fuelDealerId: fuelDealerId,
    }
    this.post.getFuelTerminalPOST(dataTerminal)
      .subscribe(res => {
        if (res) {
          this.fuelTerminalDataList = res.data;
          localStorage.setItem('fuelTerminalDataList', JSON.stringify(this.fuelTerminalDataList));
          this.spinner.hide()
          this.cd.detectChanges();
        } else {
          this.spinner.hide()
          this.cd.detectChanges();
        }
      })
  }

  //UpdateModal
  updatePOS(editPOS: any, fuelTerminalsId: any, terminalName: any, attachedAccountId: any, terminalType: any) {
    this.modalRef = this.modalService.open(editPOS);
    this.fuelTerminalsId = fuelTerminalsId;
    if (attachedAccountId == 21 || terminalType == 'OIL COMPANY PROGRAM') {
      this.isOILCOUpdate = true
      this.updateTerminal.controls['accountDetails'].setValue('21')
      this.updateTerminal.controls['bankName'].setValue('OIL COMPANY')
      this.cd.detectChanges();
    } else {
      this.isOILCOUpdate = false
      this.updateTerminal.controls['accountDetails'].setValue(attachedAccountId)
      this.cd.detectChanges();
    }

    this.updateTerminal.controls["terminalName"].setValue(terminalName);
    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      () => {
        this.closeResult = `Dismissed`;
      }
    );
    this.cd.detectChanges();
  }

  //updatePOSName()
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
            this.cd.detectChanges();
            this.spinner.hide();
          }
          else {
            this.cd.detectChanges();
            this.spinner.hide();
          }
        })
      } else {
        alert("Please Select Account")
        this.spinner.hide();
      }
    } else {
      alert("Please enter valid name")
      this.spinner.hide();
    }
  }

  //Dealer Update POS Mappingstatus using SwitchSlider
  updateMappingPOS(status: any, fuelTerminalsId: any, terminalStatus: any) {
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
            } else {
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

  //download Excel for POS
  downloadPOS() {
    this.getTerminalsListDetails.length = 0
    this.fuelTerminalDataList.map((result: any) => {
      var json = {
        TerminalName: result.terminalName,
        TerminalType: result.terminalType,
        TerminalStatus: result.terminalStatus,
        AttachedBankName: result.attachedBankName,
      };

      this.getTerminalsListDetails.push(json);
    });

    this.excelService.exportAsExcelFile(
      this.getTerminalsListDetails,
      "TerminalsList"
    );
  }

  //delete()
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

  // Bank Details By fuelDealerId
  getBankDetailsByDealerId(fuelDealerId: any) {
    this.bankAccList.length = 0;
    let data = {
      dealerId: fuelDealerId
    }
    this.post.getBankDetailsByDealerIdPOST(data)
      .subscribe(res => {
        if (res.data.length) {
          this.bankAccList = res.data1;
          this.cd.detectChanges();
        }
      })
  }

  getBankAcc(id: any) {
    this.spinner.show();
    let data = {
      bankDetailsId: id.target.value,
    }
    this.post.getBankAccByBankIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.terminal.controls['bankName'].setValue(res.data[0].bankName + '-' + res.data[0].accountNumber)
          this.cd.detectChanges();
          this.spinner.hide();
        }
        else {
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
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
          this.cd.detectChanges();
          this.spinner.hide();
        }
        else {
          this.cd.detectChanges();
          this.spinner.hide();
        }
      })
  }

  getAccountByType(id: any) {
    if (id.target.value == "OIL COMPANY FLEET PROGRAM" || id.target.value == "OIL COMPANY RETAIL PROGRAM") {
      this.isOilCo = true;
      this.terminal.controls['accountDetails'].setValue("21")
      this.terminal.controls['bankName'].setValue('OIL COMPANY')
    } else {
      this.isOilCo = false;
      this.terminal.controls['accountDetails'].setValue("")
    }
  }


}