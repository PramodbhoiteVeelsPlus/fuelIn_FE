import { ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { ModalConfig } from '../modal.config';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalsService } from '../modals.services';

@Component({
  selector: 'app-modal4',
  templateUrl: './modal4.component.html',
})
export class Modal4Component {
  @Output() closed = new EventEmitter<any>();
  @Input() public modalConfig: ModalConfig;
  @ViewChild('modal') private modalContent: TemplateRef<Modal4Component>;

  private modalRef: NgbModalRef;

  terminal = new FormGroup({
    terminalType: new FormControl('', Validators.required),
    terminalName: new FormControl(''),
    bankName: new FormControl(''),
    accountDetails: new FormControl('', Validators.required),
  });

  terminalType: any = "";
  terminalName: any;
  selectAccount: any = "";
  isOilCo: boolean = false;
  bankAccList: any = [];
  bankAccList1: any = [];
  fuelDealerId: any;
  dealerLoginVPId: any;
  vpPersonId: any;
  loginSQLCorporateId: any;
  dealerCorporateId: any;

  constructor(private modalService: NgbModal,
    private spinner: NgxSpinnerService,
    private post: ModalsService,
    public cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    var element = JSON.parse(localStorage.getItem('element') || '{}');
    var dealerData = JSON.parse(localStorage.getItem('dealerData') || '{}');
    this.fuelDealerId = localStorage.getItem('dealerId');
    this.dealerCorporateId = localStorage.getItem('dealerCorporateId');
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.vpPersonId = element.veelsPlusId
    // this.getCorporateById(this.dealerLoginVPId);
    this.getfuelDealerIdByCorporateId(this.dealerCorporateId)
    this.cd.detectChanges()
  }

  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.modalService.open(this.modalContent);
      this.modalRef.result.then(resolve, resolve);
    });
  }
  async close(): Promise<void> {
    if (
      this.modalConfig.shouldClose === undefined ||
      (await this.modalConfig.shouldClose())
    ) {
      const result =
        this.modalConfig.onClose === undefined ||
        (await this.modalConfig.onClose());
      this.modalRef.close(result);
    }
  }
  async dismiss(): Promise<void> {
    if (this.modalConfig.disableDismissButton !== undefined) {
      return;
    }
    if (
      this.modalConfig.shouldDismiss === undefined ||
      (await this.modalConfig.shouldDismiss())
    ) {
      const result =
        this.modalConfig.onDismiss === undefined ||
        (await this.modalConfig.onDismiss());
      this.modalRef.dismiss(result);
    }
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
          this.getBankDetailsByDealerId(this.fuelDealerId)
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
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

  getBankAcc(id: any) {
    this.spinner.show();
    let data = {
      bankDetailsId: id.target.value,
    }
    this.post.getBankAccByBankIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          this.terminal.controls['bankName'].setValue(res.data[0].bankName + '-' + res.data[0].accountNumber)
          this.spinner.hide();
        }
        else {
          this.spinner.hide();
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

  submitTerminal() {
    if (this.terminal.value.terminalType) {
      if (this.terminal.value.terminalName) {
        if (this.terminal.value.accountDetails && this.terminal.value.bankName) {
          this.spinner.show()
          let data = {
            terminalType: this.terminal.value.terminalType,
            terminalName: this.terminal.value.terminalName,
            fuelDealerId: this.fuelDealerId,
            corporateId: this.dealerCorporateId,
            attachedAccountId: this.terminal.value.accountDetails,
            attachedBankName: this.terminal.value.bankName,
          }

          this.post.submitTerminalPOST(data).subscribe((result: { status: string; }) => {
            if (result.status == "OK") {
              alert("Terminal Added Successfully")
              this.closed.emit();
              this.terminal.reset();
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


}
