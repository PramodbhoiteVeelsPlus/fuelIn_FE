import { ChangeDetectorRef, Component, Injectable, ViewChild } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalConfig } from 'src/app/_metronic/partials/layout/modals/modal.config';
import { Modal3Component } from 'src/app/_metronic/partials/layout/modals/modal3/modal3.component';
import { WidgetService } from '../../widgets.services';
import { FormGroup, FormControl, Validators } from '@angular/forms';

type Tabs =
  | 'kt_table_widget_4_tab_1'
  | 'kt_table_widget_4_tab_2'
  | 'kt_table_widget_4_tab_3';

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
  selector: 'app-tables-widget4',
  templateUrl: './tables-widget4.component.html',
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})

export class TablesWidget4Component {
  activeTab: Tabs = 'kt_table_widget_4_tab_1';
  dealerLoginVPId: any;
  vpPersonId: any;
  loginSQLCorporateId: any;
  fuelDealerId: any;
  bankAccList: any = [];
  modalRef: any;
  bankDetailsId: any;

  updateBankDetailsForm = new FormGroup({
    accountHolderName: new FormControl(""),
    accountNumber: new FormControl("", Validators.required),
    phone: new FormControl("", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    bankName: new FormControl(""),
    upiId: new FormControl(""),
    ifsc: new FormControl("", Validators.required),
    branchName: new FormControl(""),
  });
  closeResult: string;

  setTab(tab: Tabs) {
    this.activeTab = tab;
  }

  activeClass(tab: Tabs) {
    return tab === this.activeTab ? 'show active' : '';
  }

  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modal3Component: Modal3Component;
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
    this.dealerLoginVPId = element.veelsPlusCorporateID;
    this.vpPersonId = element.veelsPlusId
    this.getCorporateById(this.dealerLoginVPId);
    this.cd.detectChanges()
  }

  async openModal() {
    return await this.modal3Component.open();
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
  getfuelDealerIdByCorporateId(loginSQLCorporateId: any) {
    let data = {
      corporateId: loginSQLCorporateId
    }
    this.post.getfuelDealerIdByCorporateIdPOST(data)
      .subscribe(res => {
        if (res.status == "OK") {
          this.fuelDealerId = res.data[0].fuelDealerId;
          this.getBankDetailsByDealerId(this.fuelDealerId);
          this.cd.detectChanges()
        }
        else {
          this.cd.detectChanges()
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
        if (res.status == "OK") {
          this.bankAccList = res.data;
          this.cd.detectChanges()
        } else {
          this.cd.detectChanges()
        }
      })
  }

  statusBankEnable(event: any, bankDetailsId: any, dealerId: any) {
    let checkedStatus;
    if (event.target.checked == true) {
      checkedStatus = "TRUE"
    } else if (event.target.checked == false) {
      checkedStatus = "FALSE"
    }
    let data = {
      bankDetailsId: bankDetailsId,
      dealerId: dealerId,
      status: checkedStatus
    }
    this.post.updateAccountDetailsbyUniqueStatusPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          alert("Default Account Selected..!")
          this.getBankDetailsByDealerId(this.fuelDealerId);
        }
      })
  }

  updateBank(editBank: any, bankDetailsId: any, bankName: any, accountHolderName: any, accountNumber: any, phone: any, upiId: any, ifsc: any, branchName: any) {
    this.modalRef = this.modalService.open(editBank, { size: 'lg' });
    this.bankDetailsId = bankDetailsId;
    this.updateBankDetailsForm.controls['bankName'].setValue(bankName)
    this.updateBankDetailsForm.controls['accountHolderName'].setValue(accountHolderName)
    this.updateBankDetailsForm.controls['accountNumber'].setValue(accountNumber)
    this.updateBankDetailsForm.controls['phone'].setValue(phone)
    this.updateBankDetailsForm.controls['upiId'].setValue(upiId)
    this.updateBankDetailsForm.controls['ifsc'].setValue(ifsc)
    this.updateBankDetailsForm.controls['branchName'].setValue(branchName)

    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed`;
      }
    );
  }

  deletBankAcc(id: any) {

    let data = {
      bankDetailsId: id
    }
    this.post.getPOSByBankIdPOST(data)
      .subscribe(res => {
        if (res.status == 'OK') {
          if (res.data.length) {
            alert("This Bank Account Attach with POS/Digital. Please Change Acc of POS or Delete the POS..")
            // this.router.navigate(['../posMyDigitalPayments']);
          } else {
            let data = {
              bankDetailsId: id
            }
            if (confirm("Are you sure to delete ? ")) {
              this.post.deleteBankAccByDealerIdPOST(data)
                .subscribe(res => {
                  if (res.status == 'OK') {
                    alert("Bank Account Deleted..")
                    this.getBankDetailsByDealerId(this.fuelDealerId);
                  } else {
                    alert("Error to Delete..")
                  }
                })
            }
            else {
              this.spinner.hide()
            }

          }

        }
      })
  }


  updateBankAcc() {
    if (this.updateBankDetailsForm.value.accountNumber) {
      if (this.updateBankDetailsForm.value.phone) {
        if (this.updateBankDetailsForm.value.ifsc) {
          let data = {
            bankDetailsId: this.bankDetailsId,
            bankName: this.updateBankDetailsForm.value.bankName,
            accountHolderName: this.updateBankDetailsForm.value.accountHolderName,
            accountNumber: this.updateBankDetailsForm.value.accountNumber,
            phone: this.updateBankDetailsForm.value.phone,
            upiId: this.updateBankDetailsForm.value.upiId,
            branchName: this.updateBankDetailsForm.value.branchName,
            ifsc: this.updateBankDetailsForm.value.ifsc,
          }
          this.post.updateBankAccountDetailsPOST(data)
            .subscribe(res => {
              if (res.status == 'OK') {
                alert("Bank Account Updated Successfully..!")
                this.clearModal()
                this.getBankDetailsByDealerId(this.fuelDealerId);
              } else {
                alert("Error to Update")
              }
            })
        } else {
          alert("Please Enter ifsc..")
        }
      } else {
        alert("Please Enter mobile number..")
      }
    } else {
      alert("Please Enter acc number..")
    }
  }

  clearModal() {
    this.updateBankDetailsForm.reset();
    this.modalRef.close('close')
  }
}
